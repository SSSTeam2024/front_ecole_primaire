import React, { useEffect, useState } from "react";
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

import Select from "react-select";
import {
  useCreateNiveauMutation,
  useDeleteNiveauMutation,
  useGetNiveauxQuery,
} from "features/niveaux/niveauxSlice";
import UpdateNiveau from "./UpdateNiveau";

const Niveaux = () => {
  const { data = [] } = useGetNiveauxQuery();

  const [deleteNiveau] = useDeleteNiveauMutation();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le niveau a été créé avec succès",
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
          deleteNiveau(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le niveau est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le niveau est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddNiveau, setmodal_AddNiveau] = useState<boolean>(false);
  function tog_AddNiveau() {
    setmodal_AddNiveau(!modal_AddNiveau);
  }
  const [modal_UpdateNiveau, setmodal_UpdateNiveau] = useState<boolean>(false);
  function tog_UpdateNiveau() {
    setmodal_UpdateNiveau(!modal_UpdateNiveau);
  }

  const [createNiveau] = useCreateNiveauMutation();

  const initialNiveau = {
    nom_niveau: "",
    type: "",
  };

  const [niveau, setNiveau] = useState(initialNiveau);
  const [newType, setNewType] = useState("");
  const { nom_niveau, type } = niveau;

  useEffect(() => {
    if (
      nom_niveau.startsWith("7") ||
      nom_niveau.startsWith("8") ||
      nom_niveau.startsWith("9")
    ) {
      setNewType("Collège");
    } else if (
      nom_niveau.startsWith("1") ||
      nom_niveau.startsWith("2") ||
      nom_niveau.startsWith("3") ||
      nom_niveau.startsWith("4") ||
      nom_niveau.toLowerCase() === "bac"
    ) {
      setNewType("Lycée");
    } else {
      setNewType("");
    }
  }, [nom_niveau]);

  const onChangeNiveau = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNiveau((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitNiveau = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      niveau["type"] = newType;
      createNiveau(niveau)
        .then(() => notifySuccess())
        .then(() => setNiveau(initialNiveau));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Niveau</span>,
      selector: (row: any) => row.nom_niveau,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row: any) => row.type,
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
                // onClick={() => tog_UpdateNiveau()}
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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredNiveaux = () => {
    let filteredNiveaux = data;

    if (searchTerm) {
      filteredNiveaux = filteredNiveaux.filter((niveau: any) =>
        niveau?.nom_niveau!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredNiveaux;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Niveaux" pageTitle="Tableau de bord" />
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
                  <Col lg={7} className="text-end">
                    {/* <div className="mb-3">
                      <Form.Control
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        id="file-upload"
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="btn btn-darken-success"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        <i className="ri-file-excel-2-line align-middle fs-18"></i>{" "}
                        <span>Télécharger Fichier Excel</span>
                      </button>
                    </div> */}
                  </Col>
                  <Col lg={2} className="text-end">
                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn btn-darken-primary"
                        onClick={() => tog_AddNiveau()}
                      >
                        <i className="ri-add-fill align-middle fs-18"></i>{" "}
                        <span>Ajouter Niveau</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredNiveaux()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddNiveau}
            onHide={() => {
              tog_AddNiveau();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Niveau
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitNiveau}>
                <Row className="mb-4">
                  <Col lg={3} className="d-flex justify-content-center">
                    <Form.Label htmlFor="nom_niveau">Niveau</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="nom_niveau"
                      name="nom_niveau"
                      onChange={onChangeNiveau}
                      value={niveau.nom_niveau}
                    />
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddNiveau();
                        setNiveau(initialNiveau);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddNiveau();
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
            show={modal_UpdateNiveau}
            onHide={() => {
              tog_UpdateNiveau();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Niveau
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateNiveau
                modal_UpdateNiveau={modal_UpdateNiveau}
                setmodal_UpdateNiveau={setmodal_UpdateNiveau}
              />
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Niveaux;
