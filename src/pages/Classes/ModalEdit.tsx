import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";

import { useLocation } from "react-router-dom";
import { useUpdateClasseMutation } from "features/classes/classeSlice";

interface ChildProps {
  modal_UpdateClasse: boolean;
  setmodal_UpdateClasse: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalEdit: React.FC<ChildProps> = ({
  modal_UpdateClasse,
  setmodal_UpdateClasse,
}) => {
  const classeLocation = useLocation();
  const [classeName, setClasseName] = useState<string>(
    classeLocation?.state?.nom_classe ?? ""
  );
  const [classe_id, setClasseId] = useState<string>(
    classeLocation?.state?._id! ?? ""
  );

  const handleClasseName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClasseName(e.target.value);
  };

  const [updateClasse] = useUpdateClasseMutation();

  const initialClasse = {
    nom_classe: "",
  };

  const [classe, setClasse] = useState(initialClasse);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La classe a été mis à jour avec succès",
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

  const onSubmitUpdateClasse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const classe = {
        _id: classe_id || classeLocation?.state?._id!,
        nom_classe: classeName || classeLocation?.state?.nom_classe,
      };
      updateClasse(classe)
        .then(() => notifySuccess())
        .then(() => setClasse(initialClasse));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateClasse}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="classeName">Nom</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="classeName"
              name="classeName"
              value={classeName}
              onChange={handleClasseName}
            />
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateClasse(!modal_UpdateClasse)}
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
