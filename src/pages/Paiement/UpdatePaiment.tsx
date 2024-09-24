import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useUpdatePaiementMutation } from "features/paiements/paiementSlice";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

interface ChildProps {
  modal_UpdatePaiement: boolean;
  setmodal_UpdatePaiement: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatePaiment: React.FC<ChildProps> = ({
  modal_UpdatePaiement,
  setmodal_UpdatePaiement,
}) => {
  const paiementLocation = useLocation();
  const { data = [] } = useFetchEtudiantsQuery();
  const [selectedEleve, setSelectedEleve] = useState<string>("");

  const handleSelectEleve = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedEleve(value);
  };

  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  const handleSelectPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPeriod(value);
  };

  const [paiment_montant, setPaiementMontant] = useState<string>(
    paiementLocation?.state?.montant ?? ""
  );
  const [paiement_id, setPaimentId] = useState<string>(
    paiementLocation?.state?._id! ?? ""
  );

  const handlePaiementMontant = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaiementMontant(e.target.value);
  };

  const [showEleve, setShowEleve] = useState<boolean>(false);
  const [showPeriod, setShowPeriod] = useState<boolean>(false);

  const [updatePaiment] = useUpdatePaiementMutation();

  const initialPaiment = {
    eleve: "",
    montant: "",
    date_paiement: "",
    annee_scolaire: "",
    period: "",
    designation: "",
    service_sms: "",
  };

  const [paiement, setPaiment] = useState(initialPaiment);

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le paiement a été mis à jour avec succès",
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

  const [anneeScolaire, setAnneeScolaire] = useState<string>("");
  const currentDate = new Date();
  useEffect(() => {
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    let anneeScolaire: string;
    if (currentMonth >= 9 && currentMonth <= 12) {
      anneeScolaire = `${currentYear}/${currentYear + 1}`;
    } else {
      anneeScolaire = `${currentYear - 1}/${currentYear}`;
    }

    setAnneeScolaire(anneeScolaire);
  }, []);

  const formattedDate = formatDate(currentDate);

  const onSubmitUpdatePaiment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const update_paiement = {
        _id: paiement_id || paiementLocation?.state?._id!,
        montant: paiment_montant || paiementLocation?.state?.montant,
        date_paiement: formattedDate || paiementLocation?.state?.date_paiement,
        annee_scolaire:
          anneeScolaire || paiementLocation?.state?.annee_scolaire,
        eleve: selectedEleve || paiementLocation?.state?.eleve,
        period: selectedPeriod || paiementLocation?.state?.period,
        designation: paiementLocation?.state?.designation,
        service_sms: "false",
      };
      updatePaiment(update_paiement)
        .then(() => notifySuccess())
        .then(() => setPaiment(initialPaiment));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={onSubmitUpdatePaiment}>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="eleve">Elève : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>
                {paiementLocation.state.eleve.nom}{" "}
                {paiementLocation.state.eleve.prenom}
              </span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="id_file"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Elève"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowEleve(!showEleve)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showEleve && (
                <select
                  className="form-select text-muted"
                  name="eleve"
                  id="eleve"
                  onChange={handleSelectEleve}
                >
                  <option value="">Choisir</option>
                  {data.map((eleve) => (
                    <option value={eleve._id!} key={eleve?._id!}>
                      {eleve.nom} {eleve.prenom}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="eleve">Période : </Form.Label>
          </Col>
          <Col lg={8}>
            <div className="mb-3">
              <span>{paiementLocation.state.period}</span>
              <div
                className="d-flex justify-content-start mt-n3"
                style={{ marginLeft: "140px" }}
              >
                <label
                  htmlFor="period"
                  className="mb-0"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Choisir Période"
                >
                  <span
                    className="d-inline-block"
                    onClick={() => setShowPeriod(!showPeriod)}
                  >
                    <span className="text-success cursor-pointer">
                      <i className="bi bi-pen fs-14"></i>
                    </span>
                  </span>
                </label>
              </div>
              {showPeriod && (
                <select
                  className="form-select text-muted"
                  name="period"
                  id="period"
                  onChange={handleSelectPeriod}
                >
                  <option value="">Choisir</option>
                  <option value="Annuel">Annuel</option>
                  <option value="1er Versement">1er Versement</option>
                  <option value="2ème Versement">2ème Versement</option>
                  <option value="3ème Versement">3ème Versement</option>
                </select>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="designation">Désignation</Form.Label>
          </Col>
          <Col lg={8}>
            {" "}
            {paiementLocation.state.designation.map(
              (item: any, index: number) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  label={item}
                  checked={true}
                  // onChange={() => {
                  // }}
                />
              )
            )}
          </Col>
        </Row>
        <Row className="mb-4">
          <Col lg={3}>
            <Form.Label htmlFor="paiment_montant">Montant</Form.Label>
          </Col>
          <Col lg={8}>
            <Form.Control
              type="text"
              id="paiment_montant"
              name="paiment_montant"
              value={paiment_montant}
              onChange={handlePaiementMontant}
            />
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-2 justify-content-center mb-2">
            <Button
              type="submit"
              className="btn-soft-success"
              onClick={() => setmodal_UpdatePaiement(!modal_UpdatePaiement)}
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

export default UpdatePaiment;
