import React, { useState } from "react";
import { Container, Row, Card, Col, Form, Button } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate, formatTime } from "helpers/data_time_format";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateAbsenceMutation } from "features/absences/absenceSlice";

const UpdateAbsence = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'absence a été modifié avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const { _id, classe, matiere, enseignant, heure, date, trimestre, eleves } =
    location.state;

  const [elevesData, setElevesData] = useState(eleves);
  const [updateAbsence] = useUpdateAbsenceMutation();

  const [showHeure, setShowHeure] = useState<boolean>(false);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [showType, setShowType] = useState<boolean[]>([]);
  const [showTrimestre, setShowTrimestre] = useState<boolean>(false);

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHeure, setSelectedHeure] = useState<Date | null>(null);

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const handleHeureChange = (selectedDates: Date[]) => {
    setSelectedHeure(selectedDates[0]);
  };

  const handleAbsenceChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const updatedEleves = [...elevesData];
    updatedEleves[index].typeAbsent = event.target.value;
    setElevesData(updatedEleves);
  };

  const toggleShowType = (index: number) => {
    setShowType((prevShowType) => {
      const updatedShowType = [...prevShowType];
      updatedShowType[index] = !updatedShowType[index]; // Toggle for specific index
      return updatedShowType;
    });
  };

  const handleSubmit = async () => {
    try {
      const updateData = {
        classe,
        trimestre: selectedTrimestre || trimestre,
        date: formatDate(selectedDate) || date,
        eleves: elevesData,
        matiere,
        enseignant,
        heur: formatTime(selectedHeure) || heure,
      };
      await updateAbsence({ _id, updateData, eleves: elevesData });
      notifySuccess();
      navigate("/absence");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Modifier Absence" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Body>
                <Row>
                  <Col lg={4}>
                    <Row>
                      <Col lg={3}>
                        <Form.Label>Classe: </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <span className="fw-bold">{classe?.nom_classe!}</span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={3}>
                        <Form.Label>Enseignant: </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <span className="fw-bold">
                          {enseignant?.prenom_enseignant!}{" "}
                          {enseignant?.nom_enseignant!}
                        </span>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col lg={3}>
                        <Form.Label htmlFor="matiere">Matière: </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <span className="fw-bold">{matiere}</span>
                      </Col>
                    </Row>
                    <Row className="mb-4">
                      <Col lg={3}>
                        <Form.Label htmlFor="heure">Heure: </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <span className="fw-bold">{heure}</span>
                        <div
                          className="d-flex justify-content-start mt-n2"
                          style={{ marginLeft: "50px" }}
                        >
                          <label
                            htmlFor="trimestre"
                            className="mb-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Choisir Heure"
                          >
                            <span
                              className="d-inline-block"
                              onClick={() => setShowHeure(!showHeure)}
                            >
                              <span className="text-success cursor-pointer">
                                <i className="bi bi-pen fs-14"></i>
                              </span>
                            </span>
                          </label>
                        </div>
                        {showHeure && (
                          <Flatpickr
                            className="form-control"
                            options={{
                              enableTime: true,
                              noCalendar: true,
                              dateFormat: "H:i",
                              time_24hr: true,
                            }}
                            onChange={handleHeureChange}
                          />
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={3}>
                        <Form.Label htmlFor="date">Date: </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <span className="fw-bold">{date}</span>
                        <div
                          className="d-flex justify-content-start mt-n2"
                          style={{ marginLeft: "80px" }}
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
                              onClick={() => setShowDate(!showDate)}
                            >
                              <span className="text-success cursor-pointer">
                                <i className="bi bi-pen fs-14"></i>
                              </span>
                            </span>
                          </label>
                        </div>
                        {showDate && (
                          <Flatpickr
                            className="form-control flatpickr-input mb-3"
                            placeholder="Choisir Date"
                            options={{
                              dateFormat: "d M, Y",
                              locale: French,
                            }}
                            onChange={handleDateChange}
                          />
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={3}>
                        <Form.Label>Trimestre: </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <span className="fw-bold">{trimestre}</span>
                        <div
                          className="d-flex justify-content-start mt-n2"
                          style={{ marginLeft: "100px" }}
                        >
                          <label
                            htmlFor="trimestre"
                            className="mb-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Choisir Trimestre"
                          >
                            <span
                              className="d-inline-block"
                              onClick={() => setShowTrimestre(!showTrimestre)}
                            >
                              <span className="text-success cursor-pointer">
                                <i className="bi bi-pen fs-14"></i>
                              </span>
                            </span>
                          </label>
                        </div>
                        {showTrimestre && (
                          <select
                            className="form-select text-muted mb-3"
                            name="trimestre"
                            id="trimestre"
                            onChange={handleSelectTrimestre}
                          >
                            <option value="">Choisir</option>
                            <option value="1er trimestre">1er trimestre</option>
                            <option value="2ème trimestre">
                              2ème trimestre
                            </option>
                            <option value="3ème trimestre">
                              3ème trimestre
                            </option>
                          </select>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row>
                      <Col>
                        {" "}
                        <Form.Label htmlFor="elèves" className="fw-bold">
                          Elèves
                        </Form.Label>
                      </Col>
                      <Col>
                        {" "}
                        <Form.Label htmlFor="notes" className="fw-bold">
                          Type:{" "}
                        </Form.Label>
                      </Col>
                    </Row>
                    {elevesData.map((eleve: any, index: number) => (
                      <Row className="mb-4">
                        <Col>
                          <h6>
                            {eleve.eleve.prenom} {eleve.eleve.nom}
                          </h6>
                        </Col>
                        <Col>
                          <span className="fw-bold">{eleve.typeAbsent}</span>
                          <div
                            className="d-flex justify-content-start mt-n2"
                            style={{ marginLeft: "30px" }}
                          >
                            <label
                              htmlFor={`type-${index}`}
                              className="mb-0"
                              data-bs-toggle="tooltip"
                              data-bs-placement="right"
                              title="Choisir Absence"
                            >
                              <span
                                className="d-inline-block"
                                onClick={() => toggleShowType(index)}
                              >
                                <span className="text-success cursor-pointer">
                                  <i className="bi bi-pen fs-14"></i>
                                </span>
                              </span>
                            </label>
                          </div>
                          {showType[index] && (
                            <select
                              className="form-select text-muted mb-3"
                              name={`type-${index}`}
                              id={`type-${index}`}
                              onChange={(e) => handleAbsenceChange(index, e)}
                            >
                              <option value="">Choisir</option>
                              <option value="P">Présent(e)</option>
                              <option value="A">Absent(e)</option>
                              <option value="R">Retard</option>
                            </select>
                          )}
                        </Col>
                      </Row>
                    ))}
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Button
                      type="submit"
                      variant="success"
                      id="UpdateCarnet"
                      onClick={handleSubmit}
                    >
                      Modifier
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default UpdateAbsence;
