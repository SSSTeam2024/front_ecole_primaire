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
  Image,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import Select from "react-select";
import {
  useAddGallerieMutation,
  useDeleteGallerieMutation,
  useFetchGallerieQuery,
} from "features/galleries/gallerieSlice";
import Dropzone from "react-dropzone";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";
import { Pagination } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import UpdateGallerie from "./UpdateGallerie";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";

const Gallerie = () => {
  const { data = [] } = useFetchGallerieQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [deleteGallerie] = useDeleteGallerieMutation();

  const [showGallerie, setShowGallerie] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La gallerie a été crée avec succès",
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
          deleteGallerie(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La gallerie est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La gallerie est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddGallerie, setmodal_AddGallerie] = useState<boolean>(false);
  function tog_AddGallerie() {
    setmodal_AddGallerie(!modal_AddGallerie);
  }

  const [modal_UpdateGallerie, setmodal_UpdateGallerie] =
    useState<boolean>(false);
  function tog_UpdateGallerie() {
    setmodal_UpdateGallerie(!modal_UpdateGallerie);
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

  const [createGallerie] = useAddGallerieMutation();

  const initialGallerie = {
    classes: [""],
    titre: "",
    desc: "",
    creation_date: "",
    fichier_base64_string: [],
    fichier_extension: [],
    fichiers: [],
  };

  const [gallerie, setGallerie] = useState(initialGallerie);

  const {
    classes,
    titre,
    desc,
    creation_date,
    fichier_base64_string,
    fichier_extension,
    fichiers,
  } = gallerie;

  const onChangeGallerie = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setGallerie((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFileUploadFile = async (files: File[]) => {
    const base64Images = await Promise.all(
      files.map(async (file: File) => {
        const { base64Data, extension } = await convertToBase64(file);
        return {
          base64Data,
          extension,
          fileName: file.name,
        };
      })
    );

    setGallerie((prevState: any) => ({
      ...prevState,
      fichiers: base64Images.map(
        (img) => `data:image/${img.extension};base64,${img.base64Data}`
      ),
      fichier_base64_string: base64Images.map((img) => img.base64Data),
      fichier_extension: base64Images.map((img) => img.extension),
    }));
  };

  const handleDeleteFile = (indexToRemove: number) => {
    setGallerie((prevData) => {
      const newGallery = prevData.fichiers?.filter(
        (_, index) => index !== indexToRemove
      );
      const newGalleryBase64Strings = prevData.fichier_base64_string?.filter(
        (_, index) => index !== indexToRemove
      );
      const newGalleryExtension = prevData.fichier_extension?.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prevData,
        fichiers: newGallery,
        fichier_base64_string: newGalleryBase64Strings,
        fichier_extension: newGalleryExtension,
      };
    });
  };

  const onSubmitGallerie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      gallerie["creation_date"] = formatDate(selectedDate);
      gallerie["classes"] = selectedColumnValues;
      createGallerie(gallerie)
        .then(() => notifySuccess())
        .then(() => setGallerie(initialGallerie));
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
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#"
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowGallerie(!showGallerie)}
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
                onClick={() => {
                  tog_UpdateGallerie();
                }}
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

  const gallerieLocation = useLocation();

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
          <Breadcrumb title="Gallerie" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddGallerie()}
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
                        <span>Ajouter Gallerie</span>
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
            show={modal_AddGallerie}
            onHide={() => {
              tog_AddGallerie();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Gallerie
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitGallerie}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="titre">Titre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="titre"
                      name="titre"
                      onChange={onChangeGallerie}
                      value={gallerie.titre}
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
                      value={gallerie.desc}
                      onChange={onChangeGallerie}
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
                  <Col lg={6}>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleFileUploadFile(acceptedFiles)
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          className="dropzone dz-clickable text-center"
                          {...getRootProps()}
                        >
                          <div className="dz-message needsclick">
                            <div className="mb-3">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h5>
                              Déposez des photos ici ou cliquez pour
                              télécharger.
                            </h5>
                          </div>
                          <input {...getInputProps()} />
                        </div>
                      )}
                    </Dropzone>
                  </Col>
                  <Col lg={3}>
                    <div className="mt-3">
                      {gallerie.fichiers?.map((image, index) => (
                        <div key={index} className="image-preview">
                          <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="img-thumbnail"
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteFile(index)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddGallerie();
                        setGallerie(initialGallerie);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddGallerie();
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
            show={modal_UpdateGallerie}
            onHide={() => {
              tog_UpdateGallerie();
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
              <UpdateGallerie
                modal_UpdateGallerie={modal_UpdateGallerie}
                setmodal_UpdateGallerie={setmodal_UpdateGallerie}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showGallerie}
          onHide={() => setShowGallerie(!showGallerie)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails du Gallerie</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Titre</span>
              </Col>
              <Col lg={9}>
                <i>{gallerieLocation?.state?.titre!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Description</span>
              </Col>
              <Col lg={9}>
                <i>{gallerieLocation?.state?.desc!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Date création</span>
              </Col>
              <Col lg={9}>
                <i>{gallerieLocation?.state?.creation_date!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe(s)</span>
              </Col>
              <Col lg={9}>
                <i>
                  {gallerieLocation?.state?.classes
                    ?.map((c: any) => c.nom_classe)
                    .join(" / ")}
                </i>
              </Col>
            </Row>
            <Row>
              <Col lg={3}>
                <span className="fw-medium">Fichiers</span>
              </Col>
              <Col lg={9}>
                <Swiper
                  direction={"vertical"}
                  pagination={{ clickable: true }}
                  modules={[Pagination, Autoplay]}
                  loop={true}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  className="mySwiper swiper vertical-swiper rounded"
                  style={{ height: "324px" }}
                >
                  {gallerieLocation?.state?.fichiers!.map((image: any) => (
                    <div className="swiper-wrapper">
                      <SwiperSlide>
                        <Image
                          // src={`${process.env.REACT_APP_BASE_URL}/gallerieFiles/${image}`}
                          src={`${process.env.REACT_APP_BASE_URL}/gallerieFiles/${image}`}
                          alt=""
                          className="img-fluid"
                        />
                      </SwiperSlide>
                    </div>
                  ))}
                </Swiper>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Gallerie;
