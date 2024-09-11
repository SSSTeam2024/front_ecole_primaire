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
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useFetchNotesQuery,
} from "features/notes/noteSlice";
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import UpdateNote from "./UpdateNote";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";

const Notes = () => {
  const { data = [] } = useFetchNotesQuery();
  const { data: AllEleves = [] } = useFetchEtudiantsQuery();
  const { data: AllMatieres = [] } = useFetchMatieresQuery();

  const [deleteNote] = useDeleteNoteMutation();
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

  const AlertDelete = async (_id: any) => {
    swalWithBootstrapButtons
      .fire({
        title: "Etes-vous sûr?",
        text: "Vous ne pouvez pas revenir en arrière?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprime-le !",
        cancelButtonText: "Non, annuler !",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteNote(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La note est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La note est en sécurité :)",
            "info"
          );
        }
      });
  };

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

  const [selectedEleve, setSelectedEleve] = useState<string>("");

  const handleSelectEleve = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedEleve(value);
  };

  const [modal_AddNote, setmodal_AddNote] = useState<boolean>(false);
  function tog_AddNote() {
    setmodal_AddNote(!modal_AddNote);
  }

  const [modal_UpdateNote, setmodal_UpdateNote] = useState<boolean>(false);
  function tog_UpdateNote() {
    setmodal_UpdateNote(!modal_UpdateNote);
  }

  const [createNote] = useAddNoteMutation();

  const initialNote = {
    eleve: "",
    matiere: "",
    trimestre: "",
    type: "",
    note: "",
    date: "",
  };

  const [notes, setNotes] = useState(initialNote);

  const { eleve, matiere, trimestre, type, note, date } = notes;

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
      notes["date"] = formatDate(selectedDate);
      notes["type"] = selectedType;
      notes["matiere"] = selectedMatiere;
      notes["eleve"] = selectedEleve;
      notes["trimestre"] = selectedTrimestre;
      createNote(notes)
        .then(() => notifySuccess())
        .then(() => setNotes(initialNote));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Elève</span>,
      selector: (row: any) => (
        <span>
          {row?.eleve?.nom!} {row?.eleve?.prenom!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matière</span>,
      selector: (row: any) => row?.matiere?.nom_matiere!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Note</span>,
      selector: (row: any) => row.note,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Trimestre</span>,
      selector: (row: any) => row.trimestre,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row: any) => row.type,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.date,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: true,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#"
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowObservation(!showObservation)}
                state={row}
              >
                <i
                  className="ri-eye-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge badge-soft-success edit-item-btn"
                onClick={() => tog_UpdateNote()}
                state={row}
              >
                <i
                  className="ri-edit-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>
            <li>
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
                <i
                  className="ri-delete-bin-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => AlertDelete(row._id)}
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

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
          note?.matiere
            ?.nom_matiere!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          note?.trimestre!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.type!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.note!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.date!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredNotes;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Notes" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={3}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Rechercher ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col lg={6}></Col>
                  <Col lg={3} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddNote()}
                      >
                        <i
                          className="ri-add-fill align-middle"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            cursor: "pointer",
                            fontSize: "1.5em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.3)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        ></i>{" "}
                        <span>Ajouter Note</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredNotes()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddNote}
            onHide={() => {
              tog_AddNote();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Note
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitNotes}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="eleve">Elève</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="eleve"
                      id="eleve"
                      onChange={handleSelectEleve}
                    >
                      <option value="">Choisir</option>
                      {AllEleves.map((eleve) => (
                        <option value={eleve?._id!} key={eleve?._id!}>
                          {eleve.nom} {eleve.prenom}
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
                      {AllMatieres.map((matiere) => (
                        <option value={matiere?._id!} key={matiere?._id!}>
                          {matiere.nom_matiere}
                        </option>
                      ))}
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
                      <option value="Examen">Examen</option>
                      <option value="DS">DS</option>
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
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
                </Row>
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
                      <option value="2ème trimestre">2ème trimestre</option>
                      <option value="3ème trimestre">3ème trimestre</option>
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
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddNote();
                        setNotes(initialNote);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddNote();
                      }}
                      type="submit"
                      variant="success"
                      id="addNew"
                    >
                      Ajouter
                    </Button>
                  </div>
                </Row>
              </Form>
            </Modal.Body>
          </Modal>
          <Modal
            className="fade"
            id="createModal"
            show={modal_UpdateNote}
            onHide={() => {
              tog_UpdateNote();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Note
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateNote
                modal_UpdateNote={modal_UpdateNote}
                setmodal_UpdateNote={setmodal_UpdateNote}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showObservation}
          onHide={() => setShowObservation(!showObservation)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails du note</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Elève</span>
              </Col>
              <Col lg={9}>
                <i>
                  {observationLocation?.state?.eleve?.nom!}{" "}
                  {observationLocation?.state?.eleve?.prenom!}
                </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matiere</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.matiere?.nom_matiere!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Note</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.note!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date création</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Type</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.type!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Trimestre</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.trimestre!}</i>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Notes;
