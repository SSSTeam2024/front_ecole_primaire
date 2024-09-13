import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";

import { useLocation } from "react-router-dom";
import { useUpdateClasseMutation } from "features/classes/classeSlice";
import { useGetNiveauxQuery } from "features/niveaux/niveauxSlice";

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

  const { data: AllNiveaux = [] } = useGetNiveauxQuery();
  const [updateClasse] = useUpdateClasseMutation();

  const initialClasse = {
    nom_classe: "",
    niveau: "",
  };

  const [selectedNiveau, setSelectedNiveau] = useState<string>("");
  const [showNiveau, setShowNiveau] = useState<boolean>(false);

  const handleSelectNiveau = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedNiveau(value);
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
        niveau: classeLocation?.state?.niveau,
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
            <Form.Label htmlFor="type">Niveau : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{classeLocation?.state?.niveau.nom_niveau!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="niveau"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Niveau"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowNiveau(!showNiveau)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showNiveau && (
                <select
                  className="form-select text-muted"
                  name="niveau"
                  id="niveau"
                  onChange={handleSelectNiveau}
                >
                  <option value="">Choisir</option>
                  {AllNiveaux.map((niveau) => (
                    <option value={niveau?._id!} key={niveau?._id!}>
                      {niveau?.nom_niveau!}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Col>
        </Row>
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
