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
  useCreateSurveillantMutation,
  useDeleteSurveillantMutation,
  useGetSurveillantsQuery,
} from "features/surveillants/surveillantSlice";

const Surveillants = () => {
  const { data = [] } = useGetSurveillantsQuery();

  const [deleteSurveillant] = useDeleteSurveillantMutation();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le surveillant a été créé avec succès",
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
          deleteSurveillant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le surveillant est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le surveillant est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddSurveillant, setmodal_AddSurveillant] =
    useState<boolean>(false);
  function tog_AddSurveillant() {
    setmodal_AddSurveillant(!modal_AddSurveillant);
  }
  const [modal_UpdateSurveillant, setmodal_UpdateSurveillant] =
    useState<boolean>(false);
  function tog_UpdateSurveillant() {
    setmodal_UpdateSurveillant(!modal_UpdateSurveillant);
  }
  const [createSurveillant] = useCreateSurveillantMutation();

  const initialSurveillant = {
    nom_surveillant: "",
    prenom_surveillant: "",
    nom_utilisateur: "",
    mot_de_passe: "",
    tel: "",
  };

  const [surveillant, setSurveillant] = useState(initialSurveillant);

  const {
    nom_surveillant,
    prenom_surveillant,
    nom_utilisateur,
    mot_de_passe,
    tel,
  } = surveillant;

  function getLastSixReversed(numberString: string) {
    // Extract the last six characters and reverse them
    return numberString.slice(-6).split("").reverse().join("");
  }

  const onChangeSurveillant = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurveillant((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitSurveillant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      surveillant["nom_utilisateur"] = tel;
      surveillant["mot_de_passe"] = getLastSixReversed(tel);
      createSurveillant(surveillant)
        .then(() => notifySuccess())
        .then(() => setSurveillant(initialSurveillant));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom</span>,
      selector: (row: any) => row.nom_surveillant,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Prénom</span>,
      selector: (row: any) => row.prenom_surveillant,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">N° Téléphone</span>,
      selector: (row: any) => row.tel,
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
                onClick={() => tog_UpdateSurveillant()}
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

  const getFilteredSurveillants = () => {
    let filteredSurveillants = data;

    if (searchTerm) {
      filteredSurveillants = filteredSurveillants.filter(
        (surveillant: any) =>
          surveillant
            ?.nom_surveillant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          surveillant
            ?.prenom_surveillant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          surveillant?.tel!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredSurveillants;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Surveillants" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddSurveillant()}
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
                        <span>Ajouter Surveillant</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredSurveillants()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddSurveillant}
            onHide={() => {
              tog_AddSurveillant();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Surveillant
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitSurveillant}>
                <Row>
                  <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3">
                      <Form.Label htmlFor="nom_surveillant">Nom</Form.Label>
                      <Form.Control
                        type="text"
                        id="nom_surveillant"
                        name="nom_surveillant"
                        onChange={onChangeSurveillant}
                        value={surveillant.nom_surveillant}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3">
                      <Form.Label htmlFor="prenom_surveillant">
                        Prénom
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="prenom_surveillant"
                        name="prenom_surveillant"
                        onChange={onChangeSurveillant}
                        value={surveillant.prenom_surveillant}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3">
                      <Form.Label htmlFor="tel">N° Téléphone</Form.Label>
                      <Form.Control
                        type="text"
                        id="tel"
                        name="tel"
                        onChange={onChangeSurveillant}
                        value={surveillant.tel}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddSurveillant();
                        setSurveillant(initialSurveillant);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddSurveillant();
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
          {/* <Modal
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
          </Modal> */}
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Surveillants;
