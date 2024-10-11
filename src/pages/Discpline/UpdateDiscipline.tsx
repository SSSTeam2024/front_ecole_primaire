import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";
import { useFetchEtudiantsByClasseIdMutation } from "features/etudiants/etudiantSlice";
import { useUpdateDisciplineMutation } from "features/disciplines/disciplineSlice";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";

interface ChildProps {
  modal_UpdateDiscipline: boolean;
  setmodal_UpdateDiscipline: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateDiscipline: React.FC<ChildProps> = ({
  modal_UpdateDiscipline,
  setmodal_UpdateDiscipline,
}) => {
  const customStyles = {
    control: (styles: any, { isFocused }: any) => ({
      ...styles,
      minHeight: "41px",
      borderColor: isFocused ? "#4b93ff" : "#e9ebec",
      boxShadow: isFocused ? "0 0 0 1px #4b93ff" : styles.boxShadow,
      ":hover": {
        borderColor: "#4b93ff",
      },
    }),
    multiValue: (styles: any, { data }: any) => {
      return {
        ...styles,
        backgroundColor: "#4b93ff",
      };
    },
    multiValueLabel: (styles: any, { data }: any) => ({
      ...styles,
      backgroundColor: "#4b93ff",
      color: "white",
    }),
    multiValueRemove: (styles: any, { data }: any) => ({
      ...styles,
      color: "white",
      backgroundColor: "#4b93ff",
      ":hover": {
        backgroundColor: "#4b93ff",
        color: "white",
      },
    }),
  };

  const location = useLocation();
  const disciplineLocation = location.state;
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const [desciplineDesc, setDesciplineDesc] = useState<string>(
    disciplineLocation?.texte ?? ""
  );

  const handleDesciplineDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDesciplineDesc(e.target.value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [showPar, setShowPar] = useState<boolean>(false);
  const [showType, setShowType] = useState<boolean>(false);
  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const [fetchEtudiantsByClasseId, { data: fetchedEtudiants }] =
    useFetchEtudiantsByClasseIdMutation();

  useEffect(() => {
    if (disciplineLocation?.classe) {
      fetchEtudiantsByClasseId(disciplineLocation.classe);
    }
  }, [disciplineLocation, fetchEtudiantsByClasseId]);

  const existingEleve = disciplineLocation?.eleve || [];

  const defaultFilsOptions =
    disciplineLocation?.eleve?.map((item: any) => ({
      label: `${item.prenom} ${item.nom}`,
      value: item?._id!,
    })) || [];

  const optionColumnsTable = fetchedEtudiants?.map((eleve: any) => ({
    value: eleve?._id!,
    label: `${eleve.prenom} ${eleve.nom}`,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState(
    existingEleve.map((fil: any) => fil?._id!)
  );

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const [selectedType, setSelectedType] = useState<string>("");

  const handleSelectType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedType(value);
  };

  const [selectedPar, setSelectedPar] = useState<string>("");

  const handleSelectPar = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPar(value);
  };

  const [updateDiscipiline] = useUpdateDisciplineMutation();

  const initialDisicpiline = {
    _id: "",
    eleve: [""],
    type: "",
    texte: "",
    editeur: "",
    date: "",
    classe: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [discipline, setDiscipline] = useState(initialDisicpiline);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_discipline = base64Data + "." + extension;
      setDiscipline({
        ...discipline,
        fichier: file_discipline,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le discipiline a été mis à jour avec succès",
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

  console.log(selectedColumnValues);
  const onSubmitDiscipline = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      discipline["_id"] = disciplineLocation?._id!;

      if (desciplineDesc === "") {
        discipline["texte"] = disciplineLocation?.texte!;
      } else {
        discipline["texte"] = desciplineDesc;
      }
      discipline["classe"] = disciplineLocation?.classe!;
      if (selectedColumnValues === "") {
        discipline["eleve"] = disciplineLocation?.eleve!;
      } else {
        discipline["eleve"] = selectedColumnValues;
      }

      if (selectedDate === null) {
        discipline["date"] = disciplineLocation?.date!;
      } else {
        discipline["date"] = formatDate(selectedDate);
      }

      if (selectedPar === "") {
        discipline["editeur"] = disciplineLocation?.editeur!;
      } else {
        discipline["editeur"] = selectedPar;
      }

      if (selectedType === "") {
        discipline["type"] = disciplineLocation?.type!;
      } else {
        discipline["type"] = selectedType;
      }

      if (!discipline.fichier_base64_string) {
        discipline["fichier"] = disciplineLocation?.fichier!;
        discipline["fichier_base64_string"] =
          disciplineLocation?.fichier_base64_string!;
        discipline["fichier_extension"] =
          disciplineLocation?.fichier_extension!;
      }

      updateDiscipiline(discipline)
        .then(() => notifySuccess())
        .then(() => setDiscipline(initialDisicpiline));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitDiscipline}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="classes">Eleve(s) </Form.Label>
          </Col>
          <Col lg={8}>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={optionColumnsTable}
              onChange={handleSelectValueColumnChange}
              defaultValue={defaultFilsOptions}
              styles={customStyles}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="desciplineDesc">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="desciplineDesc"
              name="desciplineDesc"
              value={desciplineDesc}
              onChange={handleDesciplineDesc}
              rows={3}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="par">Editeur</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{disciplineLocation.editeur}</span>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "160px" }}
            >
              <label
                htmlFor="par"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir Editeur"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowPar(!showPar)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showPar && (
              <select
                className="form-select text-muted"
                name="par"
                id="par"
                onChange={handleSelectPar}
              >
                <option value="">Select</option>
                <option value="Administration">Administration</option>
                {AllEnseignants.map((enseignant: any) => (
                  <option
                    value={`${enseignant.nom_enseignant} ${enseignant.prenom_enseignant}`}
                    key={enseignant?._id!}
                  >
                    {enseignant.nom_enseignant} {enseignant.prenom_enseignant}
                  </option>
                ))}
              </select>
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="type">Type</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{disciplineLocation.type}</span>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "80px" }}
            >
              <label
                htmlFor="type"
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
                {/* <option value="Honneur">Honneur</option> */}
                <option value="Leçon">Leçon</option>
                <option value="Exclu">Exclu</option>
              </select>
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{disciplineLocation.date}</span>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "75px" }}
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
                className="form-control flatpickr-input"
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
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="fichier_base64_string">Fichier</Form.Label>
          </Col>
          <Col lg={8}>
            <div className="d-flex justify-content-center">
              {discipline.fichier && discipline.fichier_base64_string ? (
                <Image
                  src={`data:image/jpeg;base64, ${discipline.fichier_base64_string}`}
                  alt=""
                  className="img-thumbnail p-1 bg-body mt-n3"
                  width="200"
                />
              ) : (
                <Image
                  src={`${
                    process.env.REACT_APP_BASE_URL
                  }/disciplineFiles/${disciplineLocation?.fichier!}`}
                  alt=""
                  className="img-thumbnail p-1 bg-body mt-n3"
                  width="200"
                />
              )}
            </div>
            <div
              className="d-flex justify-content-center mt-n2"
              style={{ marginLeft: "200px" }}
            >
              <label
                htmlFor="fichier_base64_string"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir image pour l'avis"
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
                name="fichier_base64_string"
                id="fichier_base64_string"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                style={{ width: "210px", height: "120px" }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateDiscipline(!modal_UpdateDiscipline)}
              data-bs-dismiss="modal"
            >
              <i className="me-1 fs-18 align-middle"></i>
              Modifier
            </Button>
          </div>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default UpdateDiscipline;
