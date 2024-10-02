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
import {
  useAddEnseignantMutation,
  useDeleteEnseignantMutation,
  useFetchEnseignantsQuery,
} from "features/enseignants/enseignantSlice";
import UpdateEnseignant from "./UpdateEnseignant";
import { useFetchRendezvousByEnseignantIdQuery } from "features/rendezvous/rendezvousSlice";
import {
  Matiere,
  MatieresToAdd,
  useFetchMatieresQuery,
} from "features/matieres/matiereSlice";

const Enseignants = () => {
  const { data = [] } = useFetchEnseignantsQuery();

  const { data: AllMatieres = [] } = useFetchMatieresQuery();
  const allMatieres = AllMatieres.flatMap((item) => item.matieres);

  const allMatiereNames = allMatieres.map((matiere) => matiere.nom_matiere);

  const uniqueMatiereNames = Array.from(new Set(allMatiereNames));

  const [deleteEnseignant] = useDeleteEnseignantMutation();

  const [showEnseignant, setShowEnseignant] = useState<boolean>(false);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'enseignant a été créé avec succès",
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
          deleteEnseignant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "L'enseignant est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "L'enseignant est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddEnseignant, setmodal_AddEnseignant] =
    useState<boolean>(false);
  function tog_AddEnseignant() {
    setmodal_AddEnseignant(!modal_AddEnseignant);
  }

  const [modal_UpdateEnseignant, setmodal_UpdateEnseignant] =
    useState<boolean>(false);
  function tog_UpdateEnseignant() {
    setmodal_UpdateEnseignant(!modal_UpdateEnseignant);
  }

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const [createEnseignant] = useAddEnseignantMutation();

  const initialEnseignant = {
    nom_enseignant: "",
    prenom_enseignant: "",
    phone: "",
    matiere: "",
  };

  const [enseignant, setEnseignant] = useState(initialEnseignant);

  const { nom_enseignant, prenom_enseignant, phone, matiere } = enseignant;

  const onChangeEnseignant = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnseignant((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitEnseignant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      enseignant["matiere"] = selectedMatiere;
      createEnseignant(enseignant)
        .then(() => notifySuccess())
        .then(() => setEnseignant(initialEnseignant));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom</span>,
      selector: (row: any) => row.nom_enseignant,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Prénom</span>,
      selector: (row: any) => row.prenom_enseignant,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matière</span>,
      selector: (row: any) => row?.matiere!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">N° Téléphone</span>,
      selector: (row: any) => row?.phone!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#"
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowEnseignant(!showEnseignant)}
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
                onClick={() => tog_UpdateEnseignant()}
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

  const getFilteredEnseignants = () => {
    let filteredEnseignants = [...data];

    if (searchTerm) {
      filteredEnseignants = filteredEnseignants.filter(
        (enseignant: any) =>
          enseignant?.nom_enseignant
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          enseignant?.prenom_enseignant
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          enseignant?.phone_enseignant
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredEnseignants.reverse();
  };

  const enseignantLocation = useLocation();
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Enseignants" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddEnseignant()}
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
                        <span>Ajouter Enseignant</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredEnseignants()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddEnseignant}
            onHide={() => {
              tog_AddEnseignant();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Enseignant
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitEnseignant}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="nom_enseignant">Nom</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="nom_enseignant"
                      name="nom_enseignant"
                      onChange={onChangeEnseignant}
                      value={enseignant.nom_enseignant}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="prenom_enseignant">Prénom</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="prenom_enseignant"
                      name="prenom_enseignant"
                      onChange={onChangeEnseignant}
                      value={enseignant.prenom_enseignant}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="phone">N° Téléphone</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={onChangeEnseignant}
                      value={enseignant.phone}
                    />
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
                      {uniqueMatiereNames.map((matiere, index) => (
                        <option value={matiere} key={index}>
                          {matiere}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddEnseignant();
                        setEnseignant(initialEnseignant);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddEnseignant();
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
            show={modal_UpdateEnseignant}
            onHide={() => {
              tog_UpdateEnseignant();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Enseignant
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateEnseignant
                modal_UpdateEnseignant={modal_UpdateEnseignant}
                setmodal_UpdateEnseignant={setmodal_UpdateEnseignant}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showEnseignant}
          onHide={() => setShowEnseignant(!showEnseignant)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails d'enseignant</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Nom</span>
              </Col>
              <Col lg={9}>
                <i>{enseignantLocation?.state?.nom_enseignant!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Prénom</span>
              </Col>
              <Col lg={9}>
                <i>{enseignantLocation?.state?.prenom_enseignant!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">N° Téléphone</span>
              </Col>
              <Col lg={9}>
                <i>{enseignantLocation?.state?.phone!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matière</span>
              </Col>
              <Col lg={9}>
                <i>{enseignantLocation?.state?.matiere!}</i>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Enseignants;
