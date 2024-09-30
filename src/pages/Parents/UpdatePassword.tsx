import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useUpdatePasswordMutation } from "features/parents/parentSlice";

interface ChildProps {
  modal_UpdatePassword: boolean;
  setmodal_UpdatePassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatePassword: React.FC<ChildProps> = ({
  modal_UpdatePassword,
  setmodal_UpdatePassword,
}) => {
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);

  const parentLocation = useLocation();

  const [parentPassword, setParentPassword] = useState<string>("");

  const [parent_id, setParentId] = useState<string>(
    parentLocation?.state?._id ?? ""
  );

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentPassword(e.target.value);
    checkPasswordsMatch(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === parentPassword);
    checkPasswordsMatch(parentPassword, e.target.value);
  };

  const checkPasswordsMatch = (password: string, confirmPassword: string) => {
    if (password === confirmPassword && password.length > 0) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [updatePasswordParent] = useUpdatePasswordMutation();

  const initialParent = {
    password: "",
  };

  const [parent, setParent] = useState(initialParent);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le mot de passe du parent a été mis à jour avec succès",
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
        password: parentPassword || parentLocation?.state?.password,
      };
      updatePasswordParent(update_parent)
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
          <Col lg={5}>
            <Form.Label htmlFor="parentPassword">
              Nouveau Mot de passe
            </Form.Label>
          </Col>
          <Col lg={6}>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                id="parentPassword"
                name="parentPassword"
                value={parentPassword}
                onChange={handlePassword}
              />
              <InputGroup.Text
                onClick={toggleShowPassword}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? (
                  <i className="ph ph-eye"></i>
                ) : (
                  <i className="ph ph-eye-slash"></i>
                )}
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={5}>
            <Form.Label htmlFor="confirmPassword">
              Confirmer Mot de passe
            </Form.Label>
          </Col>
          <Col lg={6}>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                isInvalid={!passwordsMatch && confirmPassword.length > 0}
              />
              <InputGroup.Text
                onClick={toggleShowPassword}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? (
                  <i className="ph ph-eye"></i>
                ) : (
                  <i className="ph ph-eye-slash"></i>
                )}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                Les mots de passe ne correspondent pas.
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-success"
              onClick={() => setmodal_UpdatePassword(!modal_UpdatePassword)}
              data-bs-dismiss="modal"
              disabled={!passwordsMatch}
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

export default UpdatePassword;
