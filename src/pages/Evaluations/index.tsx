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
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import UpdateEvaluations from "./UpdateEvaluations";
import {
  useAddEvaluationsMutation,
  useDeleteEvaluationsMutation,
  useFetchEvaluationssQuery,
} from "features/evaluations/evaluationSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";

const Evaluations = () => {
  const { data = [] } = useFetchEvaluationssQuery();

  const { data: AllEleves = [] } = useFetchEtudiantsQuery();

  const { data: AllMatieres = [] } = useFetchMatieresQuery();

  const [deleteEvaluation] = useDeleteEvaluationsMutation();

  const [showEvaluation, setShowEvaluation] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'Evaluation a été créée avec succès",
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
          deleteEvaluation(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "L'Evaluation est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "L'Evaluation est en sécurité :)",
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

  const [modal_AddEvaluation, setmodal_AddEvaluation] =
    useState<boolean>(false);
  function tog_AddEvaluation() {
    setmodal_AddEvaluation(!modal_AddEvaluation);
  }

  const [modal_UpdateEvaluation, setmodal_UpdateEvaluation] =
    useState<boolean>(false);
  function tog_UpdateEvaluation() {
    setmodal_UpdateEvaluation(!modal_UpdateEvaluation);
  }

  const [createEvaluation] = useAddEvaluationsMutation();

  const initialEvaluation = {
    eleve: "",
    matiere: "",
    trimestre: "",
    note: "",
    date: "",
  };

  const [evaluations, setEvaluations] = useState(initialEvaluation);

  const { eleve, matiere, trimestre, note, date } = evaluations;

  const onChangeEvaluations = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEvaluations((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitEvaluations = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      evaluations["date"] = formatDate(selectedDate);
      evaluations["matiere"] = selectedMatiere;
      evaluations["eleve"] = selectedEleve;
      evaluations["trimestre"] = selectedTrimestre;
      createEvaluation(evaluations)
        .then(() => notifySuccess())
        .then(() => setEvaluations(initialEvaluation));
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
      selector: (row: any) => row.matiere.nom_matiere,
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
                onClick={() => setShowEvaluation(!showEvaluation)}
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
                onClick={() => tog_UpdateEvaluation()}
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

  const evaluationLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredEvaluations = () => {
    let filteredEvaluations = data;

    if (searchTerm) {
      filteredEvaluations = filteredEvaluations.filter(
        (evaluation: any) =>
          evaluation?.eleve
            ?.nom!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          evaluation?.eleve
            ?.prenom!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          evaluation?.matiere
            ?.nom_matiere!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          evaluation
            ?.trimestre!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          evaluation?.note!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evaluation?.date!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredEvaluations;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Evaluations" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddEvaluation()}
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
                        <span>Ajouter Evaluation</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredEvaluations()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddEvaluation}
            onHide={() => {
              tog_AddEvaluation();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Evaluation
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitEvaluations}>
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
                      {AllMatieres.map((matiere) =>
                        matiere.matieres.map((m) => (
                          <option value={matiere?._id!} key={m.nom_matiere}>
                            {m.nom_matiere}
                          </option>
                        ))
                      )}
                    </select>
                  </Col>
                </Row>
                {/* <Row className="mb-4">
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
                </Row> */}
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="note">Note</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="note"
                      name="note"
                      onChange={onChangeEvaluations}
                      value={evaluations.note}
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
                      <option value="1ère trimestre">1ère trimestre</option>
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
                        tog_AddEvaluation();
                        setEvaluations(initialEvaluation);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddEvaluation();
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
            show={modal_UpdateEvaluation}
            onHide={() => {
              tog_UpdateEvaluation();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Evaluation
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateEvaluations
                modal_UpdateEvaluation={modal_UpdateEvaluation}
                setmodal_UpdateEvaluation={setmodal_UpdateEvaluation}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showEvaluation}
          onHide={() => setShowEvaluation(!showEvaluation)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails d'évaluation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Elève</span>
              </Col>
              <Col lg={9}>
                <i>
                  {evaluationLocation?.state?.eleve?.nom!}{" "}
                  {evaluationLocation?.state?.eleve?.prenom!}
                </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matiere</span>
              </Col>
              <Col lg={9}>
                <i>{evaluationLocation?.state?.matiere?.nom_matiere!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Note</span>
              </Col>
              <Col lg={9}>
                <i>{evaluationLocation?.state?.note!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date création</span>
              </Col>
              <Col lg={9}>
                <i>{evaluationLocation?.state?.date!}</i>
              </Col>
            </Row>
            {/* <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Type</span>
              </Col>
              <Col lg={9}>
                <i>{evaluationLocation?.state?.type!}</i>
              </Col>
            </Row> */}
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Trimestre</span>
              </Col>
              <Col lg={9}>
                <i>{evaluationLocation?.state?.trimestre!}</i>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Evaluations;
