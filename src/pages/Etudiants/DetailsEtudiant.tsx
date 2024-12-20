import React, { useEffect } from "react";
import {
  Container,
  Card,
  Col,
  Image,
  Row,
  Button,
  Tab,
  Nav,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import student from "assets/images/6168872.png";
import eleve from "assets/images/2995357.png";
import { useGetAbsencesByEleveIdMutation } from "features/absences/absenceSlice";
import DataTable from "react-data-table-component";
import { useGetDisciplinesByEleveIdMutation } from "features/disciplines/disciplineSlice";

const DetailsEtudiant = () => {
  const etudiantLocation = useLocation();

  const [fetchAbsenceByEleveId, { data: fetchedEtudiants }] =
    useGetAbsencesByEleveIdMutation();

  const [fetchDisciplineByEleveId, { data: fetchedEtudiantsDiscipline }] =
    useGetDisciplinesByEleveIdMutation();

  useEffect(() => {
    if (etudiantLocation?.state?._id) {
      fetchAbsenceByEleveId(etudiantLocation.state._id)
        .unwrap()
        .then((result) => {
          result.forEach((absence) => {
            const eleveData = absence.eleves.find(
              (eleve: any) => eleve.eleve._id === etudiantLocation.state._id
            );
            if (eleveData) {
              console.log(`Type of absence for eleve: ${eleveData.typeAbsent}`);
            } else {
              console.log("No absence data found for the current eleve");
            }
          });
        })
        .catch((error) => {
          console.error("Error fetching absence data:", error);
        });
    }
  }, [etudiantLocation?.state?._id]);

  useEffect(() => {
    if (etudiantLocation?.state?._id) {
      fetchDisciplineByEleveId(etudiantLocation.state._id)
        .unwrap()
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error("Error fetching absence data:", error);
        });
    }
  }, [etudiantLocation?.state?._id]);

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row: any) => {
        const eleveData = row.eleves.find(
          (eleve: any) => eleve.eleve._id === etudiantLocation.state._id
        );
        return eleveData.typeAbsent === "R" ? (
          <span className="badge badge-soft-warning">Retard</span>
        ) : eleveData.typeAbsent === "A" ? (
          <span className="badge badge-soft-danger">Absent</span>
        ) : (
          <span className="badge badge-soft-info">Présent</span>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.date,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Heure</span>,
      selector: (row: any) => row.heure,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Matière</span>,
      selector: (row: any) => row.matiere,
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
  ];

  const columnsDiscipline = [
    {
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row: any) => row.type,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date de création</span>,
      selector: (row: any) => row.date,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Editeur</span>,
      selector: (row: any) => row.editeur,
      sortable: true,
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <Tab.Container defaultActiveKey="bottomtabs-profile">
              <Card.Header className="bg-transparent border-bottom">
                <Nav
                  as="ul"
                  variant="pills"
                  className="nav-justified card-footer-tabs fs-17"
                  role="tablist"
                >
                  <Nav.Item as="li">
                    <Nav.Link eventKey="bottomtabs-profile">
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="ri-user-2-line"></i> <span>Profile</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="bottomtabs-home">
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="ri-file-user-line"></i>{" "}
                        <span>Absence</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link eventKey="bottomtabs-messages">
                      <div className="d-flex align-items-center justify-content-center">
                        <i className="ri-mail-line"></i> <span>Discipline</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content className="text-muted">
                  <Tab.Pane eventKey="bottomtabs-profile">
                    <Row>
                      <div className="mb-5">
                        <Image
                          src={`${
                            process.env.REACT_APP_BASE_URL
                          }/etudiantFiles/${etudiantLocation?.state?.avatar!}`}
                          alt=""
                          className="avatar-xl rounded-circle bg-body m-1"
                        />{" "}
                      </div>
                    </Row>
                    <h5 className="fs-24">
                      {etudiantLocation?.state?.prenom!}{" "}
                      {etudiantLocation?.state?.nom!}{" "}
                      {etudiantLocation?.state?.genre === "Femelle" && (
                        <i className="bi bi-gender-female me-2 text-danger"></i>
                      )}
                      {etudiantLocation?.state?.genre === "Mâle" && (
                        <i className="bi bi-gender-male me-2 text-primary"></i>
                      )}
                    </h5>
                    <Row>
                      <Col xl={5} className="categrory-widgets overflow-hidden">
                        <div className="d-flex align-items-center mb-3 text-muted">
                          <i className="bi bi-mortarboard fs-18"></i>{" "}
                          <span className="fw-bold fs-16">Classe : </span>
                          <span className="text-dark fs-18">
                            {etudiantLocation?.state?.classe?.nom_classe!}
                          </span>
                        </div>
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
                            {etudiantLocation?.state?.date_de_naissance!} à{" "}
                            {etudiantLocation?.state?.lieu_naissance!}{" "}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-3 text-muted">
                          <i className="bi bi-geo-alt fs-18"></i>{" "}
                          <span className="text-dark fs-18">
                            {etudiantLocation?.state?.adresse_eleve!}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-3 text-muted">
                          <i className="bi bi-flag fs-18"></i>
                          <span className="text-dark fs-18">
                            {" "}
                            {etudiantLocation?.state?.nationalite!}
                          </span>
                        </div>
                        <img
                          src={eleve}
                          alt=""
                          className="img-fluid category-img object-fit-cover m-4"
                        />
                      </Col>
                      <Col></Col>
                      <Col xl={6} className="categrory-widgets overflow-hidden">
                        <div>
                          <p className="fw-bold fs-16 mb-2">
                            Année Scolaire :{" "}
                            <span className="fw-medium text-muted">
                              {etudiantLocation?.state?.annee_scolaire!}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="fw-bold fs-16 mb-2">
                            Etablissement Fréquenté :{" "}
                            <span className="fw-medium text-muted">
                              {
                                etudiantLocation?.state
                                  ?.etablissement_frequente!
                              }
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="fw-bold fs-16 mb-2">
                            Moyenne 1ère Trimestre :{" "}
                            <span className="fw-medium text-muted">
                              {etudiantLocation?.state?.moyenne_trimestre_1!}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="fw-bold fs-16 mb-2">
                            Moyenne 2ème Trimestre :{" "}
                            <span className="fw-medium text-muted">
                              {etudiantLocation?.state?.moyenne_trimestre_2!}
                            </span>
                          </p>
                        </div>
                        {etudiantLocation?.state?.moyenne_trimestre_3! !==
                          "" && (
                          <div>
                            <p className="fw-bold fs-16 mb-2">
                              Moyenne 3ème Trimestre :{" "}
                              <span className="fw-medium text-muted">
                                {etudiantLocation?.state?.moyenne_trimestre_3!}
                              </span>
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="fw-bold fs-16 mb-2">
                            Moyenne Annuelle :{" "}
                            <span className="fw-medium text-muted">
                              {etudiantLocation?.state?.moyenne_annuelle!}
                            </span>
                          </p>
                        </div>

                        <div>
                          <p className="fw-bold fs-16 mb-2">
                            N° Convocation Concours :{" "}
                            <span className="fw-medium text-muted">
                              {
                                etudiantLocation?.state
                                  ?.numero_convocation_concours!
                              }
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="fw-bold fs-16 mb-2">
                            Moyenne Concours:{" "}
                            <span className="fw-medium text-muted">
                              {etudiantLocation?.state?.moyenne_concours_6!}
                            </span>
                          </p>
                        </div>
                        <img
                          src={student}
                          alt=""
                          className="img-fluid category-img object-fit-cover m-3"
                        />
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="bottomtabs-home">
                    <DataTable
                      columns={columns}
                      data={fetchedEtudiants}
                      pagination
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="bottomtabs-messages">
                    <DataTable
                      columns={columnsDiscipline}
                      data={fetchedEtudiantsDiscipline}
                      pagination
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Tab.Container>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default DetailsEtudiant;
