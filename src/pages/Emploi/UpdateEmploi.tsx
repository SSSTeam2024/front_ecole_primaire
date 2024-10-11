import React, { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useUpdateEnseignantMutation } from "features/enseignants/enseignantSlice";
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useUpdateEmploiMutation } from "features/emplois/emploiSlice";
import Flatpickr from "react-flatpickr";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";

interface ChildProps {
  modal_UpdateEmploi: boolean;
  setmodal_UpdateEmploi: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateEmploi: React.FC<ChildProps> = ({
  modal_UpdateEmploi,
  setmodal_UpdateEmploi,
}) => {
  const emploiLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [showDate, setShowDate] = useState<boolean>(false);
  const [showClasse, setShowClasse] = useState<boolean>(false);

  const [emploiName, setEmploiName] = useState<string>(
    emploiLocation?.state?.titre ?? ""
  );
  const [emploi_id, setEmploiId] = useState<string>(
    emploiLocation?.state?._id! ?? ""
  );

  const handleEmploiName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmploiName(e.target.value);
  };

  const [selectedClasse, setSelectedClasse] = useState<string>("");

  const handleSelectClasse = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedClasse(value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const [updateEmploi] = useUpdateEmploiMutation();

  const initialEmploi = {
    titre: "",
    date: "",
    classe: "",
    image_base64_string: "",
    image_extension: "",
    image: "",
  };

  const [emploi, setEmploi] = useState(initialEmploi);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("image_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_emploi = base64Data + "." + extension;
      setEmploi({
        ...emploi,
        image: file_emploi,
        image_base64_string: base64Data,
        image_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'emploi a été modifié avec succès",
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

  const onSubmitUpdateEmploi = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_emploi = {
        _id: emploi_id || emploiLocation?.state?._id!,
        titre: emploiName || emploiLocation?.state?.titre,
        date: formatDate(selectedDate) || emploiLocation?.state?.date!,
        classe: selectedClasse || emploiLocation?.state?.classe!,
      };

      updateEmploi(update_emploi)
        .then(() => notifySuccess())
        .then(() => setEmploi(initialEmploi));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateEmploi}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="emploiName">Titre</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="emploiName"
              name="emploiName"
              value={emploiName}
              onChange={handleEmploiName}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="matiere">Classe : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{emploiLocation?.state?.classe?.nom_classe!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "120px" }}
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
                    <option value={classe?._id!} key={classe?._id!}>
                      {classe.nom_classe}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{emploiLocation.state.date}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "120px" }}
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
            <Form.Label htmlFor="image_base64_string">Fichier</Form.Label>
          </Col>
          <Col lg={8}>
            <div className="d-flex justify-content-center">
              {emploi.image && emploi.image_base64_string ? (
                <Image
                  src={`data:image/jpeg;base64, ${emploi.image_base64_string}`}
                  alt=""
                  className="img-thumbnail p-1 bg-body mt-n3"
                  width="200"
                />
              ) : (
                <Image
                  src={`${
                    process.env.REACT_APP_BASE_URL
                  }/emploiFiles/${emploiLocation?.state?.image!}`}
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
                htmlFor="image_base64_string"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir image emploi"
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
                name="image_base64_string"
                id="image_base64_string"
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
              onClick={() => setmodal_UpdateEmploi(!modal_UpdateEmploi)}
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

export default UpdateEmploi;
