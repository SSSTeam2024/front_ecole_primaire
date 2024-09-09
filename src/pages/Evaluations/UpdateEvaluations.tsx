import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";
import Flatpickr from "react-flatpickr";
import { useUpdateEvaluationsMutation } from "features/evaluations/evaluationSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";

interface ChildProps {
  modal_UpdateEvaluation: boolean;
  setmodal_UpdateEvaluation: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateEvaluations: React.FC<ChildProps> = ({
  modal_UpdateEvaluation,
  setmodal_UpdateEvaluation,
}) => {
  const evaluationLocation = useLocation();

  const { data = [] } = useFetchEtudiantsQuery();
  const { data: AllMatieres = [] } = useFetchMatieresQuery();

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

  const [note_evaluation, setNoteEvaluation] = useState<string>(
    evaluationLocation?.state?.note ?? ""
  );
  const [evaluation_id, setEvaluationId] = useState<string>(
    evaluationLocation?.state?._id! ?? ""
  );

  const handleNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteEvaluation(e.target.value);
  };

  const [showEleve, setShowEleve] = useState<boolean>(false);

  const [showMatiere, setShowMatiere] = useState<boolean>(false);

  const [showTrimestre, setShowTrimestre] = useState<boolean>(false);

  const [showType, setShowType] = useState<boolean>(false);

  const [showDate, setShowDate] = useState<boolean>(false);

  const [updateEvaluation] = useUpdateEvaluationsMutation();

  const initialEvaluation = {
    eleve: "",
    matiere: "",
    trimestre: "",
    note: "",
    date: "",
  };

  const [evaluation, setEvaluation] = useState(initialEvaluation);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'evaluation a été mis à jour avec succès",
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

  const onSubmitUpdateEvalaution = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_evaluation = {
        _id: evaluation_id || evaluationLocation?.state?._id!,
        matiere: selectedMatiere || evaluationLocation?.state?.matiere,
        trimestre: selectedTrimestre || evaluationLocation?.state?.trimestre,
        note: note_evaluation || evaluationLocation?.state?.note,
        date: formatDate(selectedDate) || evaluationLocation?.state?.date,
        eleve: selectedEleve || evaluationLocation?.state?.eleve!,
      };
      updateEvaluation(update_evaluation)
        .then(() => notifySuccess())
        .then(() => setEvaluation(initialEvaluation));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateEvalaution}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="eleve">Elève : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>
                {evaluationLocation?.state?.eleve?.nom!}{" "}
                {evaluationLocation?.state?.eleve?.prenom!}
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
            <Form.Label htmlFor="note_evaluation">Note</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="note_evaluation"
              name="note_evaluation"
              value={note_evaluation}
              onChange={handleNote}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="matiere">Matière : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{evaluationLocation?.state?.matiere?.nom_matiere!} </span>
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
            <Form.Label htmlFor="trimestre">Trimestre : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{evaluationLocation?.state?.trimestre!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="id_file"
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
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{evaluationLocation.state.date}</span>
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
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateEvaluation(!modal_UpdateEvaluation)}
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

export default UpdateEvaluations;
