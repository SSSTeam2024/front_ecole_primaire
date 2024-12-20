import React, { useEffect, useState } from "react";
import { Container, Row, Card, Col, Form } from "react-bootstrap";

import Breadcrumb from "Common/BreadCrumb";

import Swal from "sweetalert2";

import {
  useDeleteMessagerieMutation,
  useGetMessageriesByParentIdMutation,
  useGetMessageriesQuery,
  useNewMessagerieCollectifMutation,
  useNewMessagerieMutation,
} from "features/messageries/messagerieSlice";
import { useFetchParentsQuery } from "features/parents/parentSlice";
import { formatDate, formatTime } from "helpers/data_time_format";
import avatar from "assets/images/3607444.png";
import { convertToBase64 } from "helpers/base64_convert";

const MessageCollectif = () => {
  const { data = [] } = useGetMessageriesQuery();
  const { data: AllParents = [] } = useFetchParentsQuery();

  const [deleteMessage] = useDeleteMessagerieMutation();

  const [selectedMessages, setSelectedMessages] = useState<any[]>([]);
  const [getMessageriesByParentId] = useGetMessageriesByParentIdMutation();
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [selectedParentIds, setSelectedParentIds] = useState<any[]>([]);
  const handleParentClick = (parentId: any) => {
    setSelectedParentIds(
      (prevSelected) =>
        prevSelected.includes(parentId)
          ? prevSelected.filter((id) => id !== parentId) // Remove if already selected
          : [...prevSelected, parentId] // Add if not selected
    );
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

  const [createMessage] = useNewMessagerieCollectifMutation();

  const initialMessage = {
    msg: "",
    sender: "",
    receivers: [""],
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
    receivers,
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
  //   console.log("selectedParentIds", selectedParentIds);
  const currentDate = new Date();
  const onSubmitMessage = () => {
    try {
      message["date"] = formatDate(currentDate);
      message["heure"] = formatTime(currentDate);
      message["sender"] = "administration";
      message["receivers"] = selectedParentIds;
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

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredParents = () => {
    let filteredParents = AllParents;

    if (searchTerm.trim()) {
      filteredParents = filteredParents.filter(
        (parent: any) =>
          parent?.prenom_parent?.toLowerCase().trim() ===
            searchTerm.toLowerCase().trim() ||
          parent?.phone!.toLowerCase().trim() ===
            searchTerm.toLowerCase().trim() ||
          parent?.fils.some(
            (eleve: any) =>
              eleve.nom.toLowerCase().trim() ===
                searchTerm.toLowerCase().trim() ||
              eleve.prenom.toLowerCase().trim() ===
                searchTerm.toLowerCase().trim()
          )
      );
    }

    return filteredParents;
  };

  const hasFilesOrMessage =
    message.msg.trim() !== "" || message.fichiers.length > 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Messages de Groupe" pageTitle="Tableau de bord" />
          <Row>
            <Col lg={4}>
              <Card>
                <Card.Header>
                  <Row className="g-3">
                    <Col lg={7}>
                      <Form.Label>Parents</Form.Label>
                    </Col>
                    <Col lg={5}>
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control form-control-sm search"
                          placeholder="Rechercher ..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body style={{ overflowY: "scroll", maxHeight: "686px" }}>
                  <ul className="list-group">
                    {getFilteredParents().map((parent) =>
                      parent.fils?.map((eleve) => (
                        <li
                          key={parent._id}
                          className="list-group-item"
                          aria-disabled="true"
                          onClick={() => handleParentClick(parent._id)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: selectedParentIds.includes(
                              parent?._id!
                            )
                              ? "#f0f0f0"
                              : "",
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
                              <strong>
                                <i>{parent?.prenom_parent!} </i>
                              </strong>
                              :{" "}
                              <i>
                                {eleve.prenom} {eleve.nom}
                              </i>{" "}
                              __ {eleve.classe.nom_classe} :{" "}
                              <strong>{parent?.phone!}</strong>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={7}>
              <Card>
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

                  <button
                    className="btn btn-primary"
                    onClick={onSubmitMessage}
                    disabled={!hasFilesOrMessage}
                  >
                    <i className="ph ph-paper-plane-tilt"></i>
                  </button>
                  <div className="d-flex flex-wrap mt-3">
                    {message.fichiers.map((file: any, index: number) => {
                      const mimeType = file.split(";")[0].split(":")[1];
                      const isImage = mimeType.match(
                        /(jpg|jpeg|png|gif|jfif|avif)$/i
                      );

                      return (
                        <div key={index} className="me-2">
                          {isImage ? (
                            <img
                              src={file}
                              alt="preview"
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <a
                              href={file}
                              // download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-secondary"
                            >
                              <i className="ph ph-file"></i>{" "}
                              {message.fichier_extension[index]}
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default MessageCollectif;
