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
  Image,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import {
  useAddCantineMutation,
  useDeleteCantineMutation,
  useFetchCantinesQuery,
} from "features/cantines/cantineSlice";
import Masonry from "react-responsive-masonry";
import UpdateCantine from "./UpdateCantine";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";
import {
  useFetchSmsSettingsQuery,
  useUpdateSmsSettingByIdMutation,
} from "features/smsSettings/smsSettings";

const Cantines = () => {
  const { data = [] } = useFetchCantinesQuery();

  const { data: AllSmsSettings, isLoading = [] } = useFetchSmsSettingsQuery();

  const [showCantine, setShowCantine] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [deleteCantine] = useDeleteCantineMutation();

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
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
          deleteCantine(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La cantine est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La cantine est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddCantine, setmodal_AddCantine] = useState<boolean>(false);
  function tog_AddCantine() {
    setmodal_AddCantine(!modal_AddCantine);
  }

  const [modal_UpdateCantine, setmodal_UpdateCantine] =
    useState<boolean>(false);
  function tog_UpdateCantine() {
    setmodal_UpdateCantine(!modal_UpdateCantine);
  }

  const [selectedJour, setSelectedJour] = useState<string>("");

  const handleSelectJour = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedJour(value);
  };

  const [createCantine] = useAddCantineMutation();

  const initialCantine = {
    jour: "",
    repas: "",
    desc: "",
    creation_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [cantine, setCantine] = useState(initialCantine);

  const {
    jour,
    repas,
    desc,
    creation_date,
    fichier_base64_string,
    fichier_extension,
    fichier,
  } = cantine;

  const onChangeCantine = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCantine((prevState) => ({
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
      const file_cantine = base64Data + "." + extension;
      setCantine({
        ...cantine,
        fichier: file_cantine,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const [updateAvisSmsSetting] = useUpdateSmsSettingByIdMutation();
  const [formData, setFormData] = useState({
    id: "",
    status: "",
  });

  useEffect(() => {
    if (AllSmsSettings !== undefined && isLoading === false) {
      const cantine_sms_setting = AllSmsSettings?.filter(
        (parametre) => parametre.service_name === "Cantine"
      );
      setFormData((prevState) => ({
        ...prevState,
        id: cantine_sms_setting[0]?._id!,
        status: cantine_sms_setting[0].sms_status,
      }));
    }
  }, [AllSmsSettings, isLoading]);

  const onChangeCantineSmsSetting = () => {
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
        notifySuccess("Paramètre Cantine SMS a été modifié avec succès")
      );
  };

  const onSubmitCantine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      cantine["creation_date"] = formatDate(selectedDate);
      const [day, month, year] = formatDate(selectedDate).split("-");
      const formattedDate = `${year}-${month}-${day}`; // Convert to ISO format yyyy-mm-dd

      // Create a Date object from the formatted string
      const dateObj = new Date(formattedDate);

      // Use Intl.DateTimeFormat to get the day in French
      const dayOfWeek = new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
      }).format(dateObj);
      cantine["jour"] = dayOfWeek;
      createCantine(cantine)
        .then(() => notifySuccess("La cantine a été créée avec succès"))
        .then(() => setCantine(initialCantine));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Jour</span>,
      selector: (row: any) => row.jour,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Repas</span>,
      selector: (row: any) => row.repas,
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
                onClick={() => setShowCantine(!showCantine)}
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
              <Link to="#" className="badge badge-soft-success edit-item-btn">
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

  const cantineLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredCantines = () => {
    let filteredCantines = data;

    if (searchTerm) {
      filteredCantines = filteredCantines.filter(
        (cantine: any) =>
          cantine?.jour!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cantine?.repas!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cantine?.desc!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cantine
            ?.creation_date!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredCantines;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Cantine" pageTitle="Tableau de bord" />
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
                            onChange={() => onChangeCantineSmsSetting()}
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
                        onClick={() => tog_AddCantine()}
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
                        <span>Ajouter Cantine</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Masonry className="my-masonry-grid_column me-3">
                    {getFilteredCantines().map((cantine) => (
                      <Col key={cantine?._id!}>
                        <Card className="m-2">
                          <Card.Header>
                            <span className="fw-medium fs-16 mb-0">
                              {cantine?.jour!} {cantine.creation_date!}
                            </span>
                            <div className="hstack gap-2 float-end">
                              <Link
                                to="#"
                                type="button"
                                className="btn btn-soft-success btn-sm"
                                onClick={() => tog_UpdateCantine()}
                                state={cantine}
                              >
                                Modifier
                              </Link>
                              <Link
                                to="#"
                                type="button"
                                className="btn btn-soft-danger btn-sm"
                                onClick={() => AlertDelete(cantine?._id!)}
                                state={cantine}
                              >
                                Supprimer
                              </Link>
                            </div>
                          </Card.Header>
                          <Image
                            // src={`${process.env.REACT_APP_BASE_URL}/cantineFiles/${cantine.fichier!}`}
                            src={`${
                              process.env.REACT_APP_BASE_URL
                            }/cantineFiles/${cantine.fichier!}`}
                            className="rounded m-2"
                            alt={cantine.repas}
                            width="280"
                          />
                          <Card.Body>
                            <h5 className="card-title mb-1">
                              {cantine.repas!}
                            </h5>
                            <p className="card-text">{cantine.desc!}</p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Masonry>
                </Row>
                {/* <DataTable columns={columns} data={data} pagination /> */}
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddCantine}
            onHide={() => {
              tog_AddCantine();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Cantine
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitCantine}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="date">Date</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Date Repas"
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
                    <Form.Label htmlFor="repas">Repas</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="repas"
                      name="repas"
                      onChange={onChangeCantine}
                      value={cantine.repas}
                    />
                  </Col>
                </Row>
                {/* <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="jour">Jour</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="jour"
                      id="jour"
                      onChange={handleSelectJour}
                    >
                      <option value="">Choisir</option>
                      <option value="Lundi">Lundi</option>
                      <option value="Mardi">Mardi</option>
                      <option value="Mercredi">Mercredi</option>
                      <option value="Jeudi">Jeudi</option>
                      <option value="Vendredi">Vendredi</option>
                      
                    </select>
                  </Col>
                </Row> */}
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="desc">Description</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <textarea
                      className="form-control"
                      id="desc"
                      name="desc"
                      value={cantine.desc}
                      onChange={onChangeCantine}
                      rows={3}
                    ></textarea>
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
                              src={`data:image/jpeg;base64, ${cantine.fichier_base64_string}`}
                              alt={cantine.repas}
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
                        tog_AddCantine();
                        setCantine(initialCantine);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddCantine();
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
            show={modal_UpdateCantine}
            onHide={() => {
              tog_UpdateCantine();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Cantine
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateCantine
                modal_UpdateCantine={modal_UpdateCantine}
                setmodal_UpdateCantine={setmodal_UpdateCantine}
              />
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Cantines;
