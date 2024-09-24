import React, { useEffect, useState } from "react";
import { Container, Row, Card, Col, Button, Image } from "react-bootstrap";

import Breadcrumb from "Common/BreadCrumb";

import Swal from "sweetalert2";
import { useDeleteSalleMutation } from "features/salles/salleSlice";
import {
  UpdatePayload,
  useFetchSmsSettingsQuery,
  useUpdateSmsSettingsMutation,
} from "features/smsSettings/smsSettings";

import sms_bg from "assets/images/undraw_message_sent_re_q2kl.svg";
const Parametres = () => {
  const { data, isLoading = [] } = useFetchSmsSettingsQuery();

  const [deleteSalle] = useDeleteSalleMutation();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Paramètres SMS modifiées avec succès",
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
          deleteSalle(_id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "La salle est supprimée.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "La salle est en sécurité :)",
            "info"
          );
        }
      });
  };
  const [updateSmsSettings] = useUpdateSmsSettingsMutation();

  const [formData, setFormData] = useState<UpdatePayload[]>([]);

  useEffect(() => {
    let parametre = [];
    if (data !== undefined && isLoading === false) {
      for (const sms_setting of data) {
        parametre.push({
          id: sms_setting?._id!,
          status: sms_setting.sms_status,
          name: sms_setting.service_name,
        });
      }
      setFormData(parametre);
    }
  }, [data, isLoading]);

  const toggleStatus = (index: number) => {
    let prevSmsSettings = [...formData];

    prevSmsSettings[index].status =
      prevSmsSettings[index].status === "1" ? "0" : "1";

    setFormData(prevSmsSettings);

    // updateSmsSettings(prevSmsSettings[index]);
  };

  const handleUpdate = () => {
    updateSmsSettings(formData).then(() => notifySuccess());
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Paramètres SMS" pageTitle="Tableau de bord" />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Body>
                <Row>
                  <Col lg={3}>
                    {formData?.map((setting, index) => (
                      <Row className="border-bottom mt-2">
                        <Col lg={10} className="mb-3">
                          {setting.name}
                        </Col>
                        <Col lg={2}>
                          <div className="form-check form-switch">
                            <input
                              key={setting?.id!}
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id={`flexSwitchCheckChecked-${index}`}
                              checked={setting.status === "1"}
                              onChange={() => toggleStatus(index)}
                            />
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </Col>
                  <Col
                    lg={9}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <Image src={sms_bg} />
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <Button onClick={handleUpdate}>Mettre à jour</Button>
              </Card.Footer>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Parametres;
