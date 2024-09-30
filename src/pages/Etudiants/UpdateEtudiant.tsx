import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import Swal from "sweetalert2";

import { useLocation, useNavigate } from "react-router-dom";

import { useUpdateEtudiantMutation } from "features/etudiants/etudiantSlice";

import Flatpickr from "react-flatpickr";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchParentsQuery } from "features/parents/parentSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";
import Breadcrumb from "Common/BreadCrumb";

const UpdateEtudiant = ({}) => {
  const etudiantLocation = useLocation();
  const navigate = useNavigate();
  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllParent = [] } = useFetchParentsQuery();

  const [etudiantFirstName, setEtudiantFirstName] = useState<string>(
    etudiantLocation?.state?.nom ?? ""
  );

  const [etudiantLastName, setEtudiantLastName] = useState<string>(
    etudiantLocation?.state?.prenom ?? ""
  );

  const [lieuNaissance, setLieuNaissance] = useState<string>(
    etudiantLocation?.state?.lieu_naissance ?? ""
  );

  const [adresse, setAdresse] = useState<string>(
    etudiantLocation?.state?.adresse_eleve ?? ""
  );

  const [villeName, setvilleName] = useState<string>(
    etudiantLocation?.state?.ville ?? ""
  );

  const [nationalite_eleve, setNationaliteEleve] = useState<string>(
    etudiantLocation?.state?.nationalite ?? ""
  );

  const [anneeScolaire, setAnneeScolaire] = useState<string>(
    etudiantLocation?.state?.annee_scolaire ?? ""
  );

  const [convocationConcours, setConvocationConcours] = useState<string>(
    etudiantLocation?.state?.numero_convocation_concours ?? ""
  );

  const [moyenneConcours, setMoyenneConcours] = useState<string>(
    etudiantLocation?.state?.moyenne_concours_6 ?? ""
  );

  const [etablissementFrequente, setEtablissementFrequente] = useState<string>(
    etudiantLocation?.state?.etablissement_frequente ?? ""
  );

  const [moyTrimestre1, setMoyTrimestre1] = useState<string>(
    etudiantLocation?.state?.moyenne_trimestre_1 ?? ""
  );

  const [moyTrimestre2, setMoyTrimestre2] = useState<string>(
    etudiantLocation?.state?.moyenne_trimestre_2 ?? ""
  );

  const [moyTrimestre3, setMoyTrimestre3] = useState<string>(
    etudiantLocation?.state?.moyenne_trimestre_3 ?? ""
  );

  const [moyenneAnnuelle, setMoyenneAnnuelle] = useState<string>(
    etudiantLocation?.state?.moyenne_annuelle ?? ""
  );
  const [etudiant_id, setEtudiantId] = useState<string>(
    etudiantLocation?.state?._id! ?? ""
  );

  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | null>(null);
  const [showDateOfBirth, setShowDateOfBirth] = useState<boolean>(false);

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [showClasse, setShowClasse] = useState<boolean>(false);

  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [showGenre, setShowGenre] = useState<boolean>(false);

  const [selectedParent, setSelectedParent] = useState<string>("");
  const [showParent, setShowParent] = useState<boolean>(false);

  const handleEtudiantFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEtudiantFirstName(e.target.value);
  };

  const handleEtudiantLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEtudiantLastName(e.target.value);
  };

  const handlelieuNaissance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLieuNaissance(e.target.value);
  };

  const handleAdresse = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdresse(e.target.value);
  };

  const handleVilleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setvilleName(e.target.value);
  };

  const handleNationaliteEleve = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNationaliteEleve(e.target.value);
  };

  const handleAnneeScolaire = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnneeScolaire(e.target.value);
  };

  const handleConvocationConcours = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConvocationConcours(e.target.value);
  };

  const handleMoyenneConcours = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoyenneConcours(e.target.value);
  };

  const handleEtablissementFrequente = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEtablissementFrequente(e.target.value);
  };

  const handleMoyTrimestre1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoyTrimestre1(e.target.value);
  };

  const handleMoyTrimestre2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoyTrimestre2(e.target.value);
  };

  const handleMoyTrimestre3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoyTrimestre3(e.target.value);
  };

  const handleMoyenneAnnuelle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoyenneAnnuelle(e.target.value);
  };
  const handleBirthDateChange = (selectedDates: Date[]) => {
    setSelectedBirthDate(selectedDates[0]);
  };

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
  };

  const handleSelectGenre = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedGenre(value);
  };

  const handleSelectParent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedParent(value);
  };

  const [updateEtudiant] = useUpdateEtudiantMutation();

  const initialEtudiant = {
    _id: "",
    nom: "",
    prenom: "",
    date_de_naissance: "",
    classe: "",
    parent: "",
    genre: "",
    avatar_base64_string: "",
    avatar_extension: "",
    avatar: "",
    lieu_naissance: "",
    adresse_eleve: "",
    ville: "",
    nationalite: "",
    annee_scolaire: "",
    etablissement_frequente: "",
    moyenne_trimestre_1: "",
    moyenne_trimestre_2: "",
    moyenne_trimestre_3: "",
    moyenne_annuelle: "",
    moyenne_concours_6: "",
    numero_convocation_concours: "",
  };

  const [etudiant, setEtudiant] = useState(initialEtudiant);

  // Avatar
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("avatar_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setEtudiant({
        ...etudiant,
        avatar: profileImage,
        avatar_base64_string: base64Data,
        avatar_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'élève a été mis à jour avec succès",
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

  const {
    _id,
    nom,
    prenom,
    date_de_naissance,
    classe,
    parent,
    genre,
    avatar_base64_string,
    avatar_extension,
    avatar,
    ville,
    nationalite,
    etablissement_frequente,
    moyenne_annuelle,
    moyenne_concours_6,
    moyenne_trimestre_1,
    moyenne_trimestre_2,
    moyenne_trimestre_3,
    numero_convocation_concours,
    lieu_naissance,
    adresse_eleve,
    annee_scolaire,
  } = etudiant;

  const onSubmitUpdateEtudiant = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      etudiant["_id"] = etudiant_id || etudiantLocation?.state?._id!;

      if (etudiantFirstName === "") {
        etudiant["nom"] = etudiantLocation?.state?.nom!;
      } else {
        etudiant["nom"] = etudiantFirstName;
      }
      if (etudiantLastName === "") {
        etudiant["prenom"] = etudiantLocation?.state?.prenom!;
      } else {
        etudiant["prenom"] = etudiantLastName;
      }
      if (selectedBirthDate === null) {
        etudiant["date_de_naissance"] =
          etudiantLocation?.state?.date_de_naissance!;
      } else {
        etudiant["date_de_naissance"] = formatDate(selectedBirthDate);
      }
      if (lieuNaissance === null) {
        etudiant["lieu_naissance"] = etudiantLocation?.state?.lieu_naissance!;
      } else {
        etudiant["lieu_naissance"] = lieuNaissance;
      }
      if (adresse === null) {
        etudiant["adresse_eleve"] = etudiantLocation?.state?.adresse_eleve!;
      } else {
        etudiant["adresse_eleve"] = adresse;
      }
      if (villeName === null) {
        etudiant["ville"] = etudiantLocation?.state?.ville!;
      } else {
        etudiant["ville"] = villeName;
      }
      if (nationalite_eleve === null) {
        etudiant["nationalite"] = etudiantLocation?.state?.nationalite!;
      } else {
        etudiant["nationalite"] = nationalite_eleve;
      }
      if (anneeScolaire === null) {
        etudiant["annee_scolaire"] = etudiantLocation?.state?.annee_scolaire!;
      } else {
        etudiant["annee_scolaire"] = anneeScolaire;
      }
      if (convocationConcours === null) {
        etudiant["numero_convocation_concours"] =
          etudiantLocation?.state?.numero_convocation_concours!;
      } else {
        etudiant["numero_convocation_concours"] = convocationConcours;
      }
      if (moyenneConcours === null) {
        etudiant["moyenne_concours_6"] =
          etudiantLocation?.state?.moyenne_concours_6!;
      } else {
        etudiant["moyenne_concours_6"] = moyenneConcours;
      }
      if (etablissementFrequente === null) {
        etudiant["etablissement_frequente"] =
          etudiantLocation?.state?.etablissement_frequente!;
      } else {
        etudiant["etablissement_frequente"] = etablissementFrequente;
      }
      if (moyTrimestre1 === null) {
        etudiant["moyenne_trimestre_1"] =
          etudiantLocation?.state?.moyenne_trimestre_1!;
      } else {
        etudiant["moyenne_trimestre_1"] = moyTrimestre1;
      }
      if (moyTrimestre2 === null) {
        etudiant["moyenne_trimestre_2"] =
          etudiantLocation?.state?.moyenne_trimestre_2!;
      } else {
        etudiant["moyenne_trimestre_2"] = moyTrimestre2;
      }
      if (moyTrimestre3 === null) {
        etudiant["moyenne_trimestre_3"] =
          etudiantLocation?.state?.moyenne_trimestre_3!;
      } else {
        etudiant["moyenne_trimestre_3"] = moyTrimestre3;
      }
      if (moyenneAnnuelle === null) {
        etudiant["moyenne_annuelle"] =
          etudiantLocation?.state?.moyenne_annuelle!;
      } else {
        etudiant["moyenne_annuelle"] = moyenneAnnuelle;
      }
      if (selectedGenre === "") {
        etudiant["genre"] = etudiantLocation?.state?.genre!;
      } else {
        etudiant["genre"] = selectedGenre;
      }
      if (selectedClasse === "") {
        etudiant["classe"] = etudiantLocation?.state?.classe!;
      } else {
        etudiant["classe"] = selectedClasse;
      }
      if (selectedParent === "") {
        etudiant["parent"] = etudiantLocation?.state?.parent!;
      } else {
        etudiant["parent"] = selectedParent;
      }

      if (!etudiant.avatar_base64_string) {
        etudiant["avatar"] = etudiantLocation?.state?.avatar!;
        etudiant["avatar_base64_string"] =
          etudiantLocation?.state?.avatar_base64_string!;
        etudiant["avatar_extension"] =
          etudiantLocation?.state?.avatar_extension!;
      }

      updateEtudiant(etudiant)
        .then(() => notifySuccess())
        .then(() => setEtudiant(initialEtudiant))
        .then(() => navigate("/etudiants"));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Modifier Elève" pageTitle="Tableau de bord" />
          <Card>
            <Form onSubmit={onSubmitUpdateEtudiant}>
              <Row>
                <Col>
                  <Card>
                    <Card.Header>
                      <h5>RENSEIGNEMENTS CONCERNANT L’ÉLÈVE</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-2">
                        <div className="d-flex justify-content-center">
                          {etudiant.avatar && etudiant.avatar_base64_string ? (
                            <Image
                              src={`data:image/jpeg;base64, ${etudiant.avatar_base64_string}`}
                              alt=""
                              className="avatar-xl rounded-circle p-1 bg-body mt-n3"
                            />
                          ) : (
                            <Image
                              src={`${
                                process.env.REACT_APP_BASE_URL
                              }/etudiantFiles/${etudiantLocation?.state
                                ?.avatar!}`}
                              alt=""
                              className="avatar-xl rounded-circle p-1 bg-body mt-n3"
                            />
                          )}
                        </div>
                        <div
                          className="d-flex justify-content-center mt-n4"
                          style={{ marginLeft: "60px" }}
                        >
                          <label
                            htmlFor="avatar_base64_string"
                            className="mb-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Choisir image pour l'élève"
                          >
                            <span className="avatar-xs d-inline-block">
                              <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                <i className="bi bi-pen"></i>
                              </span>
                            </span>
                          </label>
                          <input
                            className="form-control d-none"
                            type="file"
                            name="avatar_base64_string"
                            id="avatar_base64_string"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e)}
                            style={{ width: "210px", height: "120px" }}
                          />
                        </div>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={4}>
                          <Form.Label htmlFor="etudiantFirstName">
                            Nom
                          </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Form.Control
                            type="text"
                            id="etudiantFirstName"
                            name="etudiantFirstName"
                            value={etudiantFirstName}
                            onChange={handleEtudiantFirstName}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={4}>
                          <Form.Label htmlFor="etudiantLastName">
                            Prenom
                          </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Form.Control
                            type="text"
                            id="etudiantLastName"
                            name="etudiantLastName"
                            value={etudiantLastName}
                            onChange={handleEtudiantLastName}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={4}>
                          <Form.Label htmlFor="date">
                            Date de Naissance
                          </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <span>
                            {etudiantLocation.state.date_de_naissance}
                          </span>
                          <div
                            className="d-flex justify-content-start mt-n3"
                            style={{ marginLeft: "230px" }}
                          >
                            <label
                              htmlFor="date"
                              className="mb-0"
                              data-bs-toggle="tooltip"
                              data-bs-placement="right"
                              title="Choisir Date"
                            >
                              <span
                                className="d-inline-block"
                                onClick={() =>
                                  setShowDateOfBirth(!showDateOfBirth)
                                }
                              >
                                <span className="text-success cursor-pointer">
                                  <i className="bi bi-pen fs-14"></i>
                                </span>
                              </span>
                            </label>
                          </div>
                          {showDateOfBirth && (
                            <Flatpickr
                              className="form-control flatpickr-input"
                              placeholder="Choisir Date"
                              options={{
                                dateFormat: "d M, Y",
                                locale: French,
                              }}
                              onChange={handleBirthDateChange}
                            />
                          )}
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={4}>
                          <Form.Label htmlFor="lieuNaissance">
                            Lieu de Naissance
                          </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Form.Control
                            type="text"
                            id="lieuNaissance"
                            name="lieuNaissance"
                            value={lieuNaissance}
                            onChange={handlelieuNaissance}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={4}>
                          <Form.Label htmlFor="genre">Genre : </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <div className="mb-3">
                            <span>{etudiantLocation?.state?.genre!}</span>
                            <div
                              className="d-flex justify-content-start mt-n3"
                              style={{ marginLeft: "140px" }}
                            >
                              <label
                                htmlFor="genre"
                                className="mb-0"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                title="Choisir Genre"
                              >
                                <span
                                  className="d-inline-block"
                                  onClick={() => setShowGenre(!showGenre)}
                                >
                                  <span className="text-success cursor-pointer">
                                    <i className="bi bi-pen fs-14"></i>
                                  </span>
                                </span>
                              </label>
                            </div>
                            {showGenre && (
                              <select
                                className="form-select text-muted"
                                name="genre"
                                id="genre"
                                onChange={handleSelectGenre}
                              >
                                <option value="">Choisir</option>
                                <option value="Mâle">Mâle</option>
                                <option value="Femelle">Femelle</option>
                              </select>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={4}>
                          <Form.Label htmlFor="adresse">Adresse</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Form.Control
                            type="text"
                            id="adresse"
                            name="adresse"
                            value={adresse}
                            onChange={handleAdresse}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={4}>
                          <Form.Label htmlFor="villeName">Ville</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Form.Control
                            type="text"
                            id="villeName"
                            name="villeName"
                            value={villeName}
                            onChange={handleVilleName}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={4}>
                          <Form.Label htmlFor="nationalite_eleve">
                            Nationalité
                          </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Form.Control
                            type="text"
                            id="nationalite_eleve"
                            name="nationalite_eleve"
                            value={nationalite_eleve}
                            onChange={handleNationaliteEleve}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={4}>
                          <Form.Label htmlFor="parent">Parent : </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <div className="mb-3">
                            <span>
                              {etudiantLocation?.state?.parent?.nom_parent!}{" "}
                              {etudiantLocation?.state?.parent?.prenom_parent!}
                            </span>
                            <div
                              className="d-flex justify-content-start mt-n3"
                              style={{ marginLeft: "140px" }}
                            >
                              <label
                                htmlFor="parent"
                                className="mb-0"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                title="Choisir Parent"
                              >
                                <span
                                  className="d-inline-block"
                                  onClick={() => setShowParent(!showParent)}
                                >
                                  <span className="text-success cursor-pointer">
                                    <i className="bi bi-pen fs-14"></i>
                                  </span>
                                </span>
                              </label>
                            </div>
                            {showParent && (
                              <select
                                className="form-select text-muted"
                                name="parent"
                                id="parent"
                                onChange={handleSelectParent}
                              >
                                <option value="">Choisir</option>
                                {AllParent.map((parent) => (
                                  <option
                                    value={parent._id!}
                                    key={parent?._id!}
                                  >
                                    {parent.nom_parent} {parent.prenom_parent}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      <h5>SCOLARITE ANTERIEURE</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row className="mb-4"></Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="classe">Classe : </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <div className="mb-3">
                            <span>
                              {etudiantLocation?.state?.classe?.nom_classe!}
                            </span>
                            <div
                              className="d-flex justify-content-start mt-n3"
                              style={{ marginLeft: "140px" }}
                            >
                              <label
                                htmlFor="classe"
                                className="mb-0"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                title="Choisir Classe"
                              >
                                <span
                                  className="d-inline-block"
                                  onClick={() => setShowClasse(!showClasse)}
                                >
                                  <span className="text-success cursor-pointer">
                                    <i className="bi bi-pen fs-14"></i>
                                  </span>
                                </span>
                              </label>
                            </div>
                            {showClasse && (
                              <select
                                className="form-select text-muted"
                                name="classe"
                                id="classe"
                                onChange={handleSelectClasse}
                              >
                                <option value="">Choisir</option>
                                {AllClasses.map((classe) => (
                                  <option
                                    value={classe._id!}
                                    key={classe?._id!}
                                  >
                                    {classe.nom_classe}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="anneeScolaire">
                            Année Scolaire
                          </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Control
                            type="text"
                            id="anneeScolaire"
                            name="anneeScolaire"
                            value={anneeScolaire}
                            onChange={handleAnneeScolaire}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="convocationConcours">
                            N° Convocation Concours
                          </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Control
                            type="text"
                            id="convocationConcours"
                            name="convocationConcours"
                            value={convocationConcours}
                            onChange={handleConvocationConcours}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="moyenneConcours">
                            Moyenne Concours
                          </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Control
                            type="text"
                            id="moyenneConcours"
                            name="moyenneConcours"
                            value={moyenneConcours}
                            onChange={handleMoyenneConcours}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="etablissementFrequente">
                            Etablissement Fréquenté
                          </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Control
                            type="text"
                            id="etablissementFrequente"
                            name="etablissementFrequente"
                            value={etablissementFrequente}
                            onChange={handleEtablissementFrequente}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="moyTrimestre1">
                            Moyenne 1er Trimestre
                          </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Control
                            type="text"
                            id="moyTrimestre1"
                            name="moyTrimestre1"
                            value={moyTrimestre1}
                            onChange={handleMoyTrimestre1}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="moyTrimestre2">
                            Moyenne 2ème Trimestre
                          </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Control
                            type="text"
                            id="moyTrimestre2"
                            name="moyTrimestre2"
                            value={moyTrimestre2}
                            onChange={handleMoyTrimestre2}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="moyTrimestre3">
                            Moyenne 3ème Trimestre
                          </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Control
                            type="text"
                            id="moyTrimestre3"
                            name="moyTrimestre3"
                            value={moyTrimestre3}
                            onChange={handleMoyTrimestre3}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={5}>
                          <Form.Label htmlFor="moyenneAnnuelle">
                            Moyenne Annuelle
                          </Form.Label>
                        </Col>
                        <Col lg={7}>
                          <Form.Control
                            type="text"
                            id="moyenneAnnuelle"
                            name="moyenneAnnuelle"
                            value={moyenneAnnuelle}
                            onChange={handleMoyenneAnnuelle}
                          />
                        </Col>
                      </Row>
                      <Row className="mb-4"></Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <div className="hstack gap-2 justify-content-center mb-2">
                  <Button
                    type="submit"
                    className="btn-soft-success"
                    data-bs-dismiss="modal"
                  >
                    <i className="me-1 fs-18 align-middle"></i>
                    Modifier
                  </Button>
                </div>
              </Row>
            </Form>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UpdateEtudiant;
