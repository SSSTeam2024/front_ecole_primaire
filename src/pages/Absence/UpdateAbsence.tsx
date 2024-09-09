import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";
import Flatpickr from "react-flatpickr";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import { useUpdateAbsenceMutation } from "features/absences/absenceSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";

interface ChildProps {
  modal_UpdateAbsence: boolean;
  setmodal_UpdateAbsence: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateAbsence: React.FC<ChildProps> = ({
  modal_UpdateAbsence,
  setmodal_UpdateAbsence,
}) => {
  const absenceLocation = useLocation();

  const { data = [] } = useFetchEtudiantsQuery();
  const { data: AllMatieres = [] } = useFetchMatieresQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [selectedEleve, setSelectedEleve] = useState<string>("");

  const handleSelectEleve = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedEleve(value);
  };

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");

  const handleSelectEnseignant = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEnseignant(value);
  };

  const [selectedType, setSelectedType] = useState<string>("");

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleTimeChange = (selectedDates: Date[]) => {
    const time = selectedDates[0];
    setSelectedTime(time);
  };

  const [absence_id, setAbsenceId] = useState<string>(
    absenceLocation?.state?._id! ?? ""
  );

  const [showEleve, setShowEleve] = useState<boolean>(false);

  const [showMatiere, setShowMatiere] = useState<boolean>(false);

  const [showTrimestre, setShowTrimestre] = useState<boolean>(false);

  const [showType, setShowType] = useState<boolean>(false);

  const [showDate, setShowDate] = useState<boolean>(false);

  const [showHeure, setShowHeure] = useState<boolean>(false);

  const [updateAbsence] = useUpdateAbsenceMutation();

  const initialAbsence = {
    eleve: "",
    matiere: "",
    enseignant: "",
    type: "",
    heure: "",
    date: "",
  };

  const [absence, setAbsence] = useState(initialAbsence);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'absence a été mis à jour avec succès",
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

  const onSubmitUpdateAbsence = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_absence = {
        _id: absence_id || absenceLocation?.state?._id!,
        matiere: selectedMatiere || absenceLocation?.state?.matiere,
        enseignant: selectedEnseignant || absenceLocation?.state?.enseignant,
        heure: formatTime(selectedTime) || absenceLocation?.state?.heure,
        type: selectedType || absenceLocation?.state?.type,
        date: formatDate(selectedDate) || absenceLocation?.state?.date,
        eleve: selectedEleve || absenceLocation?.state?.eleve!,
      };
      updateAbsence(update_absence)
        .then(() => notifySuccess())
        .then(() => setAbsence(initialAbsence));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateAbsence}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="eleve">Elève : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>
                {absenceLocation?.state?.eleve?.nom!}{" "}
                {absenceLocation?.state?.eleve?.prenom!}
              </span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="id_file"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Elève"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowEleve(!showEleve)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showEleve && (
                <select
                  className="form-select text-muted"
                  name="eleve"
                  id="eleve"
                  onChange={handleSelectEleve}
                >
                  <option value="">Choisir</option>
                  {data.map((eleve) => (
                    <option value={eleve._id!} key={eleve?._id!}>
                      {eleve.nom} {eleve.prenom}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="matiere">Matière : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{absenceLocation?.state?.matiere?.nom_matiere!} </span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="id_file"
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
                  name="matiere"
                  id="matiere"
                  onChange={handleSelectMatiere}
                >
                  <option value="">Choisir</option>
                  {AllMatieres.map((matiere) => (
                    <option value={matiere._id!} key={matiere?._id!}>
                      {matiere.nom_matiere}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="enseignant">Enseignant : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>
                {absenceLocation?.state?.enseignant?.nom_enseignant!}{" "}
                {absenceLocation?.state?.enseignant?.prenom_enseignant!}
              </span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="id_file"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Enseignant"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowTrimestre(!showTrimestre)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showTrimestre && (
                <select
                  className="form-select text-muted"
                  name="enseignant"
                  id="enseignant"
                  onChange={handleSelectEnseignant}
                >
                  <option value="">Choisir</option>
                  {AllEnseignants.map((enseignant) => (
                    <option value={enseignant._id!} key={enseignant?._id!}>
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
            <Form.Label htmlFor="type">Type : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{absenceLocation?.state?.type!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="id_file"
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
                  <option value="Absence">Absence</option>
                  <option value="Retard">Retard</option>
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
            <span>{absenceLocation.state.date}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "230px" }}
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
            <Form.Label htmlFor="heure">Heure</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{absenceLocation.state.heure}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "230px" }}
            >
              <label
                htmlFor="date"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir Heure"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowHeure(!showHeure)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showHeure && (
              <Flatpickr
                className="form-control"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                onChange={handleTimeChange}
              />
            )}
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateAbsence(!modal_UpdateAbsence)}
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

export default UpdateAbsence;
