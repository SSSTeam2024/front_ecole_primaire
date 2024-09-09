import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import Select from "react-select";
import { useUpdateRendezvousMutation } from "features/rendezvous/rendezvousSlice";

interface ChildProps {
  modal_UpdateRendezvous: boolean;
  setmodal_UpdateRendezvous: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateRendezvous: React.FC<ChildProps> = ({
  modal_UpdateRendezvous,
  setmodal_UpdateRendezvous,
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

  const rendezvousLocation = useLocation();

  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();

  // Date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    setSelectedDate(selectedDates[0]);
  };

  // Heure
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const handleTimeChange = (selectedDates: Date[]) => {
    const time = selectedDates[0];
    setSelectedTime(time);
  };

  // Enseignants
  const [selectedValues, setSelectedValues] = useState(
    rendezvousLocation?.state?.enseignants || []
  );

  const allEnseignantsOptions = AllEnseignants.map((enseignant) => ({
    value: enseignant?._id!,
    label: `${enseignant.nom_enseignant} ${enseignant.prenom_enseignant}`,
  }));

  const defaultEnseignantsOptions =
    rendezvousLocation?.state?.enseignants?.map((item: any) => ({
      label: `${item.nom_enseignant} ${item.prenom_enseignant}`,
      value: item._id,
    })) || [];

  const handleSelectValueColumnChange = (selectedOptions: any) => {
    const values = selectedOptions.map((option: any) => option.value);
    setSelectedValues(values);
  };

  // Titre
  const [rendezvous_titre, setRendezvousTitre] = useState<string>(
    rendezvousLocation?.state?.titre ?? ""
  );

  const handleTitre = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRendezvousTitre(e.target.value);
  };

  // Description
  const [rendezvous_description, setRendezvousDescription] = useState<string>(
    rendezvousLocation?.state?.description ?? ""
  );

  const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRendezvousDescription(e.target.value);
  };

  // ID
  const [rendezvous_id, setRendezvousId] = useState<string>(
    rendezvousLocation?.state?._id! ?? ""
  );

  const [showEnseignant, setShowEnseignant] = useState<boolean>(false);

  const [showTime, setShowTime] = useState<boolean>(false);

  const [showDate, setShowDate] = useState<boolean>(false);

  const [updateRendezvous] = useUpdateRendezvousMutation();

  const initialRendezvous = {
    titre: "",
    date: "",
    description: "",
    enseignants: [""],
    heure: "",
  };

  const [rendezvous, setRendezvous] = useState(initialRendezvous);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le rendez-vous a été mis à jour avec succès",
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

  const onSubmitUpdateRendezvous = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_rendezvous = {
        _id: rendezvous_id || rendezvousLocation?.state?._id!,
        titre: rendezvous_titre || rendezvousLocation?.state?.titre,
        description:
          rendezvous_description || rendezvousLocation?.state?.description,
        date: selectedDate?.toDateString()! || rendezvousLocation?.state?.date,
        heure:
          selectedTime?.toLocaleTimeString()! ||
          rendezvousLocation?.state?.heure!,
        enseignants: selectedValues || rendezvousLocation?.state?.enseignants!,
      };
      updateRendezvous(update_rendezvous)
        .then(() => notifySuccess())
        .then(() => setRendezvous(initialRendezvous));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdateRendezvous}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="enseignants">Enseignant(s) : </Form.Label>
          </Col>
          <Col lg={8}>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={allEnseignantsOptions}
              styles={customStyles}
              onChange={handleSelectValueColumnChange}
              placeholder="Filter Columns"
              defaultValue={defaultEnseignantsOptions}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="titre">Titre</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="titre"
              name="titre"
              value={rendezvous_titre}
              onChange={handleTitre}
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="description">Description</Form.Label>
          </Col>
          <Col lg={8}>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={rendezvous_description}
              onChange={handleDescription}
              rows={3}
            ></textarea>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="date">Date</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{rendezvousLocation.state.date}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "230px" }}
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
            <Form.Label htmlFor="heure">Heure</Form.Label>
          </Col>
          <Col lg={8}>
            <span>{rendezvousLocation.state.heure}</span>
            <div
              className="d-flex justify-content-start mt-n3"
              style={{ marginLeft: "230px" }}
            >
              <label
                htmlFor="heure"
                className="mb-0"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Choisir heure"
              >
                <span
                  className="d-inline-block"
                  onClick={() => setShowTime(!showTime)}
                >
                  <span className="text-success cursor-pointer">
                    <i className="bi bi-pen fs-14"></i>
                  </span>
                </span>
              </label>
            </div>
            {showTime && (
              <Flatpickr
                className="form-control"
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                onChange={handleTimeChange}
              />
            )}
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdateRendezvous(!modal_UpdateRendezvous)}
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

export default UpdateRendezvous;
