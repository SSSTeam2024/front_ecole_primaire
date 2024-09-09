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
import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import TableContainer from "Common/TableContainer";
import { shipments } from "Common/data";
import offerbanner from "../../../../assets/images/ecommerce/offer-banner.jpg";
import { transaction } from "Common/data";
import SimpleBar from "simplebar-react";
import { productDelivery } from "Common/data";

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

const ModalClaim = () => {
  const [paymentDetails, setPaymentDetails] = useState<any>({});

  const columns = useMemo(
    () => [
      {
        Header: "Transaction ID",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: any) => {
          return (
            <Link
              to="#"
              className="fw-medium"
              onClick={() => setPaymentDetails(cellProps)}
            >
              {cellProps.transactionID}
            </Link>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <Row>
        <div
          id="alert-error-msg"
          className="d-none alert alert-danger py-2"
        ></div>
        <Form className="tablelist-form">
          <input type="hidden" id="id-field" />
          <Row>
            <Col lg={16}>
              <div className="mb-3">
                <Form.Label htmlFor="customerName-field">Subject</Form.Label>
                <Form.Select
                  className="form-control form-control-sm"
                  id="subject-dropdown"
                  required
                >
                  <option value="default" disabled hidden>Select Subject</option>
                  <option value="accidents">Accidents</option>
                  <option value="driver-behavior">Driver Behavior</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="insurance">Insurance</option>
                  <option value="compliance">Compliance</option>
                  <option value="driver-training">Driver Training</option>
                  <option value="vehicle-usage">Vehicle Usage</option>
                  <option value="safety-concerns">Safety Concerns</option>
                  <option value="expense-reimbursement">
                    Expense Reimbursement
                  </option>
                  <option value="other">Other</option>
                </Form.Select>
              </div>
            </Col>
            <Col lg={12}>
              <div className="mb-3">
                <Form.Label htmlFor="supplierName-field">Message</Form.Label>

                <div>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea5"
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </Col>
            <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button variant="primary" id="add-btn">
                  Add Complain
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Row>
    </React.Fragment>
  );
};

export default ModalClaim;
