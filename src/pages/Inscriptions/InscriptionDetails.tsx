import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Image,
  Button,
  Dropdown,
  Container,
  Modal,
  Form,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
// import Images
import student from "assets/images/6168872.png";
import eleve from "assets/images/2995357.png";
import parent from "assets/images/2829916.png";
import img4 from "assets/images/small/img-4.jpg";
import {
  useUpdateInscriptionGroupeMutation,
  useUpdateInscriptionStatausMutation,
} from "features/inscriptions/inscriptionSlice";
import Swal from "sweetalert2";
import { useFetchClassesQuery } from "features/classes/classeSlice";

const InscriptionDetails = () => {
  document.title = " Détails Inscription | Sousse Leaders School";
  const location = useLocation();
  const navigate = useNavigate();
  const details = location.state;

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [selectedClasseToUpdateGroupe, setSelectedClasseToUpdateGroupe] =
    useState<string>("");

  const handleSelectClasseToUpdateGroupe = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSelectedClasseToUpdateGroupe(value);
  };

  const selectedClasse = details?.classe!;

  const matchedClasses = AllClasses.filter((classe) =>
    classe.nom_classe.startsWith(selectedClasse)
  );

  if (matchedClasses.length > 0) {
    console.log("Found class:", matchedClasses);
  } else {
    console.log("No class found starting with", selectedClasse);
  }

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'état de l'inscription a été modifiée avec succès",
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

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (row: any) => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [updateStatus] = useUpdateInscriptionStatausMutation();

  const handleUpdateStatus = (status: any) => {
    try {
      if (details) {
        updateStatus({ _id: details._id, status })
          .then(() => notifySuccess())
          .then(() => navigate("/inscriptions"));
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const [updateGroupe] = useUpdateInscriptionGroupeMutation();

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
    const fileUrl = `${
      process.env.REACT_APP_BASE_URL
    }/inscriptionFiles/${details?.copie_bulletin!}`;
    const fileName = "copie bulletin.pdf";

    openFileInNewTab(fileUrl, fileName);
  };

  const handleUpdateGroupe = (groupe: any, status: any) => {
    if (details) {
      updateGroupe({ _id: details._id, groupe })
        .then(() => {
          handleCloseModal();
        })
        .then(() => updateStatus({ _id: details._id, status }))
        .then(() => {
          notifySuccess();
        })
        .then(() => {
          navigate("/inscriptions");
        });
    }
  };

  return (
    <React.Fragment>
      <div className="page">
        <Container fluid>
          <Card>
            <Card className="border-0 shadow-none mb-0">
              <Card.Body
                className="rounded profile-basic"
                style={{
                  backgroundImage: `url(${img4})`,
                  backgroundSize: "cover",
                }}
              ></Card.Body>
              <Card.Body>
                <div className="mt-n5">
                  <Image
                    src={`${
                      process.env.REACT_APP_BASE_URL
                    }/inscriptionFiles/${details?.photoProfil!}`}
                    alt=""
                    className="avatar-xl rounded-circle bg-body mt-n5"
                  />
                </div>
              </Card.Body>
              <Card.Body>
                <Row className="text-end">
                  <Dropdown role="button">
                    <Dropdown.Toggle
                      as="a"
                      className="btn btn-soft-secondary btn-icon arrow-none"
                    >
                      <i className="bi bi-three-dots"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleOpenModal("Accepté")}
                        >
                          Accepter
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleUpdateStatus("Refusé")}
                        >
                          Refuser
                        </button>
                      </li>
                    </Dropdown.Menu>
                  </Dropdown>
                </Row>
                <Row className="justify-content-between">
                  <Col xl={4} className="categrory-widgets overflow-hidden">
                    <h5 className="fs-24">
                      {details?.prenom_eleve!} {details?.nom_eleve!}{" "}
                      {details?.status! === "" && (
                        <span className="badge bg-warning"> En Attente </span>
                      )}
                      {details?.status! === "Accepté" && (
                        <span className="badge bg-success"> Accepté </span>
                      )}
                      {details?.status! === "Refusé" && (
                        <span className="badge bg-danger"> Refusé </span>
                      )}
                    </h5>
                    <div className="d-flex align-items-center mb-3 text-muted">
                      <i className="bi bi-mortarboard fs-18"></i>{" "}
                      <span className="fs-16">Niveau : </span>
                      <span className="text-dark fs-18">
                        {details?.classe!}
                      </span>
                    </div>
                    {(details?.groupe! !== "" ||
                      details?.groupe! === undefined) && (
                      <div className="d-flex align-items-center mb-3 text-muted">
                        <img
                          width={18}
                          src="data:image/png;base64,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"
                        />{" "}
                        <span className="fs-16"> Groupe : </span>{" "}
                        <span className="text-dark fs-18">
                          {details?.groupe!}{" "}
                        </span>
                      </div>
                    )}
                    <div className="d-flex align-items-center mb-3 text-muted">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        className="bi bi-cake"
                        viewBox="0 0 16 16"
                      >
                        <path d="m7.994.013-.595.79a.747.747 0 0 0 .101 1.01V4H5a2 2 0 0 0-2 2v3H2a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a2 2 0 0 0-2-2h-1V6a2 2 0 0 0-2-2H8.5V1.806A.747.747 0 0 0 8.592.802zM4 6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v.414a.9.9 0 0 1-.646-.268 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0A.9.9 0 0 1 4 6.414zm0 1.414c.49 0 .98-.187 1.354-.56a.914.914 0 0 1 1.292 0c.748.747 1.96.747 2.708 0a.914.914 0 0 1 1.292 0c.374.373.864.56 1.354.56V9H4zM1 11a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.793l-.354.354a.914.914 0 0 1-1.293 0 1.914 1.914 0 0 0-2.707 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0 1.914 1.914 0 0 0-2.708 0 .914.914 0 0 1-1.292 0L1 11.793zm11.646 1.854a1.915 1.915 0 0 0 2.354.279V15H1v-1.867c.737.452 1.715.36 2.354-.28a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.708 0a.914.914 0 0 1 1.292 0c.748.748 1.96.748 2.707 0a.914.914 0 0 1 1.293 0Z" />
                      </svg>{" "}
                      <span className="text-dark fs-18">
                        {" "}
                        {details?.date_naissance!} à {details?.lieu_naissance!}{" "}
                      </span>
                    </div>
                    {details?.sexe! === "F" && (
                      <div className="d-flex align-items-center mb-3 text-muted">
                        <i className="bi bi-gender-female"></i>{" "}
                        <span className="text-dark fs-18">Femelle</span>
                      </div>
                    )}
                    {details?.sexe! === "M" && (
                      <div className="d-flex align-items-center mb-3 text-muted">
                        <i className="bi bi-gender-male fs-18"></i>{" "}
                        <span className="text-dark fs-18">Mâle</span>
                      </div>
                    )}
                    <div className="d-flex align-items-center mb-3 text-muted">
                      <i className="bi bi-geo-alt fs-18"></i>{" "}
                      <span className="text-dark fs-18">
                        {details?.adresse_eleve!}
                      </span>
                    </div>
                    <div className="d-flex align-items-center mb-3 text-muted">
                      <i className="bi bi-flag fs-18"></i>
                      <span className="text-dark fs-18">
                        {" "}
                        {details?.nationalite!}
                      </span>
                    </div>
                    <div className="d-flex align-items-center mb-3 text-muted">
                      <i className="bi bi-people fs-18"></i>
                      <span className="fs-16"> Vit Avec : </span>
                      <span className="text-dark fs-18">{details?.avec!}</span>
                    </div>
                    <img
                      src={eleve}
                      alt=""
                      className="img-fluid category-img object-fit-cover m-4"
                    />
                  </Col>
                  <Col xl={4} className="categrory-widgets overflow-hidden">
                    <div>
                      <p className="fw-bold fs-16 mb-2">
                        Année Scolaire :{" "}
                        <span className="fw-medium text-muted">
                          {details?.annee_scolaire!}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="fw-bold fs-16 mb-2">
                        Etablissement Fréquenté :{" "}
                        <span className="fw-medium text-muted">
                          {details?.etablissement_frequente!}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="fw-bold fs-16 mb-2">
                        Moyenne 1ère Trimestre :{" "}
                        <span className="fw-medium text-muted">
                          {details?.moyenne_trimestre_1!}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="fw-bold fs-16 mb-2">
                        Moyenne 2ème Trimestre :{" "}
                        <span className="fw-medium text-muted">
                          {details?.moyenne_trimestre_2!}
                        </span>
                      </p>
                    </div>
                    {details?.moyenne_trimestre_3! !== "" && (
                      <div>
                        <p className="fw-bold fs-16 mb-2">
                          Moyenne 3ème Trimestre :{" "}
                          <span className="fw-medium text-muted">
                            {details?.moyenne_trimestre_3!}
                          </span>
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="fw-bold fs-16 mb-2">
                        Moyenne Annuelle :{" "}
                        <span className="fw-medium text-muted">
                          {details?.moyenne_annuelle!}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="fw-bold fs-16 mb-2">
                        N° Convocation Concours :{" "}
                        <span className="fw-medium text-muted">
                          {details?.numero_convocation_concours!}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="fw-bold fs-16 mb-2">
                        Moyenne Concours:{" "}
                        <span className="fw-medium text-muted">
                          {details?.moyenne_concours_6!}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="fw-bold fs-16">
                        Fichier:{" "}
                        <Button variant="soft-dark" onClick={handleButtonClick}>
                          <i className="bi bi-file-earmark align-middle fs-16"></i>{" "}
                          Voir Fichier
                        </Button>
                      </p>
                    </div>
                    <img
                      src={student}
                      alt=""
                      className="img-fluid category-img object-fit-cover m-3"
                    />
                  </Col>
                  <Col xl={4} className="categrory-widgets overflow-hidden">
                    <Row>
                      <div>
                        <span className="fs-16 fw-bold">
                          Responsable Légal :{" "}
                        </span>
                        <span className="fs-14 fw-medium">
                          {details?.responsable_legal!}
                        </span>
                      </div>
                    </Row>
                    <Row>
                      <div>
                        <p className="fw-bold fs-16 mb-2">
                          Situation Familiale :{" "}
                          <span className="fw-medium text-muted">
                            {details?.situation_familiale!}
                          </span>
                        </p>
                      </div>
                    </Row>
                    <Row>
                      <div>
                        <p className="fw-bold fs-16 mb-2">
                          Nom et prénom :{" "}
                          <span className="fw-medium text-muted">
                            {details?.nom_parent} {details?.prenom_parent!}
                          </span>
                        </p>
                      </div>
                    </Row>
                    <Row>
                      <div>
                        <p className="fw-bold fs-16 mb-2">
                          <i className="bi bi-telephone"></i> N° de Téléphone :{" "}
                          <span className="fw-medium text-muted">
                            {details?.phone!}
                          </span>
                        </p>
                      </div>
                    </Row>
                    <Row>
                      <div>
                        <p className="fw-bold fs-16 mb-2">
                          <i className="bi bi-geo-alt"></i> Adresse :{" "}
                          <span className="fw-medium text-muted">
                            {details?.adresse_parent!}
                          </span>
                        </p>
                      </div>
                    </Row>
                    <Row>
                      <div>
                        <p className="fw-bold fs-16 mb-2">
                          <i className="bi bi-briefcase"></i> Profession :{" "}
                          <span className="fw-medium text-muted">
                            {details?.profession!}
                          </span>
                        </p>
                      </div>
                    </Row>
                    <Row>
                      <div>
                        <p className="fw-bold fs-16 mb-2">
                          <i className="bi bi-building"></i> Nom Etablissement :{" "}
                          <span className="fw-medium text-muted">
                            {details?.nom_societe!}
                          </span>
                        </p>
                      </div>
                    </Row>
                    <img
                      src={parent}
                      alt=""
                      className="img-fluid category-img object-fit-cover m-3 p-1"
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Card>
          {details.notes && details.notes !== "" && (
            <Row className="justify-content-end">
              <Col lg={6}>
                <div className="alert alert-borderless alert-info" role="alert">
                  <strong>{details.notes}</strong>
                </div>
              </Col>
            </Row>
          )}
          <Modal
            className="fade"
            id="createModal"
            show={showModal}
            onHide={() => {
              handleCloseModal();
            }}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Etat d'inscription
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col lg={4}>
                  <Form.Label htmlFor="classe" className="fw-bold fs-16">
                    Niveau : <span>{details?.classe!}</span>
                  </Form.Label>
                </Col>
                <Col lg={7}>
                  {matchedClasses?.map((classe) => (
                    <div key={classe?._id!} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="classe"
                        id={`classe-${classe?._id}`}
                        value={classe?.nom_classe!}
                        checked={
                          selectedClasseToUpdateGroupe === classe?.nom_classe
                        }
                        onChange={handleSelectClasseToUpdateGroupe}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`classe-${classe?._id}`}
                      >
                        {classe?.nom_classe!}
                      </label>
                    </div>
                  ))}
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                onClick={() =>
                  handleUpdateGroupe(selectedClasseToUpdateGroupe, "Accepté")
                }
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

export default InscriptionDetails;
