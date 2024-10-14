import React, { useEffect, useState } from "react";
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

function getMimeType(extension: any) {
  switch (extension.toLowerCase()) {
    case "txt":
      return "text/plain";
    case "csv":
      return "text/csv";
    case "pdf":
      return "application/pdf";
    case "doc":
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "application/octet-stream";
  }
}

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

  const [elevesData, setElevesData] = useState(
    eleves.map((eleve: any) => ({
      ...eleve,
      fichier: eleve.fichier || "",
      fichier_base64_string: eleve.fichier_base64_string || "",
      fichier_extension: eleve.fichier_extension || "",
    }))
  );
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
      try {
        const { base64Data, extension } = await convertToBase64(file);

        if (!base64Data || !extension) {
          throw new Error("File conversion failed");
        }

        const newFileString = `${base64Data}.${extension}`;

        setElevesData((prevElevesData: any) =>
          prevElevesData.map((eleve: any, eleveIndex: number) => {
            if (eleveIndex === index) {
              return {
                ...eleve,
                fichier: newFileString,
                fichier_base64_string: base64Data,
                fichier_extension: extension,
              };
            } else {
              return {
                ...eleve,
                fichier: eleve.fichier || "",
                fichier_base64_string: eleve.fichier_base64_string || "",
                fichier_extension: eleve.fichier_extension || "",
              };
            }
          })
        );
      } catch (error) {
        console.error("Error handling file upload:", error);
      }
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

  const handleOpenFile = (eleve: any) => {
    const fileURL = `data:${getMimeType(eleve.fichier_extension)};base64,${
      eleve.fichier_base64_string
    }`;
    window.open(fileURL, "_system");
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
                          {eleve.fichier && eleve.fichier_extension ? (
                            <>
                              {["jpeg", "jpg", "png", "gif", "bmp"].includes(
                                eleve.fichier_extension.toLowerCase()
                              ) ? (
                                <Image
                                  src={`data:image/${eleve.fichier_extension};base64, ${eleve.fichier_base64_string}`}
                                  alt="Bulletin élève"
                                  className="rounded"
                                  width="70"
                                />
                              ) : (
                                <a>
                                  {eleve.fichier_extension === "pdf" && (
                                    <i className="bi bi-filetype-pdf text-danger fs-22"></i>
                                  )}
                                  {["doc", "docx"].includes(
                                    eleve.fichier_extension
                                  ) && (
                                    <i className="bi bi-file-earmark-word text-primary fs-22"></i>
                                  )}
                                  {["xls", "xlsx"].includes(
                                    eleve.fichier_extension
                                  ) && (
                                    <i className="bi bi-file-earmark-excel text-success fs-22"></i>
                                  )}
                                  {["ppt", "pptx"].includes(
                                    eleve.fichier_extension
                                  ) && (
                                    <i className="bi bi-file-earmark-ppt text-warning fs-22"></i>
                                  )}
                                  {![
                                    "pdf",
                                    "doc",
                                    "docx",
                                    "xls",
                                    "xlsx",
                                    "ppt",
                                    "pptx",
                                  ].includes(eleve.fichier_extension) && (
                                    <i className="bi bi-file-earmark fs-22"></i>
                                  )}
                                </a>
                              )}
                            </>
                          ) : (
                            <Image
                              src={`${process.env.REACT_APP_BASE_URL}/carnetFiles/${eleve.fichier}`}
                              className="rounded"
                              width="70"
                              alt="Bulletin élève"
                            />
                          )}
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
                                      handleFileUpload(e, index);
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
