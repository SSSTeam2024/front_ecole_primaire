import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import {
  useFetchMatieresByEtudiantIdQuery,
  useFetchMatieresQuery,
} from "features/matieres/matiereSlice";
import { useUpdateNoteMutation } from "features/notes/noteSlice";
import Flatpickr from "react-flatpickr";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";

interface ChildProps {
  modal_UpdateNote: boolean;
  setmodal_UpdateNote: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateNote: React.FC<ChildProps> = ({
  modal_UpdateNote,
  setmodal_UpdateNote,
}) => {
  const noteLocation = useLocation();

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

  const [selectedType, setSelectedType] = useState<string>("");

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const [note_eleve, setNoteEleve] = useState<string>(
    noteLocation?.state?.note ?? ""
  );
  const [note_id, setNoteId] = useState<string>(
    noteLocation?.state?._id! ?? ""
  );

  const handleNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteEleve(e.target.value);
  };

  const [showEleve, setShowEleve] = useState<boolean>(false);

  const [showMatiere, setShowMatiere] = useState<boolean>(false);

  const [showTrimestre, setShowTrimestre] = useState<boolean>(false);

  const [showType, setShowType] = useState<boolean>(false);

  const [showDate, setShowDate] = useState<boolean>(false);

  const [updateNote] = useUpdateNoteMutation();

  const initialPaiment = {
    eleve: "",
    matiere: "",
    trimestre: "",
    type: "",
    note: "",
    date: "",
  };

  const [paiement, setPaiment] = useState(initialPaiment);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La note a été mis à jour avec succès",
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

  const onSubmitUpdateNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_note = {
        _id: note_id || noteLocation?.state?._id!,
        matiere: selectedMatiere || noteLocation?.state?.matiere,
        trimestre: selectedTrimestre || noteLocation?.state?.trimestre,
        type: selectedType || noteLocation?.state?.type,
        note: note_eleve || noteLocation?.state?.note,
        date: formatDate(selectedDate) || noteLocation?.state?.date,
        eleve: selectedEleve || noteLocation?.state?.eleve!,
      };
      updateNote(update_note)
        .then(() => notifySuccess())
        .then(() => setPaiment(initialPaiment));
    } catch (error) {
      notifyError(error);
    }
  };

  const selectedEleveId = selectedEleve || noteLocation?.state?.eleve?._id;

  const { data: allMatieresByEtudiantId = [] } =
    useFetchMatieresByEtudiantIdQuery(selectedEleveId);

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateNote}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="eleve">Elève : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>
                {noteLocation?.state?.eleve?.nom!}{" "}
                {noteLocation?.state?.eleve?.prenom!}
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
            <Form.Label htmlFor="note_eleve">Note</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="note_eleve"
              name="note_eleve"
              value={note_eleve}
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
              <span>{noteLocation?.state?.matiere!} </span>
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
                  {allMatieresByEtudiantId.map((matiere) =>
                    matiere.matieres.map((m) => (
                      <option value={m.nom_matiere} key={m?._id!}>
                        {m.nom_matiere}
                      </option>
                    ))
                  )}
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
              <span>{noteLocation?.state?.trimestre!}</span>
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
                  <option value="1ere trimestre">1ere trimestre</option>
                  <option value="2ème trimestre">2ème trimestre</option>
                  <option value="3ème trimestre">3ème trimestre</option>
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
              <span>{noteLocation?.state?.type!}</span>
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
                  <option value="Examen">Examen</option>
                  <option value="DS">DS</option>
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
            <span>{noteLocation.state.date}</span>
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
              onClick={() => setmodal_UpdateNote(!modal_UpdateNote)}
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

export default UpdateNote;
