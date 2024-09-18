import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useUpdateEnseignantMutation } from "features/enseignants/enseignantSlice";
import { useFetchMatieresQuery } from "features/matieres/matiereSlice";

interface ChildProps {
  modal_UpdateEnseignant: boolean;
  setmodal_UpdateEnseignant: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateEnseignant: React.FC<ChildProps> = ({
  modal_UpdateEnseignant,
  setmodal_UpdateEnseignant,
}) => {
  const enseignantLocation = useLocation();

  const { data: AllMatieres = [] } = useFetchMatieresQuery();

  const [enseignantName, setEnseignantName] = useState<string>(
    enseignantLocation?.state?.nom_enseignant ?? ""
  );
  const [enseignantLastName, setEnseignantLastName] = useState<string>(
    enseignantLocation?.state?.prenom_enseignant ?? ""
  );
  const [enseignantPhone, setEnseignantPhone] = useState<string>(
    enseignantLocation?.state?.phone ?? ""
  );
  const [enseignant_id, setEnseignantId] = useState<string>(
    enseignantLocation?.state?._id! ?? ""
  );

  const handleEnseignantName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnseignantName(e.target.value);
  };

  const handleEnseignantLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnseignantLastName(e.target.value);
  };

  const handleEnseignantPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnseignantPhone(e.target.value);
  };

  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [showMatiere, setShowMatiere] = useState<boolean>(false);

  const handleSelectMatiere = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedMatiere(value);
  };

  const [updateEnseignant] = useUpdateEnseignantMutation();

  const initialEnseignant = {
    nom_enseignant: "",
    prenom_enseignant: "",
    phone: "",
    matiere: "",
  };

  const [enseignant, setEnseignant] = useState(initialEnseignant);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "L'enseignant a été mis à jour avec succès",
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

  const onSubmitUpdateEnseignant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_enseignant = {
        _id: enseignant_id || enseignantLocation?.state?._id!,
        nom_enseignant:
          enseignantName || enseignantLocation?.state?.nom_enseignant,
        prenom_enseignant:
          enseignantLastName || enseignantLocation?.state?.prenom_enseignant,
        phone: enseignantPhone || enseignantLocation?.state?.phone!,
        matiere: selectedMatiere || enseignantLocation?.state?.matiere!,
      };
      updateEnseignant(update_enseignant)
        .then(() => notifySuccess())
        .then(() => setEnseignant(initialEnseignant));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateEnseignant}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="enseignantName">Nom</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="enseignantName"
              name="enseignantName"
              value={enseignantName}
              onChange={handleEnseignantName}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="enseignantLastName">Prénom</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="enseignantLastName"
              name="enseignantLastName"
              value={enseignantLastName}
              onChange={handleEnseignantLastName}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="enseignantPhone">N° Téléphone</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="enseignantPhone"
              name="enseignantPhone"
              value={enseignantPhone}
              onChange={handleEnseignantPhone}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="matiere">Matière : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{enseignantLocation?.state?.matiere!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "120px" }}
              >
                <label
                  htmlFor="matiere"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Matière"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowMatiere(!showMatiere)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showMatiere && (
                <select
                  className="form-select text-muted"
                  name="matiere"
                  id="matiere"
                  onChange={handleSelectMatiere}
                >
                  <option value="">Choisir</option>
                  {AllMatieres.map((matiere) =>
                    matiere.matieres.map((m) => (
                      <option value={m.nom_matiere} key={m?._id!}>
                        {m.nom_matiere}
                      </option>
                    ))
                  )}
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
              onClick={() => setmodal_UpdateEnseignant(!modal_UpdateEnseignant)}
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

export default UpdateEnseignant;
