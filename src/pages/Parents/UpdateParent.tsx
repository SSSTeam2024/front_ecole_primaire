import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import Select from "react-select";
import { useLocation } from "react-router-dom";

import { useUpdateParentMutation } from "features/parents/parentSlice";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";

interface ChildProps {
  modal_UpdateParent: boolean;
  setmodal_UpdateParent: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateParent: React.FC<ChildProps> = ({
  modal_UpdateParent,
  setmodal_UpdateParent,
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

  const parentLocation = useLocation();

  const { data: AllEtudiants = [] } = useFetchEtudiantsQuery();

  const [parentFirstName, setParentFirstName] = useState<string>(
    parentLocation?.state?.nom_parent ?? ""
  );

  const [parentLastName, setParentLastName] = useState<string>(
    parentLocation?.state?.prenom_parent ?? ""
  );

  const [parentCin, setParentCin] = useState<string>(
    parentLocation?.state?.cin ?? ""
  );

  const [parentPhone, setParentPhone] = useState<string>(
    parentLocation?.state?.phone ?? ""
  );

  const [parentLogin, setParentLogin] = useState<string>(
    parentLocation?.state?.username ?? ""
  );

  const [parent_id, setParentId] = useState<string>(
    parentLocation?.state?._id! ?? ""
  );

  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentFirstName(e.target.value);
  };

  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentLastName(e.target.value);
  };

  const handleCin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentCin(e.target.value);
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentPhone(e.target.value);
  };

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentLogin(e.target.value);
  };

  const existingFils = parentLocation.state?.fils || [];

  const filtredEtudiants = AllEtudiants.filter(
    (etudiant) => etudiant?.parent! === null
  );

  const defaultFilsOptions =
    parentLocation.state?.fils?.map((item: any) => ({
      label: `${item.nom} ${item.prenom} _ ${item?.classe?.nom_classe!}`,
      value: item?._id!,
    })) || [];

  const optionColumnsTable = filtredEtudiants.map((etudiant: any) => ({
    value: etudiant?._id!,
    label: `${etudiant.nom} ${etudiant.prenom} _ ${etudiant?.classe
      ?.nom_classe!}`,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState(
    existingFils.map((fil: any) => fil?._id!)
  );

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const [updateParent] = useUpdateParentMutation();

  const initialParent = {
    cin: "",
    nom_parent: "",
    prenom_parent: "",
    phone: "",
    username: "",
    fils: [],
  };

  const [parent, setParent] = useState(initialParent);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le parent a été mis à jour avec succès",
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

  const onSubmitUpdateParent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_parent = {
        _id: parent_id || parentLocation?.state?._id!,
        nom_parent: parentFirstName || parentLocation?.state?.nom_parent,
        prenom_parent: parentLastName || parentLocation?.state?.prenom_parent,
        cin: parentCin || parentLocation?.state?.cin,
        phone: parentPhone || parentLocation?.state?.phone,
        username: parentLogin || parentLocation?.state?.username,
        fils: selectedColumnValues || parentLocation?.state?.fils!,
      };
      updateParent(update_parent)
        .then(() => notifySuccess())
        .then(() => setParent(initialParent));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateParent}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="parentFirstName">Nom</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="parentFirstName"
              name="parentFirstName"
              value={parentFirstName}
              onChange={handleFirstName}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="parentLastName">Prenom</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="parentLastName"
              name="parentLastName"
              value={parentLastName}
              onChange={handleLastName}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="parentCin">C.I.N</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="parentCin"
              name="parentCin"
              value={parentCin}
              onChange={handleCin}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="parentPhone">Numéro Téléphone</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="parentPhone"
              name="parentPhone"
              value={parentPhone}
              onChange={handlePhone}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="parentLogin">Nom Utilisateur</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="parentLogin"
              name="parentLogin"
              value={parentLogin}
              onChange={handleLogin}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="fils">Fils</Form.Label>
          </Col>
          <Col lg={8}>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={optionColumnsTable}
              onChange={handleSelectValueColumnChange}
              defaultValue={defaultFilsOptions}
              styles={customStyles}
            />
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateParent(!modal_UpdateParent)}
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

export default UpdateParent;
