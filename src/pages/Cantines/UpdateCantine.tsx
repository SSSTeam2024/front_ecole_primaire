import React, { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";

import { useLocation } from "react-router-dom";

import Flatpickr from "react-flatpickr";

import { useUpdateCantineMutation } from "features/cantines/cantineSlice";

interface ChildProps {
  modal_UpdateCantine: boolean;
  setmodal_UpdateCantine: React.Dispatch<React.SetStateAction<boolean>>;
}

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(","); // Extract only the Base64 data
      const extension = file.name.split(".").pop() ?? ""; // Get the file extension
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const UpdateCantine: React.FC<ChildProps> = ({
  modal_UpdateCantine,
  setmodal_UpdateCantine,
}) => {
  const cantineLocation = useLocation();

  const [cantineRepas, setCantineRepas] = useState<string>(
    cantineLocation?.state?.repas ?? ""
  );

  const [cantineDesc, setCantineDesc] = useState<string>(
    cantineLocation?.state?.desc ?? ""
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const [selectedJour, setSelectedJour] = useState<string>("");
  const [showJour, setShowJour] = useState<boolean>(false);

  const handleSelectJour = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedJour(value);
  };

  const handleCantineRepas = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantineRepas(e.target.value);
  };

  const handleCantineDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCantineDesc(e.target.value);
  };

  const [updateCantine] = useUpdateCantineMutation();

  const initialCantine = {
    _id: "",
    jour: "",
    repas: "",
    desc: "",
    creation_date: "",
    fichier_base64_string: "",
    fichier_extension: "",
    fichier: "",
  };

  const [cantine, setCantine] = useState(initialCantine);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("fichier_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const file_cantine = base64Data + "." + extension;
      setCantine({
        ...cantine,
        fichier: file_cantine,
        fichier_base64_string: base64Data,
        fichier_extension: extension,
      });
    }
  };

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La cantine a été mis à jour avec succès",
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

  const onSubmitCantine = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      cantine["_id"] = cantineLocation?.state?._id!;

      if (cantineRepas === "") {
        cantine["repas"] = cantineLocation?.state?.repas!;
      } else {
        cantine["repas"] = cantineRepas;
      }

      if (cantineDesc === "") {
        cantine["desc"] = cantineLocation?.state?.desc!;
      } else {
        cantine["desc"] = cantineDesc;
      }

      if (selectedJour === "") {
        cantine["jour"] = cantineLocation?.state?.jour!;
      } else {
        cantine["jour"] = selectedJour;
      }

      if (selectedDate === null) {
        cantine["creation_date"] = cantineLocation?.state?.creation_date!;
      } else {
        cantine["creation_date"] = selectedDate?.toDateString()!;
      }

      if (!cantine.fichier_base64_string) {
        cantine["fichier"] = cantineLocation?.state?.fichier!;
        cantine["fichier_base64_string"] =
          cantineLocation?.state?.fichier_base64_string!;
        cantine["fichier_extension"] =
          cantineLocation?.state?.fichier_extension!;
      }

      updateCantine(cantine)
        .then(() => notifySuccess())
        .then(() => setCantine(initialCantine));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitCantine}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="jour">Jour </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{cantineLocation?.state?.jour!}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "100px" }}
              >
                <label
                  htmlFor="jour"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Jour"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowJour(!showJour)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showJour && (
                <select
                  className="form-select text-muted"
                  name="jour"
                  id="jour"
                  onChange={handleSelectJour}
                >
                  <option value="">Choisir</option>
                  <option value="Lundi">Lundi</option>
                  <option value="Mardi">Mardi</option>
                  <option value="Mercredi">Mercredi</option>
                  <option value="Jeudi">Jeudi</option>
                  <option value="Vendredi">Vendredi</option>
                  {/* <option value="Samedi">
                      Samedi
                      </option> */}
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="repas">Repas</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="repas"
              name="repas"
              value={cantineRepas}
              onChange={handleCantineRepas}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="cantineDesc">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="cantineDesc"
              name="cantineDesc"
              value={cantineDesc}
              onChange={handleCantineDesc}
              rows={3}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{cantineLocation.state.creation_date}</span>
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
                }}
                onChange={handleDateChange}
              />
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <div className="d-flex justify-content-center">
            {cantine.fichier && cantine.fichier_base64_string ? (
              <Image
                src={`data:image/jpeg;base64, ${cantine.fichier_base64_string}`}
                alt=""
                className="img-thumbnail p-1 bg-body mt-n3"
                width="200"
              />
            ) : (
              <Image
                src={`${
                  process.env.REACT_APP_BASE_URL
                }/cantineFiles/${cantineLocation?.state?.fichier!}`}
                alt=""
                className="img-thumbnail p-1 bg-body mt-n3"
                width="200"
              />
            )}
          </div>
          <div
            className="d-flex justify-content-center mt-n4"
            style={{ marginLeft: "100px" }}
          >
            <label
              htmlFor="fichier_base64_string"
              className="mb-0"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Choisir image pour le repas"
            >
              <span className="avatar-xs d-inline-block">
                <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                  <i className="bi bi-pen"></i>
                </span>
              </span>
            </label>
            <input
              className="form-control d-none"
              type="file"
              name="fichier_base64_string"
              id="fichier_base64_string"
              accept="image/*"
              onChange={(e) => handleFileUpload(e)}
              style={{ width: "210px", height: "120px" }}
            />
          </div>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateCantine(!modal_UpdateCantine)}
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

export default UpdateCantine;
