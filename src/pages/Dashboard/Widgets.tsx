import { useFetchClassesQuery } from "features/classes/classeSlice";
import { useFetchEnseignantsQuery } from "features/enseignants/enseignantSlice";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
import React, { useState } from "react";
import { Card, Col } from "react-bootstrap";
import CountUp from "react-countup";

interface WidgetsProps {
  id: number;
  name: string;
  amount: number;
  decimal?: number;
  perstange?: string;
  badgeColor: string;
  icon: string;
  iconColor: string;
}
const Widgets = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const handleFilters = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setSelectedFilter(newFilter);
  };
  const { data = [] } = useFetchEtudiantsQuery();
  const { data: AllClasses = [] } = useFetchClassesQuery();
  const { data: AllEnseignants = [] } = useFetchEnseignantsQuery();
  const widgetsData: Array<WidgetsProps> = [
    {
      id: 1,
      name: "Elèves",
      amount: Number(data.length),
      badgeColor: "success",
      icon: "ph-student",
      iconColor: "secondary",
    },
    {
      id: 2,
      name: "Classes",
      amount: Number(AllClasses.length),
      badgeColor: "success",
      icon: "ph-graduation-cap",
      iconColor: "info",
    },
    {
      id: 3,
      name: "Enseignants",
      amount: Number(AllEnseignants.length),
      badgeColor: "success",
      icon: "ph-user-circle",
      iconColor: "warning",
    },
  ];
  return (
    <React.Fragment>
      {(widgetsData || []).map((item: any, key: number) => (
        <Col key={key}>
          <Card className="card-animate">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div
                  className={"vr rounded bg-" + item.iconColor + " opacity-50"}
                  style={{ width: "4px" }}
                ></div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-medium text-muted fs-14 text-truncate">
                    {item.name}
                  </p>
                  <h4 className="fs-22 fw-semibold mb-3">
                    {item.decimal ? "£" : ""}
                    <span className="counter-value" data-target="98851.35">
                      <CountUp
                        start={0}
                        end={item.amount}
                        separator=","
                        decimals={item.decimal && 2}
                      />
                    </span>
                  </h4>
                  <div className="d-flex align-items-center gap-2">
                    <p
                      className={
                        "badge badge-soft-" + item.badgeColor + " mb-0 fs-14"
                      }
                    >
                      {item.perstange}
                    </p>
                  </div>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span
                    className={
                      "avatar-title bg-" +
                      item.iconColor +
                      "-subtle text-" +
                      item.iconColor +
                      " rounded fs-3"
                    }
                  >
                    <i className={item.icon}></i>
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default Widgets;
