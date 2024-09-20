import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Button,
  Offcanvas,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useFetchNotesQuery,
} from "features/notes/noteSlice";
import {
  useFetchMatieresQuery,
  useFetchMatieresByClasseIdQuery,
} from "features/matieres/matiereSlice";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import UpdateNote from "./UpdateNote";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchEtudiantsByClasseIdMutation } from "features/etudiants/etudiantSlice";

const CreateNote = () => {
  const { data = [] } = useFetchNotesQuery();
  const { data: AllEleves = [] } = useFetchEtudiantsQuery();
  const { data: AllMatieres = [] } = useFetchMatieresQuery();
  const { data: AllClasse = [] } = useFetchClassesQuery();

  const [studentNotes, setStudentNotes] = useState<{ [key: string]: string }>(
    {}
  );

  const [fetchEtudiantsByClasseId, { data: fetchedEtudiants }] =
    useFetchEtudiantsByClasseIdMutation();

  const [showObservation, setShowObservation] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La note a été créée avec succès",
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

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const [selectedType, setSelectedType] = useState<string>("");

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value);
  };

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const handleSelectClasse = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const result = await fetchEtudiantsByClasseId(value).unwrap();
    setStudents(result);
    setSelectedClasse(value);
  };
  const navigate = useNavigate();
  const [modal_AddNote, setmodal_AddNote] = useState<boolean>(false);
  function tog_AllNotes() {
    navigate("/notes");
  }

  const [modal_UpdateNote, setmodal_UpdateNote] = useState<boolean>(false);
  function tog_UpdateNote() {
    setmodal_UpdateNote(!modal_UpdateNote);
  }

  const [createNote] = useAddNoteMutation();

  const initialNote = {
    eleves: [],
    matiere: "",
    trimestre: "",
    type: "",
    date: "",
  };

  const [notes, setNotes] = useState(initialNote);

  const handleStudentNoteChange = (e: any, studentId: string) => {
    const { value } = e.target;
    setStudentNotes((prevState) => ({
      ...prevState,
      [studentId]: value,
    }));
  };

  const { eleves, matiere, trimestre, type, date } = notes;

  const onChangeNotes = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNotes((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitNotes = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const elevesWithNotes = students.map((eleve) => ({
        eleve: eleve._id,
        note: studentNotes[eleve._id] || "",
      }));

      const noteData = {
        ...notes,
        classe: selectedClasse,
        eleves: elevesWithNotes,
        date: formatDate(selectedDate),
        type: selectedType,
        matiere: selectedMatiere,
        trimestre: selectedTrimestre,
      };

      createNote(noteData)
        .then(() => notifySuccess())
        .then(() => {
          setNotes(initialNote);
          setStudentNotes({});
        });
      tog_AllNotes();
    } catch (error) {
      notifyError(error);
    }
  };

  const observationLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredNotes = () => {
    let filteredNotes = data;

    if (searchTerm) {
      filteredNotes = filteredNotes.filter(
        (note: any) =>
          note?.eleve?.nom!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.eleve
            ?.prenom!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          note?.matiere!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.trimestre!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.type!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.note!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.date!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredNotes;
  };

  const { data: useFetchMatieresByClasseId = [] } =
    useFetchMatieresByClasseIdQuery(selectedClasse);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Ajouter Note" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Body>
                <Form className="create-form" onSubmit={onSubmitNotes}>
                  <Row>
                    <Col lg={4}>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="classe">Classe</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="classe"
                            id="classe"
                            onChange={handleSelectClasse}
                          >
                            <option value="">Choisir</option>
                            {AllClasse.map((classe) => (
                              <option value={classe?._id!} key={classe?._id!}>
                                {classe.nom_classe}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="matiere">Matière</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="matiere"
                            id="matiere"
                            onChange={handleSelectMatiere}
                          >
                            <option value="">Choisir</option>
                            {useFetchMatieresByClasseId.map((matiere) =>
                              matiere.matieres.map((m) => (
                                <option value={m.nom_matiere} key={m?._id!}>
                                  {m.nom_matiere}
                                </option>
                              ))
                            )}
                          </select>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="type">Type</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="type"
                            id="type"
                            onChange={handleSelectType}
                          >
                            <option value="">Choisir</option>
                            <option value="Contrôle">Contrôle</option>
                            <option value="Synthèse">Synthèse</option>
                          </select>
                        </Col>
                      </Row>
                      {/* <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="note">Note</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="note"
                      name="note"
                      onChange={onChangeNotes}
                      value={notes.note}
                    />
                  </Col>
                </Row> */}
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="trimestre">Trimestre</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
                            name="trimestre"
                            id="trimestre"
                            onChange={handleSelectTrimestre}
                          >
                            <option value="">Choisir</option>
                            <option value="1er trimestre">1er trimestre</option>
                            <option value="2ème trimestre">
                              2ème trimestre
                            </option>
                            <option value="3ème trimestre">
                              3ème trimestre
                            </option>
                          </select>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="date">Date</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Flatpickr
                            className="form-control flatpickr-input"
                            placeholder="Date création"
                            onChange={handleDateChange}
                            options={{
                              dateFormat: "d M, Y",
                              locale: French,
                            }}
                            id="date"
                            name="date"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={8}>
                      <Row>
                        <Col lg={3}>
                          <Form.Label>Elève</Form.Label>
                        </Col>
                        <Col lg={3}>
                          <Form.Label>Note</Form.Label>
                        </Col>
                      </Row>
                      {students.map((eleve) => (
                        <Row key={eleve._id}>
                          <Col lg={3} className="mb-1">
                            {eleve.prenom} {eleve.nom}
                          </Col>
                          <Col lg={3} className="mb-1">
                            <Form.Control
                              type="text"
                              value={studentNotes[eleve._id] || ""}
                              onChange={(e) =>
                                handleStudentNoteChange(e, eleve._id)
                              }
                            />
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>

                  <Row>
                    <div className="hstack gap-2 justify-content-end">
                      <Button type="submit" variant="success" id="addNew">
                        Ajouter
                      </Button>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default CreateNote;
