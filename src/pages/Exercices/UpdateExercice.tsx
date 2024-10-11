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
import { useUpdateExerciceMutation } from "features/exercices/exerciceSlice";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import { useFetchMatieresByClasseIdQuery } from "features/matieres/matiereSlice";

interface ChildProps {
  modal_UpdateExercice: boolean;
  setmodal_UpdateExercice: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateExercice: React.FC<ChildProps> = ({
  modal_UpdateExercice,
  setmodal_UpdateExercice,
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

  const exerciceLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const { data: allMatieresByClasseId = [] } = useFetchMatieresByClasseIdQuery(
    exerciceLocation?.state?.classes!
  );

  const [exerciceDesc, setExerciceDesc] = useState<string>(
    exerciceLocation?.state?.desc ?? ""
  );

  const [selectedPar, setSelectedPar] = useState<string>("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBadgeDate, setSelectedBadgeDate] = useState<Date | null>(null);

  const [showBadgeDate, setShowBadgeDate] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [showPar, setShowPar] = useState<boolean>(false);
  const [showMatiere, setShowMatiere] = useState<boolean>(false);
  const [showClasse, setShowClasse] = useState<boolean>(false);

  const handleExerciceDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setExerciceDesc(e.target.value);
  };

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
  };

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const handleSelectPar = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPar(value);
  };

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const handleBadgeDateChange = (selectedDates: Date[]) => {
    setSelectedBadgeDate(selectedDates[0]);
  };

  const [updateExercice] = useUpdateExerciceMutation();

  const initialExercice = {
    _id: "",
    classes: "",
    matiere: "",
    desc: "",
    creation_date: "",
    badge_date: "",
    enseignant: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [excercice, setExercice] = useState(initialExercice);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_exercice = base64Data + "." + extension;
      setExercice({
        ...excercice,
        fichier: file_exercice,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'exercice a été mis à jour avec succès",
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

  const onSubmitExercice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      excercice["_id"] = exerciceLocation?.state?._id!;

      if (exerciceDesc === "") {
        excercice["desc"] = exerciceLocation?.state?.desc!;
      } else {
        excercice["desc"] = exerciceDesc;
      }

      if (selectedClasse === "") {
        excercice["classes"] = exerciceLocation?.state?.classes!;
      } else {
        excercice["classes"] = selectedClasse;
      }

      if (selectedDate === null) {
        excercice["creation_date"] = exerciceLocation?.state?.creation_date!;
      } else {
        excercice["creation_date"] = formatDate(selectedDate);
      }

      if (selectedBadgeDate === null) {
        excercice["badge_date"] = exerciceLocation?.state?.badge_date!;
      } else {
        excercice["badge_date"] = formatDate(selectedBadgeDate);
      }

      if (selectedMatiere === "") {
        excercice["matiere"] = exerciceLocation?.state?.matiere!;
      } else {
        excercice["matiere"] = selectedMatiere;
      }

      if (selectedPar === "") {
        excercice["enseignant"] = exerciceLocation?.state?.enseignant!;
      } else {
        excercice["enseignant"] = selectedPar;
      }

      if (!excercice.fichier_base64_string) {
        excercice["fichier"] = exerciceLocation?.state?.fichier!;
        excercice["fichier_base64_string"] =
          exerciceLocation?.state?.fichier_base64_string!;
        excercice["fichier_extension"] =
          exerciceLocation?.state?.fichier_extension!;
      }

      updateExercice(excercice)
        .then(() => notifySuccess())
        .then(() => setExercice(initialExercice));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitExercice}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="classes">Classe</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{exerciceLocation.state.classes.nom_classe}</span>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "80px" }}
            >
              <label
                htmlFor="classes"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir Classe"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowClasse(!showClasse)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showClasse && (
              <select
                className="form-select text-muted"
                name="classe"
                id="classe"
                onChange={handleSelectClasse}
              >
                <option value="">Choisir</option>
                {AllClasses.map((classe) => (
                  <option value={classe?._id!} key={classe?._id!}>
                    {classe.nom_classe}
                  </option>
                ))}
              </select>
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="selectedMatiere">Matiere</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{exerciceLocation.state.matiere}</span>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "90px" }}
            >
              <label
                htmlFor="selectedMatiere"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir Matière"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowMatiere(!showMatiere)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showMatiere && (
              <select
                className="form-select text-muted"
                name="selectedMatiere"
                id="selectedMatiere"
                onChange={handleSelectMatiere}
              >
                <option value="">Choisir</option>
                {allMatieresByClasseId.map((matiere) =>
                  matiere.matieres.map((m) => (
                    <option value={m.nom_matiere} key={m?._id!}>
                      {m.nom_matiere}
                    </option>
                  ))
                )}
              </select>
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="selectedPar">Enseignant</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{exerciceLocation.state.enseignant}</span>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "100px" }}
            >
              <label
                htmlFor="selectedPar"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir Enseignant"
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
                name="selectedPar"
                id="selectedPar"
                onChange={handleSelectPar}
              >
                <option value="">Choisir</option>
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
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date Création</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{exerciceLocation.state.creation_date}</span>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "80px" }}
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
            <Form.Label htmlFor="badge_date">Date de retour</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{exerciceLocation.state.badge_date}</span>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "80px" }}
            >
              <label
                htmlFor="badge_date"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir Date Retour"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowBadgeDate(!showBadgeDate)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showBadgeDate && (
              <Flatpickr
                className="form-control flatpickr-input"
                placeholder="Choisir Date Retour"
                options={{
                  dateFormat: "d M, Y",
                  locale: French,
                }}
                onChange={handleBadgeDateChange}
              />
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="exerciceDesc">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="exerciceDesc"
              name="exerciceDesc"
              value={exerciceDesc}
              onChange={handleExerciceDesc}
              rows={3}
            ></textarea>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="fichier_base64_string">Fichier</Form.Label>
          </Col>
          <Col lg={8}>
            <div className="d-flex justify-content-center">
              {/* {excercice.fichier && excercice.fichier_base64_string ? (
                <i
                  className="bi bi-file-earmark-image p-1 bg-body mt-n3"
                  style={{
                    fontSize: "48px",
                    color: "#6c757d",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    window.open(
                      `data:image/jpeg;base64, ${excercice.fichier_base64_string}`,
                      "_blank"
                    )
                  }
                ></i>
              ) : ( */}
              <i
                className="bi bi-file-earmark p-1 bg-body mt-n3"
                style={{
                  fontSize: "48px",
                  color: "#6c757d",
                  cursor: "pointer",
                }}
                onClick={() =>
                  window.open(
                    `${process.env.REACT_APP_BASE_URL}/exerciceFiles/${exerciceLocation?.state?.fichier}`,
                    "_blank"
                  )
                }
              ></i>
              {/* )} */}
            </div>
            <div className="d-flex justify-content-center mt-n2">
              {/* <label
                htmlFor="fichier_base64_string"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir fichier pour l'exercice"
              >
                <span className="avatar-xs d-inline-block">
                  <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                    <i className="bi bi-pen"></i>
                  </span>
                </span>
              </label> */}
              <input
                className="form-control mb-2"
                type="file"
                id="fichier_base64_string"
                name="fichier_base64_string"
                onChange={(e) => handleFileUpload(e)}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateExercice(!modal_UpdateExercice)}
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

export default UpdateExercice;
