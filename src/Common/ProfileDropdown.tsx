import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
//import images
import { RootState } from "../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../features/account/authSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import logo from "assets/images/sls-logo2.png";

const ProfileDropdown = () => {
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const navigate = useNavigate();

  const logout = () => {
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/central/logout/${user._id}`,
        {}
      )
      .then((res: any) => {
        console.log(res);
        Cookies.remove("astk");
        navigate("/login");
      });
  };

  return (
    <React.Fragment>
      <Dropdown className="ms-sm-3 header-item topbar-user">
        <Dropdown.Toggle
          type="button"
          className="btn bg-transparent border-0 arrow-none"
          id="page-header-user-dropdown"
        >
          <span className="d-flex align-items-center">
            <img className="rounded-circle" src={logo} width={100} />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {user.name}
              </span>
              {/* <span className="d-none d-xl-block ms-1 fs-13 text-muted user-name-sub-text">Founder</span> */}
            </span>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {user.name}!</h6>
          <Dropdown.Item href="/profile">
            <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle">Profile</span>
          </Dropdown.Item>
          {/* <Dropdown.Item href="/#!"><i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Messages</span></Dropdown.Item>
                    <Dropdown.Item href="/#!"><i className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Taskboard</span></Dropdown.Item>
                    <Dropdown.Item href="/pages-faqs"><i className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Help</span></Dropdown.Item> */}
          <div className="dropdown-divider"></div>
          {/* <Dropdown.Item href="/pages-profile"><i className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Balance : <b>$8451.36</b></span></Dropdown.Item> */}
          {/* <Dropdown.Item href="/pages-profile-settings"><span className="badge bg-soft-success text-success mt-1 float-end">New</span><i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Settings</span></Dropdown.Item> */}
          {/* <Dropdown.Item href="/auth-lockscreen-basic"><i className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span></Dropdown.Item> */}
          <Dropdown.Item onClick={logout}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
