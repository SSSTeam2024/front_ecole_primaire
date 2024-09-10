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
import Select from "react-select";
import {
  useAddEvenementMutation,
  useDeleteEvenementMutation,
  useFetchEvenementQuery,
} from "features/evenements/evenementSlice";
import UpdateEvenement from "./UpdateEvenement";

import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";

const Evenements = () => {
  const { data = [] } = useFetchEvenementQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [deleteEvenement] = useDeleteEvenementMutation();

  const [showEvenement, setShowEvenement] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'événement a été créé avec succès",
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
          deleteEvenement(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "L'événement est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "L'événement est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddEvenement, setmodal_AddEvenement] = useState<boolean>(false);
  function tog_AddEvenement() {
    setmodal_AddEvenement(!modal_AddEvenement);
  }

  const [modal_UpdateEvenement, setmodal_UpdateEvenement] =
    useState<boolean>(false);
  function tog_UpdateEvenement() {
    setmodal_UpdateEvenement(!modal_UpdateEvenement);
  }

  const optionColumnsTable = AllClasses.map((classe: any) => ({
    value: classe?._id!,
    label: classe?.nom_classe!,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const [selectedType, setSelectedType] = useState<string>("");

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value);
  };

  const [createEvenement] = useAddEvenementMutation();

  const initialEvenement = {
    classes: [""],
    titre: "",
    desc: "",
    type: "",
    creation_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [evenement, setEvenement] = useState(initialEvenement);

  const {
    classes,
    titre,
    desc,
    type,
    creation_date,
    fichier_base64_string,
    fichier_extension,
    fichier,
  } = evenement;

  const onChangeEvenement = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEvenement((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFileUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_evenement = base64Data + "." + extension;
      setEvenement({
        ...evenement,
        fichier: file_evenement,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const onSubmitEvenement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      evenement["creation_date"] = formatDate(selectedDate);
      evenement["classes"] = selectedColumnValues;
      evenement["type"] = selectedType;
      createEvenement(evenement)
        .then(() => notifySuccess())
        .then(() => setEvenement(initialEvenement));
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
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row: any) => row.type,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Classe(s)</span>,
      selector: (row: any) => {
        return (
          <ul className="vstack gap-2 list-unstyled mb-0">
            {row.classes?.map((classe: any) => (
              <li key={classe._id}>{classe.nom_classe}</li>
            ))}
          </ul>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date de création</span>,
      selector: (row: any) => row.creation_date,
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
                onClick={() => setShowEvenement(!showEvenement)}
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
                onClick={() => tog_UpdateEvenement()}
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

  const evenementLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredEvenements = () => {
    let filteredEvenement = data;

    if (searchTerm) {
      filteredEvenement = filteredEvenement.filter((evenement: any) => {
        const titleMatch = evenement?.titre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const typeMatch = evenement?.type
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const dateMatch = evenement?.creation_date
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const classMatch = evenement?.classes?.some((classe: any) =>
          classe?.nom_classe?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return titleMatch || dateMatch || classMatch || typeMatch;
      });
    }

    return filteredEvenement;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Evénement" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddEvenement()}
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
                        <span>Ajouter Evénement</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredEvenements()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddEvenement}
            onHide={() => {
              tog_AddEvenement();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Evénement
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitEvenement}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="titre">Titre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="titre"
                      name="titre"
                      onChange={onChangeEvenement}
                      value={evenement.titre}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="classe">Classe(s)</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionColumnsTable}
                      onChange={handleSelectValueColumnChange}
                      placeholder="Choisir..."
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
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
                      <option value="Industrie">Industrie</option>
                      <option value="Emploi">Emploi</option>
                      <option value="Loisir et Tourisme">
                        Loisir et Tourisme
                      </option>
                      <option value="Art et Cultures">Art et Cultures</option>
                      <option value="Communautaire - Economie">
                        Communautaire - Economie
                      </option>
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="desc">Description</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <textarea
                      className="form-control"
                      id="desc"
                      name="desc"
                      value={evenement.desc}
                      onChange={onChangeEvenement}
                      rows={3}
                    ></textarea>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="date">Date Création</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Date Création"
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
                    <Form.Label htmlFor="fichier_base64_string">
                      Fichier
                    </Form.Label>
                  </Col>
                  <Col lg={8}>
                    <div className="text-center mb-3">
                      <div className="position-relative d-inline-block">
                        <div className="position-absolute top-100 start-100 translate-middle">
                          <label
                            htmlFor="fichier_base64_string"
                            className="mb-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Choisir emploi"
                            // style={{width: "0px"}}
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
                            name="fichier_base64_string"
                            id="fichier_base64_string"
                            accept="image/*"
                            onChange={(e) => handleFileUploadFile(e)}
                            style={{ width: "210px", height: "120px" }}
                          />
                        </div>
                        <div className="avatar-lg">
                          <div className="avatar-title bg-light rounded-3">
                            <img
                              src={`data:image/jpeg;base64, ${evenement.fichier_base64_string}`}
                              alt={evenement.titre}
                              id="image_base64_string"
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
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddEvenement();
                        setEvenement(initialEvenement);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddEvenement();
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
            show={modal_UpdateEvenement}
            onHide={() => {
              tog_UpdateEvenement();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Evènement
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateEvenement
                modal_UpdateEvenement={modal_UpdateEvenement}
                setmodal_UpdateEvenement={setmodal_UpdateEvenement}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showEvenement}
          onHide={() => setShowEvenement(!showEvenement)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails d'Evénement</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Titre</span>
              </Col>
              <Col lg={9}>
                <i>{evenementLocation?.state?.titre}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Description</span>
              </Col>
              <Col lg={9}>
                <i>{evenementLocation?.state?.desc!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Type</span>
              </Col>
              <Col lg={9}>
                <i>{evenementLocation?.state?.type!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date création</span>
              </Col>
              <Col lg={9}>
                <i>{evenementLocation?.state?.creation_date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe(s)</span>
              </Col>
              <Col lg={9}>
                <i>
                  {evenementLocation?.state?.classes
                    ?.map((c: any) => c.nom_classe)
                    .join(" / ")}
                </i>
              </Col>
            </Row>
            <Row>
              <Col lg={3}>
                <span className="fw-medium">Fichier</span>
              </Col>
              <Col lg={9}>
                <div className="d-flex justify-content-center">
                  <img
                    src={`${
                      process.env.REACT_APP_BASE_URL
                    }/evenementFiles/${evenementLocation?.state?.fichier!}`}
                    alt=""
                    className="rounded"
                    width="200"
                  />
                </div>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Evenements;
