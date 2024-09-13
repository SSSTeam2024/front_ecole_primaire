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
import { useFetchEtudiantsByClasseIdMutation } from "features/etudiants/etudiantSlice";
import Flatpickr from "react-flatpickr";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import {
  Compterendu,
  useAddCompteRenduMutation,
  useDeleteCompteRenduMutation,
  useFetchCompteRenduQuery,
} from "features/compteRendus/compteRenduSlice";
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import { convertToBase64 } from "helpers/base64_convert";

const CompteRendu = () => {
  const { data = [] } = useFetchCompteRenduQuery();
  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllMatieres = [] } = useFetchMatieresQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();
  const [deleteCompteRendu] = useDeleteCompteRenduMutation();

  const [showCompteRendu, setShowCompteRendu] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La compte rendu a été créée avec succès",
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
          deleteCompteRendu(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La compte rendu est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La compte rendu est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [
    getEtudiantsByClasseId,
    { data: AllEtudiantByClasseId, isLoading, error },
  ] = useFetchEtudiantsByClasseIdMutation();

  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
    if (value) {
      getEtudiantsByClasseId(value)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  let etudiantsByClasseId = AllEtudiantByClasseId || [];

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const [selectedEnseignant, setSelectedEnseignant] = useState<string>("");

  const handleSelectEnseignant = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedEnseignant(value);
  };

  const [modal_AddCompteRendu, setmodal_AddCompteRendu] =
    useState<boolean>(false);
  function tog_AddCompteRendu() {
    setmodal_AddCompteRendu(!modal_AddCompteRendu);
  }

  const [createCompteRendu] = useAddCompteRenduMutation();

  const initialCompteRendu: Compterendu = {
    classe: "",
    titre: "",
    desc: "",
    matiere: "",
    enseignant: "",
    creation_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
    notes: [],
  };

  const [compteRendu, setCompteRendu] =
    useState<Compterendu>(initialCompteRendu);

  const {
    classe,
    titre,
    desc,
    matiere,
    enseignant,
    creation_date,
    fichier_base64_string,
    fichier_extension,
    fichier,
    notes,
  } = compteRendu;

  const onChangeCompteRendu = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    etudiantId?: string
  ) => {
    const { id, value, name } = e.target;

    if (name === "note" && etudiantId) {
      setCompteRendu((prevState) => {
        const updatedNotes = prevState.notes.map((note) =>
          note.eleve === etudiantId ? { ...note, note: value } : note
        );

        // If the note doesn't exist, add a new one
        if (!updatedNotes.find((note) => note.eleve === etudiantId)) {
          updatedNotes.push({ eleve: etudiantId, note: value });
        }

        return { ...prevState, notes: updatedNotes };
      });
    } else {
      setCompteRendu((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_compteRendu = base64Data + "." + extension;
      setCompteRendu({
        ...compteRendu,
        fichier: file_compteRendu,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const onSubmitCompteRendu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      compteRendu["creation_date"] = selectedDate?.toDateString()!;
      compteRendu["classe"] = selectedClasse;
      compteRendu["enseignant"] = selectedEnseignant;
      compteRendu["matiere"] = selectedMatiere;

      createCompteRendu(compteRendu)
        .then(() => notifySuccess())
        .then(() => setCompteRendu(initialCompteRendu));
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
      selector: (row: any) => row.classe.nom_classe,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matiere</span>,
      selector: (row: any) => row.matiere.nom_matiere,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Enseignant</span>,
      selector: (row: any) => (
        <span>
          {row?.enseignant?.nom_enseignant!}{" "}
          {row?.enseignant?.prenom_enseignant!}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
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
                onClick={() => setShowCompteRendu(!showCompteRendu)}
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

  const compteRenduLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredCompteRendu = () => {
    let filteredCompteRendu = data;

    if (searchTerm) {
      filteredCompteRendu = filteredCompteRendu.filter(
        (compteRendu: any) =>
          compteRendu
            ?.titre!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          compteRendu?.matiere
            ?.nom_matiere!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          compteRendu?.classe
            ?.nom_classe!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          compteRendu
            ?.creation_date!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          compteRendu?.enseignant
            ?.nom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          compteRendu?.enseignant
            ?.prenom_enseignant!.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filteredCompteRendu;
  };

  const openFileInNewTab = (fileUrl: string, fileName: string) => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank"; // Open in new tab
    link.download = fileName; // Optional: specify a filename for download

    // Append the link to the document body and trigger a click event
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link element
    document.body.removeChild(link);
  };

  const handleButtonClick = () => {
    // Example file URL and name
    const fileUrl = `${process.env.REACT_APP_BASE_URL}/compteRenduFiles/${compteRenduLocation.state.fichier}`;
    const fileName = "sample.pdf";

    openFileInNewTab(fileUrl, fileName);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Compte Rendu" pageTitle="Tableau de bord" />
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
                  <Col lg={7}></Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddCompteRendu()}
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
                        <span>Ajouter Compte Rendu</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredCompteRendu()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddCompteRendu}
            onHide={() => {
              tog_AddCompteRendu();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Compte Rendu
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitCompteRendu}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="titre">Titre</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="titre"
                      name="titre"
                      onChange={onChangeCompteRendu}
                      value={compteRendu.titre}
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
                      value={compteRendu.desc}
                      onChange={onChangeCompteRendu}
                      rows={3}
                    ></textarea>
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
                {isLoading && (
                  <div className="spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                {error && <p>Erreur lors du chargement des étudiants.</p>}
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="notes">Notes</Form.Label>
                  </Col>
                  <Col lg={8}>
                    {etudiantsByClasseId.map((etudiant) => (
                      <Row className="mb-2" key={etudiant._id}>
                        <Col lg={3}>
                          <Form.Label htmlFor={`note-${etudiant._id}`}>
                            {etudiant.nom} {etudiant.prenom}
                          </Form.Label>
                        </Col>
                        <Col lg={9}>
                          <Form.Control
                            type="text"
                            id={`note-${etudiant._id}`}
                            name="note"
                            onChange={(e) =>
                              onChangeCompteRendu(e, etudiant._id)
                            }
                            value={
                              // Type assertion to ensure TypeScript recognizes 'note' as a string
                              compteRendu.notes.find(
                                (note) => note.eleve === etudiant._id
                              )?.note ?? ""
                            }
                          />
                        </Col>
                      </Row>
                    ))}
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="matiere">Matiere</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="matiere"
                      id="matiere"
                      onChange={handleSelectMatiere}
                    >
                      <option value="">Choisir</option>
                      {AllMatieres.map((matiere) =>
                        matiere.matieres.map((m) => (
                          <option value={matiere?._id!} key={m.nom_matiere}>
                            {m.nom_matiere}
                          </option>
                        ))
                      )}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="enseignant">Enseignant</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="enseignant"
                      id="enseignant"
                      onChange={handleSelectEnseignant}
                    >
                      <option value="">Choisir</option>
                      {AllEnseignants.map((enseignant) => (
                        <option value={enseignant?._id!} key={enseignant?._id!}>
                          {enseignant.nom_enseignant}{" "}
                          {enseignant.prenom_enseignant}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="creation_date">Date</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Choisir date"
                      onChange={handleDateChange}
                      options={{
                        dateFormat: "d M, Y",
                      }}
                      id="creation_date"
                      name="creation_date"
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
                      onChange={(e) => handleFileUpload(e)}
                    />
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddCompteRendu();
                        setCompteRendu(initialCompteRendu);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddCompteRendu();
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
      </div>
      <Offcanvas
        show={showCompteRendu}
        onHide={() => setShowCompteRendu(!showCompteRendu)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Détails du compte rendu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row className="mb-3">
            <Col lg={3}>
              <span className="fw-medium">Titre</span>
            </Col>
            <Col lg={9}>
              <i>{compteRenduLocation?.state?.titre!}</i>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={3}>
              <span className="fw-medium">Description</span>
            </Col>
            <Col lg={9}>
              <i>{compteRenduLocation?.state?.desc!}</i>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={3}>
              <span className="fw-medium">Date création</span>
            </Col>
            <Col lg={9}>
              <i>{compteRenduLocation?.state?.creation_date!}</i>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={3}>
              <span className="fw-medium">Classe</span>
            </Col>
            <Col lg={9}>
              <i>{compteRenduLocation?.state?.classe?.nom_classe!}</i>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={3}>
              <span className="fw-medium">Matiere</span>
            </Col>
            <Col lg={9}>
              <i>{compteRenduLocation?.state?.matiere?.nom_matiere}</i>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={3}>
              <span className="fw-medium">Enseignant</span>
            </Col>
            <Col lg={9}>
              <i>
                {compteRenduLocation?.state?.enseignant?.nom_enseignant}{" "}
                {compteRenduLocation?.state?.enseignant?.prenom_enseignant}
              </i>
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
    </React.Fragment>
  );
};
export default CompteRendu;
