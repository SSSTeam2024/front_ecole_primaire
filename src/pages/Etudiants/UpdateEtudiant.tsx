import React, { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";

import { useLocation } from "react-router-dom";

import { useUpdateEtudiantMutation } from "features/etudiants/etudiantSlice";

import Flatpickr from "react-flatpickr";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchParentsQuery } from "features/parents/parentSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";

interface ChildProps {
  modal_UpdateEtudiant: boolean;
  setmodal_UpdateEtudiant: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateEtudiant: React.FC<ChildProps> = ({
  modal_UpdateEtudiant,
  setmodal_UpdateEtudiant,
}) => {
  const etudiantLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const { data: AllParent = [] } = useFetchParentsQuery();

  const [etudiantFirstName, setEtudiantFirstName] = useState<string>(
    etudiantLocation?.state?.nom ?? ""
  );

  const [etudiantLastName, setEtudiantLastName] = useState<string>(
    etudiantLocation?.state?.prenom ?? ""
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
        .then(() => setEtudiant(initialEtudiant));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateEtudiant}>
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
                }/etudiantFiles/${etudiantLocation?.state?.avatar!}`}
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
          <Col lg={3}>
            <Form.Label htmlFor="etudiantFirstName">Nom</Form.Label>
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
          <Col lg={3}>
            <Form.Label htmlFor="etudiantLastName">Prenom</Form.Label>
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
          <Col lg={3}>
            <Form.Label htmlFor="date">Date de Naissance</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{etudiantLocation.state.date_de_naissance}</span>
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
                  onClick={() => setShowDateOfBirth(!showDateOfBirth)}
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
          <Col lg={3}>
            <Form.Label htmlFor="classe">Classe : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{etudiantLocation?.state?.classe?.nom_classe!}</span>
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
                    <option value={classe._id!} key={classe?._id!}>
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
                    <option value={parent._id!} key={parent?._id!}>
                      {parent.nom_parent} {parent.prenom_parent}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
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
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateEtudiant(!modal_UpdateEtudiant)}
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

export default UpdateEtudiant;
