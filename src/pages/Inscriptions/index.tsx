import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useGetAllInscriptionsQuery,
  useRemoveInscriptionMutation,
  useUpdateInscriptionGroupeMutation,
  useUpdateInscriptionStatausMutation,
} from "features/inscriptions/inscriptionSlice";
import { useFetchClassesQuery } from "features/classes/classeSlice";

import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  useAddEtudiantMutation,
  useUpdateEleveClasseMutation,
} from "features/etudiants/etudiantSlice";
import {
  useAddParentMutation,
  useFetchParentsQuery,
} from "features/parents/parentSlice";

interface InscriptionRow {
  _id: string;
  classe: string;
  nom_eleve: string;
  prenom_eleve: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: string;
  adresse_eleve: string;
  situation_familiale: string;
  avec: string;
  responsable_legal: string;
  nom_parent: string;
  prenom_parent: string;
  adresse_parent: string;
  profession: string;
  nom_societe: string;
  phone: string;
  status: string;
  nationalite: string;
  annee_scolaire: string;
  etablissement_frequente: string;
  moyenne_trimestre_1: string;
  moyenne_trimestre_2: string;
  moyenne_trimestre_3: string;
  moyenne_annuelle: string;
  moyenne_concours_6: string;
  numero_convocation_concours: string;
  bulletin_base64: string;
  bulletin_extension: string;
  photo_base64: string;
  photo_extension: string;
  copie_bulletin: string;
  photoProfil: string;
  notes: string;
}

