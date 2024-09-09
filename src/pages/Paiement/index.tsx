import React, { useState, useEffect } from "react";
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
import {
  useAddPaiementMutation,
  useDeletePaiementMutation,
  useFetchPaiementsQuery,
} from "features/paiements/paiementSlice";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import UpdatePaiment from "./UpdatePaiment";

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// function convertToBase64(
//   file: File
// ): Promise<{ base64Data: string; extension: string }> {
//   return new Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.onload = () => {
//       const base64String = fileReader.result as string;
//       const [, base64Data] = base64String.split(",");
//       const extension = file.name.split(".").pop() ?? "";
//       resolve({ base64Data, extension });
//     };
//     fileReader.onerror = (error) => {
//       reject(error);
//     };
//     fileReader.readAsDataURL(file);
//   });
// }

const Paiement = () => {
  const { data = [] } = useFetchPaiementsQuery();
  const { data: AllEleves = [] } = useFetchEtudiantsQuery();

  const [deletePaiement] = useDeletePaiementMutation();
  const [showPaiement, setShowPaiement] = useState<boolean>(false);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le Paiement a été créé avec succès",
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
          deletePaiement(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le Paiement est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le Paiement est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [selectedEleve, setSelectedEleve] = useState<string>("");

  const handleSelectEleve = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedEleve(value);
  };

  const [modal_AddPaiement, setmodal_AddPaiement] = useState<boolean>(false);
  function tog_AddPaiement() {
    setmodal_AddPaiement(!modal_AddPaiement);
  }

  const [modal_UpdatePaiement, setmodal_UpdatePaiement] =
    useState<boolean>(false);
  function tog_UpdatePaiement() {
    setmodal_UpdatePaiement(!modal_UpdatePaiement);
  }

  const [createPaiement] = useAddPaiementMutation();

  const initialPaiement = {
    eleve: "",
    annee_scolaire: "",
    montant: "",
    date_paiement: "",
  };

  const [paiement, setPaiement] = useState(initialPaiement);

  const { eleve, annee_scolaire, montant, date_paiement } = paiement;

  const onChangePaiement = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaiement((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // const handleFileUploadFile = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const file = (
  //     document.getElementById("fichier_base64_string") as HTMLFormElement
  //   ).files[0];
  //   if (file) {
  //     const { base64Data, extension } = await convertToBase64(file);
  //     const file_observation = base64Data + "." + extension;
  //     setObservation({
  //       ...observation,
  //       fichier: file_observation,
  //       fichier_base64_string: base64Data,
  //       fichier_extension: extension,
  //     });
  //   }
  // };
  const [anneeScolaire, setAnneeScolaire] = useState<string>("");
  const currentDate = new Date();
  useEffect(() => {
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    let anneeScolaire: string;
    if (currentMonth >= 9 && currentMonth <= 12) {
      anneeScolaire = `${currentYear}/${currentYear + 1}`;
    } else {
      anneeScolaire = `${currentYear - 1}/${currentYear}`;
    }

    setAnneeScolaire(anneeScolaire);
  }, []);

  const formattedDate = formatDate(currentDate);

  const onSubmitPaiement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      paiement["eleve"] = selectedEleve;
      paiement["annee_scolaire"] = anneeScolaire;
      paiement["date_paiement"] = formattedDate;
      createPaiement(paiement)
        .then(() => notifySuccess())
        .then(() => setPaiement(initialPaiement));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Elève</span>,
      selector: (row: any) => (
        <span>
          {row.eleve.nom} {row.eleve.prenom}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Montant</span>,
      selector: (row: any) => <span>{row.montant} dt</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.date_paiement,
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
                onClick={() => setShowPaiement(!showPaiement)}
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
                onClick={() => tog_UpdatePaiement()}
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

  const paiementLocation = useLocation();

  // const openFileInNewTab = (fileUrl: string, fileName: string) => {
  //   // Create a temporary link element
  //   const link = document.createElement("a");
  //   link.href = fileUrl;
  //   link.target = "_blank"; // Open in new tab
  //   link.download = fileName; // Optional: specify a filename for download

  //   // Append the link to the document body and trigger a click event
  //   document.body.appendChild(link);
  //   link.click();

  //   // Clean up by removing the link element
  //   document.body.removeChild(link);
  // };

  // const handleButtonClick = () => {
  //   // Example file URL and name
  //   const fileUrl = `${process.env.REACT_APP_BASE_URL}/observationFiles/${observationLocation.state.fichier}`;
  //   const fileName = "sample.pdf";

  //   openFileInNewTab(fileUrl, fileName);
  // };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredPaiements = () => {
    let filteredPaiements = data;

    if (searchTerm) {
      filteredPaiements = filteredPaiements.filter(
        (paiement: any) =>
          paiement
            ?.annee_scolaire!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          paiement?.montant!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paiement
            ?.date_paiement!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          paiement?.eleve
            ?.nom!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          paiement?.eleve
            ?.prenom!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredPaiements;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Paiement" pageTitle="Tableau de bord" />
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
                        onClick={() => tog_AddPaiement()}
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
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredPaiements()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddPaiement}
            onHide={() => {
              tog_AddPaiement();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Paiement
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitPaiement}>
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
                    <Form.Label htmlFor="montant">Montant</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="montant"
                      name="montant"
                      onChange={onChangePaiement}
                      value={paiement.montant}
                    />
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddPaiement();
                        setPaiement(initialPaiement);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddPaiement();
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
            show={modal_UpdatePaiement}
            onHide={() => {
              tog_UpdatePaiement();
            }}
            centered
            size="sm"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Paiement
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdatePaiment
                modal_UpdatePaiement={modal_UpdatePaiement}
                setmodal_UpdatePaiement={setmodal_UpdatePaiement}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showPaiement}
          onHide={() => setShowPaiement(!showPaiement)}
          placement="end"
          // style={{ width: "40%" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails Paiement</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Elève</span>
              </Col>
              <Col lg={8}>
                <i>
                  {paiementLocation?.state?.eleve?.nom!}{" "}
                  {paiementLocation?.state?.eleve?.prenom!}
                </i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Montant</span>
              </Col>
              <Col lg={8}>
                <i>{paiementLocation?.state?.montant!} dt</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Date</span>
              </Col>
              <Col lg={8}>
                <i>{paiementLocation?.state?.date_paiement!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Annee Scolaire</span>
              </Col>
              <Col lg={8}>
                <i>{paiementLocation?.state?.annee_scolaire!}</i>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Paiement;
