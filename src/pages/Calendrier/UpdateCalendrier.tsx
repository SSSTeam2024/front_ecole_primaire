import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";
import Flatpickr from "react-flatpickr";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchSallesQuery } from "features/salles/salleSlice";
import { useUpdateCalendrierMutation } from "features/calendriers/calendrierSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";

interface ChildProps {
  modal_UpdateCalendrier: boolean;
  setmodal_UpdateCalendrier: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateCalendrier: React.FC<ChildProps> = ({
  modal_UpdateCalendrier,
  setmodal_UpdateCalendrier,
}) => {
  const calendrierLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllSalles = [] } = useFetchSallesQuery();

  const { data: AllMatieres = [] } = useFetchMatieresQuery();

  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
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

  const [selectedSalle, setSelectedSalle] = useState<string>("");

  const handleSelectSalle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSalle(value);
  };

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);

  const handleStartTimeChange = (selectedDates: Date[]) => {
    const time = selectedDates[0];
    setSelectedStartTime(time);
  };

  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);

  const handleEndTimeChange = (selectedDates: Date[]) => {
    const time = selectedDates[0];
    setSelectedEndTime(time);
  };

  const [calendrier_id, setCalendrierId] = useState<string>(
    calendrierLocation?.state?._id! ?? ""
  );

  const [showClasse, setShowClasse] = useState<boolean>(false);

  const [showMatiere, setShowMatiere] = useState<boolean>(false);

  const [showTrimestre, setShowTrimestre] = useState<boolean>(false);

  const [showDate, setShowDate] = useState<boolean>(false);

  const [showHeureDebut, setShowHeureDebut] = useState<boolean>(false);

  const [showHeureFin, setShowHeureFin] = useState<boolean>(false);

  const [showEnseignant, setShowEnseignant] = useState<boolean>(false);

  const [showSalle, setShowSalle] = useState<boolean>(false);

  const [updateCalendrier] = useUpdateCalendrierMutation();

  const initialCalendrier = {
    salle: "",
    trimestre: "",
    heure_debut: "",
    heure_fin: "",
    date: "",
    matiere: "",
    classe: "",
    enseignant: "",
  };

  const [calendrier, setCalendrier] = useState(initialCalendrier);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le calendrier a été mis à jour avec succès",
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

  const onSubmitUpdateCalendrier = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_calendrier = {
        _id: calendrier_id || calendrierLocation?.state?._id!,
        matiere: selectedMatiere || calendrierLocation?.state?.matiere,
        enseignant: selectedEnseignant || calendrierLocation?.state?.enseignant,
        heure_debut:
          formatTime(selectedStartTime) ||
          calendrierLocation?.state?.heure_debut,
        heure_fin:
          formatTime(selectedEndTime) || calendrierLocation?.state?.heure_fin,
        trimestre: selectedTrimestre || calendrierLocation?.state?.trimestre,
        date: formatDate(selectedDate) || calendrierLocation?.state?.date,
        classe: selectedClasse || calendrierLocation?.state?.classe!,
        salle: selectedSalle || calendrierLocation?.state?.salle!,
      };
      updateCalendrier(update_calendrier)
        .then(() => notifySuccess())
        .then(() => setCalendrier(initialCalendrier));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateCalendrier}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="classe">Classe : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{calendrierLocation?.state?.classe?.nom_classe!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="classe"
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
                    <option value={classe._id!} key={classe?._id!}>
                      {classe.nom_classe}
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
              <span>{calendrierLocation?.state?.matiere?.nom_matiere!} </span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="matiere"
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
                {calendrierLocation?.state?.enseignant?.nom_enseignant!}{" "}
                {calendrierLocation?.state?.enseignant?.prenom_enseignant!}
              </span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="enseignant"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Enseignant"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowEnseignant(!showEnseignant)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showEnseignant && (
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
            <Form.Label htmlFor="salle">Salle : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{calendrierLocation?.state?.salle?.nom_salle!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="salle"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Salle"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowSalle(!showSalle)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showSalle && (
                <select
                  className="form-select text-muted"
                  name="salle"
                  id="salle"
                  onChange={handleSelectSalle}
                >
                  <option value="">Choisir</option>
                  {AllSalles.map((salle) => (
                    <option value={salle._id!} key={salle?._id!}>
                      {salle.nom_salle}
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
            <span>{calendrierLocation.state.date}</span>
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
            <Form.Label htmlFor="heure_debut">De</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{calendrierLocation.state.heure_debut}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "230px" }}
            >
              <label
                htmlFor="heure_debut"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir heure de début"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowHeureDebut(!showHeureDebut)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showHeureDebut && (
              <Flatpickr
                className="form-control"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                onChange={handleStartTimeChange}
              />
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="heure_fin">Jusqu'à</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{calendrierLocation.state.heure_fin}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "230px" }}
            >
              <label
                htmlFor="heure_fin"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir heure de fin"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowHeureFin(!showHeureFin)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showHeureFin && (
              <Flatpickr
                className="form-control"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                onChange={handleEndTimeChange}
              />
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="trimestre">Trimestre : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{calendrierLocation?.state?.trimestre!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="trimestre"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Trimestre"
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
                  name="trimestre"
                  id="trimestre"
                  onChange={handleSelectTrimestre}
                >
                  <option value="">Choisir</option>
                  <option value="1ère trimestre">1ère trimestre</option>
                  <option value="2ème trimestre">2ème trimestre</option>
                  <option value="3ème trimestre">3ème trimestre</option>
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateCalendrier(!modal_UpdateCalendrier)}
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

export default UpdateCalendrier;
