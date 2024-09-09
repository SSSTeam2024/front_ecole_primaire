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
  useAddEtudiantMutation,
  useDeleteEtudiantMutation,
  useFetchEtudiantsQuery,
} from "features/etudiants/etudiantSlice";
import Flatpickr from "react-flatpickr";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import UpdateEtudiant from "./UpdateEtudiant";
import { French } from "flatpickr/dist/l10n/fr";
import { convertToBase64 } from "helpers/base64_convert";
import { formatDate } from "helpers/data_time_format";

const Etudiants = () => {
  const { data = [] } = useFetchEtudiantsQuery();
  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [deleteEtudiant] = useDeleteEtudiantMutation();

  const [showEtudiant, setShowEtudiant] = useState<boolean>(false);

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

  const [modal_UpdateEtudiant, setmodal_UpdateEtudiant] =
    useState<boolean>(false);
  function tog_UpdateEtudiant() {
    setmodal_UpdateEtudiant(!modal_UpdateEtudiant);
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
                to="#"
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowEtudiant(!showEtudiant)}
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
                onClick={() => tog_UpdateEtudiant()}
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

  const etudiantLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredEtudiants = () => {
    let filteredEtudiants = data;

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

    return filteredEtudiants;
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
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Elève
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitEtudiant}>
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
                          style={{ width: "210px", height: "120px" }}
                        />
                      </div>
                      <div className="avatar-lg">
                        <div className="avatar-title bg-light rounded-3">
                          <img
                            src={`data:image/jpeg;base64, ${etudiant.avatar_base64_string}`}
                            alt={etudiant.nom}
                            id="avatar_base64_string"
                            className="avatar-xl h-auto rounded-3 object-fit-cover"
                            style={{
                              width: "210px",
                              height: "120px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="nom">Nom</Form.Label>
                  </Col>
                  <Col lg={8}>
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
                  <Col lg={8}>
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
                    <Form.Label htmlFor="prenom">Date de Naissance</Form.Label>
                  </Col>
                  <Col lg={8}>
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
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="genre">Genre</Form.Label>
                  </Col>
                  <Col lg={8}>
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
          <Modal
            className="fade"
            id="createModal"
            show={modal_UpdateEtudiant}
            onHide={() => {
              tog_UpdateEtudiant();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Elève
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateEtudiant
                modal_UpdateEtudiant={modal_UpdateEtudiant}
                setmodal_UpdateEtudiant={setmodal_UpdateEtudiant}
              />
            </Modal.Body>
          </Modal>
        </Container>
      </div>
      <Offcanvas
        show={showEtudiant}
        onHide={() => setShowEtudiant(!showEtudiant)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Détails d'élève</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mt-3">
            <div className="p-3 border-bottom border-bottom-dashed">
              <table>
                <tr>
                  <div className="d-flex justify-content-center">
                    <img
                      src={`${
                        process.env.REACT_APP_BASE_URL
                      }/etudiantFiles/${etudiantLocation?.state?.avatar!}`}
                      alt=""
                      className="rounded"
                      width="200"
                    />
                  </div>
                </tr>
                <tr>
                  <td>
                    <h6>Nom :</h6>{" "}
                  </td>
                  <td>
                    <i>{etudiantLocation?.state?.nom!}</i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h6>Prénom : </h6>
                  </td>
                  <td>
                    <i>{etudiantLocation?.state?.prenom!}</i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h6>Date : </h6>
                  </td>
                  <td>
                    <i>{etudiantLocation?.state?.date_de_naissance!}</i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h6>Classe : </h6>
                  </td>
                  <td>
                    <i>{etudiantLocation?.state?.classe?.nom_classe!}</i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h6>Genre: </h6>
                  </td>
                  <td>
                    <i>{etudiantLocation?.state?.genre!}</i>
                  </td>
                </tr>
                {etudiantLocation?.state?.parent! === null ? (
                  <tr>
                    <td>
                      <h6>Parent: </h6>
                    </td>
                    <td>
                      <i className="text-danger">
                        Aucun parent assigné pour le moment !!
                      </i>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>
                      <h6>Parent: </h6>
                    </td>
                    <td>
                      <i>
                        {etudiantLocation?.state?.parent?.nom_parent}{" "}
                        {etudiantLocation?.state?.parent?.prenom_parent}
                      </i>
                    </td>
                  </tr>
                )}
              </table>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};
export default Etudiants;
