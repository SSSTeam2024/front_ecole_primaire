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
  Paiement,
  useAddPaiementMutation,
  useDeletePaiementMutation,
  useFetchPaiementsQuery,
} from "features/paiements/paiementSlice";
import {
  useFetchEtudiantsQuery,
  useUpdatePaymentStatausMutation,
} from "features/etudiants/etudiantSlice";
import UpdatePaiment from "./UpdatePaiment";

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const PaiementPage = () => {
  const { data = [] } = useFetchPaiementsQuery();
  const { data: AllEleves = [] } = useFetchEtudiantsQuery();

  const eleves_fully_paid = AllEleves.filter(
    (eleve) => eleve?.statusPaiement! === "0"
  );

  const eleves_first_part_paid = AllEleves.filter(
    (eleve) => eleve?.statusPaiement! === "0"
  );

  const eleves_second_part_paid = AllEleves.filter(
    (eleve) =>
      eleve?.statusPaiement! !== "Entièrement Payé" &&
      eleve?.statusPaiement! !== "1er Versement" &&
      eleve?.statusPaiement! !== "2ème Versement"
  );

  const eleves_third_part_paid = AllEleves.filter(
    (eleve) =>
      eleve?.statusPaiement! !== "Entièrement Payé" &&
      eleve?.statusPaiement! !== "1er Versement" &&
      eleve?.statusPaiement! !== "2ème Versement" &&
      eleve?.statusPaiement! !== "3ème Versement"
  );

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

  const [selectedPeriode, setSelectedPeriode] = useState<string>("");

  const handleSelectPeriode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPeriode(value);
  };

  const [selectedNiveau, setSelectedNiveau] = useState<string>("");

  const handleSelectNiveau = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedNiveau(value);
  };

  const [isInscriptionChecked, setInscriptionChecked] = useState(false);
  // const handleInscriptionCheckboxChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setInscriptionChecked(event.target.checked);
  // };

  const [isUniformeFilleChecked, setIsUniformeFilleChecked] = useState(false);
  // const handleUniformeFilleCheckboxChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setIsUniformeFilleChecked(event.target.checked);
  // };

  const [isUniformeGarconChecked, setIsUniformeGarconChecked] = useState(false);
  // const handleUniformeGarconCheckboxChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setIsUniformeGarconChecked(event.target.checked);
  // };

  const [isScolariteChecked, setIsScolariteChecked] = useState(false);
  // const handleScolariteCheckboxChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setIsScolariteChecked(event.target.checked);
  // };

  const [isRestaurationChecked, setIsRestaurationChecked] = useState(false);
  // const handleRestaurationCheckboxChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setIsRestaurationChecked(event.target.checked);
  // };

  const [isPanierChecked, setIsPanierChecked] = useState(false);
  // const handlePanierCheckboxChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setIsPanierChecked(event.target.checked);
  // };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    designationValue: string,
    amountValue: number
  ) => {
    const { checked } = event.target;

    setPaiement((prevState) => {
      let newDesignations = prevState.designation;
      let newMontant = parseInt(prevState.montant) || 0;

      if (checked) {
        if (!newDesignations.includes(designationValue)) {
          newDesignations = [...newDesignations, designationValue];
          newMontant += amountValue;
        }
      } else {
        newDesignations = newDesignations.filter(
          (designation) => designation !== designationValue
        );
        newMontant -= amountValue;
      }

      return {
        ...prevState,
        designation: newDesignations,
        montant: newMontant.toString(),
      };
    });
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

  const initialPaiement: Paiement = {
    eleve: "",
    annee_scolaire: "",
    montant: "",
    date_paiement: "",
    period: "",
    designation: [] as string[],
  };

  const [paiement, setPaiement] = useState(initialPaiement);

  const { eleve, annee_scolaire, montant, date_paiement, period, designation } =
    paiement;

  const onChangePaiement = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPaiement((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const [anneeScolaire, setAnneeScolaire] = useState<string>("");

  const currentDate = new Date();

  useEffect(() => {
    const currentMonth = currentDate.getMonth() + 1;
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
  const [updateStatus] = useUpdatePaymentStatausMutation();

  const handleUpdateStatus = (statusPaiement: any) => {
    updateStatus({ _id: selectedEleve, statusPaiement });
  };

  const onSubmitPaiement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (
    //   (selectedPeriode === "1er Versement" || selectedPeriode === "Annuel") &&
    //   (!isInscriptionChecked ||
    //     !isScolariteChecked ||
    //     !isRestaurationChecked ||
    //     !isPanierChecked)
    // ) {
    //   notifyCheck(
    //     "Veuillez cocher toutes les cases requises : Inscription, Scolarité, Restauration, Panier."
    //   );
    //   return;
    // }

    // if (
    //   (selectedPeriode === "1er Versement" || selectedPeriode === "Annuel") &&
    //   !(isUniformeFilleChecked || isUniformeGarconChecked)
    // ) {
    //   setShowAlert(true);
    // } else {
    //   setShowAlert(false);
    // }

    try {
      paiement["eleve"] = selectedEleve;
      paiement["annee_scolaire"] = anneeScolaire;
      paiement["date_paiement"] = formattedDate;
      paiement["period"] = selectedPeriode;

      // if (selectedPeriode === "Annuel" && Number(paiement.montant) < 7700) {
      //   notifyAnnuel();
      // } else if (
      //   selectedPeriode === "1er Versement" &&
      //   Number(paiement.montant) < 3350 &&
      //   !(isUniformeFilleChecked || isUniformeGarconChecked)
      // ) {
      //   setShowAlert(true);
      // } else {

      createPaiement(paiement)
        .then(() => notifySuccess())
        .then(() => setPaiement(initialPaiement))
        .then(() => setSelectedPeriode(""))
        .then(() => setSelectedNiveau(""));
      if (selectedPeriode === "Annuel") {
        handleUpdateStatus("Entièrement Payé");
      }
      if (selectedPeriode === "1er Versement") {
        handleUpdateStatus("1er Versement");
      }
      if (selectedPeriode === "2ème Versement") {
        handleUpdateStatus("2ème Versement");
      }
      if (selectedPeriode === "3ème Versement") {
        handleUpdateStatus("Entièrement Payé");
      }
      // }
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
      name: <span className="font-weight-bold fs-13">Période</span>,
      selector: (row: any) => <span>{row.period}</span>,
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
            .includes(searchTerm.toLowerCase()) ||
          paiement?.period!.toLowerCase().includes(searchTerm.toLowerCase())
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
              setSelectedPeriode("");
              setSelectedNiveau("");
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Paiement
              </h1>
            </Modal.Header>
            <Modal.Body>
              {/* {showAlert && (
                <div
                  className="alert alert-primary alert-dismissible alert-label-icon label-arrow fade show"
                  role="alert"
                >
                  <i className="ri-user-smile-line label-icon"></i>
                  <strong>Veuillez sélectionner un uniforme</strong> : Fille ou
                  Garçon.
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setShowAlert(false)}
                  ></button>
                </div>
              )} */}
              <Form className="create-form" onSubmit={onSubmitPaiement}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="niveau">Niveau</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="niveau"
                      id="niveau"
                      onChange={handleSelectNiveau}
                    >
                      <option value="">Choisir</option>
                      <option value="Collège">Collège</option>
                      <option value="Lycée">Lycée</option>
                    </select>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="period">Période</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <select
                      className="form-select text-muted"
                      name="period"
                      id="period"
                      onChange={handleSelectPeriode}
                    >
                      <option value="">Choisir</option>
                      <option value="Annuel">Annuel</option>
                      <option value="1er Versement">1er Versement</option>
                      <option value="2ème Versement">2ème Versement</option>
                      <option value="3ème Versement">3ème Versement</option>
                    </select>
                  </Col>
                </Row>
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
                      {selectedPeriode === "Annuel" &&
                        eleves_fully_paid.map((eleve) => (
                          <option value={eleve?._id!} key={eleve?._id!}>
                            {eleve.nom} {eleve.prenom}
                          </option>
                        ))}
                      {selectedPeriode === "1er Versement" &&
                        eleves_first_part_paid.map((eleve) => (
                          <option value={eleve?._id!} key={eleve?._id!}>
                            {eleve.nom} {eleve.prenom}
                          </option>
                        ))}
                      {selectedPeriode === "2ème Versement" &&
                        eleves_second_part_paid.map((eleve) => (
                          <option value={eleve?._id!} key={eleve?._id!}>
                            {eleve.nom} {eleve.prenom}
                          </option>
                        ))}
                      {selectedPeriode === "3ème Versement" &&
                        eleves_third_part_paid.map((eleve) => (
                          <option value={eleve?._id!} key={eleve?._id!}>
                            {eleve.nom} {eleve.prenom}
                          </option>
                        ))}
                    </select>
                  </Col>
                </Row>
                {(selectedPeriode === "Annuel" ||
                  selectedPeriode === "1er Versement") &&
                  selectedNiveau === "Collège" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inscription"
                            value="Inscription"
                            checked={isInscriptionChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Frais d'inscription",
                                300
                              );
                              setInscriptionChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inscription"
                          >
                            Frais d'inscription
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="optionFille"
                            name="uniforme"
                            value="fille"
                            checked={isUniformeFilleChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Uniforme Fille", 200);
                              setIsUniformeFilleChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="optionFille"
                          >
                            Uniforme Fille
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="optionGarcon"
                            name="uniforme"
                            value="garcon"
                            checked={isUniformeGarconChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Uniforme Garçon", 150);
                              setIsUniformeGarconChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="optionGarcon"
                          >
                            Uniforme Garçon
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}
                {selectedPeriode === "Annuel" &&
                  selectedNiveau === "Collège" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck1"
                            value="optio1"
                            checked={isScolariteChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Scolarité", 4050);
                              setIsScolariteChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck1"
                          >
                            Scolarité
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck2"
                            value="optio2"
                            checked={isRestaurationChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Garde et restauration",
                                1800
                              );
                              setIsRestaurationChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck2"
                          >
                            Garde et restauration
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineChec2"
                            value="opti2"
                            checked={isPanierChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Garde et panier", 1350);
                              setIsPanierChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineChec2"
                          >
                            Garde et panier
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}
                {selectedPeriode === "1er Versement" &&
                  selectedNiveau === "Collège" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck1"
                            value="optio1"
                            checked={isScolariteChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Scolarité", 1500);
                              setIsScolariteChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck1"
                          >
                            Scolarité
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck2"
                            value="optio2"
                            checked={isRestaurationChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Garde et restauration",
                                800
                              );
                              setIsRestaurationChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck2"
                          >
                            Garde et restauration
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineChec2"
                            value="opti2"
                            checked={isPanierChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Garde et panier", 550);
                              setIsPanierChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineChec2"
                          >
                            Garde et panier
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}
                {selectedPeriode === "2ème Versement" &&
                  selectedNiveau === "Collège" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck1"
                            value="optio1"
                            checked={isScolariteChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Scolarité", 1300);
                              setIsScolariteChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck1"
                          >
                            Scolarité
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck2"
                            value="optio2"
                            checked={isRestaurationChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Garde et restauration",
                                500
                              );
                              setIsRestaurationChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck2"
                          >
                            Garde et restauration
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineChec2"
                            value="opti2"
                            checked={isPanierChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Garde et panier", 400);
                              setIsPanierChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineChec2"
                          >
                            Garde et panier
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}
                {selectedPeriode === "3ème Versement" &&
                  selectedNiveau === "Collège" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck1"
                            value="optio1"
                            checked={isScolariteChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Scolarité", 1250);
                              setIsScolariteChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck1"
                          >
                            Scolarité
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck2"
                            value="optio2"
                            checked={isRestaurationChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Garde et restauration",
                                500
                              );
                              setIsRestaurationChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck2"
                          >
                            Garde et restauration
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineChec2"
                            value="opti2"
                            checked={isPanierChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Garde et panier", 400);
                              setIsPanierChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineChec2"
                          >
                            Garde et panier
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}

                {(selectedPeriode === "Annuel" ||
                  selectedPeriode === "1er Versement") &&
                  selectedNiveau === "Lycée" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inscription"
                            value="Inscription"
                            checked={isInscriptionChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Frais d'inscription",
                                300
                              );
                              setInscriptionChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inscription"
                          >
                            Frais d'inscription
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}
                {selectedPeriode === "Annuel" && selectedNiveau === "Lycée" && (
                  <Row className="mb-4">
                    <Col lg={12} className="d-flex align-items-center">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inlineCheck1"
                          value="optio1"
                          checked={isScolariteChecked}
                          onChange={(e) => {
                            handleCheckboxChange(e, "Scolarité", 4750);
                            setIsScolariteChecked(e.target.checked);
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineCheck1"
                        >
                          Scolarité
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inlineCheck2"
                          value="optio2"
                          checked={isRestaurationChecked}
                          onChange={(e) => {
                            handleCheckboxChange(
                              e,
                              "Garde et restauration",
                              1800
                            );
                            setIsRestaurationChecked(e.target.checked);
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineCheck2"
                        >
                          Garde et restauration
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inlineChec2"
                          value="opti2"
                          checked={isPanierChecked}
                          onChange={(e) => {
                            handleCheckboxChange(e, "Garde et panier", 1350);
                            setIsPanierChecked(e.target.checked);
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineChec2"
                        >
                          Garde et panier
                        </label>
                      </div>
                    </Col>
                  </Row>
                )}
                {selectedPeriode === "1er Versement" &&
                  selectedNiveau === "Lycée" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck1"
                            value="optio1"
                            checked={isScolariteChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Scolarité", 1750);
                              setIsScolariteChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck1"
                          >
                            Scolarité
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck2"
                            value="optio2"
                            checked={isRestaurationChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Garde et restauration",
                                800
                              );
                              setIsRestaurationChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck2"
                          >
                            Garde et restauration
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineChec2"
                            value="opti2"
                            checked={isPanierChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Garde et panier", 550);
                              setIsPanierChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineChec2"
                          >
                            Garde et panier
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}
                {selectedPeriode === "2ème Versement" &&
                  selectedNiveau === "Lycée" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck1"
                            value="optio1"
                            checked={isScolariteChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Scolarité", 1500);
                              setIsScolariteChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck1"
                          >
                            Scolarité
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck2"
                            value="optio2"
                            checked={isRestaurationChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Garde et restauration",
                                500
                              );
                              setIsRestaurationChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck2"
                          >
                            Garde et restauration
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineChec2"
                            value="opti2"
                            checked={isPanierChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Garde et panier", 400);
                              setIsPanierChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineChec2"
                          >
                            Garde et panier
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}
                {selectedPeriode === "3ème Versement" &&
                  selectedNiveau === "Lycée" && (
                    <Row className="mb-4">
                      <Col lg={12} className="d-flex align-items-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck1"
                            value="optio1"
                            checked={isScolariteChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Scolarité", 1500);
                              setIsScolariteChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck1"
                          >
                            Scolarité
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineCheck2"
                            value="optio2"
                            checked={isRestaurationChecked}
                            onChange={(e) => {
                              handleCheckboxChange(
                                e,
                                "Garde et restauration",
                                500
                              );
                              setIsRestaurationChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineCheck2"
                          >
                            Garde et restauration
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="inlineChec2"
                            value="opti2"
                            checked={isPanierChecked}
                            onChange={(e) => {
                              handleCheckboxChange(e, "Garde et panier", 400);
                              setIsPanierChecked(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inlineChec2"
                          >
                            Garde et panier
                          </label>
                        </div>
                      </Col>
                    </Row>
                  )}
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
                      readOnly
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
            size="lg"
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
                <span className="fw-medium">Période</span>
              </Col>
              <Col lg={8}>
                <i>{paiementLocation?.state?.period!}</i>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col lg={4}>
                <span className="fw-medium">Désignation</span>
              </Col>
              <Col lg={8}>
                {paiementLocation?.state?.designation.join(" -- ")}
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
export default PaiementPage;
