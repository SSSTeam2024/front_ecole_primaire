import React, { useEffect } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

import logo from "assets/images/sls-logo2.png";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useDispatch } from "react-redux";
import withRouter from "Common/withRouter";

import {
  LoginRequest,
  useLoginMutation,
} from "../../features/account/accountSlice";
import { setCredentials } from "../../features/account/authSlice";

import Cookies from "js-cookie";

const Login = (props: any) => {
  document.title = "Login | Sousse Leaders School";

  const [login, { isLoading }] = useLoginMutation();

  const [formState, setFormState] = React.useState<LoginRequest>({
    login: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("authAffiliate")) {
      navigate("/dashboard");
    }
  }, [localStorage.getItem("authAffiliate")]);

  const notify = () => {
    Swal.fire({
      icon: "success",
      title: `Welcome`,
      showConfirmButton: false,
      timer: 2200,
    });
    navigate("/");
  };

  const msgError: string = "Wrong Credentials !";
  const Errornotify = (msg: string) => {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: `${msg}`,
      showConfirmButton: false,
      timer: 2500,
    });
    navigate("/login");
  };
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }));
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <React.Fragment>
      <section className="auth-page-wrapper position-relative bg-light min-vh-100 d-flex align-items-center justify-content-between">
        <div className="w-100">
          <Container>
            <Row className="justify-content-center">
              <Col lg={6}>
                <div className="auth-card mx-lg-3">
                  <Card className="border-0 mb-0">
                    <Card.Header className="bg-primary-subtle border-0">
                      <Row>
                        <Col
                          lg={12}
                          className="d-flex justify-content-center col-12"
                        >
                          <img src={logo} alt="" className="img-fluid" />
                        </Col>
                      </Row>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted fs-15">
                        Connectez-vous pour continuer vers le tableau de bord.
                      </p>
                      <div className="p-2">
                        <div className="mb-3">
                          <Form.Label htmlFor="username">Login</Form.Label>
                          <Form.Control
                            type="email"
                            className="form-control"
                            placeholder="Entrez le nom d'utilisateur"
                            onChange={handleChange}
                            name="login"
                          />
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Mot de passe oublié ?
                            </Link>
                          </div>
                          <Form.Label htmlFor="password-input">
                            Mot de passe
                          </Form.Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Form.Control
                              className="form-control pe-5 password-input"
                              placeholder="Entrez le mot de passe"
                              id="password-input"
                              name="password"
                              onChange={handleChange}
                              type={show ? "text" : "password"}
                            />
                            <Button
                              variant="link"
                              className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                              type="button"
                              id="password-addon"
                              onClick={handleClick}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </Button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Form.Check
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Form.Label htmlFor="auth-remember-check">
                            Rappelez-vous de moi
                          </Form.Label>
                        </div>
                        <div>
                          {isLoading ? (
                            <div className="hstack flex-wrap gap-2 mb-3 mb-lg-0">
                              <button
                                className="btn btn-outline-primary btn-load w-100"
                                disabled
                              >
                                <span className="d-flex align-items-center">
                                  <span
                                    className="spinner-border flex-shrink-0"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </span>
                                  <span className="flex-grow-1 ms-2">
                                    Loading...
                                  </span>
                                </span>
                              </button>
                            </div>
                          ) : (
                            <Button
                              variant="soft-primary"
                              className="w-100"
                              type="submit"
                              onClick={async () => {
                                try {
                                  const user: any = await login(
                                    formState
                                  ).unwrap();
                                  if (user) {
                                    dispatch(setCredentials(user));
                                    Cookies.set(
                                      "astk",
                                      user.central.api_token,
                                      {
                                        expires: 1 / 4,
                                      }
                                    );
                                    notify();
                                  } else {
                                    Errornotify(msgError);
                                  }
                                } catch (err: any) {
                                  //Errornotify(err);
                                  console.log(err);
                                }
                              }}
                            >
                              Se connecter
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>

          <footer className="footer">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      ©{new Date().getFullYear()} Sousse Leaders School. Conçu
                      avec <i className="mdi mdi-heart text-danger"></i> par
                      l'équipe 3S
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </footer>
        </div>
      </section>
    </React.Fragment>
  );
};

export default withRouter(Login);
