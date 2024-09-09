import React, { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useUpdateEvenementMutation } from "features/evenements/evenementSlice";

interface ChildProps {
  modal_UpdateEvenement: boolean;
  setmodal_UpdateEvenement: React.Dispatch<React.SetStateAction<boolean>>;
}

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const UpdateEvenement: React.FC<ChildProps> = ({
  modal_UpdateEvenement,
  setmodal_UpdateEvenement,
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

  const evenementLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [titreEvenement, setTitreEvenement] = useState<string>(
    evenementLocation?.state?.titre ?? ""
  );

  const handleTitreEvenement = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitreEvenement(e.target.value);
  };

  const [descEvenement, setDescEvenement] = useState<string>(
    evenementLocation?.state?.desc ?? ""
  );

  const handleDescEvenement = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescEvenement(e.target.value);
  };

  const [selectedType, setSelectedType] = useState<string>("");
  const [showType, setShowType] = useState<boolean>(false);

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const existingClasse = evenementLocation.state?.classes || [];

  const defaultFilsOptions =
    evenementLocation.state?.classes?.map((item: any) => ({
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

  const [updateEvenement] = useUpdateEvenementMutation();

  const initialEvenement = {
    _id: "",
    classes: [""],
    type: "",
    titre: "",
    desc: "",
    creation_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [Evenements, setEvenements] = useState(initialEvenement);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_evenement = base64Data + "." + extension;
      setEvenements({
        ...Evenements,
        fichier: file_evenement,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'évènement a été mis à jour avec succès",
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

  const onSubmitEvenement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      Evenements["_id"] = evenementLocation?.state?._id!;

      if (titreEvenement === "") {
        Evenements["titre"] = evenementLocation?.state?.titre!;
      } else {
        Evenements["titre"] = titreEvenement;
      }

      if (descEvenement === "") {
        Evenements["desc"] = evenementLocation?.state?.desc!;
      } else {
        Evenements["desc"] = descEvenement;
      }

      if (selectedColumnValues === "") {
        Evenements["classes"] = evenementLocation?.state?.classes!;
      } else {
        Evenements["classes"] = selectedColumnValues;
      }

      if (selectedDate === null) {
        Evenements["creation_date"] = evenementLocation?.state?.creation_date!;
      } else {
        Evenements["creation_date"] = selectedDate?.toDateString()!;
      }

      if (selectedType === "") {
        Evenements["type"] = evenementLocation?.state?.type!;
      } else {
        Evenements["type"] = selectedType;
      }

      if (!Evenements.fichier_base64_string) {
        Evenements["fichier"] = evenementLocation?.state?.fichier!;
        Evenements["fichier_base64_string"] =
          evenementLocation?.state?.fichier_base64_string!;
        Evenements["fichier_extension"] =
          evenementLocation?.state?.fichier_extension!;
      }

      updateEvenement(Evenements)
        .then(() => notifySuccess())
        .then(() => setEvenements(initialEvenement));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitEvenement}>
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
            <Form.Label htmlFor="titreEvenement">Titre</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="titreEvenement"
              name="titreEvenement"
              value={titreEvenement}
              onChange={handleTitreEvenement}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="descEvenement">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="descEvenement"
              name="descEvenement"
              value={descEvenement}
              onChange={handleDescEvenement}
              rows={3}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="type">Type : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{evenementLocation?.state?.type!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="type"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Type"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowType(!showType)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showType && (
                <select
                  className="form-select text-muted"
                  name="type"
                  id="type"
                  onChange={handleSelectType}
                >
                  <option value="">Choisir</option>
                  <option value="Industrie">Industrie</option>
                  <option value="Emploi">Emploi</option>
                  <option value="Loisir et Tourisme">Loisir et Tourisme</option>
                  <option value="Art et Cultures">Art et Cultures</option>
                  <option value="Communautaire - Economie">
                    Communautaire - Economie
                  </option>
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{evenementLocation.state.creation_date}</span>
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
              {Evenements.fichier && Evenements.fichier_base64_string ? (
                <Image
                  src={`data:image/jpeg;base64, ${Evenements.fichier_base64_string}`}
                  alt=""
                  className="img-thumbnail p-1 bg-body mt-n3"
                  width="200"
                />
              ) : (
                <Image
                  src={`${
                    process.env.REACT_APP_BASE_URL
                  }/evenementFiles/${evenementLocation?.state?.fichier!}`}
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
              onClick={() => setmodal_UpdateEvenement(!modal_UpdateEvenement)}
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

export default UpdateEvenement;
