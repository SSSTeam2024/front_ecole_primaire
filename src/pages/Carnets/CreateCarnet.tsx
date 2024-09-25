import React, { useState } from "react";
import { Container, Row, Card, Col, Form, Button } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import { useFetchEtudiantsByClasseIdMutation } from "features/etudiants/etudiantSlice";
import { Carnet, useAddCarnetMutation } from "features/carnets/carnetSlice";
import { convertToBase64 } from "helpers/base64_convert";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useNavigate } from "react-router-dom";

interface StudentFileData {
  fichier: string;
  fichier_base64_string: string;
  fichier_extension: string;
}

const CreateCarnet = () => {
  const { data: AllClasse = [] } = useFetchClassesQuery();

  const [studentNotes, setStudentNotes] = useState<{ [key: string]: string }>(
    {}
  );

  const [studentFiles, setStudentFiles] = useState<{
    [key: string]: StudentFileData;
  }>({});

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const [fetchEtudiantsByClasseId, { data: fetchedEtudiants }] =
    useFetchEtudiantsByClasseIdMutation();

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);

  const handleSelectClasse = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const result = await fetchEtudiantsByClasseId(value).unwrap();
    setStudents(result);
    setSelectedClasse(value);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le bulletin a été créé avec succès",
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

  const [selectedTrimestre, setSelectedTrimestre] = useState<string>("");

  const handleSelectTrimestre = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedTrimestre(value);
  };

  const [createCarnet] = useAddCarnetMutation();

  const initialCarnet: Carnet = {
    classe: "",
    trimestre: "",
    date: "",
    eleves: [],
  };

  const [carnet, setCarnet] = useState(initialCarnet);

  const { classe, trimestre, date, eleves } = carnet;

  const handleStudentNoteChange = (e: any, studentId: string) => {
    const { value } = e.target;
    setStudentNotes((prevState) => ({
      ...prevState,
      [studentId]: value,
    }));
  };

  const handleFileUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
    studentId: string
  ) => {
    const target = event.target;
    if (target && target.files && target.files[0]) {
      const file = target.files[0];
      const { base64Data, extension } = await convertToBase64(file);

      setStudentFiles((prevState) => ({
        ...prevState,
        [studentId]: {
          fichier: base64Data + "." + extension,
          fichier_base64_string: base64Data,
          fichier_extension: extension,
        },
      }));
    }
  };

  const navigate = useNavigate();
  function tog_AllBulletins() {
    navigate("/bulletins");
  }
  const onSubmitCarnet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const elevesWithNotes = students.map((eleve) => ({
        eleve: eleve._id,
        note: studentNotes[eleve._id] || "",
        fichier: studentFiles[eleve._id].fichier || "",
        fichier_base64_string:
          studentFiles[eleve._id].fichier_base64_string || "",
        fichier_extension: studentFiles[eleve._id].fichier_extension || "",
      }));

      const bulletineData = {
        ...carnet,
        classe: selectedClasse,
        eleves: elevesWithNotes,
        date: formatDate(selectedDate),
        trimestre: selectedTrimestre,
      };

      createCarnet(bulletineData)
        .then(() => notifySuccess())
        .then(() => setCarnet(initialCarnet));
      tog_AllBulletins();
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Ajouter Bulletin" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Body>
                <Form className="create-form" onSubmit={onSubmitCarnet}>
                  <Row>
                    <Col lg={4}>
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
                            {AllClasse.map((classe) => (
                              <option value={classe?._id!} key={classe?._id!}>
                                {classe.nom_classe}
                              </option>
                            ))}
                          </select>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="description">
                            Trimestre
                          </Form.Label>
                        </Col>
                        <Col lg={8}>
                          <select
                            className="form-select text-muted"
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
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col lg={3}>
                          <Form.Label htmlFor="date">Date</Form.Label>
                        </Col>
                        <Col lg={8}>
                          <Flatpickr
                            className="form-control flatpickr-input"
                            placeholder="Date création"
                            onChange={handleDateChange}
                            options={{
                              dateFormat: "d M, Y",
                              locale: French,
                            }}
                            id="date"
                            name="date"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={8}>
                      <Row>
                        <Col lg={3}>
                          <Form.Label>Elève</Form.Label>
                        </Col>
                        <Col lg={3}>
                          <Form.Label>Note</Form.Label>
                        </Col>
                        <Col lg={6}>
                          <Form.Label>Fichier</Form.Label>
                        </Col>
                      </Row>
                      {students.map((eleve) => (
                        <Row key={eleve._id}>
                          <Col lg={3} className="mb-1">
                            {eleve.prenom} {eleve.nom}
                          </Col>
                          <Col lg={3} className="mb-1">
                            <Form.Control
                              type="text"
                              value={studentNotes[eleve._id] || ""}
                              onChange={(e) =>
                                handleStudentNoteChange(e, eleve._id)
                              }
                            />
                          </Col>
                          <Col lg={6}>
                            <input
                              className="form-control mb-2"
                              type="file"
                              id="fichier_base64_string"
                              name="fichier_base64_string"
                              onChange={(e) =>
                                handleFileUploadFile(e, eleve._id)
                              }
                            />
                          </Col>
                        </Row>
                      ))}
                    </Col>
                  </Row>
                  <Row>
                    <div className="hstack gap-2 justify-content-end">
                      <Button type="submit" variant="success" id="addNew">
                        Ajouter
                      </Button>
                    </div>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default CreateCarnet;
