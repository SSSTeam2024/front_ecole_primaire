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
import {
  useDeleteMessagerieMutation,
  useGetMessageriesQuery,
  useNewMessagerieMutation,
} from "features/messageries/messagerieSlice";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const Messages = () => {
  const { data = [] } = useGetMessageriesQuery();

  const [deleteMessages] = useDeleteMessagerieMutation();

  const [showMessages, setShowMessages] = useState<boolean>(false);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le message a été envoyé avec succès",
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
          deleteMessages(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le message est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le message est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddMessage, setmodal_AddMessage] = useState<boolean>(false);
  function tog_AddMessage() {
    setmodal_AddMessage(!modal_AddMessage);
  }

  const [createMessage] = useNewMessagerieMutation();

  const initialMessage = {
    msg: "",
    sender: "",
    receiver: "",
    date: "",
    heure: "",
    fichier_base64_string: [],
    fichier_extension: [],
    fichiers: [],
  };

  const [message, setMessage] = useState(initialMessage);

  const {
    msg,
    sender,
    receiver,
    date,
    heure,
    fichier_base64_string,
    fichier_extension,
    fichiers,
  } = message;

  const onChangeMessage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFileUpload = async (files: File[]) => {
    const base64Files = await Promise.all(
      files.map(async (file: File) => {
        const { base64Data, extension } = await convertToBase64(file);
        const mimeType = file.type; // Get the MIME type of the file
        return {
          base64Data,
          extension,
          fileName: file.name,
          mimeType,
        };
      })
    );

    setMessage((prevState: any) => ({
      ...prevState,
      fichiers: base64Files.map(
        (file) => `data:${file.mimeType};base64,${file.base64Data}`
      ),
      fichier_base64_string: base64Files.map((file) => file.base64Data),
      fichier_extension: base64Files.map((file) => file.extension),
    }));
  };

  const handleDeleteFile = (indexToRemove: number) => {
    setMessage((prevData) => {
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

  const onSubmitMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      createMessage(message)
        .then(() => notifySuccess())
        .then(() => setMessage(initialMessage));
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
                onClick={() => setShowMessages(!showMessages)}
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

  const gallerieLocation = useLocation();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Messages" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddMessage()}
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
          {/* <Modal
            className="fade"
            id="createModal"
            show={modal_AddMessage}
            onHide={() => {
              tog_AddMessage();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Gallerie
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitMessage}>
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
        </Offcanvas> */}
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Messages;
