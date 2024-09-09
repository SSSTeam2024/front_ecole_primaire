import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Form,
  Table,
  Dropdown,
} from "react-bootstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "Common/withRouter";
import { RootState } from "../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../features/account/authSlice";

const UserProfile = () => {
  document.title = " Profile | Affiliate Administration ";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const dispatch = useDispatch<any>();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);

  const { error, success } = useSelector((state: any) => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }));

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xxl={12}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col lg={3}>
                      <div className="profile-user-img position-relative">
                        <img
                          src={`${process.env.REACT_APP_FILE_URL}/schoolFiles/${user.logo}`}
                          alt=""
                          className="rounded object-fit-cover"
                        />
                        <span className="position-absolute top-0 start-100 translate-middle badge border border-3 border-white rounded-circle bg-success p-1 mt-1 me-1">
                          <span className="visually-hidden">
                            unread messages
                          </span>
                        </span>
                      </div>
                    </Col>
                    <Col lg={9}>
                      <div className="d-flex border-bottom border-bottom-dashed pb-3 mb-3 mt-4 mt-lg-0">
                        <div className="flex-grow-1">
                          <h5>{user.name}</h5>
                        </div>
                        <div className="flex-shrink-0">
                          <Dropdown>
                            <Dropdown.Toggle
                              href="#"
                              className="arrow-none btn btn-ghost-primary btn-sm btn-icon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="ph-dots-three-outline"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <li>
                                <Dropdown.Item href="/#">Action</Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item href="/#">
                                  Another action
                                </Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item href="/#">
                                  Something else here
                                </Dropdown.Item>
                              </li>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      <Row>
                        <Col lg={6}>
                          <div className="table-responsive">
                            <Table className="table-borderless table-sm mb-0">
                              <tbody>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-map-pin"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Location</td>
                                  </div>
                                </tr>

                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-envelope"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Email</td>
                                  </div>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-phone"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Mobile / Phone No.</td>
                                  </div>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-book"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Designation</td>
                                  </div>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="table-responsive">
                            <Table className="table-borderless table-sm mb-0">
                              <tbody>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-bank"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Bank Name</td>
                                  </div>
                                  <td className="fw-medium"> </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-user-list"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Account Name</td>
                                  </div>
                                  <td className="fw-medium"> </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-credit-card"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Account Number</td>
                                  </div>
                                  <td className="fw-medium"> </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-receipt"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Sort Code</td>
                                  </div>
                                  <td className="fw-medium"> </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              {/* <RecentOrders /> */}
            </Col>

            {/* <Col xxl={3}>
                    <Acitivity />
                </Col> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
