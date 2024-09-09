import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";

import { useLocation } from "react-router-dom";

import { useUpdateSalleMutation } from "features/salles/salleSlice";

interface ChildProps {
  modal_UpdateSalle: boolean;
  setmodal_UpdateSalle: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateSalle: React.FC<ChildProps> = ({
  modal_UpdateSalle,
  setmodal_UpdateSalle,
}) => {
  const salleLocation = useLocation();

  const [salleName, setSalleName] = useState<string>(
    salleLocation?.state?.nom_salle ?? ""
  );

  const [matiere_id, setMatiereId] = useState<string>(
    salleLocation?.state?._id! ?? ""
  );

  const handleSalleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalleName(e.target.value);
  };

  const [updateSalle] = useUpdateSalleMutation();

  const initialSalle = {
    nom_salle: "",
  };

  const [salle, setSalle] = useState(initialSalle);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La salle a été mis à jour avec succès",
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

  const onSubmitUpdateSalle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_salle = {
        _id: matiere_id || salleLocation?.state?._id!,
        nom_salle: salleName || salleLocation?.state?.nom_salle,
      };
      updateSalle(update_salle)
        .then(() => notifySuccess())
        .then(() => setSalle(initialSalle));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateSalle}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="salleName">Nom</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="salleName"
              name="salleName"
              value={salleName}
              onChange={handleSalleName}
            />
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateSalle(!modal_UpdateSalle)}
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

export default UpdateSalle;
