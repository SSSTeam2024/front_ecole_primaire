import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Offcanvas,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  useDeleteNoteMutation,
  useFetchNotesQuery,
} from "features/notes/noteSlice";
import UpdateNote from "./UpdateNote";

import {
  useFetchSmsSettingsQuery,
  useUpdateSmsSettingByIdMutation,
} from "features/smsSettings/smsSettings";

const Notes = () => {
  const { data = [] } = useFetchNotesQuery();

  const { data: AllSmsSettings, isLoading = [] } = useFetchSmsSettingsQuery();

  const [deleteNote] = useDeleteNoteMutation();
  const [showObservation, setShowObservation] = useState<boolean>(false);

  const navigate = useNavigate();
  const notifySuccess = (msg: string) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: msg,
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
          deleteNote(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La note est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La note est en sécurité :)",
            "info"
          );
        }
      });
  };

  function tog_AddNote() {
    navigate("/nouveau-note");
  }

  const [modal_UpdateNote, setmodal_UpdateNote] = useState<boolean>(false);
  function tog_UpdateNote() {
    setmodal_UpdateNote(!modal_UpdateNote);
  }

  const [updateAvisSmsSetting] = useUpdateSmsSettingByIdMutation();
  const [formData, setFormData] = useState({
    id: "",
    status: "",
  });

  useEffect(() => {
    if (AllSmsSettings !== undefined && isLoading === false) {
      const devoir_sms_setting = AllSmsSettings?.filter(
        (parametre) => parametre.service_name === "Notes"
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
        notifySuccess("Paramètre Notes SMS a été modifié avec succès")
      );
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Classe</span>,
      selector: (row: any) => <span>{row?.classe?.nom_classe!}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matière</span>,
      selector: (row: any) => row?.matiere!,
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
      name: <span className="font-weight-bold fs-13">Date</span>,
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
              <Link
                to="/modifier-note"
                className="badge badge-soft-success edit-item-btn"
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

  const getFilteredNotes = () => {
    let filteredNotes = data;

    if (searchTerm) {
      filteredNotes = filteredNotes.filter(
        (note: any) =>
          note?.matiere!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.trimestre!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.type!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note?.classe
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          note?.date!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredNotes;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Notes" pageTitle="Tableau de bord" />
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
                        onClick={tog_AddNote}
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
                        <span>Ajouter Note</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredNotes()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
        </Container>
        <Offcanvas
          show={showObservation}
          onHide={() => setShowObservation(!showObservation)}
          placement="end"
          style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails du note</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Classe</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.classe?.nom_classe!} </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Matiere</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.matiere!}</i>
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
            <Row className="mb-3">
              <Col lg={3}>
                <span className="fw-medium">Type</span>
              </Col>
              <Col lg={9}>
                <i>{observationLocation?.state?.type!}</i>
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
            <Row>
              <Col lg={8}>
                {/* Header for the table of students and notes */}
                <Row>
                  <Col lg={5}>
                    <Form.Label>Elève</Form.Label>
                  </Col>
                  <Col lg={3}>
                    <Form.Label>Note</Form.Label>
                  </Col>
                </Row>

                {observationLocation?.state?.eleves!.length > 0 ? (
                  observationLocation?.state?.eleves!.map((eleve: any) => (
                    <Row key={eleve.eleve._id}>
                      <Col lg={5} className="mb-1">
                        {eleve?.eleve?.prenom!} {eleve?.eleve?.nom!}
                      </Col>
                      <Col lg={3} className="mb-1">
                        {eleve?.note!}
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Row>
                    <Col>
                      <p>Aucun Note pour le classe</p>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Notes;
