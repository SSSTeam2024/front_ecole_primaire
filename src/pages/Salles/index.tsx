import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAddSalleMutation,
  useDeleteSalleMutation,
  useFetchSallesQuery,
} from "features/salles/salleSlice";
import UpdateSalle from "./UpdateSalle";

const Salles = () => {
  const { data = [] } = useFetchSallesQuery();

  const [deleteSalle] = useDeleteSalleMutation();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La salle a été créée avec succès",
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
          deleteSalle(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La salle est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La salle est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddSalle, setmodal_AddSalle] = useState<boolean>(false);
  function tog_AddSalle() {
    setmodal_AddSalle(!modal_AddSalle);
  }
  const [modal_UpdateSalle, setmodal_UpdateSalle] = useState<boolean>(false);
  function tog_UpdateSalle() {
    setmodal_UpdateSalle(!modal_UpdateSalle);
  }
  const [createSalle] = useAddSalleMutation();

  const initialSalle = {
    nom_salle: "",
  };

  const [salle, setSalle] = useState(initialSalle);

  const { nom_salle } = salle;

  const onChangeSalle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalle((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitSalle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      createSalle(salle)
        .then(() => notifySuccess())
        .then(() => setSalle(initialSalle));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom Salle</span>,
      selector: (row: any) => row.nom_salle,
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
                className="badge badge-soft-success edit-item-btn"
                onClick={() => tog_UpdateSalle()}
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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredSalles = () => {
    let filteredSalles = data;

    if (searchTerm) {
      filteredSalles = filteredSalles.filter((salle: any) =>
        salle?.nom_salle!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredSalles;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Salles" pageTitle="Tableau de bord" />
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
                  <Col lg={7}></Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddSalle()}
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
                        <span>Ajouter Salle</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredSalles()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddSalle}
            onHide={() => {
              tog_AddSalle();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Salle
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitSalle}>
                <Row>
                  <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3">
                      <Form.Label htmlFor="nom_salle">Nom</Form.Label>
                      <Form.Control
                        type="text"
                        id="nom_salle"
                        name="nom_salle"
                        onChange={onChangeSalle}
                        value={salle.nom_salle}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddSalle();
                        setSalle(initialSalle);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddSalle();
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
            show={modal_UpdateSalle}
            onHide={() => {
              tog_UpdateSalle();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Salle
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateSalle
                modal_UpdateSalle={modal_UpdateSalle}
                setmodal_UpdateSalle={setmodal_UpdateSalle}
              />
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Salles;
