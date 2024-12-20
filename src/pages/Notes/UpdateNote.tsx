import React, { useState } from "react";
import { Container, Row, Card, Col, Form, Button } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdateNoteMutation } from "features/notes/noteSlice";

const UpdateNote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le note a été modifié avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const { _id, classe, trimestre, date, eleves, matiere, type } =
    location.state;

  const [elevesData, setElevesData] = useState(eleves);
  const [updateNote] = useUpdateNoteMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const [selectedType, setSelectedType] = useState<string>("");
  const [showType, setShowType] = useState<boolean>(false);
  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value);
  };

  const [showDate, setShowDate] = useState<boolean>(false);
  const [showTrimestre, setShowTrimestre] = useState<boolean>(false);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };
  const handleNoteChange = (index: number, value: string) => {
    const updatedEleves = [...elevesData];
    updatedEleves[index].note = value;
    setElevesData(updatedEleves);
  };

  const handleSubmit = async () => {
    try {
      const updateData = {
        classe,
        trimestre: selectedTrimestre || trimestre,
        date: formatDate(selectedDate) || date,
        eleves: elevesData,
        matiere,
        type: selectedType || type,
      };
      await updateNote({ _id, updateData, eleves: elevesData });
      notifySuccess();
      navigate("/notes");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Modifier Note" pageTitle="Tableau de bord" />
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
                        <Form.Label htmlFor="type">Type: </Form.Label>
                      </Col>
                      <Col lg={8}>
                        <span className="fw-bold">{type}</span>
                        <div
                          className="d-flex justify-content-start mt-n2"
                          style={{ marginLeft: "70px" }}
                        >
                          <label
                            htmlFor="trimestre"
                            className="mb-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Choisir Type"
                          >
                            <span
                              className="d-inline-block"
                              onClick={() => setShowType(!showType)}
                            >
                              <span className="text-success cursor-pointer">
                                <i className="bi bi-pen fs-14"></i>
                              </span>
                            </span>
                          </label>
                        </div>
                        {showType && (
                          <select
                            className="form-select text-muted"
                            name="type"
                            id="type"
                            onChange={handleSelectType}
                          >
                            <option value="">Choisir</option>
                            <option value="Contrôle">Contrôle</option>
                            <option value="Synthèse">Synthèse</option>
                          </select>
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
                          Notes:{" "}
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
                          <input
                            type="text"
                            value={eleve.note}
                            onChange={(e) =>
                              handleNoteChange(index, e.target.value)
                            }
                          />
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
export default UpdateNote;
