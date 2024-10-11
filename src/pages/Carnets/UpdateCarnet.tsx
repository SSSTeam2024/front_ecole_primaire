import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import { useFetchEtudiantsByClasseIdMutation } from "features/etudiants/etudiantSlice";
import {
  Carnet,
  useAddCarnetMutation,
  useUpdateCarnetMutation,
} from "features/carnets/carnetSlice";
import { convertToBase64 } from "helpers/base64_convert";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateCarnet = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le bulletin a été modifié avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const { _id, classe, trimestre, date, eleves } = location.state;

  const [elevesData, setElevesData] = useState(eleves);
  const [updateCarnet] = useUpdateCarnetMutation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newFileString = `${base64Data}.${extension}`;
      const updatedEleves = [...elevesData];
      updatedEleves[index] = {
        ...updatedEleves[index],
        fichier: newFileString,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      };
      setElevesData(updatedEleves);
    }
  };

  const handleSubmit = async () => {
    try {
      const updateData = {
        classe,
        trimestre: selectedTrimestre || trimestre,
        date: formatDate(selectedDate) || date,
        eleves: elevesData,
      };
      await updateCarnet({ _id, updateData, eleves: elevesData });
      notifySuccess();
      navigate("/bulletins");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Modifier Bulletin" pageTitle="Tableau de bord" />
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
                      <Col>
                        {" "}
                        <Form.Label htmlFor="bulletins" className="fw-bold">
                          Bulletins:{" "}
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
                        <Col className="d-flex align-items-center">
                          <Image
                            src={`${process.env.REACT_APP_BASE_URL}/carnetFiles/${eleve.fichier}`}
                            className="rounded"
                            width="70"
                            alt="Bulletin élève"
                          />
                          <div className="ms-3 d-flex flex-column">
                            <div className="d-flex align-items-center">
                              <i
                                className="ph ph-pencil-simple-line"
                                style={{
                                  cursor: "pointer",
                                  color: "blue",
                                  marginRight: "10px",
                                }}
                                onClick={() => {
                                  const fileInput = document.getElementById(
                                    `fileInput-${index}`
                                  );
                                  if (fileInput) {
                                    (fileInput as HTMLInputElement).click();
                                  }
                                }}
                              >
                                <input
                                  type="file"
                                  id={`fileInput-${index}`}
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    if (
                                      e.target.files &&
                                      e.target.files.length > 0
                                    ) {
                                      handleFileUpload(e, index); // Pass index to know which student is being updated
                                    }
                                  }}
                                />
                              </i>
                            </div>
                          </div>
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
export default UpdateCarnet;