const Inscriptions = () => {
  const { data = [] } = useGetAllInscriptionsQuery();

  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllParents = [] } = useFetchParentsQuery();

  const [deleteInscription] = useRemoveInscriptionMutation();

  const [selectedClasseToUpdateGroupe, setSelectedClasseToUpdateGroupe] =
    useState<string>("");

  const handleSelectClasseToUpdateGroupe = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedClasseToUpdateGroupe(value);
  };

  const [selectedNiveau, setSelectedNiveau] = useState<string>("");

  const handleSelectNiveau = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedNiveau(value);
  };

  const [selectedClasseToFilterTable, setSelectedClasseToFilterTable] =
    useState<string>("");

  const handleSelectClasseToFilterTable = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedClasseToFilterTable(value);
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
          deleteInscription(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "L'inscription est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "L'inscription est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [updateStatus, { isSuccess }] = useUpdateInscriptionStatausMutation();

  const [updateGroupe] = useUpdateInscriptionGroupeMutation();
  const [updateEleveClasse] = useUpdateEleveClasseMutation();
  const [selectedRow, setSelectedRow] = useState<InscriptionRow | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showModalUpdateGroupe, setShowModalUpdateGroupe] = useState(false);

  const handleOpenModal = (row: any) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const handleOpenModalUpdateGroupe = (row: any) => {
    setSelectedRow(row);
    setShowModalUpdateGroupe(true);
  };

  const handleCloseModalUpdateGroupe = () => {
    setShowModalUpdateGroupe(false);
    setSelectedRow(null);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Groupe a été affectée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifySuccessAcceptInscription = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'inscription a été acceptée avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const [createEleve] = useAddEtudiantMutation();
  const [createParent] = useAddParentMutation();
  const handleUpdateStatus = async (status: any) => {
    if (selectedRow) {
      updateStatus({ _id: selectedRow._id, status })
        .then(() => {
          handleCloseModal();
        })
        .then(() => notifySuccessAcceptInscription())
        .then(() =>
          createEleve({
            nom: selectedRow.nom_eleve,
            prenom: selectedRow.prenom_eleve,
            date_de_naissance: selectedRow.date_naissance,
            genre: selectedRow.sexe,
            avatar: selectedRow.photoProfil,
            statusPaiement: "0",
            lieu_naissance: selectedRow.lieu_naissance,
            adresse_eleve: selectedRow.adresse_eleve,
            ville: "",
            nationalite: selectedRow.nationalite,
            annee_scolaire: selectedRow.annee_scolaire,
            etablissement_frequente: selectedRow.etablissement_frequente,
            moyenne_trimestre_1: selectedRow.moyenne_trimestre_1,
            moyenne_trimestre_2: selectedRow.moyenne_trimestre_2,
            moyenne_trimestre_3: selectedRow.moyenne_trimestre_3,
            moyenne_annuelle: selectedRow.moyenne_annuelle,
            moyenne_concours_6: selectedRow.moyenne_concours_6,
            numero_convocation_concours:
              selectedRow.numero_convocation_concours,
          })
        );
      const phoneExistsInParents = AllParents.some(
        (parent) => parent.phone === selectedRow.phone
      );

      if (phoneExistsInParents) {
        console.log("Phone number exists in the parents list.");
      } else {
        const lastSixDigits = selectedRow.phone.slice(-6);
        const reversedLastSixDigits = lastSixDigits
          .split("")
          .reverse()
          .join("");
        createParent({
          cin: "",
          nom_parent: selectedRow.nom_parent,
          prenom_parent: selectedRow.prenom_parent,
          phone: selectedRow.phone,
          username: selectedRow.phone,
          password: reversedLastSixDigits,
          profession: selectedRow.profession,
        });
      }
    }
  };

  const handleUpdateGroupe = (groupe: any) => {
    if (selectedRow) {
      updateGroupe({ _id: selectedRow._id, groupe })
        .then(() => {
          handleCloseModalUpdateGroupe();
        })
        .then(() => {
          notifySuccess();
        });
      // .then(() => {
      //   updateEleveClasse({
      //     _id: "",
      //     classe: groupe,
      //   });
      // });
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Niveau</span>,
      selector: (row: any) => row.classe,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Groupe</span>,
      selector: (row: any) =>
        row.groupe === "" || row.groupe === undefined ? (
          <span>--</span>
        ) : (
          <span>{row?.groupe}</span>
        ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Nom Elève</span>,
      selector: (row: any) => (
        <span>
          {row.nom_eleve} {row.prenom_eleve}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Sexe</span>,
      selector: (row: any) => <span>{row.sexe}</span>,
      sortable: true,
      width: "64px",
    },
    {
      name: <span className="font-weight-bold fs-13">Moyenne</span>,
      selector: (row: any) => <span>{row.moyenne_annuelle}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">N° Téléphone</span>,
      selector: (row: any) => row.phone,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Adresse Parent</span>,
      selector: (row: any) => row.adresse_parent,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Etat</span>,
      selector: (cell: any) => {
        switch (cell.status) {
          case "":
            return <span className="badge bg-warning"> En Attente </span>;
          case "Accepté":
            return <span className="badge bg-success"> {cell.status} </span>;
          case "Refusé":
            return <span className="badge bg-danger"> {cell.status} </span>;
          default:
            return <span className="badge bg-warning"> En Attente </span>;
        }
      },
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="/details-inscription"
                className="badge badge-soft-info edit-item-btn"
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
            {row.status === "Accepté" ? (
              <li>
                <Link
                  to="#"
                  className="badge bg-secondary edit-item-btn"
                  style={{
                    pointerEvents: "none",
                    cursor: "not-allowed",
                  }}
                >
                  <i
                    className="ri-checkbox-circle-line"
                    style={{
                      transition: "transform 0.3s ease-in-out",
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
            ) : (
              <li>
                <Link
                  to="#"
                  className="badge badge-soft-success edit-item-btn"
                  onClick={() => handleOpenModal(row)}
                >
                  <i
                    className="ri-check-double-line"
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
            )}
            {row.status === "Accepté" && (
              <li>
                <Link
                  to="#"
                  className="badge badge-soft-warning remove-item-btn"
                  onClick={() => handleOpenModalUpdateGroupe(row)}
                >
                  <i
                    className="ri-arrow-left-right-line"
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
            )}
            <li>
              <Link
                to="/modifier-inscription"
                className="badge badge-soft-success remove-item-btn"
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
              <Link
                to="#"
                className="badge badge-soft-danger remove-item-btn"
                onClick={() => AlertDelete(row._id)}
              >
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
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const [isMaleChecked, setMaleChecked] = useState(false);
  const handleMaleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMaleChecked(event.target.checked);
  };

  const [isFemaleChecked, setIsFemaleChecked] = useState(false);
  const handleFemaleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsFemaleChecked(event.target.checked);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredInscriptions = () => {
    let filteredInscription = data;

    if (searchTerm) {
      filteredInscription = filteredInscription.filter((inscription: any) => {
        const titleMatch = inscription?.classe
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const typeMatch = inscription?.nom_eleve
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const dateMatch = inscription?.prenom_eleve
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const groupeMatch = inscription?.groupe
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const moyenneAnnuelleMatch = inscription?.moyenne_annuelle
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const adresseParentMatch = inscription?.adresse_parent
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const sexeMatch = inscription?.sexe
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        return (
          titleMatch ||
          dateMatch ||
          typeMatch ||
          groupeMatch ||
          moyenneAnnuelleMatch ||
          adresseParentMatch ||
          sexeMatch
        );
      });
    }
    // Filter by selected "classe"
    if (selectedNiveau && selectedNiveau !== "all") {
      filteredInscription = filteredInscription.filter(
        (inscription: any) => inscription.classe === selectedNiveau
      );
    }

    // Filter by selected "groupe"
    if (selectedClasseToFilterTable && selectedClasseToFilterTable !== "all") {
      filteredInscription = filteredInscription.filter(
        (inscription: any) =>
          inscription?.groupe! === selectedClasseToFilterTable
      );
    }

    // Filter by selected "sexe"
    if (isMaleChecked || isFemaleChecked) {
      filteredInscription = filteredInscription.filter((inscription: any) => {
        if (isMaleChecked && inscription.sexe === "M") {
          return true;
        }
        if (isFemaleChecked && inscription.sexe === "F") {
          return true;
        }
        return false;
      });
    }

    return filteredInscription;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Niveau",
      "Groupe",
      "Nom Elève",
      "Sexe",
      "Moyenne",
      "N° Téléphone",
      "Adresse Parent",
      "Etat",
    ];
    const tableRows = getFilteredInscriptions().map((row) => [
      row.classe,
      row.groupe || "--",
      `${row.nom_eleve} ${row.prenom_eleve}`,
      row.sexe,
      row.moyenne_annuelle,
      row.phone,
      row.adresse_parent,
      row.status || "En Attente",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("table_inscription.pdf");
  };

  const selectedClasse = selectedRow?.classe!;

  const selectedClasseNumber = selectedClasse?.match(/\d+/)?.[0]; // Extracts the number from "7 ème", "8 ème", etc.

  const matchedClasses = AllClasses.filter((classe) => {
    const classeNumber = classe.nom_classe?.match(/\d+/)?.[0]; // Extracts the number from "7B1", "8B1", etc.

    // Compare the numeric parts
    return classeNumber === selectedClasseNumber;
  });

  if (matchedClasses.length > 0) {
    console.log("Found class:", matchedClasses);
  } else {
    console.log("No class found starting with", selectedClasse);
  }

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      getFilteredInscriptions().map((row) => ({
        Niveau: row.classe,
        Groupe: row.groupe || "--",
        "Nom Elève": `${row.nom_eleve} ${row.prenom_eleve}`,
        Sexe: row.sexe,
        Moyenne: row.moyenne_annuelle,
        "N° Téléphone": row.phone,
        "Adresse Parent": row.adresse_parent,
        Etat: row.status === "" ? "En Attente" : row.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscriptions");

    XLSX.writeFile(workbook, "inscriptions.xlsx");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Inscription" pageTitle="Tableau de bord" />
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
                  <Col lg={2}>
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="Niveau"
                      id="Niveau"
                      onChange={handleSelectNiveau}
                    >
                      <option value="all">Tous les Niveaux</option>
                      <option value="7 ème">7 ème</option>
                      <option value="8 ème">8 ème</option>
                      <option value="9 ème">9 ème</option>
                      <option value="1ère">1ère</option>
                      <option value="2ème">2ème</option>
                      <option value="3ème Maths">3ème Maths</option>
                      <option value="3ème Science">3ème Science</option>
                      <option value="3ème Technique">3ème Technique</option>
                      <option value="4ème Maths">4ème Maths</option>
                      <option value="4ème Science">4ème Science</option>
                      <option value="4ème Technique">4ème Technique</option>
                    </select>
                  </Col>
                  <Col lg={2}>
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="FilterTable"
                      id="FilterTable"
                      onChange={handleSelectClasseToFilterTable}
                    >
                      <option value="all">Toutes les Classes</option>
                      {AllClasses.map((classe) => (
                        <option value={classe?.nom_classe!} key={classe?._id!}>
                          {classe?.nom_classe!}
                        </option>
                      ))}
                    </select>
                  </Col>
                  <Col lg={3} className="d-flex align-items-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox1"
                        value="option1"
                        checked={isMaleChecked}
                        onChange={handleMaleCheckboxChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineCheckbox1"
                      >
                        M
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox2"
                        value="option2"
                        checked={isFemaleChecked}
                        onChange={handleFemaleCheckboxChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineCheckbox2"
                      >
                        F
                      </label>
                    </div>
                  </Col>
                  <Col lg={1}>
                    <span
                      className="badge badge-label bg-success"
                      onClick={handleExport}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="mdi mdi-file-excel fs-22"></i>
                    </span>
                  </Col>
                  <Col lg={1} className="text-end">
                    <span
                      className="badge badge-label bg-danger"
                      onClick={downloadPDF}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="mdi mdi-file-pdf-box fs-22"></i>
                    </span>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredInscriptions()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Modifier L'état</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedRow && (
                <>
                  <p>
                    Nom Elève: {selectedRow.nom_eleve}{" "}
                    {selectedRow.prenom_eleve}
                  </p>
                  <p>
                    Date et Lieu de Naissance: {selectedRow.date_naissance} à{" "}
                    {selectedRow.lieu_naissance}
                  </p>
                  <p>Sexe: {selectedRow.sexe}</p>
                  <p>L'enfant vit avec: {selectedRow.avec}</p>
                  <p>Classe: {selectedRow.classe}</p>
                  <p>
                    Moyenne 1er Trimèstre: {selectedRow.moyenne_trimestre_1}
                  </p>
                  <p>
                    Moyenne 2ème Trimèstre: {selectedRow.moyenne_trimestre_2}
                  </p>
                  {selectedRow.moyenne_trimestre_3 !== "" && (
                    <p>
                      Moyenne 3ème Trimèstre: {selectedRow.moyenne_trimestre_3}
                    </p>
                  )}
                  <p>Moyenne Annuelle: {selectedRow.moyenne_annuelle}</p>
                  <p>Moyenne Concours : {selectedRow.moyenne_concours_6}</p>
                  <p>
                    N° Convocation Concours:{" "}
                    {selectedRow.numero_convocation_concours}
                  </p>
                  <p>Situation Familiale: {selectedRow.situation_familiale}</p>
                  <p>Responsable Légal: {selectedRow.responsable_legal}</p>
                  <p>
                    Nom Parent: {selectedRow.nom_parent}{" "}
                    {selectedRow.prenom_parent}
                  </p>
                  <p>Adresse: {selectedRow.adresse_parent}</p>
                  <p>N° Téléphone: {selectedRow.phone}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => handleUpdateStatus("Accepté")}
              >
                Accepter
              </Button>
              <Button
                variant="danger"
                onClick={() => handleUpdateStatus("Refusé")}
              >
                Refuser
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showModalUpdateGroupe}
            onHide={handleCloseModalUpdateGroupe}
          >
            <Modal.Header closeButton>
              <Modal.Title>Affecter Groupe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col lg={4}>
                  <Form.Label htmlFor="classe" className="fw-bold fs-16">
                    Niveau : <span>{selectedRow?.classe!}</span>
                  </Form.Label>
                </Col>
                <Col lg={7}>
                  <select
                    className="form-select text-muted"
                    name="classe"
                    id="classe"
                    onChange={handleSelectClasseToUpdateGroupe}
                  >
                    <option value="">Choisir</option>
                    {matchedClasses?.map((classe) => (
                      <option value={classe?.nom_classe!} key={classe?._id!}>
                        {classe?.nom_classe!}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() => handleUpdateGroupe(selectedClasseToUpdateGroupe)}
              >
                Affecter
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Inscriptions;
