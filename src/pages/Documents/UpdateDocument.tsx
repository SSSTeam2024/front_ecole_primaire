import React, { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";

import { useLocation } from "react-router-dom";

import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useUpdateDocumentMutation } from "features/documents/documentSlice";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { French } from "flatpickr/dist/l10n/fr";
import { formatDate } from "helpers/data_time_format";
import { convertToBase64 } from "helpers/base64_convert";

interface ChildProps {
  modal_UpdateDocument: boolean;
  setmodal_UpdateDocument: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateDocument: React.FC<ChildProps> = ({
  modal_UpdateDocument,
  setmodal_UpdateDocument,
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

  const documentLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [titreDoc, setTitreDoc] = useState<string>(
    documentLocation?.state?.titre ?? ""
  );

  const [documentDesc, setDocumentDesc] = useState<string>(
    documentLocation?.state?.desc ?? ""
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const existingClasse = documentLocation.state?.classes || [];

  const defaultFilsOptions =
    documentLocation.state?.classes?.map((item: any) => ({
      label: item.nom_classe,
      value: item?._id!,
    })) || [];

  const optionColumnsTable = AllClasses.map((classe: any) => ({
    value: classe?._id!,
    label: classe.nom_classe,
  }));

  const [selectedColumnValues, setSelectedColumnValues] = useState(
    existingClasse.map((fil: any) => fil?._id!)
  );

  const handleSelectValueColumnChange = (selectedOption: any) => {
    const values = selectedOption.map((option: any) => option.value);
    setSelectedColumnValues(values);
  };

  const handleTitreDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitreDoc(e.target.value);
  };

  const handleDocumentDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDocumentDesc(e.target.value);
  };

  const [updateDocument] = useUpdateDocumentMutation();

  const initialDocument = {
    _id: "",
    classes: [""],
    titre: "",
    desc: "",
    creation_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [documents, setDocuments] = useState(initialDocument);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_document = base64Data + "." + extension;
      setDocuments({
        ...documents,
        fichier: file_document,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le document a été mis à jour avec succès",
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

  const onSubmitDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      documents["_id"] = documentLocation?.state?._id!;

      if (titreDoc === "") {
        documents["titre"] = documentLocation?.state?.titre!;
      } else {
        documents["titre"] = titreDoc;
      }

      if (documentDesc === "") {
        documents["desc"] = documentLocation?.state?.desc!;
      } else {
        documents["desc"] = documentDesc;
      }

      if (selectedColumnValues === "") {
        documents["classes"] = documentLocation?.state?.classes!;
      } else {
        documents["classes"] = selectedColumnValues;
      }

      if (selectedDate === null) {
        documents["creation_date"] = documentLocation?.state?.creation_date!;
      } else {
        documents["creation_date"] = formatDate(selectedDate);
      }

      if (!documents.fichier_base64_string) {
        documents["fichier"] = documentLocation?.state?.fichier!;
        documents["fichier_base64_string"] =
          documentLocation?.state?.fichier_base64_string!;
        documents["fichier_extension"] =
          documentLocation?.state?.fichier_extension!;
      }

      updateDocument(documents)
        .then(() => notifySuccess())
        .then(() => setDocuments(initialDocument));
    } catch (error) {
      notifyError(error);
    }
  };

  const openFileInNewTab = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.target = "_blank";
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const handleButtonClick = () => {
    // const fileUrl = `${process.env.REACT_APP_BASE_URL}/documentFiles/${documentLocation.state.fichier}`;
    const fileUrl = `${process.env.REACT_APP_BASE_URL}/documentFiles/${documentLocation.state.fichier}`;
    const fileName = "sample.pdf";

    openFileInNewTab(fileUrl, fileName);
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitDocument}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="jour">Classe(s) </Form.Label>
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
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="titreDoc">Titre</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="titreDoc"
              name="titreDoc"
              value={titreDoc}
              onChange={handleTitreDoc}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="documentDesc">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="documentDesc"
              name="documentDesc"
              value={documentDesc}
              onChange={handleDocumentDesc}
              rows={3}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{documentLocation.state.creation_date}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "200px" }}
            >
              <label
                htmlFor="date"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir Date"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowDate(!showDate)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showDate && (
              <Flatpickr
                className="form-control flatpickr-input"
                placeholder="Choisir Date"
                options={{
                  dateFormat: "d M, Y",
                  locale: French,
                }}
                onChange={handleDateChange}
              />
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="file">Fichier</Form.Label>
          </Col>
          <Col lg={8}>
            <Button variant="soft-danger" onClick={handleButtonClick}>
              <i className="bi bi-filetype-pdf align-middle fs-22"></i>
            </Button>
            <div
              className="d-flex justify-content-start mt-n2"
              style={{ marginLeft: "50px" }}
            >
              <label
                htmlFor="fichier_base64_string"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Select Driving License"
              >
                <span className="d-inline-block">
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
              <input
                className="form-control d-none"
                type="file"
                name="fichier_base64_string"
                id="fichier_base64_string"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e)}
                style={{
                  width: "210px",
                  height: "120px",
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateDocument(!modal_UpdateDocument)}
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

export default UpdateDocument;
