import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Button,
  Offcanvas,
  Tab,
  Nav,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAddSmSMutation,
  useDeleteSmsEnAttenteMutation,
  useDeleteSmSMutation,
  useFetchSmSQuery,
  useSendSmSMutation,
} from "features/sms/smsSlice";
import { useFetchParentsQuery } from "features/parents/parentSlice";
import Select from "react-select";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchEtudiantsByClasseIdMutation } from "features/etudiants/etudiantSlice";
import shortCode from "Common/shortCode";

const ParentsSmses = () => {
  const { data = [] } = useFetchSmSQuery();

  const { data: AllParents = [] } = useFetchParentsQuery();
  const { data: AllClasses = [] } = useFetchClassesQuery();
  const filteredShortCode = shortCode.filter((item) => item.id !== 6);
  const [fetchEtudiantsByClasseId, { data: fetchedEtudiants }] =
    useFetchEtudiantsByClasseIdMutation();
  const [deleteSms] = useDeleteSmSMutation();

  const [
    deleteSmsEnAttente,
    { isLoading: isDeletingPendingSmsLoading, isError },
  ] = useDeleteSmsEnAttenteMutation();

  const pending_sms = data.filter((sms) => sms.status === "Pending");

  const [showDestinataire, setShowDestinataire] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState("arrow-overview");

  const handleSelect = (selectedKey: any) => {
    setActiveTab(selectedKey);
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Message a été créé avec succès",
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

  const AlertDelete = async (ids: string[]) => {
    swalWithBootstrapButtons
      .fire({
        title: "Etes-vous sûr?",
        text: "Vous ne pouvez pas revenir en arrière!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprime-les !",
        cancelButtonText: "Non, annuler !",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteSms(ids);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Les messages sélectionnés ont été supprimés.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Les messages sont en sécurité :)",
            "info"
          );
        }
      });
  };

  const AlertDeletePendingSms = async () => {
    swalWithBootstrapButtons
      .fire({
        title: "Etes-vous sûr?",
        text: "Vous ne pouvez pas revenir en arrière?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprime-le !",
        cancelButtonText: "Non, annuler !",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteSmsEnAttente();
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Les SMS en attente ont été supprimés avec succès.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Les SMS en attente sont sécurisés :)",
            "info"
          );
        }
      });
  };

  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    if (event.target.checked === true) {
      setSms((prevState) => ({
        ...prevState,
        include_names: "1",
      }));
    } else {
      setSms((prevState) => ({
        ...prevState,
        include_names: "0",
      }));
    }
  };

  const [modal_AddSms, setmodal_AddSms] = useState<boolean>(false);
  function tog_AddSms() {
    setmodal_AddSms(!modal_AddSms);
  }

  const handleReload = () => {
    window.location.reload();
  };

  const [createSms, { isLoading: loadingCreateSms }] = useAddSmSMutation();

  const [sendSms, { isLoading }] = useSendSmSMutation();

  const handleSendSms = async () => {
    try {
      await sendSms().then(() => handleReload);
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const initialSms = {
    sender: "",
    receivers: [""],
    msg: "",
    status: "",
    include_names: "1",
    specefic_students: [""],
    total_sms: "",
    sms_par_destinataire: "",
  };

  const [sms, setSms] = useState(initialSms);
  const [students, setStudents] = useState<any[]>([]);
  const {
    sender,
    receivers,
    msg,
    status,
    include_names,
    specefic_students,
    total_sms,
    sms_par_destinataire,
  } = sms;

  const optionColumnsTable = AllClasses.map((classe: any) => ({
    value: classe?._id!,
    label: `${classe?.nom_classe!}`,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  const handleSelectValueColumnChange = async (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
    let apiStudents = [];
    for (const classID of values) {
      const result = await fetchEtudiantsByClasseId(classID).unwrap();
      for (const eleve of result) {
        apiStudents.push(eleve);
      }
    }

    setStudents(apiStudents);
  };

  const optionEleves = students.map((eleve: any) => ({
    value: eleve?._id!,
    label: `${eleve?.prenom!} ${eleve?.nom!}`,
  }));

  const [selectedElevesValues, setSelectedEleveValues] = useState<any[]>([]);

  const handleSelectEleveChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedEleveValues(values);
  };

  useEffect(() => {
    if (AllParents.length > 0) {
      if (activeTab === "arrow-overview") {
        const parentIds = AllParents.map((parent) => parent?._id!);
        setSms((prevState) => ({
          ...prevState,
          receivers: parentIds,
        }));
      } else if (activeTab === "arrow-profile") {
        if (selectedColumnValues.length === 1) {
          setSms((prevState) => ({
            ...prevState,
            receivers: [""],
            specefic_students: selectedElevesValues,
          }));
        } else {
          setSms((prevState) => ({
            ...prevState,
            receivers: [""],
            specefic_students: students,
          }));
        }
      }
    }
  }, [
    AllParents,
    activeTab,
    selectedColumnValues,
    selectedElevesValues,
    students,
  ]);

  const onChangeSms = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSms((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const calculateSmsCount = (messageLength: number, isChecked: boolean) => {
    let firstLimit = isChecked ? 127 : 157;
    let subsequentLimit = 157;

    if (messageLength <= firstLimit) {
      return 1;
    }
    let smsCount = 1;
    messageLength -= firstLimit;
    smsCount += Math.ceil(messageLength / subsequentLimit);

    return smsCount;
  };

  const numberOfSms = calculateSmsCount(msg.length, isChecked);

  let totalSms = numberOfSms * receivers.length;

  const onSubmitSms = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      sms["sender"] = "SLS Sousse";
      sms["status"] = "Pending";
      sms["total_sms"] = totalSms.toString();
      sms["sms_par_destinataire"] = numberOfSms.toString();
      createSms(sms)
        .then(() => notifySuccess())
        .then(() => setSms(initialSms));
    } catch (error) {
      notifyError(error);
    }
  };

  const groupedData = Object.values(
    data.reduce((acc: any, current: any) => {
      const { msg } = current;

      if (!acc[msg]) {
        acc[msg] = {
          ...current,
          receiversCount: [current],
        };
      } else {
        acc[msg].receiversCount.push(current);
      }
      return acc;
    }, {})
  );

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Message</span>,
      selector: (row: any) => row.msg,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Destinataire(s)</span>,
      selector: (row: any) => (
        <Link
          to="#"
          state={row}
          onClick={() => setShowDestinataire(!showDestinataire)}
        >
          <span>{row.receiversCount.length}</span>
        </Link>
      ),
      sortable: true,
      width: "10%",
    },
    {
      name: <span className="font-weight-bold fs-13">SMS/Destinataire</span>,
      selector: (row: any) => row.sms_par_destinataire,
      sortable: true,
      width: "10%",
    },
    {
      name: <span className="font-weight-bold fs-13">Total SMS</span>,
      selector: (row: any) => row.total_sms,
      sortable: true,
      width: "8%",
    },
    {
      name: <span className="font-weight-bold fs-13">Etat</span>,
      selector: (cell: any) => {
        switch (cell.status) {
          case "Pending":
            return <span className="badge bg-warning"> En Attente </span>;
          case "sent":
            return <span className="badge bg-success"> Envoyé </span>;
          default:
            return <span className="badge bg-warning"> En Attente </span>;
        }
      },
      sortable: true,
      width: "8%",
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,
      cell: (row: any) => {
        const idsToDelete = row.receiversCount.map((sms: any) => sms._id);

        return row.status === "Pending" ? (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
                <i
                  className="ri-delete-bin-2-line"
                  onClick={() => AlertDelete(idsToDelete)}
                ></i>
              </Link>
            </li>
          </ul>
        ) : (
          ""
        );
      },
      width: "8%",
    },
  ];

  const textareaRef1 = useRef<HTMLTextAreaElement>(null);
  const textareaRef2 = useRef<HTMLTextAreaElement>(null);

  const destinataireLocation = useLocation();

  const handleShortcodeClick = (
    code: string,
    textareaRef: React.RefObject<HTMLTextAreaElement>
  ) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = sms.msg.slice(0, start) + code + sms.msg.slice(end);

      setSms((prevState) => ({
        ...prevState,
        msg: newText,
      }));

      setTimeout(() => {
        textarea.setSelectionRange(start + code.length, start + code.length);
        textarea.focus();
      }, 0);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="SMS Parents" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={2}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Rechercher ..."
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="d-flex align-items-center justify-content-start">
                      <div className="d-flex flex-column align-items-center mb-0">
                        <p className="h5 mb-1">Messages prêt à envoyer</p>
                        <h6 className="text-primary">{pending_sms.length}</h6>
                      </div>
                      <div className="ms-4">
                        {isLoading ? (
                          <button
                            className="btn btn-outline-primary btn-load d-flex align-items-center"
                            disabled
                          >
                            <span
                              className="spinner-border flex-shrink-0"
                              role="status"
                            />
                            <span className="flex-grow-1 ms-2">
                              En Cours...
                            </span>
                          </button>
                        ) : (
                          <button
                            className={`btn btn-primary btn-load d-flex align-items-center ${
                              pending_sms.length === 0 ? "disabled" : ""
                            }`}
                            onClick={handleSendSms}
                            disabled={pending_sms.length === 0}
                          >
                            <span className="flex-grow-1 ms-2">Envoyer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col lg={4} className="d-flex justify-content-end">
                    <div className="hstack gap-3">
                      <div
                        className="btn-group btn-group-sm"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={AlertDeletePendingSms}
                          disabled={
                            isDeletingPendingSmsLoading ||
                            pending_sms.length === 0
                          }
                        >
                          <i className="ri-delete-bin-2-line align-middle fs-20"></i>{" "}
                          {isDeletingPendingSmsLoading ? (
                            <span>Nettoyer ... </span>
                          ) : (
                            <span>Nettoyer Sms en attente</span>
                          )}
                        </button>
                      </div>
                      <div
                        className="btn-group btn-group-sm"
                        role="group"
                        aria-label="Basic example"
                      >
                        {loadingCreateSms ? (
                          <button
                            className="btn btn-outline-primary btn-load d-flex align-items-center"
                            disabled
                          >
                            <span
                              className="spinner-border flex-shrink-0"
                              role="status"
                            />
                            <span className="flex-grow-1 ms-2">
                              En Cours...
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => tog_AddSms()}
                          >
                            <i className="ri-add-fill align-middle fs-20"></i>{" "}
                            <span>Ajouter Message(s)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={groupedData.reverse()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddSms}
            onHide={() => {
              tog_AddSms();
            }}
            centered
            size="xl"
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Message(s)
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitSms}>
                <Card>
                  <Card.Body>
                    <Tab.Container
                      defaultActiveKey="arrow-overview"
                      onSelect={handleSelect}
                    >
                      <Nav
                        as="ul"
                        variant="pills"
                        className="arrow-navtabs nav-success bg-light mb-3"
                      >
                        <Nav.Item as="li">
                          <Nav.Link eventKey="arrow-overview">
                            <span className="d-block d-sm-none">
                              <i className="mdi mdi-home-variant"></i>
                            </span>
                            <span className="d-none d-sm-block">
                              Tous les groupes
                            </span>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item as="li">
                          <Nav.Link eventKey="arrow-profile">
                            <span className="d-block d-sm-none">
                              <i className="mdi mdi-account"></i>
                            </span>
                            <span className="d-none d-sm-block">
                              Groupe(s) Spécifique(s)
                            </span>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <Tab.Content className="text-muted">
                        <Tab.Pane eventKey="arrow-overview">
                          <Row className="mb-4">
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="formCheck1"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="formCheck1"
                              >
                                Inclure Nom élève au début de message.
                              </label>
                            </div>
                          </Row>
                          <Row className="mb-4">
                            <Col lg={2}>
                              <Form.Label htmlFor="msg">Message</Form.Label>
                            </Col>
                            <Col lg={7}>
                              <textarea
                                className="form-control"
                                id="msg"
                                name="msg"
                                value={sms.msg}
                                onChange={onChangeSms}
                                ref={textareaRef1}
                                rows={9}
                              ></textarea>
                              <div className="mt-2 text-end">
                                <span>
                                  {msg.length}/ {numberOfSms} SMS
                                </span>
                              </div>
                            </Col>
                            <Col lg={3}>
                              {filteredShortCode.map((code) => (
                                <Button
                                  type="button"
                                  variant="light"
                                  id="addNew"
                                  className="m-1"
                                  onClick={() =>
                                    handleShortcodeClick(
                                      code.code,
                                      textareaRef1
                                    )
                                  }
                                >
                                  {code.name}
                                </Button>
                              ))}
                            </Col>
                          </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="arrow-profile">
                          <Row className="mb-4">
                            <Col lg={2}>
                              <Form.Label htmlFor="classe">
                                Groupe(s)
                              </Form.Label>
                            </Col>
                            <Col lg={7}>
                              <Select
                                closeMenuOnSelect={false}
                                isMulti
                                options={optionColumnsTable}
                                onChange={handleSelectValueColumnChange}
                                placeholder="Choisir..."
                              />
                            </Col>
                          </Row>
                          {selectedColumnValues.length === 1 ? (
                            <Row className="mb-4">
                              <Col lg={2}>
                                <Form.Label htmlFor="classe">
                                  Elève(s)
                                </Form.Label>
                              </Col>
                              <Col lg={7}>
                                <Select
                                  closeMenuOnSelect={false}
                                  isMulti
                                  options={optionEleves}
                                  onChange={handleSelectEleveChange}
                                  placeholder="Choisir..."
                                />
                              </Col>
                            </Row>
                          ) : (
                            ""
                          )}
                          <Row className="mb-4">
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="formCheck1"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="formCheck1"
                              >
                                Inclure Nom élève au début de message.
                              </label>
                            </div>
                          </Row>
                          <Row className="mb-4">
                            <Col lg={2}>
                              <Form.Label htmlFor="msg">Message</Form.Label>
                            </Col>
                            <Col lg={7}>
                              <small className="text-muted">
                                Vous pouvez utiliser les abréviations dynamiques
                              </small>
                              <textarea
                                className="form-control"
                                id="msg"
                                name="msg"
                                value={sms.msg}
                                onChange={onChangeSms}
                                ref={textareaRef2}
                                rows={8}
                              ></textarea>
                              <div className="mt-2 text-end">
                                <span>
                                  {msg.length}/ {numberOfSms} SMS
                                </span>
                              </div>
                            </Col>
                            <Col lg={2}>
                              {filteredShortCode.map((code) => (
                                <Button
                                  type="button"
                                  variant="light"
                                  id="addNew"
                                  className="mb-2"
                                  onClick={() =>
                                    handleShortcodeClick(
                                      code.code,
                                      textareaRef2
                                    )
                                  }
                                >
                                  {code.name}
                                </Button>
                              ))}
                            </Col>
                          </Row>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </Card.Body>
                </Card>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddSms();
                        setSms(initialSms);
                      }}
                    >
                      Fermer
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddSms();
                      }}
                      type="submit"
                      variant="success"
                      id="addNew"
                    >
                      Ajouter
                    </Button>
                  </div>
                </Row>
              </Form>
            </Modal.Body>
          </Modal>
          <Offcanvas
            show={showDestinataire}
            onHide={() => setShowDestinataire(!showDestinataire)}
            placement="end"
            style={{ width: "40%" }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Destinataire(s)</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {destinataireLocation?.state?.receiversCount!.map((msg: any) => (
                <Row className="border-bottom border-bottom-dashed p-2">
                  <Col lg={5}>
                    <span className="fw-medium">Nom:</span>{" "}
                    {msg?.eleve?.prenom!} {msg?.eleve?.nom!}
                  </Col>
                  <Col lg={4}>
                    <span className="fw-medium">Classe:</span>{" "}
                    {msg?.eleve?.classe?.nom_classe!}
                  </Col>
                  <Col lg={3}>
                    <span className="fw-medium">Tel:</span>{" "}
                    {msg?.receiver?.phone!}
                  </Col>
                </Row>
              ))}
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default ParentsSmses;
