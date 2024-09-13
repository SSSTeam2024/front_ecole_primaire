import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import {
  useFetchMatieresQuery,
  useUpdateMatiereMutation,
} from "features/matieres/matiereSlice";
import Select from "react-select";
import { useUpdateNiveauMutation } from "features/niveaux/niveauxSlice";

interface ChildProps {
  modal_UpdateNiveau: boolean;
  setmodal_UpdateNiveau: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateNiveau: React.FC<ChildProps> = ({
  modal_UpdateNiveau,
  setmodal_UpdateNiveau,
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

  const niveauLocation = useLocation();

  const { data: AllMatieres = [] } = useFetchMatieresQuery();

  const [niveauName, setNiveauName] = useState<string>(
    niveauLocation?.state?.nom_niveau ?? ""
  );
  const [niveau_id, setNiveauId] = useState<string>(
    niveauLocation?.state?._id! ?? ""
  );

  const handleNiveauName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNiveauName(e.target.value);
  };

  const [updateNiveau] = useUpdateNiveauMutation();

  const initialNiveau = {
    nom_niveau: "",
    matieres: [""],
  };

  const [niveau, setNiveau] = useState(initialNiveau);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le niveau a été mis à jour avec succès",
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
    niveauLocation?.state?.matieres || []
  );

  const defaultClassesOptions =
    niveauLocation?.state?.matieres?.map((item: any) => ({
      label: `${item.nom_matiere}`,
      value: item._id,
    })) || [];

  const handleSelectValueColumnChange = (selectedOptions: any) => {
    const values = selectedOptions.map((option: any) => option.value);
    setSelectedValues(values);
  };

  const [newType, setNewType] = useState("");

  useEffect(() => {
    if (
      niveauName.startsWith("7") ||
      niveauName.startsWith("8") ||
      niveauName.startsWith("9")
    ) {
      setNewType("Collège");
    } else if (
      niveauName.startsWith("1") ||
      niveauName.startsWith("2") ||
      niveauName.startsWith("3") ||
      niveauName.startsWith("4") ||
      niveauName.toLowerCase() === "bac"
    ) {
      setNewType("Lycée");
    } else {
      setNewType("");
    }
  }, [niveauName]);

  const onSubmitUpdateMatiere = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_niveau = {
        _id: niveau_id || niveauLocation?.state?._id!,
        nom_niveau: niveauName || niveauLocation?.state?.nom_niveau,
        type: newType || niveauLocation?.state?.type,
      };
      updateNiveau(update_niveau)
        .then(() => notifySuccess())
        .then(() => setNiveau(initialNiveau));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateMatiere}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="niveauName">Niveau</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="niveauName"
              name="niveauName"
              value={niveauName}
              onChange={handleNiveauName}
            />
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateNiveau(!modal_UpdateNiveau)}
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

export default UpdateNiveau;
