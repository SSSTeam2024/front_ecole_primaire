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
  Tab,
  Nav,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import { useFetchMatieresByClasseIdQuery } from "features/matieres/matiereSlice";
import UpdateCalendrier from "./UpdateCalendrier";
import {
  useAddCalendrierMutation,
  useDeleteCalendrierMutation,
  useFetchCalendrierQuery,
} from "features/calendriers/calendrierSlice";
import { useFetchSallesQuery } from "features/salles/salleSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";
import {
  useFetchSmsSettingsQuery,
  useUpdateSmsSettingByIdMutation,
} from "features/smsSettings/smsSettings";

const DevoirSynthese = () => {
  const { data = [] } = useFetchCalendrierQuery();

  const syntheseData = data.filter(
    (calendrier) => calendrier.type === "Synthèse"
  );

  const { data: AllSalles = [] } = useFetchSallesQuery();

  const { data: AllSmsSettings, isLoading = [] } = useFetchSmsSettingsQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [deleteCalendrier] = useDeleteCalendrierMutation();

  const [showCalendrier, setShowCalendrier] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };
  const navigate = useNavigate();
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);

  const handleStartTimeChange = (selectedDates: Date[]) => {
    const time = selectedDates[0];
    setSelectedStartTime(time);
  };

  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);

  const handleEndTimeChange = (selectedDates: Date[]) => {
    const time = selectedDates[0];
    setSelectedEndTime(time);
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
          deleteCalendrier(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le calendrier est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le calendrier est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [selectedSalle, setSelectedSalle] = useState<string>("");

  const handleSelectSalle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSalle(value);
  };

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");

  const handleSelectEnseignant = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEnseignant(value);
  };

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
  };

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const [modal_AddCalendrier, setmodal_AddCalendrier] =
    useState<boolean>(false);
  function tog_AddCalendrier() {
    setmodal_AddCalendrier(!modal_AddCalendrier);
  }

  const [modal_UpdateCalendrier, setmodal_UpdateCalendrier] =
    useState<boolean>(false);
  function tog_UpdateCalendrier() {
    setmodal_UpdateCalendrier(!modal_UpdateCalendrier);
  }

  const [updateAvisSmsSetting] = useUpdateSmsSettingByIdMutation();
  const [formData, setFormData] = useState({
    id: "",
    status: "",
  });

  useEffect(() => {
    if (AllSmsSettings !== undefined && isLoading === false) {
      const devoir_sms_setting = AllSmsSettings?.filter(
        (parametre) => parametre.service_name === "Devoirs"
      );
      setFormData((prevState) => ({
        ...prevState,
        id: devoir_sms_setting[0]?._id!,
        status: devoir_sms_setting[0].sms_status,
      }));
    }
  }, [AllSmsSettings, isLoading]);

  const onChangeDevoirSmsSetting = () => {
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
        notifySuccess("Paramètre Devoirs SMS a été modifié avec succès")
      );
  };

  const [createCalendrier] = useAddCalendrierMutation();

  const initialCalendrier = {
    salle: "",
    trimestre: "",
    heure_debut: "",
    heure_fin: "",
    date: "",
    matiere: "",
    classe: "",
    type: "",
    // enseignant: "",
  };

  const [calendrier, setCalendrier] = useState(initialCalendrier);

  const {
    salle,
    trimestre,
    heure_debut,
    heure_fin,
    date,
    matiere,
    classe,
    type,
    // enseignant,
  } = calendrier;

  const [calendrierList, setCalendrierList] = useState([initialCalendrier]);

  const handleAddRow = () => {
    setCalendrierList([...calendrierList, initialCalendrier]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedList = calendrierList.filter((_, i) => i !== index);
    setCalendrierList(updatedList);
  };

  const handleSelectChange = (e: any, index: number) => {
    const { name, value } = e.target;
    const updatedCalendrierList = [...calendrierList];
    updatedCalendrierList[index] = {
      ...updatedCalendrierList[index],
      [name]: value,
    };
    setCalendrierList(updatedCalendrierList);
  };

  const handleManyDateChange = (date: Date[], index: number) => {
    const updatedCalendrierList = [...calendrierList];
    updatedCalendrierList[index] = {
      ...updatedCalendrierList[index],
      date: formatDate(date[0]), // Flatpickr returns an array, so get the first value
    };
    setCalendrierList(updatedCalendrierList);
  };

  const handleManyStartTimeChange = (time: Date[], index: number) => {
    const updatedCalendrierList = [...calendrierList];
    updatedCalendrierList[index] = {
      ...updatedCalendrierList[index],
      heure_debut: formatTime(time[0]),
    };
    setCalendrierList(updatedCalendrierList);
  };

  const handleEndManyTimeChange = (time: Date[], index: number) => {
    const updatedCalendrierList = [...calendrierList];
    updatedCalendrierList[index] = {
      ...updatedCalendrierList[index],
      heure_fin: formatTime(time[0]), // Flatpickr returns an array, so get the first value
    };
    setCalendrierList(updatedCalendrierList);
  };

  const handleSelectManySalle = (e: any, index: number) => {
    const { value } = e.target;
    const updatedCalendrierList = [...calendrierList];
    updatedCalendrierList[index] = {
      ...updatedCalendrierList[index],
      salle: value,
    };
    setCalendrierList(updatedCalendrierList);
  };

  const onChangeCalendrier = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCalendrier((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const [classetoAdd, setClasseToAdd] = useState("");
  const [trimestretoAdd, setTrimestreToAdd] = useState("");

  const handleSelectTrimestreToAdd = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setTrimestreToAdd(value);
  };

  const handleSelectClasseToAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClasseToAdd(e.target.value);
  };

  const onSubmitCalendrier = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      calendrier["date"] = formatDate(selectedDate)!;
      calendrier["salle"] = selectedSalle;
      // calendrier["enseignant"] = selectedEnseignant;
      calendrier["matiere"] = selectedMatiere;
      calendrier["trimestre"] = selectedTrimestre;
      calendrier["classe"] = selectedClasse;
      calendrier["heure_debut"] = formatTime(selectedStartTime);
      calendrier["heure_fin"] = formatTime(selectedEndTime);
      calendrier["type"] = "Contrôle";
      createCalendrier(calendrier)
        .then(() => notifySuccess("Le calendrier a été créé avec succès"))
        .then(() => setCalendrier(initialCalendrier));
      navigate("/calendrier-examen-contrôle");
    } catch (error) {
      notifyError(error);
    }
  };

  const onSubmitManyCalendrier = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      console.log("Selected Date:", selectedDate);
      console.log("Selected Start Time:", selectedStartTime);
      console.log("Selected End Time:", selectedEndTime);

      const updatedCalendrierList = calendrierList.map((calendrier) => ({
        ...calendrier,
        classe: classetoAdd,
        trimestre: trimestretoAdd,
        type: "Synthèse",
        // heure_fin: formatTime(selectedEndTime),
        // heure_debut: formatTime(selectedStartTime),
        // date: formatDate(selectedDate)!,
      }));

      console.log("Updated Calendrier List:", updatedCalendrierList);

      await Promise.all(
        updatedCalendrierList.map((calendrier) => createCalendrier(calendrier))
      );

      notifySuccess("Le calendrier a été créé avec succès");
      setCalendrierList([initialCalendrier]);
      setClasseToAdd("");
      setTrimestreToAdd("");
      navigate("/calendrier-examen-synthèse");
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => <span>{row?.classe?.nom_classe!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matiere</span>,
      selector: (row: any) => row?.matiere!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.date,
      sortable: true,
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Enseignant</span>,
    //   selector: (row: any) => (
    //     <span>
    //       {row.enseignant.nom_enseignant} {row.enseignant.prenom_enseignant}
    //     </span>
    //   ),
    //   sortable: true,
    // },
    {
      name: <span className="font-weight-bold fs-13">De</span>,
      selector: (row: any) => row.heure_debut,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Jusqu'à</span>,
      selector: (row: any) => row.heure_fin,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Salle</span>,
      selector: (row: any) => row?.salle?.nom_salle!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Trimestre</span>,
      selector: (row: any) => row.trimestre,
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
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowCalendrier(!showCalendrier)}
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
                onClick={() => tog_UpdateCalendrier()}
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

  const calendrierLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredCalendriers = () => {
    let filteredCalendriers = data;

    if (searchTerm) {
      filteredCalendriers = filteredCalendriers.filter(
        (calendrier: any) =>
          calendrier
            ?.matiere!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier
            ?.trimestre!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier
            ?.heure_debut!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier?.date!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          calendrier?.enseignant
            ?.nom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier?.enseignant
            ?.prenom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier
            ?.heure_fin!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier?.classe
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calendrier?.salle
            ?.nom_salle!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredCalendriers;
  };

  const { data: allMatieresByClasseId = [] } =
    useFetchMatieresByClasseIdQuery(selectedClasse);

  const { data: manyAllMatieresByClasseId = [] } =
    useFetchMatieresByClasseIdQuery(classetoAdd);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            title="Calendrier des examens"
            pageTitle="Tableau de bord"
          />
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
                            onChange={() => onChangeDevoirSmsSetting()}
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
                        onClick={() => tog_AddCalendrier()}
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
                        <span>Ajouter Calendrier</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable columns={columns} data={syntheseData} pagination />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddCalendrier}
            onHide={() => {
              tog_AddCalendrier();
            }}
            centered
            size="xl"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Calendrier
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col xxl={12}>
                  <Card>
                    <Card.Body>
                      <Tab.Container defaultActiveKey="border-navs-home">
                        <Nav
                          as="ul"
                          variant="pills"
                          className="nav-customs nav-danger mb-3"
                          role="tablist"
                        >
                          <Nav.Item as="li">
                            <Nav.Link eventKey="border-navs-home">
                              Devoirs de Contrôles
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item as="li">
                            <Nav.Link eventKey="border-navs-profile">
                              Devoirs de Synthèse
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                        <Tab.Content className="text-muted">
                          <Tab.Pane eventKey="border-navs-home">
                            <Form
                              className="create-form"
                              onSubmit={onSubmitCalendrier}
                            >
                              <Row className="mb-4">
                                <Col lg={3}>
                                  <Form.Label htmlFor="classe">
                                    Classe
                                  </Form.Label>
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
                                      <option
                                        value={classe?._id!}
                                        key={classe?._id!}
                                      >
                                        {classe.nom_classe}
                                      </option>
                                    ))}
                                  </select>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col lg={3}>
                                  <Form.Label htmlFor="classe">
                                    Matière
                                  </Form.Label>
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
                                        <option
                                          value={m.nom_matiere}
                                          key={m._id}
                                        >
                                          {m.nom_matiere}
                                        </option>
                                      ))
                                    )}
                                  </select>
                                </Col>
                              </Row>
                              {/* <Row className="mb-4">
                                <Col lg={3}>
                                  <Form.Label htmlFor="enseignant">
                                    Enseignant
                                  </Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <select
                                    className="form-select text-muted"
                                    name="enseignant"
                                    id="enseignant"
                                    onChange={handleSelectEnseignant}
                                  >
                                    <option value="">Select</option>
                                    {AllEnseignants.map((enseignant) => (
                                      <option
                                        value={enseignant?._id!}
                                        key={enseignant?._id!}
                                      >
                                        {enseignant.nom_enseignant}{" "}
                                        {enseignant.prenom_enseignant}
                                      </option>
                                    ))}
                                  </select>
                                </Col>
                              </Row> */}
                              <Row className="mb-4">
                                <Col lg={3}>
                                  <Form.Label htmlFor="date">Date</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Flatpickr
                                    className="form-control flatpickr-input"
                                    placeholder="Date examen"
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
                                  <Form.Label htmlFor="heure_debut">
                                    Commence à
                                  </Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Flatpickr
                                    className="form-control"
                                    options={{
                                      enableTime: true,
                                      noCalendar: true,
                                      dateFormat: "H:i",
                                      time_24hr: true,
                                    }}
                                    onChange={handleStartTimeChange}
                                  />
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col lg={3}>
                                  <Form.Label htmlFor="heure_fin">
                                    Jusqu'à
                                  </Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <Flatpickr
                                    className="form-control"
                                    options={{
                                      enableTime: true,
                                      noCalendar: true,
                                      dateFormat: "H:i",
                                      time_24hr: true,
                                    }}
                                    onChange={handleEndTimeChange}
                                  />
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col lg={3}>
                                  <Form.Label htmlFor="salle">Salle</Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <select
                                    className="form-select text-muted"
                                    name="salle"
                                    id="salle"
                                    onChange={handleSelectSalle}
                                  >
                                    <option value="">Choisir</option>
                                    {AllSalles.map((salle) => (
                                      <option
                                        value={salle?._id!}
                                        key={salle?._id!}
                                      >
                                        {salle.nom_salle}
                                      </option>
                                    ))}
                                  </select>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col lg={3}>
                                  <Form.Label htmlFor="trimestre">
                                    Trimestre
                                  </Form.Label>
                                </Col>
                                <Col lg={8}>
                                  <select
                                    className="form-select text-muted"
                                    name="trimestre"
                                    id="trimestre"
                                    onChange={handleSelectTrimestre}
                                  >
                                    <option value="">Choisir</option>
                                    <option value="1er trimestre">
                                      1er trimestre
                                    </option>
                                    <option value="2ème trimestre">
                                      2ème trimestre
                                    </option>
                                    <option value="3ème trimestre">
                                      3ème trimestre
                                    </option>
                                  </select>
                                </Col>
                              </Row>

                              <Row>
                                <div className="hstack gap-2 justify-content-end">
                                  <Button
                                    variant="light"
                                    onClick={() => {
                                      tog_AddCalendrier();
                                      setCalendrier(initialCalendrier);
                                    }}
                                  >
                                    Fermer
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      tog_AddCalendrier();
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
                          </Tab.Pane>
                          <Tab.Pane eventKey="border-navs-profile">
                            <Form
                              className="create-form"
                              onSubmit={onSubmitManyCalendrier}
                            >
                              <Row>
                                <Col lg={12}>
                                  <Row className="mb-4">
                                    <Col lg={2}>
                                      <Form.Label htmlFor="classetoAdd">
                                        Classe
                                      </Form.Label>
                                    </Col>
                                    <Col lg={3}>
                                      <select
                                        className="form-select text-muted"
                                        name="classetoAdd"
                                        id="classetoAdd"
                                        value={classetoAdd}
                                        onChange={handleSelectClasseToAdd}
                                      >
                                        <option value="">Choisir</option>
                                        {AllClasses.map((classe) => (
                                          <option
                                            value={classe?._id!}
                                            key={classe?._id!}
                                          >
                                            {classe.nom_classe}
                                          </option>
                                        ))}
                                      </select>
                                    </Col>
                                    <Col lg={2}>
                                      <Form.Label htmlFor="trimestretoAdd">
                                        Trimestre
                                      </Form.Label>
                                    </Col>
                                    <Col lg={3}>
                                      <select
                                        className="form-select text-muted"
                                        name="trimestretoAdd"
                                        id="trimestretoAdd"
                                        value={trimestretoAdd}
                                        onChange={handleSelectTrimestreToAdd}
                                      >
                                        <option value="">Choisir</option>
                                        <option value="1er trimestre">
                                          1er trimestre
                                        </option>
                                        <option value="2ème trimestre">
                                          2ème trimestre
                                        </option>
                                        <option value="3ème trimestre">
                                          3ème trimestre
                                        </option>
                                      </select>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12}>
                                  <Row>
                                    <Col>
                                      <Form.Label htmlFor="matiere">
                                        Matière
                                      </Form.Label>
                                    </Col>
                                    {/* <Col>
                                    <Form.Label htmlFor="enseignant">
                                      Enseignant
                                    </Form.Label>
                                  </Col> */}
                                    <Col>
                                      <Form.Label htmlFor="date">
                                        Date
                                      </Form.Label>
                                    </Col>
                                    <Col>
                                      <Form.Label htmlFor="heure_debut">
                                        Commence à
                                      </Form.Label>
                                    </Col>
                                    <Col>
                                      <Form.Label htmlFor="heure_fin">
                                        Jusqu'à
                                      </Form.Label>
                                    </Col>
                                    <Col>
                                      <Col lg={3}>
                                        <Form.Label htmlFor="salle">
                                          Salle
                                        </Form.Label>
                                      </Col>
                                    </Col>
                                    <Col lg={1}></Col>
                                    <Col lg={1}></Col>
                                  </Row>
                                  {calendrierList.map((calendrier, index) => (
                                    <Row>
                                      <Col>
                                        <select
                                          className="form-select text-muted"
                                          name="matiere"
                                          id={`matiere-${index}`}
                                          value={calendrier.matiere}
                                          onChange={(e) =>
                                            handleSelectChange(e, index)
                                          }
                                        >
                                          <option value="">Choisir</option>
                                          {manyAllMatieresByClasseId.map(
                                            (matiere) =>
                                              matiere.matieres.map((m) => (
                                                <option
                                                  value={m.nom_matiere}
                                                  key={m._id}
                                                >
                                                  {m.nom_matiere}
                                                </option>
                                              ))
                                          )}
                                        </select>
                                      </Col>
                                      {/* <Col>
                                    <select
                                      className="form-select text-muted"
                                      name="enseignant"
                                      id="enseignant"
                                      onChange={handleSelectEnseignant}
                                    >
                                      <option value="">Select</option>
                                      {AllEnseignants.map((enseignant) => (
                                        <option
                                          value={enseignant?._id!}
                                          key={enseignant?._id!}
                                        >
                                          {enseignant.nom_enseignant}{" "}
                                          {enseignant.prenom_enseignant}
                                        </option>
                                      ))}
                                    </select>
                                  </Col> */}
                                      <Col>
                                        <Flatpickr
                                          className="form-control flatpickr-input"
                                          placeholder="Date examen"
                                          onChange={(date) =>
                                            handleManyDateChange(date, index)
                                          }
                                          options={{
                                            dateFormat: "d M, Y",
                                            locale: French,
                                          }}
                                          id="date"
                                          name="date"
                                        />
                                      </Col>
                                      <Col>
                                        <Flatpickr
                                          className="form-control"
                                          options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true,
                                          }}
                                          onChange={(time) =>
                                            handleManyStartTimeChange(
                                              time,
                                              index
                                            )
                                          }
                                        />
                                      </Col>
                                      <Col>
                                        <Flatpickr
                                          className="form-control"
                                          options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true,
                                          }}
                                          onChange={(time) =>
                                            handleEndManyTimeChange(time, index)
                                          }
                                        />
                                      </Col>
                                      <Col>
                                        <select
                                          className="form-select text-muted"
                                          name="salle"
                                          id="salle"
                                          onChange={(e) =>
                                            handleSelectManySalle(e, index)
                                          }
                                          value={calendrier.salle}
                                        >
                                          <option value="">Choisir</option>
                                          {AllSalles.map((salle) => (
                                            <option
                                              value={salle?._id!}
                                              key={salle?._id!}
                                            >
                                              {salle.nom_salle}
                                            </option>
                                          ))}
                                        </select>
                                      </Col>
                                      <Col lg={1} className="m-1">
                                        {index ===
                                          calendrierList.length - 1 && (
                                          <button
                                            type="button"
                                            className="btn btn-soft-info btn-icon"
                                            onClick={handleAddRow}
                                          >
                                            <i className="ri-add-line"></i>
                                          </button>
                                        )}
                                      </Col>
                                      <Col lg={1} className="m-1">
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-icon"
                                          onClick={() => handleDeleteRow(index)}
                                        >
                                          <i className="ri-delete-bin-5-line"></i>
                                        </button>
                                      </Col>
                                    </Row>
                                  ))}
                                </Col>
                              </Row>
                              <Row className="mt-3">
                                <div className="hstack gap-2 justify-content-end">
                                  <Button
                                    variant="light"
                                    onClick={() => {
                                      tog_AddCalendrier();
                                      setCalendrier(initialCalendrier);
                                    }}
                                  >
                                    Fermer
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      tog_AddCalendrier();
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
                            {/* {matiere.matieres.map((item, index) => (
                  <Row className="mb-4" key={index}>
                    <Col lg={3}>
                      <Form.Label htmlFor={`nom_matiere_${index}`}>
                        Matière {index + 1}
                      </Form.Label>
                    </Col>
                    <Col lg={6}>
                      <Form.Control
                        type="text"
                        id={`nom_matiere_${index}`}
                        name={`nom_matiere_${index}`}
                        placeholder="Matière"
                        className="w-100"
                        value={item.nom_matiere}
                        onChange={(e) =>
                          handleMatiereChange(index, e.target.value)
                        }
                      />
                    </Col>
                    <Col lg={1} className="m-1">
                      {index === matiere.matieres.length - 1 && (
                        <button
                          type="button"
                          className="btn btn-soft-info btn-icon"
                          onClick={handleAddMatiere}
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      )}
                    </Col>
                    <Col lg={1} className="m-1">
                      <button
                        type="button"
                        className="btn btn-danger btn-icon"
                        onClick={() => handleRemoveMatiere(index)}
                      >
                        <i className="ri-delete-bin-5-line"></i>
                      </button>
                    </Col>
                  </Row>
                ))} */}
                          </Tab.Pane>
                        </Tab.Content>
                      </Tab.Container>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
          <Modal
            className="fade"
            id="createModal"
            show={modal_UpdateCalendrier}
            onHide={() => {
              tog_UpdateCalendrier();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Calendrier
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateCalendrier
                modal_UpdateCalendrier={modal_UpdateCalendrier}
                setmodal_UpdateCalendrier={setmodal_UpdateCalendrier}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showCalendrier}
          onHide={() => setShowCalendrier(!showCalendrier)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails Calendrier</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.classe?.nom_classe!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matiere</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.matiere!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date Examen</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">De</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.heure_debut!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Jusqu'à</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.heure_fin!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Trimestre</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.trimestre!}</i>
              </Col>
            </Row>
            {/* <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Enseignant</span>
              </Col>
              <Col lg={9}>
                <i>
                  {calendrierLocation?.state?.enseignant?.nom_enseignant}{" "}
                  {calendrierLocation?.state?.enseignant?.prenom_enseignant}
                </i>
              </Col>
            </Row> */}
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Salle</span>
              </Col>
              <Col lg={9}>
                <i>{calendrierLocation?.state?.salle?.nom_salle!}</i>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default DevoirSynthese;
