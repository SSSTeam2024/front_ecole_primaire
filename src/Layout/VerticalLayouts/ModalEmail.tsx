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

const ModalEmail = () => {
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
        <div className="col-xxl-12 col-lg-12">
          <div className="card card-height-100">
            <SimpleBar style={{ maxHeight: "445px" }}>
              {(productDelivery || []).map((item, key) => (
                <div
                  className="p-3 border-bottom border-bottom-dashed"
                  key={key}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.productName}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </SimpleBar>
          </div>
        </div>
      </Row>
    </React.Fragment>
  );
};

export default ModalEmail;