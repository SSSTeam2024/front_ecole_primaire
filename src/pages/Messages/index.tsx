import React, { useEffect, useState } from "react";
import { Container, Row, Card, Col, Form } from "react-bootstrap";

import Breadcrumb from "Common/BreadCrumb";

import Swal from "sweetalert2";

import {
  useDeleteMessagerieMutation,
  useGetMessageriesByParentIdMutation,
  useGetMessageriesQuery,
  useNewMessagerieMutation,
} from "features/messageries/messagerieSlice";
import { useFetchParentsQuery } from "features/parents/parentSlice";
import { formatDate, formatTime } from "helpers/data_time_format";
import avatar from "assets/images/3607444.png";
import "./searchBox.css";
import { convertToBase64 } from "helpers/base64_convert";

const Messages = () => {
  const { data = [] } = useGetMessageriesQuery();
  const { data: AllParents = [] } = useFetchParentsQuery();

  const [deleteMessage] = useDeleteMessagerieMutation();

  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
  const [getMessageriesByParentId] = useGetMessageriesByParentIdMutation();
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [selectedParentId, setSelectedParentId] = useState(null);
  const handleParentClick = async (parentId: any) => {
    try {
      const response = await getMessageriesByParentId(parentId).unwrap();
      setSelectedMessages(response);
      setSelectedParent(parentId);
      setSelectedParentId(parentId);
    } catch (error) {
      console.error("Error fetching messages", error);
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le message a été envoyé avec succès",
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

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const [createMessage] = useNewMessagerieMutation();

  const initialMessage = {
    msg: "",
    sender: "",
    receiver: "",
    date: "",
    heure: "",
    fichier_base64_string: [],
    fichier_extension: [],
    fichiers: [],
  };

  const [message, setMessage] = useState(initialMessage);

  const {
    msg,
    sender,
    receiver,
    date,
    heure,
    fichier_base64_string,
    fichier_extension,
    fichiers,
  } = message;

  const onChangeMessage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleFileUpload = async (files: File[]) => {
    const base64Files = await Promise.all(
      files.map(async (file: File) => {
        const { base64Data, extension } = await convertToBase64(file);
        const mimeType = file.type;
        return {
          base64Data,
          extension,
          fileName: file.name,
          mimeType,
        };
      })
    );

    setMessage((prevState: any) => ({
      ...prevState,
      fichiers: base64Files.map(
        (file) => `data:${file.mimeType};base64,${file.base64Data}`
      ),
      fichier_base64_string: base64Files.map((file) => file.base64Data),
      fichier_extension: base64Files.map((file) => file.extension),
    }));
  };

  const currentDate = new Date();
  const onSubmitMessage = () => {
    try {
      message["date"] = formatDate(currentDate);
      message["heure"] = formatTime(currentDate);
      message["sender"] = "administration";
      message["receiver"] = selectedParent;
      createMessage(message)
        .then(() => notifySuccess())
        .then(() => setMessage(initialMessage));
    } catch (error) {
      notifyError(error);
    }
  };
  const isArabic = (text: string) => {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicPattern.test(text);
  };
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!searchTerm) {
      setIsFocused(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredParents = () => {
    let filteredParents = AllParents;

    if (searchTerm) {
      filteredParents = filteredParents.filter(
        (parent: any) =>
          parent
            ?.prenom_parent!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          parent?.phone!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredParents;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Messages" pageTitle="Tableau de bord" />
          <Row>
            <Col lg={4}>
              <Card>
                <Card.Header>
                  <Row className="g-3">
                    <Col lg={7}>
                      <Form.Label>Parents</Form.Label>
                    </Col>
                    <Col lg={5}>
                      <div
                        className={`searching-box ${isFocused ? "active" : ""}`}
                      >
                        <i
                          className="ri-search-line searching-icon"
                          onClick={() => setIsFocused(true)}
                        ></i>
                        <input
                          type="text"
                          className="form-control form-control-sm searching-input-text"
                          placeholder="Rechercher ..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body style={{ overflowY: "scroll", maxHeight: "686px" }}>
                  <ul className="list-group">
                    {getFilteredParents().map((parent) => (
                      <li
                        key={parent._id}
                        className="list-group-item"
                        aria-disabled="true"
                        onClick={() => handleParentClick(parent._id)}
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedParentId === parent._id ? "#f0f0f0" : "",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <div className="flex-shrink-0">
                            <img
                              src={avatar}
                              alt=""
                              className="avatar-xs rounded-circle"
                            />
                          </div>
                          <div className="flex-grow-1 ms-2">
                            {parent?.prenom_parent!} : {parent?.phone!}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card>
                <Card.Header>Messages</Card.Header>
                <Card.Body style={{ overflowY: "scroll", maxHeight: "604px" }}>
                  <ul className="list-group">
                    {selectedMessages.length > 0 ? (
                      selectedMessages.map((message, index) =>
                        message.sender === "administration" ? (
                          <li key={index} className="list-group-item border-0">
                            <div className="d-flex flex-column">
                              <Card
                                className="card-body bg-light d-flex justify-content-end w-50 ms-auto border-0 rounded-top-5"
                                style={{
                                  borderBottomRightRadius: "0",
                                  borderBottomLeftRadius: "30px",
                                }}
                              >
                                <div
                                  className={`message-content ${
                                    isArabic(message.msg)
                                      ? "text-end"
                                      : "text-start"
                                  }`}
                                >
                                  <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 ms-2">
                                      <p className="text-muted mb-0">
                                        {message.msg}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {message.fichiers.length > 0 ? (
                                  <div className="file-list">
                                    {message.fichiers?.map(
                                      (fichier: any, fileIndex: number) => {
                                        const extension = fichier
                                          .substring(
                                            fichier.lastIndexOf(".") + 1
                                          )
                                          .toLowerCase();
                                        const isImage = extension?.match(
                                          /(jpg|jpeg|png|gif|jfif|avif)$/i
                                        );
                                        return (
                                          <div
                                            key={fileIndex}
                                            className="file-item mt-3"
                                          >
                                            {isImage ? (
                                              <img
                                                src={`${
                                                  process.env.REACT_APP_BASE_URL
                                                }/msgFiles/${fichier!}`}
                                                alt="fichier"
                                                className="img-fluid rounded"
                                                style={{
                                                  maxWidth: "150px",
                                                  maxHeight: "150px",
                                                }}
                                              />
                                            ) : (
                                              <a
                                                href={`${
                                                  process.env.REACT_APP_BASE_URL
                                                }/msgFiles/${fichier!}`}
                                                download={`file-${fileIndex}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="file-icon text-info"
                                              >
                                                <i
                                                  className="bi bi-file-earmark"
                                                  style={{ fontSize: "1.4rem" }}
                                                ></i>
                                              </a>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </Card>
                              {/* Date and time container */}
                              <div
                                className={`message-info ${
                                  isArabic(message.msg)
                                    ? "text-end"
                                    : "text-center"
                                }`}
                              >
                                <small className="text-dark">
                                  {message.date}
                                </small>{" "}
                                <small className="fw-medium text-dark">
                                  {message.heure}
                                </small>
                              </div>
                            </div>
                          </li>
                        ) : (
                          <li
                            key={index}
                            className="list-group-item border-0 d-flex align-items-end w-50"
                          >
                            <div
                              className="avatar bg-light rounded-circle me-3 d-flex justify-content-center align-items-center"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <img
                                src={avatar}
                                alt=""
                                className="avatar-xs rounded-circle"
                              />
                            </div>
                            <div className="d-flex flex-column">
                              <Card
                                className="card-body bg-info bg-opacity-50 text-white d-flex justify-content-start border-0 rounded-top-5 rounded-end-5"
                                style={{ borderBottomLeftRadius: "0" }}
                              >
                                <div
                                  className={`message-content ${
                                    isArabic(message.msg)
                                      ? "text-end"
                                      : "text-start"
                                  }`}
                                >
                                  <p className="mb-0">{message.msg}</p>
                                  {message.fichiers.length > 0 && (
                                    <div className="file-list mt-2">
                                      {message.fichiers?.map(
                                        (fichier: any, fileIndex: number) => {
                                          const extension = fichier
                                            .substring(
                                              fichier.lastIndexOf(".") + 1
                                            )
                                            .toLowerCase();
                                          const isImage = extension?.match(
                                            /(jpg|jpeg|png|gif|jfif|avif)$/i
                                          );
                                          return (
                                            <div
                                              key={fileIndex}
                                              className="file-item mt-2"
                                            >
                                              {isImage ? (
                                                <img
                                                  src={`${process.env.REACT_APP_BASE_URL}/msgFiles/${fichier}`}
                                                  alt="fichier"
                                                  className="img-fluid rounded"
                                                  style={{
                                                    maxWidth: "100px",
                                                    maxHeight: "100px",
                                                  }}
                                                />
                                              ) : (
                                                <a
                                                  href={`${process.env.REACT_APP_BASE_URL}/msgFiles/${fichier}`}
                                                  download={`file-${fileIndex}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="file-icon text-white"
                                                >
                                                  <i
                                                    className="bi bi-file-earmark"
                                                    style={{
                                                      fontSize: "1.4rem",
                                                    }}
                                                  ></i>
                                                </a>
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  )}
                                </div>
                              </Card>
                              <div
                                className={`message-content ${
                                  isArabic(message.msg)
                                    ? "text-end"
                                    : "text-start"
                                }`}
                              >
                                <small className="text-dark">
                                  {message.date}
                                </small>{" "}
                                <small className="fw-medium text-dark">
                                  {message.heure}
                                </small>
                              </div>
                            </div>
                          </li>
                        )
                      )
                    ) : (
                      <li className="list-group-item">
                        Aucun message disponible
                      </li>
                    )}
                  </ul>
                </Card.Body>
                <Card.Footer className="d-flex align-items-center">
                  <input
                    type="text"
                    id="msg"
                    value={message.msg}
                    onChange={onChangeMessage}
                    className="form-control me-2"
                    placeholder="Tapez un message"
                  />

                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFileUpload(Array.from(e.target.files || []))
                    }
                  />

                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <i className="ph ph-paperclip"></i>
                  </button>

                  <button className="btn btn-primary" onClick={onSubmitMessage}>
                    <i className="ph ph-paper-plane-tilt"></i>
                  </button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Messages;
