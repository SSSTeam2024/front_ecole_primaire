import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ModalEdit from "./ModalEdit";
import {
  useAddMatiereMutation,
  useDeleteMatiereMutation,
  useFetchMatieresQuery,
} from "features/matieres/matiereSlice";
import * as XLSX from "xlsx";

const Matieres = () => {
  const { data = [] } = useFetchMatieresQuery();

  const [deleteMatiere] = useDeleteMatiereMutation();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La matière a été créée avec succès",
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
          deleteMatiere(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La matière est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La matière est en sécurité :)",
            "info"
          );
        }
      });
  };

  const [modal_AddMatiere, setmodal_AddMatiere] = useState<boolean>(false);
  function tog_AddMatiere() {
    setmodal_AddMatiere(!modal_AddMatiere);
  }
  const [modal_UpdateMatiere, setmodal_UpdateMatiere] =
    useState<boolean>(false);
  function tog_UpdateMatiere() {
    setmodal_UpdateMatiere(!modal_UpdateMatiere);
  }
  const [createMatiere] = useAddMatiereMutation();

  const initialMatiere = {
    nom_matiere: "",
  };

  const [matiere, setMatiere] = useState(initialMatiere);

  const { nom_matiere } = matiere;

  const onChangeMatiere = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatiere((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitMatiere = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      createMatiere(matiere)
        .then(() => notifySuccess())
        .then(() => setMatiere(initialMatiere));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Nom Matière</span>,
      selector: (row: any) => row.nom_matiere,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Actions</span>,
      sortable: true,
      cell: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#"
                className="badge badge-soft-success edit-item-btn"
                onClick={() => tog_UpdateMatiere()}
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

  const [matieres, setMatieres] = useState(data);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getFilteredMatieres = () => {
    let filteredMatieres = data;

    if (searchTerm) {
      filteredMatieres = filteredMatieres.filter((matiere: any) =>
        matiere?.nom_matiere!.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredMatieres;
  };

  const submitExcelData = async (parsedData: any[]) => {
    try {
      for (const matiere of parsedData) {
        await createMatiere(matiere); // Assuming createMatiere is a promise-based function
      }
      notifySuccess();
    } catch (error) {
      notifyError("An error occurred while uploading matieres.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const excelData = XLSX.utils.sheet_to_json(worksheet);

        // Assuming the structure [{ nom_matiere: 'value' }]
        const parsedData = excelData.map((row: any) => ({
          nom_matiere: row["nom_matiere"],
        }));

        // Submit the parsed data to the backend
        submitExcelData(parsedData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Matières" pageTitle="Tableau de bord" />
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
                  <Col lg={7} className="text-end">
                    <div className="mb-3">
                      <Form.Control
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        id="file-upload"
                        style={{ display: "none" }}
                      />
                      <button
                        type="button"
                        className="btn btn-darken-success"
                        onClick={() =>
                          document.getElementById("file-upload")?.click()
                        }
                      >
                        <i className="ri-file-excel-2-line align-middle fs-18"></i>{" "}
                        <span>Télécharger Fichier Excel</span>
                      </button>
                    </div>
                  </Col>
                  <Col lg={2} className="text-end">
                    <div className="mb-3">
                      <button
                        type="button"
                        className="btn btn-darken-primary"
                        onClick={() => tog_AddMatiere()}
                      >
                        <i className="ri-add-fill align-middle fs-18"></i>{" "}
                        <span>Ajouter Matière</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable
                  columns={columns}
                  data={getFilteredMatieres()}
                  pagination
                />
              </Card.Body>
            </Card>
          </Col>
          <Modal
            className="fade"
            id="createModal"
            show={modal_AddMatiere}
            onHide={() => {
              tog_AddMatiere();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Ajouter Matière
              </h1>
            </Modal.Header>
            <Modal.Body>
              <Form className="create-form" onSubmit={onSubmitMatiere}>
                <Row>
                  <Col lg={12} className="d-flex justify-content-center">
                    <div className="mb-3">
                      <Form.Label htmlFor="nom_matiere">Nom</Form.Label>
                      <Form.Control
                        type="text"
                        id="nom_matiere"
                        name="nom_matiere"
                        onChange={onChangeMatiere}
                        value={matiere.nom_matiere}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      variant="light"
                      onClick={() => {
                        tog_AddMatiere();
                        setMatiere(initialMatiere);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        tog_AddMatiere();
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
            show={modal_UpdateMatiere}
            onHide={() => {
              tog_UpdateMatiere();
            }}
            centered
          >
            <Modal.Header closeButton>
              <h1 className="modal-title fs-5" id="createModalLabel">
                Modifier Matiere
              </h1>
            </Modal.Header>
            <Modal.Body>
              <ModalEdit
                modal_UpdateMatiere={modal_UpdateMatiere}
                setmodal_UpdateMatiere={setmodal_UpdateMatiere}
              />
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Matieres;
