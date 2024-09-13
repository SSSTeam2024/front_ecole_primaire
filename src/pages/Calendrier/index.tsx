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
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";
import UpdateCalendrier from "./UpdateCalendrier";
import {
  useAddCalendrierMutation,
  useDeleteCalendrierMutation,
  useFetchCalendrierQuery,
} from "features/calendriers/calendrierSlice";
import { useFetchSallesQuery } from "features/salles/salleSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";

const Calendrier = () => {
  const { data = [] } = useFetchCalendrierQuery();

  const { data: AllSalles = [] } = useFetchSallesQuery();

  const { data: AllMatieres = [] } = useFetchMatieresQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [deleteCalendrier] = useDeleteCalendrierMutation();

  const [showCalendrier, setShowCalendrier] = useState<boolean>(false);

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

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le calendrier a été créé avec succès",
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
          deleteCalendrier(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le calendrier est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le calendrier est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [selectedSalle, setSelectedSalle] = useState<string>("");

  const handleSelectSalle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSalle(value);
  };

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");

  const handleSelectEnseignant = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEnseignant(value);
  };

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
  };

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const [modal_AddCalendrier, setmodal_AddCalendrier] =
    useState<boolean>(false);
  function tog_AddCalendrier() {
    setmodal_AddCalendrier(!modal_AddCalendrier);
  }

  const [modal_UpdateCalendrier, setmodal_UpdateCalendrier] =
    useState<boolean>(false);
  function tog_UpdateCalendrier() {
    setmodal_UpdateCalendrier(!modal_UpdateCalendrier);
  }

  const [createCalendrier] = useAddCalendrierMutation();

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

  const {
    salle,
    trimestre,
    heure_debut,
    heure_fin,
    date,
    matiere,
    classe,
    enseignant,
  } = calendrier;

  const onChangeCalendrier = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCalendrier((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitCalendrier = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      calendrier["date"] = formatDate(selectedDate)!;
      calendrier["salle"] = selectedSalle;
      calendrier["enseignant"] = selectedEnseignant;
      calendrier["matiere"] = selectedMatiere;
      calendrier["trimestre"] = selectedTrimestre;
      calendrier["classe"] = selectedClasse;
      calendrier["heure_debut"] = formatTime(selectedStartTime);
      calendrier["heure_fin"] = formatTime(selectedEndTime);

      createCalendrier(calendrier)
        .then(() => notifySuccess())
        .then(() => setCalendrier(initialCalendrier));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => <span>{row?.classe?.nom_classe!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matiere</span>,
      selector: (row: any) => row?.matiere!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.date,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Enseignant</span>,
      selector: (row: any) => (
        <span>
          {row.enseignant.nom_enseignant} {row.enseignant.prenom_enseignant}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">De</span>,
      selector: (row: any) => row.heure_debut,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Jusqu'à</span>,
      selector: (row: any) => row.heure_fin,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Salle</span>,
      selector: (row: any) => row?.salle?.nom_salle!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Trimestre</span>,
      selector: (row: any) => row.trimestre,
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
                onClick={() => setShowCalendrier(!showCalendrier)}
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
                // onClick={() => tog_UpdateCalendrier()}
                // state={row}
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

  const calendrierLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredCalendriers = () => {
    let filteredCalendriers = data;

    if (searchTerm) {
      filteredCalendriers = filteredCalendriers.filter(
        (calendrier: any) =>
          calendrier?.matiere
            ?.nom_matiere!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier
            ?.trimestre!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier
            ?.heure_debut!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier?.date!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          calendrier?.enseignant
            ?.nom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier?.enseignant
            ?.prenom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier
            ?.heure_fin!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier?.classe
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier?.salle
            ?.nom_salle!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredCalendriers;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="Calendrier des examens"
            pageTitle="Tableau de bord"
          />
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
                        // value={searchTerm}
                        // onChange={handleSearchChange}
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
                        onClick={() => tog_AddCalendrier()}
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
                        <span>Ajouter Calendrier</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredCalendriers()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddCalendrier}
            onHide={() => {
              tog_AddCalendrier();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Calendrier
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitCalendrier}>
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
                      {AllClasses.map((classe) => (
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
                      {AllMatieres.map((matiere) =>
                        matiere.matieres.map((m) => (
                          <option value={m.nom_matiere} key={m._id}>
                            {m.nom_matiere}
                          </option>
                        ))
                      )}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="enseignant">Enseignant</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="enseignant"
                      id="enseignant"
                      onChange={handleSelectEnseignant}
                    >
                      <option value="">Select</option>
                      {AllEnseignants.map((enseignant) => (
                        <option value={enseignant?._id!} key={enseignant?._id!}>
                          {enseignant.nom_enseignant}{" "}
                          {enseignant.prenom_enseignant}
                        </option>
                      ))}
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
                      placeholder="Date examen"
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
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="heure_debut">Commence à</Form.Label>
                  </Col>
                  <Col lg={8}>
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
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="heure_fin">Jusqu'à</Form.Label>
                  </Col>
                  <Col lg={8}>
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
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="salle">Salle</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="salle"
                      id="salle"
                      onChange={handleSelectSalle}
                    >
                      <option value="">Choisir</option>
                      {AllSalles.map((salle) => (
                        <option value={salle?._id!} key={salle?._id!}>
                          {salle.nom_salle}
                        </option>
                      ))}
                    </select>
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

                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddCalendrier();
                        setCalendrier(initialCalendrier);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddCalendrier();
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
            show={modal_UpdateCalendrier}
            onHide={() => {
              tog_UpdateCalendrier();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Calendrier
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateCalendrier
                modal_UpdateCalendrier={modal_UpdateCalendrier}
                setmodal_UpdateCalendrier={setmodal_UpdateCalendrier}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showCalendrier}
          onHide={() => setShowCalendrier(!showCalendrier)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails Calendrier</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.classe?.nom_classe!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matiere</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.matiere!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date Examen</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">De</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.heure_debut!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Jusqu'à</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.heure_fin!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Trimestre</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.trimestre!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Enseignant</span>
              </Col>
              <Col lg={9}>
                <i>
                  {calendrierLocation?.state?.enseignant?.nom_enseignant}{" "}
                  {calendrierLocation?.state?.enseignant?.prenom_enseignant}
                </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Salle</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.salle?.nom_salle!}</i>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Calendrier;
