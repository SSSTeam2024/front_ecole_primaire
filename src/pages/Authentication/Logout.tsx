import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

//redux
import { useSelector, useDispatch } from "react-redux";
import withRouter from "Common/withRouter";

const Logout = () => {
  document.title = "Log Out | Toner eCommerce + Admin React Template";

  const dispatch = useDispatch<any>();

  const { isUserLogout } = useSelector((state: any) => ({
    isUserLogout: state.Login.isUserLogout,
  }));

  if (isUserLogout) {
    return <Navigate to="/login" />;
  }

  return <React.Fragment></React.Fragment>;
};

export default withRouter(Logout);
