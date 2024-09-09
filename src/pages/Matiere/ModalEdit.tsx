import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";

import { useLocation } from "react-router-dom";
import { useUpdateClasseMutation } from "features/classes/classeSlice";
import { useUpdateMatiereMutation } from "features/matieres/matiereSlice";

interface ChildProps {
  modal_UpdateMatiere: boolean;
  setmodal_UpdateMatiere: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalEdit: React.FC<ChildProps> = ({
  modal_UpdateMatiere,
  setmodal_UpdateMatiere,
}) => {
  const matiereLocation = useLocation();
  const [matiereName, setMatiereName] = useState<string>(
    matiereLocation?.state?.nom_matiere ?? ""
  );
  const [matiere_id, setMatiereId] = useState<string>(
    matiereLocation?.state?._id! ?? ""
  );

  const handleMatiereName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatiereName(e.target.value);
  };

  const [updateMatiere] = useUpdateMatiereMutation();

  const initialMatiere = {
    nom_matiere: "",
  };

  const [matiere, setMatiere] = useState(initialMatiere);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La matière a été mis à jour avec succès",
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

  const onSubmitUpdateMatiere = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const classe = {
        _id: matiere_id || matiereLocation?.state?._id!,
        nom_matiere: matiereName || matiereLocation?.state?.nom_matiere,
      };
      updateMatiere(classe)
        .then(() => notifySuccess())
        .then(() => setMatiere(initialMatiere));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateMatiere}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="matiereName">Nom</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="matiereName"
              name="matiereName"
              value={matiereName}
              onChange={handleMatiereName}
            />
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateMatiere(!modal_UpdateMatiere)}
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

export default ModalEdit;
