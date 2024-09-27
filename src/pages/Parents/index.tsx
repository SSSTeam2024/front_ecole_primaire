import React, { useState } from "react";
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
  useAddParentMutation,
  useDeleteParentMutation,
  useFetchParentsQuery,
} from "features/parents/parentSlice";
import Select from "react-select";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import UpdateParent from "./UpdateParent";

const Parents = () => {
  const { data = [] } = useFetchParentsQuery();
  const { data: AllEtudiants = [] } = useFetchEtudiantsQuery();

  const [showParent, setShowParent] = useState<boolean>(false);

  const [deleteParent] = useDeleteParentMutation();
  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le parent a été créé avec succès",
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

  const AlertDelete = async (_id: any) => {
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
          deleteParent(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le parent est supprimé.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le parent est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddParent, setmodal_AddParent] = useState<boolean>(false);
  function tog_AddParent() {
    setmodal_AddParent(!modal_AddParent);
  }
  const [modal_UpdateParent, setmodal_UpdateParent] = useState<boolean>(false);
  function tog_UpdateParent() {
    setmodal_UpdateParent(!modal_UpdateParent);
  }

  const filtredEtudiants = AllEtudiants.filter(
    (etudiant) => etudiant?.parent! === null
  );

  const optionColumnsTable = filtredEtudiants.map((etudiant: any) => ({
    value: etudiant?._id!,
    label: `${etudiant.nom} ${etudiant.prenom} _ ${etudiant?.classe
      ?.nom_classe!}`,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState<any[]>([]);

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const [createParent] = useAddParentMutation();

  const initialParent = {
    cin: "",
    nom_parent: "",
    prenom_parent: "",
    phone: "",
    username: "",
    password: "",
    fils: [
      {
        _id: "",
        nom: "",
        prenom: "",
        avatar: "",
      },
    ],
    profession: "",
  };

  const [parent, setParent] = useState(initialParent);

  const {
    cin,
    nom_parent,
    prenom_parent,
    phone,
    username,
    password,
    fils,
    profession,
  } = parent;

  const onChangeParent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParent((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitParent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const lastSixDigits = phone.slice(-6);
      const reversedLastSixDigits = lastSixDigits.split("").reverse().join("");

      parent["username"] = phone;
      parent["password"] = reversedLastSixDigits;
      parent["fils"] = selectedColumnValues;
      createParent(parent)
        .then(() => notifySuccess())
        .then(() => setParent(initialParent));
    } catch (error) {
      notifyError(error);
    }
  };
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom</span>,
      selector: (row: any) => row.nom_parent,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Prénom</span>,
      selector: (row: any) => row.prenom_parent,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">C.I.N</span>,
      selector: (row: any) => row?.cin!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Téléphone</span>,
      selector: (row: any) => row?.phone!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Profession</span>,
      selector: (row: any) => row?.profession!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Fils</span>,
      selector: (row: any) => {
        return (
          <ul className="vstack gap-2 list-unstyled mb-0">
            {row.fils.map((fils: any) => (
              <li key={fils._id}>
                {fils.nom} {fils.prenom}
              </li>
            ))}
          </ul>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#"
                className="badge badge-soft-info edit-item-btn"
                onClick={() => setShowParent(!showParent)}
                state={row}
              >
                <i
                  className="ri-eye-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge badge-soft-success edit-item-btn"
                onClick={() => tog_UpdateParent()}
                state={row}
              >
                <i
                  className="ri-edit-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>
            <li>
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
                <i
                  className="ri-delete-bin-2-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.2em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onClick={() => AlertDelete(row._id)}
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const parentLocation = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredParents = () => {
    let filteredParents = data;

    if (searchTerm) {
      filteredParents = filteredParents.filter(
        (parent: any) =>
          parent
            ?.nom_parent!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          parent
            ?.prenom_parent!.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          parent?.phone!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parent?.cin!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parent?.username!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredParents;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Parents" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={3}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Rechercher ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col lg={7}></Col>
                  <Col lg={2} className="d-flex justify-content-end">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => tog_AddParent()}
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
                        <span>Ajouter Parent</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredParents()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddParent}
            onHide={() => {
              tog_AddParent();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Parent
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitParent}>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="nom_parent">Nom</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="nom_parent"
                      name="nom_parent"
                      onChange={onChangeParent}
                      value={parent.nom_parent}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="prenom_parent">Prénom</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="prenom_parent"
                      name="prenom_parent"
                      onChange={onChangeParent}
                      value={parent.prenom_parent}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="cin">C.I.N</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="cin"
                      name="cin"
                      onChange={onChangeParent}
                      value={parent.cin}
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="phone">Téléphone</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="phone"
                      name="phone"
                      onChange={onChangeParent}
                      value={parent.phone}
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
                    />
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col lg={3}>
                    <Form.Label htmlFor="profession">Profession</Form.Label>
                  </Col>
                  <Col lg={8}>
                    <Form.Control
                      type="text"
                      id="profession"
                      name="profession"
                      onChange={onChangeParent}
                      value={parent.profession}
                    />
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddParent();
                        setParent(initialParent);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddParent();
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
          <Modal
            className="fade"
            id="createModal"
            show={modal_UpdateParent}
            onHide={() => {
              tog_UpdateParent();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Parent
              </h1>
            </Modal.Header>
            <Modal.Body>
              <UpdateParent
                modal_UpdateParent={modal_UpdateParent}
                setmodal_UpdateParent={setmodal_UpdateParent}
              />
            </Modal.Body>
          </Modal>
        </Container>
        <Offcanvas
          show={showParent}
          onHide={() => setShowParent(!showParent)}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Détails du parent</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="mt-3">
              <div className="p-3 border-bottom border-bottom-dashed">
                <table>
                  <tr>
                    <td>
                      <h6>Nom :</h6>{" "}
                    </td>
                    <td>
                      <i>{parentLocation?.state?.nom_parent!}</i>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Prénom : </h6>
                    </td>
                    <td>
                      <i>{parentLocation?.state?.prenom_parent!}</i>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>C.I.N : </h6>
                    </td>
                    <td>
                      <i>{parentLocation?.state?.cin!}</i>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Téléphone : </h6>
                    </td>
                    <td>
                      <i>{parentLocation?.state?.phone!}</i>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Profession : </h6>
                    </td>
                    <td>
                      <i>{parentLocation?.state?.profession!}</i>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h6>Fils : </h6>
                    </td>
                    <td>
                      <ul className="vstack gap-2 list-unstyled mb-0">
                        {parentLocation?.state?.fils.map((fils: any) => (
                          <li key={fils._id}>
                            <img
                              src={`${process.env.REACT_APP_BASE_URL}/etudiantFiles/${fils.avatar}`}
                              alt=""
                              className="rounded avatar-sm"
                            />
                            {fils.nom} {fils.prenom}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </React.Fragment>
  );
};
export default Parents;
