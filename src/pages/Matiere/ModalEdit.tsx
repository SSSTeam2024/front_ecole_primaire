import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useUpdateMatiereMutation } from "features/matieres/matiereSlice";
import { useGetNiveauxQuery } from "features/niveaux/niveauxSlice";

interface ChildProps {
  modal_UpdateMatiere: boolean;
  setmodal_UpdateMatiere: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalEdit: React.FC<ChildProps> = ({
  modal_UpdateMatiere,
  setmodal_UpdateMatiere,
}) => {
  const [showNiveau, setShowNiveau] = useState<boolean>(false);
  const matiereLocation = useLocation();

  const { data: AllNiveaux = [] } = useGetNiveauxQuery();

  const [updateMatiere] = useUpdateMatiereMutation();

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

  const {
    _id,
    matieres: initialMatieres,
    niveau: initialNiveau,
  } = matiereLocation.state;

  const [selectedNiveau, setSelectedNiveau] = useState<string>(
    initialNiveau || ""
  );

  const [formValues, setFormValues] = useState({
    niveau: initialNiveau || "",
    matieres: initialMatieres || [],
  });

  const handleSelectNiveau = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedNiveau(value);
    setFormValues((prevState) => ({
      ...prevState,
      niveau: value,
    }));
  };

  const handleMatiereChange = (index: number, event: any) => {
    const updatedMatieres = [...formValues.matieres];
    updatedMatieres[index].nom_matiere = event.target.value;
    setFormValues({ ...formValues, matieres: updatedMatieres });
  };

  const handleDeleteMatiere = (index: number) => {
    const updatedMatieres = formValues.matieres.filter(
      (_: any, i: number) => i !== index
    );
    setFormValues({ ...formValues, matieres: updatedMatieres });
  };

  const handleAddMatiere = () => {
    const newMatiere = { nom_matiere: "" };
    setFormValues({
      ...formValues,
      matieres: [...formValues.matieres, newMatiere],
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    try {
      updateMatiere({ _id, ...formValues }).then(() => notifySuccess());
    } catch (error) {
      notifyError("Quelque chose s'est mal passé, Veuillez Réessayer");
    }
  };

  return (
    <React.Fragment>
      <Form className="create-form" onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="niveau">Niveau</Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{matiereLocation?.state?.niveau.nom_niveau!}</span>
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
        <div className="form-group mb-4">
          <label>Matières</label>
          {formValues.matieres.map((matiere: any, index: number) => (
            <div key={index} className="d-flex align-items-center mb-2 gap-2">
              <input
                type="text"
                value={matiere.nom_matiere}
                onChange={(e) => handleMatiereChange(index, e)}
                className="form-control"
              />
              <button
                type="button"
                onClick={() => handleDeleteMatiere(index)}
                className="btn btn-danger"
              >
                <i className="ri-delete-bin-2-line"></i>
              </button>
            </div>
          ))}
          <div className="form-group float-end">
            <button
              type="button"
              onClick={handleAddMatiere}
              className="btn btn-success"
            >
              <i className="ri-add-fill"></i>{" "}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="success"
          id="addNew"
          onClick={() => setmodal_UpdateMatiere(!modal_UpdateMatiere)}
        >
          Mettre à jour
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default ModalEdit;
