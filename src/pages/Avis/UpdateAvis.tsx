import React, { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useUpdateAvisMutation } from "features/avis/avisSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";

interface ChildProps {
  modal_UpdateAvis: boolean;
  setmodal_UpdateAvis: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateAvis: React.FC<ChildProps> = ({
  modal_UpdateAvis,
  setmodal_UpdateAvis,
}) => {
  const customStyles = {
    control: (styles: any, { isFocused }: any) => ({
      ...styles,
      minHeight: "41px",
      borderColor: isFocused ? "#4b93ff" : "#e9ebec",
      boxShadow: isFocused ? "0 0 0 1px #4b93ff" : styles.boxShadow,
      ":hover": {
        borderColor: "#4b93ff",
      },
    }),
    multiValue: (styles: any, { data }: any) => {
      return {
        ...styles,
        backgroundColor: "#4b93ff",
      };
    },
    multiValueLabel: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
      color: "white",
    }),
    multiValueRemove: (styles: any, { data }: any) => ({
      ...styles,
      color: "white",
      backgroundColor: "#4b93ff",
      ":hover": {
        backgroundColor: "#4b93ff",
        color: "white",
      },
    }),
  };

  const avisLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [titreAvis, setTitreAvis] = useState<string>(
    avisLocation?.state?.titre ?? ""
  );

  const handleTitreAvis = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitreAvis(e.target.value);
  };

  const [AviDesc, setAvisDesc] = useState<string>(
    avisLocation?.state?.desc ?? ""
  );

  const handleAvisDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAvisDesc(e.target.value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const existingClasse = avisLocation.state?.classes || [];

  const defaultFilsOptions =
    avisLocation.state?.classes?.map((item: any) => ({
      label: item.nom_classe,
      value: item?._id!,
    })) || [];

  const optionColumnsTable = AllClasses.map((classe: any) => ({
    value: classe?._id!,
    label: classe.nom_classe,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState(
    existingClasse.map((fil: any) => fil?._id!)
  );

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const [updateAvis] = useUpdateAvisMutation();

  const initialAvis = {
    _id: "",
    classes: [""],
    editeur: "",
    titre: "",
    desc: "",
    creation_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [Aviss, setAviss] = useState(initialAvis);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_avis = base64Data + "." + extension;
      setAviss({
        ...Aviss,
        fichier: file_avis,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'avis a été mis à jour avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const onSubmitAvis = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      Aviss["_id"] = avisLocation?.state?._id!;

      if (titreAvis === "") {
        Aviss["titre"] = avisLocation?.state?.titre!;
      } else {
        Aviss["titre"] = titreAvis;
      }

      if (AviDesc === "") {
        Aviss["desc"] = avisLocation?.state?.desc!;
      } else {
        Aviss["desc"] = AviDesc;
      }

      if (selectedColumnValues === "") {
        Aviss["classes"] = avisLocation?.state?.classes!;
      } else {
        Aviss["classes"] = selectedColumnValues;
      }

      if (selectedDate === null) {
        Aviss["creation_date"] = avisLocation?.state?.creation_date!;
      } else {
        Aviss["creation_date"] = formatDate(selectedDate);
      }

      Aviss["editeur"] = "Administration";

      if (!Aviss.fichier_base64_string) {
        Aviss["fichier"] = avisLocation?.state?.fichier!;
        Aviss["fichier_base64_string"] =
          avisLocation?.state?.fichier_base64_string!;
        Aviss["fichier_extension"] = avisLocation?.state?.fichier_extension!;
      }

      updateAvis(Aviss)
        .then(() => notifySuccess())
        .then(() => setAviss(initialAvis));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitAvis}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="classes">Classe(s) </Form.Label>
          </Col>
          <Col lg={8}>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={optionColumnsTable}
              onChange={handleSelectValueColumnChange}
              defaultValue={defaultFilsOptions}
              styles={customStyles}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="titreAvis">Titre</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="titreAvis"
              name="titreAvis"
              value={titreAvis}
              onChange={handleTitreAvis}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="AviDesc">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="AviDesc"
              name="AviDesc"
              value={AviDesc}
              onChange={handleAvisDesc}
              rows={3}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{avisLocation.state.creation_date}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "200px" }}
            >
              <label
                htmlFor="date"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir Date"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowDate(!showDate)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showDate && (
              <Flatpickr
                className="form-control flatpickr-input"
                placeholder="Choisir Date"
                options={{
                  dateFormat: "d M, Y",
                  locale: French,
                }}
                onChange={handleDateChange}
              />
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="fichier_base64_string">Fichier</Form.Label>
          </Col>
          <Col lg={8}>
            <div className="d-flex justify-content-center">
              {Aviss.fichier && Aviss.fichier_base64_string ? (
                <Image
                  src={`data:image/jpeg;base64, ${Aviss.fichier_base64_string}`}
                  alt=""
                  className="img-thumbnail p-1 bg-body mt-n3"
                  width="200"
                />
              ) : (
                <Image
                  src={`${
                    process.env.REACT_APP_BASE_URL
                  }/AvisFiles/${avisLocation?.state?.fichier!}`}
                  alt=""
                  className="img-thumbnail p-1 bg-body mt-n3"
                  width="200"
                />
              )}
            </div>
            <div
              className="d-flex justify-content-center mt-n2"
              style={{ marginLeft: "200px" }}
            >
              <label
                htmlFor="fichier_base64_string"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir image pour l'avis"
              >
                <span className="avatar-xs d-inline-block">
                  <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                    <i className="bi bi-pen"></i>
                  </span>
                </span>
              </label>
              <input
                className="form-control d-none"
                type="file"
                name="fichier_base64_string"
                id="fichier_base64_string"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                style={{ width: "210px", height: "120px" }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateAvis(!modal_UpdateAvis)}
              data-bs-dismiss="modal"
            >
              <i className="me-1 fs-18 align-middle"></i>
              Modifier
            </Button>
          </div>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default UpdateAvis;
