import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Offcanvas,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import TableContainer from "Common/TableContainer";
import { shipments } from "Common/data";
import offerbanner from "../../../../assets/images/ecommerce/offer-banner.jpg";
import { transaction } from "Common/data";
import SimpleBar from "simplebar-react";
import { productDelivery } from "Common/data";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { selectCurrentUser } from "../../features/account/authSlice";
const Status = ({ status }: any) => {
  switch (status) {
    case "Successful":
      return <span className="badge badge-soft-success"> {status}</span>;
    case "Denied":
      return <span className="badge badge-soft-danger"> {status}</span>;
    case "Pending":
      return <span className="badge badge-soft-warning"> {status}</span>;
    default:
      return <span className="badge badge-soft-success"> Successful </span>;
  }
};

const ModalNote = () => {
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<any>({});

  const [modal_Note, setmodal_Note] = useState<boolean>(false);
  function tog_ModalNotes() {
    setmodal_Note(!modal_Note);
  }

  return (
    <React.Fragment>
      <Modal
        className="fade zoomIn"
        size="lg"
        show={modal_Note}
        onHide={() => {
          tog_ModalNotes();
        }}
        centered
      ></Modal>
      <Row></Row>
    </React.Fragment>
  );
};

export default ModalNote;
