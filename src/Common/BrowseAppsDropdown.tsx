import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

//SimpleBar
import SimpleBar from "simplebar-react";

import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { selectCurrentUser } from "../features/account/authSlice";

const BrowseAppsDropdown = () => {
  const emptyCart: any = useRef();

  // const { data = [] } = useFetchNoteQuery();
  const user1 = useSelector((state: RootState) => selectCurrentUser(state));

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  // pdf and image handlers
  const [selectedPdf, setSelectedPdf] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  useEffect(() => {
    if (pdfUrl !== "") {
      window.open(pdfUrl);
    }
  }, [pdfUrl]);

  useEffect(() => {
    if (photoUrl !== "") {
      window.open(photoUrl);
    }
  }, [photoUrl]);
  const openPdfInNewTab = (PDF: string) => {
    setSelectedPdf(PDF);
    setPdfUrl(`${process.env.REACT_APP_FILE_URL}/noteFiles/pdf/${PDF}`);
  };
  const openPhotoInNewTab = (PHOTO: string) => {
    setSelectedPhoto(PHOTO);
    setPhotoUrl(`${process.env.REACT_APP_FILE_URL}/noteFiles/photo/${PHOTO}`);
  };
  return (
    <React.Fragment>
      <Dropdown className="topbar-head-dropdown ms-1 header-item">
        <Dropdown.Toggle
          id="cart-dropdown"
          type="button"
          className="btn btn-icon btn-topbar btn-ghost-dark rounded-circle arrow-none"
        >
          <i className="bi bi-pencil-square "></i>
          {/* <span className="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info">
            {notesTotal}
          </span> */}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart">
          <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0 fs-16 fw-semibold"> My Notes</h6>
              </Col>
              <div className="col-auto">
                <span className="badge bg-info-subtle text-info fs-13">
                  {" "}
                  {/* <span className="cartitem-badge"> {notesTotal} </span> notes */}
                </span>
              </div>
            </Row>
          </div>
          <SimpleBar style={{ maxHeight: "300px" }}>
            <div className="p-2">
              <div
                className="text-center empty-cart"
                ref={emptyCart}
                style={{ display: "none" }}
              >
                <div className="avatar-md mx-auto my-3">
                  <div className="avatar-title bg-info-subtle fs-36 rounded-circle">
                    <i className="bx bx-cart"></i>
                  </div>
                </div>
                <h5 className="mb-3">Your Cart of notes is Empty!</h5>
                <Link to="/" className="btn btn-success w-md mb-3">
                  Write New One
                </Link>
              </div>
            </div>
          </SimpleBar>
          {/* <div className="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border d-grid" id="checkout-elem">
                          <div className="d-flex justify-content-between align-items-center pb-3">
                              <h5 className="m-0 text-muted">Total:</h5>
                              <div className="px-2">
                                  <h5 className="m-0">$ <span ref={cartItemTotal} id="cart-item-total">3400</span></h5>
                              </div>
                          </div>
  
                          <Link to="/apps-ecommerce-checkout" className="btn btn-success text-center w-100">
                              Checkout
                          </Link>
                      </div> */}
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default BrowseAppsDropdown;
