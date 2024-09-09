import React, { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useUpdateEvenementMutation } from "features/evenements/evenementSlice";
import { useUpdateGallerieMutation } from "features/galleries/gallerieSlice";

interface ChildProps {
  modal_UpdateGallerie: boolean;
  setmodal_UpdateGallerie: React.Dispatch<React.SetStateAction<boolean>>;
}

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const UpdateGallerie: React.FC<ChildProps> = ({
  modal_UpdateGallerie,
  setmodal_UpdateGallerie,
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

  const gallerieLocation = useLocation();

  const { data: AllClasses = [] } = useFetchClassesQuery();

  const [titreGallerie, setTitreGallerie] = useState<string>(
    gallerieLocation?.state?.titre ?? ""
  );

  const handleTitreGallerie = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitreGallerie(e.target.value);
  };

  const [descGallerie, setDescGallerie] = useState<string>(
    gallerieLocation?.state?.desc ?? ""
  );

  const handleDescGallerie = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDescGallerie(e.target.value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDate, setShowDate] = useState<boolean>(false);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  const existingClasse = gallerieLocation.state?.classes || [];

  const defaultFilsOptions =
    gallerieLocation.state?.classes?.map((item: any) => ({
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

  const [updateGallerie] = useUpdateGallerieMutation();

  const initialGallerie = {
    _id: "",
    classes: [""],
    titre: "",
    desc: "",
    creation_date: "",
    fichier_base64_string: [""],
    fichier_extension: [""],
    fichiers: [""],
  };

  const [Galleries, setGalleries] = useState(initialGallerie);

  const handleFileUpload = async (files: File[]) => {
    const base64Images = await Promise.all(
      files.map(async (file: File) => {
        const { base64Data, extension } = await convertToBase64(file);
        return {
          base64Data,
          extension,
          fileName: file.name,
        };
      })
    );

    setGalleries((prevState) => ({
      ...prevState,
      fichiers: [
        ...prevState.fichiers,
        ...base64Images.map(
          (img) => `data:image/${img.extension};base64,${img.base64Data}`
        ),
      ],
      fichier_base64_string: [
        ...prevState.fichier_base64_string,
        ...base64Images.map((img) => img.base64Data),
      ],
      fichier_extension: [
        ...prevState.fichier_extension,
        ...base64Images.map((img) => img.extension),
      ],
    }));
  };
  const allImages = [
    ...gallerieLocation.state.fichiers,
    // ...updateVehicleProfile.vehicle_images,
  ];
  const handleRemoveImage = (index: any) => {
    setGalleries((prevState) => {
      const newFichier = [...prevState.fichiers];
      newFichier.splice(index, 1);

      const newFichierBase64String = [...prevState.fichier_base64_string];
      newFichierBase64String.splice(index, 1);

      const newFichierExtension = [...prevState.fichier_extension];
      newFichierExtension.splice(index, 1);

      return {
        ...prevState,
        fichiers: newFichier,
        fichier_base64_string: newFichierBase64String,
        fichier_extension: newFichierExtension,
      };
    });
  };

  React.useEffect(() => {
    if (gallerieLocation?.state) {
      setGalleries((prevState) => ({
        ...prevState,
        fichiers: gallerieLocation.state.fichiers || [],
        fichier_base64_string:
          gallerieLocation.state.fichier_base64_string || [],
        fichier_extension: gallerieLocation.state.fichier_extension || [],
      }));
    }
  }, [gallerieLocation]);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "La gallerie a été mis à jour avec succès",
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

  const onSubmitGallerie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      Galleries["_id"] = gallerieLocation?.state?._id!;

      if (titreGallerie === "") {
        Galleries["titre"] = gallerieLocation?.state?.titre!;
      } else {
        Galleries["titre"] = titreGallerie;
      }

      if (descGallerie === "") {
        Galleries["desc"] = gallerieLocation?.state?.desc!;
      } else {
        Galleries["desc"] = descGallerie;
      }

      if (selectedColumnValues === "") {
        Galleries["classes"] = gallerieLocation?.state?.classes!;
      } else {
        Galleries["classes"] = selectedColumnValues;
      }

      if (selectedDate === null) {
        Galleries["creation_date"] = gallerieLocation?.state?.creation_date!;
      } else {
        Galleries["creation_date"] = selectedDate?.toDateString()!;
      }

      if (!Galleries.fichier_base64_string) {
        Galleries["fichiers"] = gallerieLocation?.state?.fichiers!;
        Galleries["fichier_base64_string"] =
          gallerieLocation?.state?.fichier_base64_string!;
        Galleries["fichier_extension"] =
          gallerieLocation?.state?.fichier_extension!;
      }

      updateGallerie(Galleries)
        .then(() => notifySuccess())
        .then(() => setGalleries(initialGallerie));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitGallerie}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="classes">Classe(s) </Form.Label>
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
            <Form.Label htmlFor="titreGallerie">Titre</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="titreGallerie"
              name="titreGallerie"
              value={titreGallerie}
              onChange={handleTitreGallerie}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="descGallerie">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="descGallerie"
              name="descGallerie"
              value={descGallerie}
              onChange={handleDescGallerie}
              rows={3}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{gallerieLocation.state.creation_date}</span>
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
          <Col lg={3}>
            <Form.Label htmlFor="fichier_base64_string">Fichiers</Form.Label>
          </Col>
          <Col lg={8}>
            <div className="d-flex justify-content-center flex-wrap">
              {allImages.length > 0 ? (
                allImages.map((image, index) => (
                  <div key={index} className="image-wrapper">
                    <Image
                      src={
                        image.startsWith("data:image")
                          ? image
                          : `http//localhost:3000/gallerieFiles/${image}`
                      }
                      alt={`Gallerie Image ${index + 1}`}
                      className="img-thumbnail p-1 bg-body mt-n3"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="d-flex justify-content-center mt-n2">
              <label
                htmlFor="profile_image"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Select affiliate logo"
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
                name="profile_image"
                id="profile_image"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    handleFileUpload(Array.from(files));
                  }
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
              onClick={() => setmodal_UpdateGallerie(!modal_UpdateGallerie)}
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

export default UpdateGallerie;
