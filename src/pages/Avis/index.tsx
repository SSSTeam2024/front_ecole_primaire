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
import Select from "react-select";
import {
  useAddAvisMutation,
  useDeleteAvisMutation,
  useFetchAvisQuery,
} from "features/avis/avisSlice";
import UpdateAvis from "./UpdateAvis";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";
import {
  useFetchSmsSettingsQuery,
  useUpdateSmsSettingByIdMutation,
} from "features/smsSettings/smsSettings";

const Avis = () => {
  const { data = [] } = useFetchAvisQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllSmsSettings, isLoading = [] } = useFetchSmsSettingsQuery();

  const [deleteAvis] = useDeleteAvisMutation();

  const [showObservation, setShowObservation] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBadgeDate, setSelectedBadgeDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const handleBadgeDateChange = (selectedDates: Date[]) => {
    setSelectedBadgeDate(selectedDates[0]);
  };

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
          deleteAvis(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "L'avis est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "L'avis est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddAvis, setmodal_AddAvis] = useState<boolean>(false);
  function tog_AddAvis() {
    setmodal_AddAvis(!modal_AddAvis);
  }

  const [modal_UpdateAvis, setmodal_UpdateAvis] = useState<boolean>(false);
  function tog_UpdateAvis() {
    setmodal_UpdateAvis(!modal_UpdateAvis);
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

  const [updateAvisSmsSetting] = useUpdateSmsSettingByIdMutation();
  const [formData, setFormData] = useState({
    id: "",
    status: "",
  });

  useEffect(() => {
    if (AllSmsSettings !== undefined && isLoading === false) {
      const avis_sms_setting = AllSmsSettings?.filter(
        (parametre) => parametre.service_name === "Avis"
      );
      setFormData((prevState) => ({
        ...prevState,
        id: avis_sms_setting[0]?._id!,
        status: avis_sms_setting[0].sms_status,
      }));
    }
  }, [AllSmsSettings, isLoading]);

  const onChangeAvisSmsSetting = () => {
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
        notifySuccess("Paramètre Avis SMS a été modifié avec succès")
      );
  };

  const [createAvis] = useAddAvisMutation();

  const initialAvis = {
    classes: [""],
    titre: "",
    desc: "",
    editeur: "",
    creation_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [avis, setAvis] = useState(initialAvis);

  const {
    classes,
    titre,
    desc,
    editeur,
    creation_date,
    fichier_base64_string,
    fichier_extension,
    fichier,
  } = avis;

  const onChangeAvis = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAvis((prevState) => ({
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
      const file_avis = base64Data + "." + extension;
      setAvis({
        ...avis,
        fichier: file_avis,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const onSubmitAvis = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      avis["creation_date"] = formatDate(selectedDate);
      avis["classes"] = selectedColumnValues;
      avis["editeur"] = "Administration";
      createAvis(avis)
        .then(() => notifySuccess("L'avis a été créée avec succès"))
        .then(() => setAvis(initialAvis));
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
      name: <span className="font-weight-bold fs-13">Editeur</span>,
      selector: (row: any) => row.editeur,
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
                onClick={() => tog_UpdateAvis()}
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

  const getFilteredAvis = () => {
    let filteredAvis = data;

    if (searchTerm) {
      filteredAvis = filteredAvis.filter((avis: any) => {
        const titleMatch = avis?.titre
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const dateMatch = avis?.creation_date
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const classMatch = avis?.classes?.some((classe: any) =>
          classe?.nom_classe?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return titleMatch || dateMatch || classMatch;
      });
    }

    return filteredAvis;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Avis" pageTitle="Tableau de bord" />
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
                      <Col lg={2}>
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
                            onChange={() => onChangeAvisSmsSetting()}
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
                        onClick={() => tog_AddAvis()}
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
                        <span>Ajouter Avis</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredAvis()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddAvis}
            onHide={() => {
              tog_AddAvis();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Avis
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitAvis}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="titre">Titre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="titre"
                      name="titre"
                      onChange={onChangeAvis}
                      value={avis.titre}
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
                    <Form.Label htmlFor="desc">Description</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <textarea
                      className="form-control"
                      id="desc"
                      name="desc"
                      value={avis.desc}
                      onChange={onChangeAvis}
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
                              src={`data:image/jpeg;base64, ${avis.fichier_base64_string}`}
                              alt={avis.titre}
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
                        tog_AddAvis();
                        setAvis(initialAvis);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddAvis();
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
            show={modal_UpdateAvis}
            onHide={() => {
              tog_UpdateAvis();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Avis
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateAvis
                modal_UpdateAvis={modal_UpdateAvis}
                setmodal_UpdateAvis={setmodal_UpdateAvis}
              />
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
            <Offcanvas.Title>Détails d'Avis</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Titre</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.titre}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Description</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.desc!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date création</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.creation_date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe(s)</span>
              </Col>
              <Col lg={9}>
                <i>
                  {observationLocation?.state?.classes
                    ?.map((c: any) => c.nom_classe)
                    .join(" / ")}
                </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Editeur</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.editeur!}</i>
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
                    }/AvisFiles/${observationLocation?.state?.fichier!}`}
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
export default Avis;
