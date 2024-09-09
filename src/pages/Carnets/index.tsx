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
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import {
  useAddCarnetMutation,
  useDeleteCarnetMutation,
  useFetchCarnetsQuery,
} from "features/carnets/carnetSlice";
import { convertToBase64 } from "helpers/base64_convert";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";

const Carnets = () => {
  const { data = [] } = useFetchCarnetsQuery();
  const { data: AllEleves = [] } = useFetchEtudiantsQuery();

  const [deleteCarnet] = useDeleteCarnetMutation();

  const [showObservation, setShowObservation] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le carnet a été créé avec succès",
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
          deleteCarnet(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le carnet est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le carnet est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const [selectedEleve, setSelectedEleve] = useState<string>("");

  const handleSelectEleve = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedEleve(value);
  };

  const [modal_AddCarnet, setmodal_AddCarnet] = useState<boolean>(false);
  function tog_AddCarnet() {
    setmodal_AddCarnet(!modal_AddCarnet);
  }

  const [createCarnet] = useAddCarnetMutation();

  const initialCarnet = {
    eleve: "",
    trimestre: "",
    note: "",
    date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [carnet, setCarnet] = useState(initialCarnet);

  const {
    eleve,
    trimestre,
    note,
    date,
    fichier_base64_string,
    fichier_extension,
    fichier,
  } = carnet;

  const onChangeCarnet = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCarnet((prevState) => ({
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
      const file_carnet = base64Data + "." + extension;
      setCarnet({
        ...carnet,
        fichier: file_carnet,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const onSubmitCarnet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      carnet["date"] = formatDate(selectedDate);
      carnet["eleve"] = selectedEleve;
      carnet["trimestre"] = selectedTrimestre;
      createCarnet(carnet)
        .then(() => notifySuccess())
        .then(() => setCarnet(initialCarnet));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Elève</span>,
      selector: (row: any) => (
        <span>
          {row?.eleve?.nom!} {row?.eleve?.prenom!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Note Trimestriel</span>,
      selector: (row: any) => row.note,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Trimestre</span>,
      selector: (row: any) => row.trimestre,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date de création</span>,
      selector: (row: any) => row.date,
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
    const fileUrl = `${process.env.REACT_APP_BASE_URL}/carnetFiles/${observationLocation.state.fichier}`;
    const fileName = "sample.pdf";

    openFileInNewTab(fileUrl, fileName);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Bulletins" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddCarnet()}
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
                        <span>Ajouter Bulletin</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable columns={columns} data={data} pagination />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddCarnet}
            onHide={() => {
              tog_AddCarnet();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Bulletin
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitCarnet}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="eleve">Elève</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="eleve"
                      id="eleve"
                      onChange={handleSelectEleve}
                    >
                      <option value="">Choisir</option>
                      {AllEleves.map((eleve) => (
                        <option value={eleve?._id!} key={eleve?._id!}>
                          {eleve.nom} {eleve.prenom}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="description">Trimestre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="trimestre"
                      id="trimestre"
                      onChange={handleSelectTrimestre}
                    >
                      <option value="">Choisir</option>
                      <option value="1er trimestre">1er trimestre</option>
                      <option value="2ème trimestre">2ème trimestre</option>
                      <option value="3ème trimestre">3ème trimestre</option>
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="note">Note</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="note"
                      name="note"
                      onChange={onChangeCarnet}
                      value={carnet.note}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="date">Date</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Date création"
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
                        tog_AddCarnet();
                        setCarnet(initialCarnet);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddCarnet();
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
            <Offcanvas.Title>Détails du Bulletin</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Elève</span>
              </Col>
              <Col lg={9}>
                <i>
                  {observationLocation?.state?.eleve?.nom!}{" "}
                  {observationLocation?.state?.eleve?.prenom!}
                </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Note</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.note!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Trimestre</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.trimestre!}</i>
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
                <Button variant="soft-danger" onClick={handleButtonClick}>
                  <i className="bi bi-filetype-pdf align-middle fs-22"></i>
                </Button>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Carnets;
