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
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAddEtudiantMutation,
  useDeleteEtudiantMutation,
  useFetchEtudiantsQuery,
} from "features/etudiants/etudiantSlice";
import Flatpickr from "react-flatpickr";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { convertToBase64 } from "helpers/base64_convert";
import { formatDate } from "helpers/data_time_format";

const Etudiants = () => {
  const { data = [] } = useFetchEtudiantsQuery();
  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [deleteEtudiant] = useDeleteEtudiantMutation();

  const [selectedDateDeNaissance, setSelectedDateDeNaissance] =
    useState<Date | null>(null);
  const handleDateDeNaissanceChange = (selectedDates: Date[]) => {
    setSelectedDateDeNaissance(selectedDates[0]);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'élève a été créé avec succès",
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
          deleteEtudiant(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "L'élève est supprimé.",
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

  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
  };

  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const handleSelectGenre = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedGenre(value);
  };

  const [modal_AddEtudiant, setmodal_AddEtudiant] = useState<boolean>(false);
  function tog_AddEtudiant() {
    setmodal_AddEtudiant(!modal_AddEtudiant);
  }

  const [createEtudiant] = useAddEtudiantMutation();

  const initialEtudiant = {
    nom: "",
    prenom: "",
    date_de_naissance: "",
    classe: "",
    genre: "",
    avatar_base64_string: "",
    avatar_extension: "",
    avatar: "",
    statusPaiement: "",
    lieu_naissance: "",
    adresse_eleve: "",
    ville: "",
    nationalite: "",
    annee_scolaire: "",
    etablissement_frequente: "",
    moyenne_trimestre_1: "",
    moyenne_trimestre_2: "",
    moyenne_trimestre_3: "",
    moyenne_annuelle: "",
    moyenne_concours_6: "",
    numero_convocation_concours: "",
  };

  const [etudiant, setEtudiant] = useState(initialEtudiant);

  const {
    nom,
    prenom,
    date_de_naissance,
    classe,
    genre,
    avatar_base64_string,
    avatar_extension,
    avatar,
    statusPaiement,
    lieu_naissance,
    adresse_eleve,
    ville,
    nationalite,
    annee_scolaire,
    etablissement_frequente,
    moyenne_trimestre_1,
    moyenne_trimestre_2,
    moyenne_trimestre_3,
    moyenne_annuelle,
    moyenne_concours_6,
    numero_convocation_concours,
  } = etudiant;

  const onChangeEtudiant = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEtudiant((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("avatar_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setEtudiant({
        ...etudiant,
        avatar: profileImage,
        avatar_base64_string: base64Data,
        avatar_extension: extension,
      });
    }
  };

  const onSubmitEtudiant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      etudiant["date_de_naissance"] = formatDate(selectedDateDeNaissance);
      etudiant["classe"] = selectedClasse;
      etudiant["genre"] = selectedGenre;
      etudiant["statusPaiement"] = "0";
      createEtudiant(etudiant)
        .then(() => notifySuccess())
        .then(() => setEtudiant(initialEtudiant));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
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

  const getFilteredEtudiants = () => {
    let filteredEtudiants = [...data];

    if (searchTerm) {
      filteredEtudiants = filteredEtudiants.filter(
        (etudiant: any) =>
          etudiant?.nom!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          etudiant?.prenom!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          etudiant?.classe
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          etudiant
            ?.date_de_naissance!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          etudiant?.parent
            ?.nom_parent!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          etudiant?.parent
            ?.prenom_parent!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredEtudiants.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Elèves" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddEtudiant()}
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
                        <span>Ajouter Elève</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredEtudiants()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddEtudiant}
            onHide={() => {
              tog_AddEtudiant();
            }}
            centered
            size="xl"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Elève
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitEtudiant}>
                <Row>
                  <Col lg={7}>
                    <Card>
                      <Card.Header>
                        <h5>RENSEIGNEMENTS CONCERNANT L’ÉLÈVE</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row className="mb-4">
                          <div className="text-center mb-3">
                            <div className="position-relative d-inline-block">
                              <div className="position-absolute top-100 start-100 translate-middle">
                                <label
                                  htmlFor="avatar_base64_string"
                                  className="mb-0"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="right"
                                  title="Choisir avatar pour élève"
                                >
                                  <span className="avatar-xs d-inline-block">
                                    <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                      <i className="ri-image-fill"></i>
                                    </span>
                                  </span>
                                </label>
                                <input
                                  className="form-control d-none"
                                  type="file"
                                  name="avatar_base64_string"
                                  id="avatar_base64_string"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e)}
                                  // style={{ width: "210px", height: "120px" }}
                                />
                              </div>
                              <div className="avatar-lg">
                                <div className="avatar-title bg-light rounded-3">
                                  <img
                                    src={`data:image/jpeg;base64, ${etudiant.avatar_base64_string}`}
                                    alt={etudiant.nom}
                                    id="avatar_base64_string"
                                    className="img-thumbnail rounded-circle"
                                    width={200}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Row>
                        <Row className="mb-4"></Row>
                        <Row className="mb-4">
                          <Col lg={3}>
                            <Form.Label htmlFor="nom">Nom</Form.Label>
                          </Col>
                          <Col lg={9}>
                            <Form.Control
                              type="text"
                              id="nom"
                              name="nom"
                              onChange={onChangeEtudiant}
                              value={etudiant.nom}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={3}>
                            <Form.Label htmlFor="prenom">Prénom</Form.Label>
                          </Col>
                          <Col lg={9}>
                            <Form.Control
                              type="text"
                              id="prenom"
                              name="prenom"
                              onChange={onChangeEtudiant}
                              value={etudiant.prenom}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={3}>
                            <Form.Label htmlFor="prenom">
                              Date et Lieu de Naissance
                            </Form.Label>
                          </Col>
                          <Col lg={4}>
                            <Flatpickr
                              className="form-control flatpickr-input"
                              placeholder="Choisir date de Naissance"
                              onChange={handleDateDeNaissanceChange}
                              options={{
                                dateFormat: "d M, Y",
                                locale: French,
                              }}
                              id="startDate"
                              name="startDate"
                            />
                          </Col>
                          <Col lg={5}>
                            <Form.Control
                              type="text"
                              id="lieu_naissance"
                              name="lieu_naissance"
                              onChange={onChangeEtudiant}
                              placeholder="Lieu de Naissance"
                              value={etudiant.lieu_naissance}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={3}>
                            <Form.Label htmlFor="adresse_eleve">
                              Adresse
                            </Form.Label>
                          </Col>
                          <Col lg={4}>
                            <Form.Control
                              type="text"
                              id="adresse_eleve"
                              name="adresse_eleve"
                              onChange={onChangeEtudiant}
                              placeholder="Adresse"
                              value={etudiant.adresse_eleve}
                            />
                          </Col>
                          <Col lg={1}>
                            <Form.Label htmlFor="ville">Ville</Form.Label>
                          </Col>
                          <Col lg={4}>
                            <Form.Control
                              type="text"
                              id="ville"
                              name="ville"
                              onChange={onChangeEtudiant}
                              placeholder="Ville"
                              value={etudiant.ville}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={3}>
                            <Form.Label htmlFor="nationalite">
                              Nationalité
                            </Form.Label>
                          </Col>
                          <Col lg={9}>
                            <Form.Control
                              type="text"
                              id="nationalite"
                              name="nationalite"
                              onChange={onChangeEtudiant}
                              value={etudiant.nationalite}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={3}>
                            <Form.Label htmlFor="genre">Genre</Form.Label>
                          </Col>
                          <Col lg={9}>
                            <select
                              className="form-select text-muted"
                              name="genre"
                              id="genre"
                              onChange={handleSelectGenre}
                            >
                              <option value="">Choisir</option>
                              <option value="Mâle">Mâle</option>
                              <option value="Femelle">Femelle</option>
                            </select>
                          </Col>
                        </Row>
                        <Row className="mb-4"></Row>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={5}>
                    <Card>
                      <Card.Header>
                        <h5>SCOLARITE ANTERIEURE</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row className="mb-4">
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
                        <Row className="mb-4">
                          <Col lg={4}>
                            <Form.Label htmlFor="numero_convocation_concours">
                              N° Convocation Concours
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              type="text"
                              id="numero_convocation_concours"
                              name="numero_convocation_concours"
                              onChange={onChangeEtudiant}
                              value={etudiant.numero_convocation_concours}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={4}>
                            <Form.Label htmlFor="moyenne_concours_6">
                              Moyenne Concours
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              type="text"
                              id="moyenne_concours_6"
                              name="moyenne_concours_6"
                              onChange={onChangeEtudiant}
                              value={etudiant.moyenne_concours_6}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={4}>
                            <Form.Label htmlFor="annee_scolaire">
                              Année Scolaire
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              type="text"
                              id="annee_scolaire"
                              name="annee_scolaire"
                              onChange={onChangeEtudiant}
                              value={etudiant.annee_scolaire}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={4}>
                            <Form.Label htmlFor="etablissement_frequente">
                              Etablissement Fréquenté
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              type="text"
                              id="etablissement_frequente"
                              name="etablissement_frequente"
                              onChange={onChangeEtudiant}
                              value={etudiant.etablissement_frequente}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={4}>
                            <Form.Label htmlFor="moyenne_trimestre_1">
                              Moyenne 1er Trimestre
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              type="text"
                              id="moyenne_trimestre_1"
                              name="moyenne_trimestre_1"
                              onChange={onChangeEtudiant}
                              value={etudiant.moyenne_trimestre_1}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={4}>
                            <Form.Label htmlFor="moyenne_trimestre_2">
                              Moyenne 2ème Trimestre
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              type="text"
                              id="moyenne_trimestre_2"
                              name="moyenne_trimestre_2"
                              onChange={onChangeEtudiant}
                              value={etudiant.moyenne_trimestre_2}
                            />
                          </Col>
                        </Row>
                        <Row className="mb-4">
                          <Col lg={4}>
                            <Form.Label htmlFor="moyenne_trimestre_3">
                              Moyenne 3ème Trimestre
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              type="text"
                              id="moyenne_trimestre_3"
                              name="moyenne_trimestre_3"
                              onChange={onChangeEtudiant}
                              value={etudiant.moyenne_trimestre_3}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={4}>
                            <Form.Label htmlFor="moyenne_annuelle">
                              Moyenne Annuelle
                            </Form.Label>
                          </Col>
                          <Col lg={8}>
                            <Form.Control
                              type="text"
                              id="moyenne_annuelle"
                              name="moyenne_annuelle"
                              onChange={onChangeEtudiant}
                              value={etudiant.moyenne_annuelle}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddEtudiant();
                        setEtudiant(initialEtudiant);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddEtudiant();
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
      </div>
    </React.Fragment>
  );
};
export default Etudiants;
