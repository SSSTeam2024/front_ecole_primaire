import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Widgets from "./Widgets";

const Dashboard = () => {
  document.title = "Tableau de bord | Leaders Ecole Privée";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Widgets />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
