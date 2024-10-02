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
import {
  useFetchEtudiantsByClasseIdMutation,
  useFetchEtudiantsQuery,
} from "features/etudiants/etudiantSlice";
import {
  useAddAbonnementMutation,
  useGetAbonnementsByEleveIdMutation,
} from "features/abonnements/abonnementSlice";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchCantinesQuery } from "features/cantines/cantineSlice";
// import UpdateSalle from "./UpdateSalle";

const Abonnements = () => {
  const { data: AllEtudiants = [] } = useFetchEtudiantsQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllCantines = [] } = useFetchCantinesQuery();

  const [fetchAbonnementByEleveId, { data: fetchedAbonnements }] =
    useGetAbonnementsByEleveIdMutation();

  const [fetchEtudiantsByClasseId, { data: fetchedEtudiants }] =
    useFetchEtudiantsByClasseIdMutation();

  const [deleteSalle] = useDeleteSalleMutation();

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [studentsToCreateAbonnement, setStudentsToCreateAbonnement] = useState<
    any[]
  >([]);
  const [
    selectedClasseToCreateAbonnement,
    setSelectedClasseToCreateAbonnement,
  ] = useState<string>("");

  const handleSelectClasse = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const result = await fetchEtudiantsByClasseId(value).unwrap();
    setStudents(result);
    setSelectedClasse(value);
  };

  const handleSelectClasseToCreateAbonnement = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const result = await fetchEtudiantsByClasseId(value).unwrap();
    setStudentsToCreateAbonnement(result);
    setSelectedClasseToCreateAbonnement(value);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'abonnement a été créé avec succès",
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

  const [modal_AddAbonnement, setmodal_AddAbonnement] =
    useState<boolean>(false);
  function tog_AddAbonnement() {
    setmodal_AddAbonnement(!modal_AddAbonnement);
  }
  const [modal_UpdateSalle, setmodal_UpdateSalle] = useState<boolean>(false);
  function tog_UpdateSalle() {
    setmodal_UpdateSalle(!modal_UpdateSalle);
  }

  const [selectedAbonnements, setSelectedAbonnements] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedEleveId, setSelectedEleveId] = useState(null);
  const [selectedEleve, setSelectedEleve] = useState<string>("");
  // const [selectedCantine, setSelectedCantine] = useState<string | null>("");

  const handleSelectEleve = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEleve(value);
  };

  const handleSelectType = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedType(value);
  };

  // const handleSelectCantine = async (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const value = event.target.value;
  //   setSelectedCantine(value);
  // };

  const [createAbonnement] = useAddAbonnementMutation();

  const initialAbonnement = {
    eleve: "",
    type: "",
    status: "",
  };

  const [abonnement, setAbonnement] = useState(initialAbonnement);

  const { eleve, type, status } = abonnement;

  const onChangeAbonnement = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAbonnement((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitAbonnement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      abonnement["eleve"] = selectedEleve;
      abonnement["type"] = selectedType;
      // abonnement.cantine = selectedCantine === "" ? null : selectedCantine;
      createAbonnement(abonnement)
        .then(() => notifySuccess())
        .then(() => setAbonnement(initialAbonnement));
    } catch (error) {
      notifyError(error);
    }
  };

  const handleParentClick = async (eleveId: any) => {
    try {
      const response = await fetchAbonnementByEleveId(eleveId).unwrap();
      setSelectedAbonnements(response);
      setSelectedEleve(eleveId);
      setSelectedEleveId(eleveId);
    } catch (error) {
      console.error("Error fetching abonnements", error);
    }
  };

  const columns = [
    // {
    //   name: <span className="font-weight-bold fs-13">Cantine</span>,
    //   selector: (row: any) => row.cantine?.repas,
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row: any) => row.type,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.cantine?.creation_date,
      sortable: true,
    },

    // {
    //   name: <span className="font-weight-bold fs-13">Actions</span>,
    //   sortable: true,
    //   cell: (row: any) => {
    //     return (
    //       <ul className="hstack gap-2 list-unstyled mb-0">
    //         <li>
    //           <Link
    //             to="#"
    //             className="badge badge-soft-success edit-item-btn"
    //             onClick={() => tog_UpdateSalle()}
    //             state={row}
    //           >
    //             <i
    //               className="ri-edit-2-line"
    //               style={{
    //                 transition: "transform 0.3s ease-in-out",
    //                 cursor: "pointer",
    //                 fontSize: "1.2em",
    //               }}
    //               onMouseEnter={(e) =>
    //                 (e.currentTarget.style.transform = "scale(1.3)")
    //               }
    //               onMouseLeave={(e) =>
    //                 (e.currentTarget.style.transform = "scale(1)")
    //               }
    //             ></i>
    //           </Link>
    //         </li>
    //         <li>
    //           <Link to="#" className="badge badge-soft-danger remove-item-btn">
    //             <i
    //               className="ri-delete-bin-2-line"
    //               style={{
    //                 transition: "transform 0.3s ease-in-out",
    //                 cursor: "pointer",
    //                 fontSize: "1.2em",
    //               }}
    //               onMouseEnter={(e) =>
    //                 (e.currentTarget.style.transform = "scale(1.3)")
    //               }
    //               onMouseLeave={(e) =>
    //                 (e.currentTarget.style.transform = "scale(1)")
    //               }
    //               onClick={() => AlertDelete(row._id)}
    //             ></i>
    //           </Link>
    //         </li>
    //       </ul>
    //     );
    //   },
    // },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredEleves = () => {
    let filteredEleves = students;

    if (searchTerm) {
      filteredEleves = filteredEleves.filter(
        (eleve: any) =>
          eleve?.nom!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          eleve?.prenom!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredEleves;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Abonnements" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Body>
                <Row>
                  <Col>
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col lg={4}>
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
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Header>
                        <Row className="g-3">
                          <Col lg={7}>
                            <Form.Label>Elèves</Form.Label>
                          </Col>
                          <Col lg={5}>
                            <div className="search-box">
                              <input
                                type="text"
                                className="form-control form-control-sm search"
                                placeholder="Rechercher ..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                              />
                              <i className="ri-search-line search-icon"></i>
                            </div>
                          </Col>
                        </Row>
                      </Card.Header>
                      {students.length === 0 ? (
                        <Card.Body>
                          <h6>Aucun Classe été sélectionné</h6>
                        </Card.Body>
                      ) : (
                        <Card.Body
                          style={{ overflowY: "scroll", maxHeight: "600px" }}
                        >
                          <ul className="list-group">
                            {getFilteredEleves().map((eleve) => (
                              <li
                                key={eleve._id}
                                className="list-group-item"
                                aria-disabled="true"
                                onClick={() => handleParentClick(eleve._id)}
                                style={{
                                  cursor: "pointer",
                                  backgroundColor:
                                    selectedEleveId === eleve._id
                                      ? "#f0f0f0"
                                      : "",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  <div className="flex-shrink-0">
                                    <img
                                      src={`${
                                        process.env.REACT_APP_BASE_URL
                                      }/etudiantFiles/${eleve?.avatar!}`}
                                      alt=""
                                      className="avatar-xs rounded-circle"
                                    />
                                  </div>
                                  <div className="flex-grow-1 ms-2">
                                    {eleve?.prenom!} {eleve?.nom!}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </Card.Body>
                      )}
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <Card.Header>
                        <Row>
                          <Col lg={8}>
                            <Form.Label>Abonnements</Form.Label>
                          </Col>
                          <Col lg={4}>
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                              aria-label="Basic example"
                            >
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => tog_AddAbonnement()}
                              >
                                <i
                                  className="ri-add-fill align-middle"
                                  style={{
                                    transition: "transform 0.3s ease-in-out",
                                    cursor: "pointer",
                                    fontSize: "1.5em",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform =
                                      "scale(1.3)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform =
                                      "scale(1)")
                                  }
                                ></i>{" "}
                                <span>Ajouter Abonnement</span>
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Card.Header>
                      <Card.Body>
                        <DataTable
                          columns={columns}
                          data={selectedAbonnements}
                          pagination
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddAbonnement}
            onHide={() => {
              tog_AddAbonnement();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Abonnement
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitAbonnement}>
                <Row className="mb-2">
                  <Col lg={4}>
                    <Form.Label htmlFor="classe">Classe</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="classe"
                      id="classe"
                      onChange={handleSelectClasseToCreateAbonnement}
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
                <Row className="mb-2">
                  <Col lg={4}>
                    <Form.Label htmlFor="eleve">Elèves</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="eleve"
                      id="eleve"
                      onChange={handleSelectEleve}
                    >
                      <option value="">Choisir</option>
                      {studentsToCreateAbonnement.map((eleve) => (
                        <option value={eleve?._id!} key={eleve?._id!}>
                          {eleve?.prenom!} {eleve?.nom!}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col lg={4}>
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

                      <option value="Garde et Restauration annuel">
                        Garde et Restauration annuel
                      </option>
                      <option value="Garde et Panier annuel">
                        Garde et Panier annuel
                      </option>
                      <option value="Garde et Restauration T1">
                        Garde et Restauration T1
                      </option>
                      <option value="Garde et Restauration T2">
                        Garde et Restauration T2
                      </option>
                      <option value="Garde et Restauration T3">
                        Garde et Restauration T3
                      </option>
                      <option value="Garde et Panier T1">
                        Garde et Panier T1
                      </option>
                      <option value="Garde et Panier T2">
                        Garde et Panier T2
                      </option>
                      <option value="Garde et Panier T3">
                        Garde et Panier T3
                      </option>
                      <option value="Solo">Solo</option>
                    </select>
                  </Col>
                </Row>
                {/* {selectedType === "Solo" && (
                  <Row className="mb-2">
                    <Col lg={4}>
                      <Form.Label htmlFor="cantine">Cantine</Form.Label>
                    </Col>
                    <Col lg={8}>
                      <select
                        className="form-select text-muted"
                        name="cantine"
                        id="cantine"
                        onChange={handleSelectCantine}
                      >
                        <option value="">Choisir</option>
                        {AllCantines.map((cantine) => (
                          <option value={cantine?._id!} key={cantine?._id!}>
                            {cantine?.repas!}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                )} */}
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddAbonnement();
                        setAbonnement(initialAbonnement);
                      }}
                    >
                      Fermer
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddAbonnement();
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
export default Abonnements;
