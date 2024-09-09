import React, { useState } from "react";
import { Card, Col, Dropdown } from "react-bootstrap";
import CustomDropdownToggle from "Common/CustomDropdownToggle";

const TopTrips = () => {
  const [reportPeriod, setReportPeriod] = useState("Today");

  const handleReportPeriodChange = (period: React.SetStateAction<string>) => {
    setReportPeriod(period);
  };

  const renderCardBody = () => {
    switch (reportPeriod) {
      case "Today":
        return (
          <div>
            <div className="mb-4">
              <span className="badge bg-dark-subtle text-body float-end">
                100%
              </span>
              <h6 className="mb-2">All Trips</h6>
              <div className="progress progress-sm" role="progressbar">
                <div
                  className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              <span className="badge bg-dark-subtle text-body float-end">
                50%
              </span>
              <h6 className="mb-2">Completed with success</h6>
              <div className="progress progress-sm" role="progressbar">
                <div
                  className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                40%
              </span>
              <h6 className="mb-2">Changed Routes</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-warning bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                77%
              </span>
              <h6 className="mb-2">Delayed</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-danger bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "77%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                53%
              </span>
              <h6 className="mb-2">Canceled</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-info bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "53%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                81%
              </span>
              <h6 className="mb-2">Extra Trip</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-primary bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "81%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                96%
              </span>
              <h6 className="mb-2">Total Offers</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-secondary bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "96%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                69%
              </span>
              <h6 className="mb-2">Offers Booked</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "69%" }}
                ></div>
              </div>
            </div>
          </div>
        );
      case "This Week":
        return (
          <div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                100%
              </span>
              <h6 className="mb-2">All Trips</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                90%
              </span>
              <h6 className="mb-2">Completed with success</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                64%
              </span>
              <h6 className="mb-2">Changed Routes</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-warning bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "64%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                77%
              </span>
              <h6 className="mb-2">Delayed</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-danger bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "77%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                53%
              </span>
              <h6 className="mb-2">Canceled</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-info bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "53%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                81%
              </span>
              <h6 className="mb-2">Extra Trip</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-primary bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "81%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                96%
              </span>
              <h6 className="mb-2">Total Offers</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-secondary bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "96%" }}
                ></div>
              </div>
            </div>
            <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                69%
              </span>
              <h6 className="mb-2">Offers Booked</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "69%" }}
                ></div>
              </div>
            </div>
          </div>
        );
      case "This Month":
        return (
            <div>
              <div className="mb-4">
              
              <span className="badge bg-dark-subtle text-body float-end">
                100%
              </span>
              <h6 className="mb-2">All Trips</h6>
              <div className="progress progress-sm" role="progressbar">
                
                <div
                  className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
              <div className="mb-4">
                <span className="badge bg-dark-subtle text-body float-end">
                  80%
                </span>
                <h6 className="mb-2">Completed with success</h6>
                <div className="progress progress-sm" role="progressbar">
                  <div
                    className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                
                <span className="badge bg-dark-subtle text-body float-end">
                  10%
                </span>
                <h6 className="mb-2">Changed Routes</h6>
                <div className="progress progress-sm" role="progressbar">
                  
                  <div
                    className="progress-bar bg-warning bg-opacity-50 progress-bar-striped progress-bar-animated"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                
                <span className="badge bg-dark-subtle text-body float-end">
                  53%
                </span>
                <h6 className="mb-2">Delayed</h6>
                <div className="progress progress-sm" role="progressbar">
                  
                  <div
                    className="progress-bar bg-danger bg-opacity-50 progress-bar-striped progress-bar-animated"
                    style={{ width: "53%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                
                <span className="badge bg-dark-subtle text-body float-end">
                  5%
                </span>
                <h6 className="mb-2">Canceled</h6>
                <div className="progress progress-sm" role="progressbar">
                  
                  <div
                    className="progress-bar bg-info bg-opacity-50 progress-bar-striped progress-bar-animated"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                
                <span className="badge bg-dark-subtle text-body float-end">
                  54%
                </span>
                <h6 className="mb-2">Extra Trip</h6>
                <div className="progress progress-sm" role="progressbar">
                  
                  <div
                    className="progress-bar bg-primary bg-opacity-50 progress-bar-striped progress-bar-animated"
                    style={{ width: "54%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                
                <span className="badge bg-dark-subtle text-body float-end">
                  60%
                </span>
                <h6 className="mb-2">Total Offers</h6>
                <div className="progress progress-sm" role="progressbar">
                  
                  <div
                    className="progress-bar bg-secondary bg-opacity-50 progress-bar-striped progress-bar-animated"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div className="mb-4">
                
                <span className="badge bg-dark-subtle text-body float-end">
                  9%
                </span>
                <h6 className="mb-2">Offers Booked</h6>
                <div className="progress progress-sm" role="progressbar">
                  
                  <div
                    className="progress-bar bg-success bg-opacity-50 progress-bar-striped progress-bar-animated"
                    style={{ width: "9%" }}
                  ></div>
                </div>
              </div>
            </div>
          )
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Col xxl={3} lg={6}>
        <Card className="card-height-100">
          <Card.Header className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Trips</h4>
            <div className="flex-shrink-0">
              <Dropdown className="card-header-dropdown">
                <Dropdown.Toggle
                  as={CustomDropdownToggle}
                  href="#"
                  className="text-reset dropdown-btn"
                >
                  <span className="text-muted">
                    {reportPeriod}
                    <i className="mdi mdi-chevron-down ms-1"></i>
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <Dropdown.Item
                    onClick={() => handleReportPeriodChange("Today")}
                  >
                    Today
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleReportPeriodChange("This Week")}
                  >
                    This Week
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleReportPeriodChange("This Month")}
                  >
                    This Month
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Header>

          <Card.Body>{renderCardBody()}</Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TopTrips;