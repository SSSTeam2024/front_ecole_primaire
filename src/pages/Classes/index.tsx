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
import {
  useAddClasseMutation,
  useDeleteClasseMutation,
  useFetchClassesQuery,
} from "features/classes/classeSlice";
import Swal from "sweetalert2";
import ModalEdit from "./ModalEdit";
import { useGetNiveauxQuery } from "features/niveaux/niveauxSlice";
import {
  useFetchEtudiantsByClasseIdMutation,
  useUpdateEleveClasseMutation,
} from "features/etudiants/etudiantSlice";

const Classes = () => {
  const { data = [] } = useFetchClassesQuery();
  const { data: AllNiveaux = [] } = useGetNiveauxQuery();

  const handleReload = async () => {
    window.location.reload();
  };

  const [deleteClasse] = useDeleteClasseMutation();

  const [showClasse, setShowClasse] = useState<boolean>(false);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La classe a été créée avec succès",
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
          deleteClasse(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La classe est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La classe est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddClasse, setmodal_AddClasse] = useState<boolean>(false);
  function tog_AddClasse() {
    setmodal_AddClasse(!modal_AddClasse);
  }
  const [modal_UpdateClasse, setmodal_UpdateClasse] = useState<boolean>(false);
  function tog_UpdateClasse() {
    setmodal_UpdateClasse(!modal_UpdateClasse);
  }

  const [selectedNiveau, setSelectedNiveau] = useState<string>("");

  const handleSelectNiveau = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedNiveau(value);
  };

  const [createClasse] = useAddClasseMutation();

  const initialClasse = {
    nom_classe: "",
    niveau: "",
  };

  const [classe, setClasse] = useState(initialClasse);

  const { nom_classe, niveau } = classe;

  const onChangeClasse = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClasse((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitClasse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      classe["niveau"] = selectedNiveau;
      createClasse(classe).then(() => notifySuccess());
    } catch (error) {
      notifyError(error);
    }
  };

  const classLocation = useLocation();

  const [students, setStudents] = useState<any[]>([]);

  const [fetchEtudiantsByClasseId, { data: fetchedEtudiants }] =
    useFetchEtudiantsByClasseIdMutation();

  const handleListOfStudents = async (selectedOption: any) => {
    const result = await fetchEtudiantsByClasseId(selectedOption._id!).unwrap();
    setStudents(result);
    setShowClasse(!showClasse);
  };

  const [deleteEleveFromClasse] = useUpdateEleveClasseMutation();

  const AlertDeleteEleveFromClasse = async (_id: any) => {
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
      .then(async (result) => {
        if (result.isConfirmed) {
          deleteEleveFromClasse({
            _id,
            classe: null,
          });
          await handleReload();
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "L'élève est supprimée de ce classe.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "L'élève est en sécurité :)",
            "info"
          );
        }
      });
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Niveau</span>,
      selector: (row: any) => row?.niveau?.nom_niveau!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => row.nom_classe,
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
                className="badge badge-soft-info view-item-btn"
                onClick={() => handleListOfStudents(row)}
                state={row}
              >
                <i className="ri-eye-line"></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge badge-soft-success edit-item-btn"
                onClick={() => tog_UpdateClasse()}
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

  const columnEtudiants = [
    {
      name: <span className="font-weight-bold fs-13">Nom</span>,
      selector: (row: any) => row.nom,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Prénom</span>,
      selector: (row: any) => row.prenom,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date de Naissance</span>,
      selector: (row: any) => row.date_de_naissance,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => row.classe?.nom_classe!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Parent</span>,
      selector: (row: any) => (
        <span>
          {row?.parent?.nom_parent!} {row?.parent?.prenom_parent!}
        </span>
      ),
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
                to="/détails-etudiant"
                className="badge badge-soft-info edit-item-btn"
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
                to="/modifier-etudiant"
                className="badge badge-soft-success edit-item-btn"
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
                  onClick={() => AlertDeleteEleveFromClasse(row._id)}
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

  const getFilteredClasses = () => {
    let filteredClasses = data;

    if (searchTerm) {
      filteredClasses = filteredClasses.filter((classe: any) =>
        classe?.nom_classe!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredClasses;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Classes" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddClasse()}
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
                        <span>Ajouter Classe</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredClasses()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddClasse}
            onHide={() => {
              tog_AddClasse();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Classe
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitClasse}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="niveau">Niveau</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="niveau"
                      id="niveau"
                      onChange={handleSelectNiveau}
                    >
                      <option value="">Choisir</option>
                      {AllNiveaux.map((niveau: any) => (
                        <option value={niveau._id} key={niveau?._id!}>
                          {niveau.nom_niveau}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3} className="d-flex justify-content-center">
                    <Form.Label htmlFor="nom_classe">Classe</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="nom_classe"
                      name="nom_classe"
                      onChange={onChangeClasse}
                      value={classe.nom_classe}
                    />
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddClasse();
                        setClasse(initialClasse);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddClasse();
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
            show={modal_UpdateClasse}
            onHide={() => {
              tog_UpdateClasse();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Classe
              </h1>
            </Modal.Header>
            <Modal.Body>
              <ModalEdit
                modal_UpdateClasse={modal_UpdateClasse}
                setmodal_UpdateClasse={setmodal_UpdateClasse}
              />
            </Modal.Body>
          </Modal>
          <Offcanvas
            show={showClasse}
            onHide={() => setShowClasse(!showClasse)}
            placement="end"
            style={{ width: "50%" }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Liste des élèves</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <DataTable columns={columnEtudiants} data={students} pagination />
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Classes;
