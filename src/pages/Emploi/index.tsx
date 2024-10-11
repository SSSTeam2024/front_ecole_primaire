import React, { useEffect, useState } from "react";
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
import {
  useAddEmploiMutation,
  useDeleteEmploiMutation,
  useFetchEmploisQuery,
} from "features/emplois/emploiSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";
import {
  useFetchSmsSettingsQuery,
  useUpdateSmsSettingByIdMutation,
} from "features/smsSettings/smsSettings";
import UpdateEmploi from "./UpdateEmploi";

const Emploi = () => {
  const { data = [] } = useFetchEmploisQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllSmsSettings, isLoading = [] } = useFetchSmsSettingsQuery();

  const [deleteEmploi] = useDeleteEmploiMutation();
  const [showObservation, setShowObservation] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const [modal_UpdateEmploi, setmodal_UpdateEmploi] = useState<boolean>(false);
  function tog_UpdateEmploi() {
    setmodal_UpdateEmploi(!modal_UpdateEmploi);
  }

  const notifySuccess = (msg: string) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: msg,
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
          deleteEmploi(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "L'emploi est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "L'emploi est en sécurité :)",
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

  const [modal_AddObservation, setmodal_AddObservation] =
    useState<boolean>(false);
  function tog_AddObservation() {
    setmodal_AddObservation(!modal_AddObservation);
  }

  const [updateAvisSmsSetting] = useUpdateSmsSettingByIdMutation();
  const [formData, setFormData] = useState({
    id: "",
    status: "",
  });

  useEffect(() => {
    if (AllSmsSettings !== undefined && isLoading === false) {
      const devoir_sms_setting = AllSmsSettings?.filter(
        (parametre) => parametre.service_name === "Emplois"
      );
      setFormData((prevState) => ({
        ...prevState,
        id: devoir_sms_setting[0]?._id!,
        status: devoir_sms_setting[0]?.sms_status!,
      }));
    }
  }, [AllSmsSettings, isLoading]);

  const onChangeDocumentSmsSetting = () => {
    let updateData = {
      id: formData.id,
      status: formData.status === "1" ? "0" : "1",
    };
    updateAvisSmsSetting(updateData)
      .then(() =>
        setFormData((prevState) => ({
          ...prevState,
          status: formData.status === "1" ? "0" : "1",
        }))
      )
      .then(() =>
        notifySuccess("Paramètre Emplois SMS a été modifié avec succès")
      );
  };

  const [createObservation] = useAddEmploiMutation();

  const initialObservation = {
    titre: "",
    date: "",
    classe: "",
    image_base64_string: "",
    image_extension: "",
    image: "",
  };

  const [observation, setObservation] = useState(initialObservation);

  const { titre, date, classe, image_base64_string, image_extension, image } =
    observation;

  const onChangeObservation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setObservation((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFileUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("image_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_observation = base64Data + "." + extension;
      setObservation({
        ...observation,
        image: file_observation,
        image_base64_string: base64Data,
        image_extension: extension,
      });
    }
  };

  const onSubmitObservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      observation["date"] = formatDate(selectedDate);
      observation["classe"] = selectedClasse;
      createObservation(observation)
        .then(() => notifySuccess("L'emploi a été créé avec succès"))
        .then(() => setObservation(initialObservation));
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
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => row?.classe?.nom_classe!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.date,
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
                onClick={() => setShowObservation(!showObservation)}
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
                onClick={() => tog_UpdateEmploi()}
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

  const observationLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredEmplois = () => {
    let filteredEmplois = [...data];

    if (searchTerm) {
      filteredEmplois = filteredEmplois.filter(
        (emploi: any) =>
          emploi?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emploi?.classe
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          emploi?.date?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredEmplois.reverse();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Emplois" pageTitle="Tableau de bord" />
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
                  <Col lg={6}>
                    <Row>
                      <Col lg={3} className="text-center">
                        <Form.Label>Status SMS: </Form.Label>
                      </Col>
                      <Col lg={2}>
                        <div className="form-check form-switch">
                          <input
                            key={formData?.id!}
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id={formData.id}
                            checked={formData.status === "1"}
                            onChange={() => onChangeDocumentSmsSetting()}
                          />
                          {formData.status === "0" ? (
                            <span className="badge bg-warning-subtle text-warning badge-border">
                              Désactivé
                            </span>
                          ) : (
                            <span className="badge bg-info-subtle text-info badge-border">
                              Activé
                            </span>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={3} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddObservation()}
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
                        <span>Ajouter Emploi</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredEmplois()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddObservation}
            onHide={() => {
              tog_AddObservation();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Emploi
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitObservation}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="titre">Titre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="titre"
                      name="titre"
                      onChange={onChangeObservation}
                      value={observation.titre}
                    />
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
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="date">Date</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Start Date"
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
                            htmlFor="image_base64_string"
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
                            name="image_base64_string"
                            id="image_base64_string"
                            accept="image/*"
                            onChange={(e) => handleFileUploadFile(e)}
                            style={{ width: "210px", height: "120px" }}
                          />
                        </div>
                        <div className="avatar-lg">
                          <div className="avatar-title bg-light rounded-3">
                            <img
                              src={`data:image/jpeg;base64, ${observation.image_base64_string}`}
                              alt={observation.titre}
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
                        tog_AddObservation();
                        setObservation(initialObservation);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddObservation();
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
        <Offcanvas
          show={showObservation}
          onHide={() => setShowObservation(!showObservation)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails d'emploi</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Titre</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.titre!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.classe?.nom_classe!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date création</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.date!}</i>
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
                    }/emploiFiles/${observationLocation?.state?.image!}`}
                    alt=""
                    className="rounded"
                    width="200"
                  />
                </div>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
        <Modal
          className="fade"
          id="createModal"
          show={modal_UpdateEmploi}
          onHide={() => {
            tog_UpdateEmploi();
          }}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <h1 className="modal-title fs-5" id="createModalLabel">
              Modifier Emploi
            </h1>
          </Modal.Header>
          <Modal.Body>
            <UpdateEmploi
              modal_UpdateEmploi={modal_UpdateEmploi}
              setmodal_UpdateEmploi={setmodal_UpdateEmploi}
            />
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default Emploi;
