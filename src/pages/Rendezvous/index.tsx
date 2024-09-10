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
  useAddRendezvousMutation,
  useDeleteRendezvousMutation,
  useFetchRendezvousQuery,
} from "features/rendezvous/rendezvousSlice";

import Select from "react-select";
import UpdateRendezvous from "./UpdateRendezvous";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";
import { useFetchParentsQuery } from "features/parents/parentSlice";

const Rendezvous = () => {
  const { data = [] } = useFetchRendezvousQuery();

  const { data: AllParents = [] } = useFetchParentsQuery();

  const [deleteRendezvous] = useDeleteRendezvousMutation();

  const [showRendezvous, setShowRendezvous] = useState<boolean>(false);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le rendez-vous a été créé avec succès",
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
          deleteRendezvous(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le rendez-vous est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le rendez-vous est en sécurité :)",
            "info"
          );
        }
      });
  };

  const optionColumnsTable = AllParents.map((parent: any) => ({
    value: parent?._id!,
    label: `${parent.prenom_parent} ${parent.nom_parent}`,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
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

  const [modal_AddRendezvous, setmodal_AddRendezvous] =
    useState<boolean>(false);
  function tog_AddRendezvous() {
    setmodal_AddRendezvous(!modal_AddRendezvous);
  }

  const [modal_UpdateRendezvous, setmodal_UpdateRendezvous] =
    useState<boolean>(false);
  function tog_UpdateRendezvous() {
    setmodal_UpdateRendezvous(!modal_UpdateRendezvous);
  }

  const [createRendezvous] = useAddRendezvousMutation();

  const initialRendezvous = {
    titre: "",
    date: "",
    description: "",
    parents: [""],
    heure: "",
    administration: "",
  };

  const [rendezvous, setRendezvous] = useState(initialRendezvous);

  const { titre, date, description, parents, heure, administration } =
    rendezvous;

  const onChangeRendezvous = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRendezvous((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitRendezvous = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      rendezvous["date"] = formatDate(selectedDate);
      rendezvous["parents"] = selectedColumnValues;
      rendezvous["administration"] = "false";
      rendezvous["heure"] = formatTime(selectedTime);
      createRendezvous(rendezvous)
        .then(() => notifySuccess())
        .then(() => setRendezvous(initialRendezvous));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Titre</span>,
      selector: (row: any) => row.titre,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Parent(s)</span>,
      selector: (row: any) => {
        return (
          <ul className="vstack gap-2 list-unstyled mb-0">
            {row.parents.map((parent: any) => (
              <li key={parent._id}>
                {parent.prenom_parent} {parent.nom_parent}
              </li>
            ))}
          </ul>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date du rendez-vous</span>,
      selector: (row: any) => row.date,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Heure</span>,
      selector: (row: any) => row.heure,
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
                onClick={() => setShowRendezvous(!showRendezvous)}
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
                onClick={() => tog_UpdateRendezvous()}
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

  const rendezvousLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredRendezvous = () => {
    let filteredRendezvous = data;

    if (searchTerm) {
      filteredRendezvous = filteredRendezvous.filter((rendezvous: any) => {
        const matchTitre = rendezvous?.titre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchDescription = rendezvous?.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchDate = rendezvous?.date
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchHeure = rendezvous?.heure
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchParents = rendezvous.parents.some((parent: any) => {
          return (
            parent.nom_parent
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            parent.prenom_parent
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        });

        return (
          matchTitre ||
          matchDescription ||
          matchDate ||
          matchHeure ||
          matchParents
        );
      });
    }

    return filteredRendezvous;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Rendez-vous" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddRendezvous()}
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
                        <span>Ajouter Rendez-vous</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredRendezvous()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddRendezvous}
            onHide={() => {
              tog_AddRendezvous();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Rendez-vous
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitRendezvous}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="titre">Titre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="titre"
                      name="titre"
                      onChange={onChangeRendezvous}
                      value={rendezvous.titre}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="description">Description</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={rendezvous.description}
                      onChange={onChangeRendezvous}
                      rows={3}
                    ></textarea>
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
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="heure">Commence à</Form.Label>
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
                      onChange={handleTimeChange}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="parents">Parent(s)</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionColumnsTable}
                      onChange={handleSelectValueColumnChange}
                    />
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddRendezvous();
                        setRendezvous(initialRendezvous);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddRendezvous();
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
        </Container>
        <Modal
          className="fade"
          id="createModal"
          show={modal_UpdateRendezvous}
          onHide={() => {
            tog_UpdateRendezvous();
          }}
          centered
        >
          <Modal.Header closeButton>
            <h1 className="modal-title fs-5" id="createModalLabel">
              Modifier Rendez-vous
            </h1>
          </Modal.Header>
          <Modal.Body>
            <UpdateRendezvous
              modal_UpdateRendezvous={modal_UpdateRendezvous}
              setmodal_UpdateRendezvous={setmodal_UpdateRendezvous}
            />
          </Modal.Body>
        </Modal>
        <Offcanvas
          show={showRendezvous}
          onHide={() => setShowRendezvous(!showRendezvous)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails du rendez-vous</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Titre</span>
              </Col>
              <Col lg={8}>
                <i>{rendezvousLocation?.state?.titre!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Description</span>
              </Col>
              <Col lg={8}>
                <i>{rendezvousLocation?.state?.description!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Date rendez-vous</span>
              </Col>
              <Col lg={8}>
                <i>{rendezvousLocation?.state?.date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Heure</span>
              </Col>
              <Col lg={8}>
                <i>{rendezvousLocation?.state?.heure!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Parent(s)</span>
              </Col>
              <Col lg={8}>
                <ul className="vstack gap-2 list-unstyled mb-0">
                  {rendezvousLocation?.state?.parents.map((parent: any) => (
                    <li key={parent._id}>
                      {parent.prenom_parent} {parent.nom_parent}
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
            {rendezvousLocation?.state?.matiere! !== null && (
              <Row className="mb-3">
                <Col lg={4}>
                  <span className="fw-medium">Matiere</span>
                </Col>
                <Col lg={8}>
                  <i>{rendezvousLocation?.state?.matiere?.nom_matiere!}</i>
                </Col>
              </Row>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Rendezvous;
