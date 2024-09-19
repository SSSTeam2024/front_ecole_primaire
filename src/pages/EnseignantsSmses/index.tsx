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
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAddSmSMutation,
  useFetchSmSQuery,
  useSendSmSMutation,
} from "features/smsEnseignants/smsEnseignantSlice";
import Select from "react-select";
import shortCode from "Common/shortCode";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";

const EnseignantsSmses = () => {
  const { data = [] } = useFetchSmSQuery();

  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  const pending_sms = data.filter((sms) => sms.status === "Pending");

  const [showDestinataire, setShowDestinataire] = useState<boolean>(false);

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

  const [modal_AddSms, setmodal_AddSms] = useState<boolean>(false);
  function tog_AddSms() {
    setmodal_AddSms(!modal_AddSms);
  }

  const [createSms] = useAddSmSMutation();

  const [sendSms, { isLoading }] = useSendSmSMutation();

  const handleReload = () => {
    window.location.reload();
  };

  const handleSendSms = async () => {
    try {
      await sendSms().then(() => handleReload);
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const initialSms = {
    sender: "",
    msg: "",
    status: "",
    include_names: "1",
    specefic_enseignants: [""],
    total_sms: "",
    sms_par_destinataire: "",
  };

  const [sms, setSms] = useState(initialSms);

  const {
    sender,
    msg,
    status,
    include_names,
    specefic_enseignants,
    total_sms,
    sms_par_destinataire,
  } = sms;

  const optionEnseignant = AllEnseignants.map((enseignant: any) => ({
    value: enseignant?._id!,
    label: `${enseignant?.prenom_enseignant!} ${enseignant?.nom_enseignant!} ___${" "} ${enseignant?.matiere!}`,
  }));

  const [selectedEnseignant, setSelectedEnseignant] = useState<any[]>([]);

  const handleSelectEnseignant = async (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedEnseignant(values);
  };

  useEffect(() => {
    setSms((prevState) => ({
      ...prevState,
      specefic_enseignants: selectedEnseignant,
    }));
  }, [AllEnseignants, selectedEnseignant]);

  const onChangeSms = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSms((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const calculateSmsCount = (messageLength: number) => {
    return messageLength <= 157
      ? 1
      : Math.ceil((messageLength - 157) / 158) + 1;
  };

  const numberOfSms = calculateSmsCount(msg.length);
  let totalSms = numberOfSms * specefic_enseignants.length;
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
  ];

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const destinataireLocation = useLocation();

  const handleShortcodeClick = (code: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = msg.slice(0, start) + code + msg.slice(end);

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

  const filteredShortCode = shortCode.filter(
    (item) =>
      item.name.toLowerCase().includes("enseignant") ||
      item.code.toLowerCase().includes("enseignant")
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="SMS Enseignants" pageTitle="Tableau de bord" />
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
                  <Col lg={8}>
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
                  <Col lg={2} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddSms()}
                      >
                        <i
                          className="ri-add-fill align-middle"
                          style={{
                            transition: "transform 0.3s ease-in-out",
                            cursor: "pointer",
                            fontSize: "1.5em",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.3)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        ></i>{" "}
                        <span>Ajouter Message(s)</span>
                      </button>
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
                Ajouter Message
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitSms}>
                {/* <Card>
                  <Card.Body> */}
                {/* <Tab.Container
                      defaultActiveKey="arrow-contact"
                      onSelect={handleSelect}
                    > */}
                {/* <Nav
                        as="ul"
                        variant="pills"
                        className="arrow-navtabs nav-success bg-light mb-3"
                      >
                        <Nav.Item as="li">
                          <Nav.Link eventKey="arrow-contact">
                            <span className="d-block d-sm-none">
                              <i className="mdi mdi-email"></i>
                            </span>
                            <span className="d-none d-sm-block">
                              Enseignant(s)
                            </span>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav> */}
                {/* <Tab.Content className="text-muted">
                        <Tab.Pane eventKey="arrow-contact"> */}
                <Row className="mb-4">
                  <Col lg={2}>
                    <Form.Label htmlFor="enseignant">Enseignant(s)</Form.Label>
                  </Col>
                  <Col lg={7}>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={optionEnseignant}
                      onChange={handleSelectEnseignant}
                      placeholder="Choisir..."
                    />
                  </Col>
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
                      ref={textareaRef}
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
                        onClick={() => handleShortcodeClick(code.code)}
                      >
                        {code.name}
                      </Button>
                    ))}
                  </Col>
                </Row>
                {/* </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container> */}
                {/* </Card.Body>
                </Card> */}
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
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Destinataire(s)</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {destinataireLocation?.state?.receiversCount!.map((msg: any) => (
                <Row className="border-bottom border-bottom-dashed p-2">
                  <Col>
                    <span className="fw-medium">Nom:</span>{" "}
                    {msg.receiver.prenom_enseignant}{" "}
                    {msg.receiver.nom_enseignant}
                  </Col>
                  <Col>
                    <span className="fw-medium">Tel:</span> {msg.receiver.phone}
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
export default EnseignantsSmses;
