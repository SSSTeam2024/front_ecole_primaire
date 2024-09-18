import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import {
  Matiere,
  useFetchMatieresQuery,
  useUpdateMatiereMutation,
} from "features/matieres/matiereSlice";
import Select from "react-select";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useGetNiveauxQuery } from "features/niveaux/niveauxSlice";

interface ChildProps {
  modal_UpdateMatiere: boolean;
  setmodal_UpdateMatiere: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalEdit: React.FC<ChildProps> = ({
  modal_UpdateMatiere,
  setmodal_UpdateMatiere,
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

  const matiereLocation = useLocation();
  const location = useLocation();
  const matiereToEdit = location.state?.matiere;

  const { data: AllNiveaux = [] } = useGetNiveauxQuery();
  const { data: AllMatieres = [] } = useFetchMatieresQuery();
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

  const [selectedValues, setSelectedValues] = useState(
    matiereLocation?.state?.classe || []
  );

  const [selectedMatiere, setSelectedMatiere] = useState<Matiere>({
    _id: "",
    niveau: "",
    matieres: [{ nom_matiere: "" }],
  });

  useEffect(() => {
    if (matiereToEdit) {
      setSelectedMatiere(matiereToEdit);
    }
  }, [matiereToEdit]);

  const handleAddMatiere = () => {
    setSelectedMatiere((prevState) => ({
      ...prevState,
      matieres: [...prevState.matieres, { nom_matiere: "" }],
    }));
  };

  const handleRemoveMatiere = (index: number) => {
    setSelectedMatiere((prevState) => ({
      ...prevState,
      matieres: prevState.matieres.filter((_, i) => i !== index),
    }));
  };

  const handleSelectMatiereToUpdate = (selectedId: string) => {
    const selectedMatiere = AllMatieres.find(
      (matiere) => matiere._id === selectedId
    );
    if (selectedMatiere) {
      setSelectedMatiere(selectedMatiere); // Populate the form with the selected matiere
    }
  };

  const handleMatiereChange = (index: number, value: string) => {
    const updatedMatieres = [...selectedMatiere.matieres];
    updatedMatieres[index].nom_matiere = value;
    setSelectedMatiere({ ...selectedMatiere, matieres: updatedMatieres });
  };

  const onSubmitMatiere = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMatiere({ _id: selectedMatiere._id, ...selectedMatiere });
  };

  return (
    <React.Fragment>
      <Form className="create-form" onSubmit={onSubmitMatiere}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="niveau">Niveau</Form.Label>
          </Col>
          <Col lg={8}>
            <select
              className="form-select text-muted"
              name="niveau"
              id="niveau"
              value={selectedMatiere.niveau}
              onChange={(e) =>
                setSelectedMatiere({
                  ...selectedMatiere,
                  niveau: e.target.value,
                })
              }
            >
              <option value="">Choisir</option>
              {AllNiveaux.map((niveau: any) => (
                <option value={niveau._id} key={niveau._id}>
                  {niveau.nom_niveau}
                </option>
              ))}
            </select>
          </Col>
        </Row>

        {selectedMatiere.matieres.map((item, index) => (
          <Row className="mb-4" key={index}>
            <Col lg={3}>
              <Form.Label htmlFor={`nom_matiere_${index}`}>
                Matière {index + 1}
              </Form.Label>
            </Col>
            <Col lg={6}>
              <Form.Control
                type="text"
                id={`nom_matiere_${index}`}
                name={`nom_matiere_${index}`}
                placeholder="Matière"
                className="w-100"
                value={item.nom_matiere}
                onChange={(e) => handleMatiereChange(index, e.target.value)}
              />
            </Col>
            <Col lg={1} className="m-1">
              {index === selectedMatiere.matieres.length - 1 && (
                <button
                  type="button"
                  className="btn btn-soft-info btn-icon"
                  onClick={handleAddMatiere}
                >
                  <i className="ri-add-line"></i>
                </button>
              )}
            </Col>
            <Col lg={1} className="m-1">
              <button
                type="button"
                className="btn btn-danger btn-icon"
                onClick={() => handleRemoveMatiere(index)}
              >
                <i className="ri-delete-bin-5-line"></i>
              </button>
            </Col>
          </Row>
        ))}

        <Button type="submit" variant="success" id="addNew">
          Mettre à jour
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default ModalEdit;
