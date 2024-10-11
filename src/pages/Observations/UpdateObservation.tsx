import React, { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useUpdateEvenementMutation } from "features/evenements/evenementSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";
import { useUpdateObservationMutation } from "features/observations/observationSlice";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";

interface ChildProps {
  modal_UpdateObservation: boolean;
  setmodal_UpdateObservation: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateObservation: React.FC<ChildProps> = ({
  modal_UpdateObservation,
  setmodal_UpdateObservation,
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

  const observationLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [titreObservation, setTitreObservation] = useState<string>(
    observationLocation?.state?.titre ?? ""
  );

  const handleTitreObservation = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitreObservation(e.target.value);
  };

  const [descObservation, setDescObservation] = useState<string>(
    observationLocation?.state?.description ?? ""
  );

  const handleDescObservation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescObservation(e.target.value);
  };

  const [selectedPar, setSelectedPar] = useState<string>("");
  const [showPar, setShowPar] = useState<boolean>(false);

  const handleSelectPar = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPar(value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const existingClasse = observationLocation.state?.classe || [];

  const defaultFilsOptions =
    observationLocation.state?.classe?.map((item: any) => ({
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

  const [updateObservation] = useUpdateObservationMutation();

  const initialObservation = {
    _id: "",
    classe: [""],
    par: "",
    titre: "",
    description: "",
    date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [observations, setObservations] = useState(initialObservation);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_observation = base64Data + "." + extension;
      setObservations({
        ...observations,
        fichier: file_observation,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'observation a été modifié avec succès",
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

  const onSubmitObservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      observations["_id"] = observationLocation?.state?._id!;

      if (titreObservation === "") {
        observations["titre"] = observationLocation?.state?.titre!;
      } else {
        observations["titre"] = titreObservation;
      }

      if (descObservation === "") {
        observations["description"] = observationLocation?.state?.description!;
      } else {
        observations["description"] = descObservation;
      }

      if (selectedColumnValues === "") {
        observations["classe"] = observationLocation?.state?.classe!;
      } else {
        observations["classe"] = selectedColumnValues;
      }

      if (selectedDate === null) {
        observations["date"] = observationLocation?.state?.date!;
      } else {
        observations["date"] = formatDate(selectedDate);
      }

      if (selectedPar === "") {
        observations["par"] = observationLocation?.state?.par!;
      } else {
        observations["par"] = selectedPar;
      }

      if (!observations.fichier_base64_string) {
        observations["fichier"] = observationLocation?.state?.fichier!;
        observations["fichier_base64_string"] =
          observationLocation?.state?.fichier_base64_string!;
        observations["fichier_extension"] =
          observationLocation?.state?.fichier_extension!;
      }

      updateObservation(observations)
        .then(() => notifySuccess())
        .then(() => setObservations(initialObservation));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitObservation}>
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
            <Form.Label htmlFor="titreObservation">Titre</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="titreObservation"
              name="titreObservation"
              value={titreObservation}
              onChange={handleTitreObservation}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="descObservation">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="descObservation"
              name="descObservation"
              value={descObservation}
              onChange={handleDescObservation}
              rows={3}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="type">Editeur : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{observationLocation?.state?.par!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="type"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Editeur"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowPar(!showPar)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showPar && (
                <select
                  className="form-select text-muted"
                  name="type"
                  id="type"
                  onChange={handleSelectPar}
                >
                  <option value="">Choisir</option>
                  <option value="Administration">Administration</option>
                  {AllEnseignants.map((enseignant: any) => (
                    <option
                      value={`${enseignant.nom_enseignant} ${enseignant.prenom_enseignant}`}
                      key={enseignant?._id!}
                    >
                      {enseignant.nom_enseignant} {enseignant.prenom_enseignant}
                    </option>
                  ))}
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
            <span>{observationLocation.state.date}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "120px" }}
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
              {observations.fichier && observations.fichier_base64_string ? (
                <Image
                  src={`data:image/jpeg;base64, ${observations.fichier_base64_string}`}
                  alt=""
                  className="img-thumbnail p-1 bg-body mt-n3"
                  width="200"
                />
              ) : (
                <Image
                  src={`${
                    process.env.REACT_APP_BASE_URL
                  }/observationFiles/${observationLocation?.state?.fichier!}`}
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
              onClick={() =>
                setmodal_UpdateObservation(!modal_UpdateObservation)
              }
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

export default UpdateObservation;
