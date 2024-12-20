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
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import {
  useAddExerciceMutation,
  useDeleteExerciceMutation,
  useFetchExercicesQuery,
} from "features/exercices/exerciceSlice";
import Select from "react-select";
import {
  useFetchMatieresByClasseIdQuery,
  useFetchMatieresQuery,
} from "features/matieres/matiereSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";
import {
  useFetchSmsSettingsQuery,
  useUpdateSmsSettingByIdMutation,
} from "features/smsSettings/smsSettings";
import UpdateExercice from "./UpdateExercice";

const Exercices = () => {
  const { data = [] } = useFetchExercicesQuery();
  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const { data: AllSmsSettings, isLoading = [] } = useFetchSmsSettingsQuery();

  const { data: AllMatieres = [] } = useFetchMatieresQuery();

  const [deleteExercice] = useDeleteExerciceMutation();

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
          deleteExercice(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le travail à la maison est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le travail à la maison est en sécurité :)",
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

  const [selectedPar, setSelectedPar] = useState<string>("");

  const handleSelectPar = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPar(value);
  };

  const [modal_AddObservation, setmodal_AddObservation] =
    useState<boolean>(false);
  function tog_AddObservation() {
    setmodal_AddObservation(!modal_AddObservation);
  }

  const [modal_UpdateExercice, setmodal_UpdateExercice] =
    useState<boolean>(false);
  function tog_UpdateExercice() {
    setmodal_UpdateExercice(!modal_UpdateExercice);
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

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const [updateAvisSmsSetting] = useUpdateSmsSettingByIdMutation();
  const [formData, setFormData] = useState({
    id: "",
    status: "",
  });

  useEffect(() => {
    if (AllSmsSettings !== undefined && isLoading === false) {
      const devoir_sms_setting = AllSmsSettings?.filter(
        (parametre) => parametre.service_name === "Travail à la maison"
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
        notifySuccess(
          "Paramètre Travail à la maison SMS a été modifié avec succès"
        )
      );
  };

  const [createObservation] = useAddExerciceMutation();

  const initialObservation = {
    matiere: "",
    classes: "",
    desc: "",
    creation_date: "",
    badge_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
    enseignant: "",
  };

  const [observation, setObservation] = useState(initialObservation);

  const {
    matiere,
    classes,
    desc,
    creation_date,
    badge_date,
    fichier_base64_string,
    fichier_extension,
    fichier,
    enseignant,
  } = observation;

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
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_observation = base64Data + "." + extension;
      setObservation({
        ...observation,
        fichier: file_observation,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const onSubmitObservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      observation["creation_date"] = formatDate(selectedDate);
      observation["badge_date"] = formatDate(selectedBadgeDate);
      observation["classes"] = selectedClasse;
      observation["enseignant"] = selectedPar;
      observation["matiere"] = selectedMatiere;
      createObservation(observation)
        .then(() =>
          notifySuccess("Le travail à la maison a été créée avec succès")
        )
        .then(() => setObservation(initialObservation));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Matière</span>,
      selector: (row: any) => row?.matiere!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => row?.classes.nom_classe!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date de création</span>,
      selector: (row: any) => row.creation_date,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date de remis</span>,
      selector: (row: any) => row.badge_date,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Enseignant</span>,
      selector: (row: any) => row.enseignant,
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
                onClick={() => tog_UpdateExercice()}
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

  const openFileInNewTab = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleButtonClick = () => {
    const fileUrl = `${process.env.REACT_APP_BASE_URL}/exerciceFiles/${observationLocation.state.fichier}`;
    const fileName = "sample.pdf";

    openFileInNewTab(fileUrl, fileName);
  };

  const { data: allMatieresByClasseId = [] } =
    useFetchMatieresByClasseIdQuery(selectedClasse);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredExercices = () => {
    let filteredExercices = data;

    if (searchTerm) {
      filteredExercices = filteredExercices.filter(
        (exercice: any) =>
          exercice?.matiere!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercice?.classes
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exercice
            ?.creation_date!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exercice
            ?.badge_date!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          exercice?.enseignant!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredExercices;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Travail à la maison" pageTitle="Tableau de bord" />
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
                        <span>Ajouter Travail à la maison</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredExercices()}
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
                Ajouter Travail à la maison
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitObservation}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="classe">Classe</Form.Label>
                  </Col>
                  <Col lg={8}>
                    {/* <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionColumnsTable}
                      onChange={handleSelectValueColumnChange}
                      placeholder="Choisir..."
                    /> */}
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
                      {allMatieresByClasseId.map((matiere) =>
                        matiere.matieres.map((m) => (
                          <option value={m.nom_matiere} key={m?._id!}>
                            {m.nom_matiere}
                          </option>
                        ))
                      )}
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
                      value={observation.desc}
                      onChange={onChangeObservation}
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
                    <Form.Label htmlFor="badge_date">Date de Remis</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Date Remis"
                      onChange={handleBadgeDateChange}
                      options={{
                        dateFormat: "d M, Y",
                        locale: French,
                      }}
                      id="badge_date"
                      name="badge_date"
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="par">Editeur</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="par"
                      id="par"
                      onChange={handleSelectPar}
                    >
                      <option value="">Choisir...</option>
                      {AllEnseignants.map((enseignant: any) => (
                        <option
                          value={`${enseignant.nom_enseignant} ${enseignant.prenom_enseignant}`}
                          key={enseignant?._id!}
                        >
                          {enseignant.nom_enseignant}{" "}
                          {enseignant.prenom_enseignant}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="fichier_base64_string">
                      Fichier
                    </Form.Label>
                  </Col>
                  <Col lg={8}>
                    <input
                      className="form-control mb-2"
                      type="file"
                      id="fichier_base64_string"
                      name="fichier_base64_string"
                      onChange={(e) => handleFileUploadFile(e)}
                    />
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
                      Fermer
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
          <Modal
            className="fade"
            id="createModal"
            show={modal_UpdateExercice}
            onHide={() => {
              tog_UpdateExercice();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Exercice
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateExercice
                modal_UpdateExercice={modal_UpdateExercice}
                setmodal_UpdateExercice={setmodal_UpdateExercice}
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
            <Offcanvas.Title>Détails du travail à la maison</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.classes.nom_classe}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matière</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.matiere!}</i>
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
                <span className="fw-medium">Date Remis</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.badge_date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Editeur</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.enseignant!}</i>
              </Col>
            </Row>
            {observationLocation?.state?.fichier! !== "" && (
              <Row>
                <Col lg={3}>
                  <span className="fw-medium">Fichier</span>
                </Col>
                <Col lg={9}>
                  <Button variant="soft-danger" onClick={handleButtonClick}>
                    <i className="bi bi-filetype-pdf align-middle fs-22"></i>
                  </Button>
                </Col>
              </Row>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Exercices;
