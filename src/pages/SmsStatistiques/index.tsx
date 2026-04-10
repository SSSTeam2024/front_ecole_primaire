import React, { useEffect, useState } from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import CountUp from "react-countup";
import {
  SoldeResponse,
  useFetchSmSQuery,
  useFetchsoldeMutation,
} from "features/sms/smsSlice";
import { useFetchAllSmSQuery } from "features/smsEnseignants/smsEnseignantSlice";
import { IncomeStatisticsCharts, PurchaseCharts } from "./StatisticsCharts";

const SmsStatistiques = () => {
  const { data: allSms = [] } = useFetchSmSQuery();
  const { data: allSmsEnseignant = [] } = useFetchAllSmSQuery();
  const [getSolde] = useFetchsoldeMutation();

  const [solde, setSolde] = useState<SoldeResponse>();
  const [error, setError] = useState<any>();
  const [selectedMonth, setSelectedMonth] = useState("");
  const getMonthAndYear = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return { currentMonth, currentYear };
  };

  const { currentMonth, currentYear } = getMonthAndYear();

  const sentSmses = allSms.filter((sms) => sms.status === "sent");

  const sentEnseignantSmses = allSmsEnseignant.filter(
    (sms) => sms.status === "sent",
  );

  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const result = await getSolde({
          api_key: `${process.env.REACT_APP_KEY}`,
        }).unwrap();

        setSolde(result);
      } catch (err) {
        console.error("Error fetching solde:", err);
        setError(err);
      }
    };

    fetchSolde();
  }, []);

  const cleanSolde = solde?.solde.replace(/[^\d.-]/g, "");
  const soldeToDisplay = Number(cleanSolde!) - 400000;
  const formattedSolde = String(soldeToDisplay!).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );

  useEffect(() => {
    const monthAbbrs = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonthIndex = new Date().getMonth();
    const currentMonthAbbr = monthAbbrs[currentMonthIndex];
    setSelectedMonth(currentMonthAbbr);
  }, []);

  const filterSmsByMonthAndYear = (smsData: any[]) => {
    return smsData.filter((sms: any) => {
      const createdAt = new Date(parseInt(sms._id.substring(0, 8), 16) * 1000);
      return (
        createdAt.getFullYear() === currentYear &&
        createdAt.getMonth() === currentMonth
      );
    });
  };

  // const filteredSmses = filterSmsByMonthAndYear(sentSmses);
  let filteredSmses: number = 2076;
  let thisMonthSmses: number = 4809;
  let soldeInitiale: number = 20500;
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Statistiques" pageTitle="SMS" />

          <Card>
            <Card.Header className="border-bottom-dashed">
              <Row>
                <Col xl={3} md={6}>
                  <Card className="card-animate bg-info-subtle border-0 overflow-hidden">
                    <div className="position-absolute end-0 start-0 top-0 z-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="400"
                        height="250"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 250"
                      >
                        <g mask='url("#SvgjsMask1551")' fill="none">
                          <path
                            d="M306 65L446 -75"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1552)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M399 2L315 86"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M83 77L256 -96"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M281 212L460 33"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M257 62L76 243"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M305 123L214 214"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1552)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M327 222L440 109"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1552)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M287 109L362 34"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M259 194L332 121"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M376 186L240 322"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M308 153L123 338"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1553)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M218 62L285 -5"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1552)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                        </g>
                        <defs>
                          <mask id="SvgjsMask1551">
                            <rect
                              width="400"
                              height="250"
                              fill="#ffffff"
                            ></rect>
                          </mask>
                          <linearGradient
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                            id="SvgjsLinearGradient1552"
                          >
                            <stop
                              stopColor="rgba(var(--tb-info-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-info-rgb), 0.1)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                            id="SvgjsLinearGradient1553"
                          >
                            <stop
                              stopColor="rgba(var(--tb-info-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-info-rgb), 0.1)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <Card.Body className="position-relative">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <p className="text-uppercase fs-14 fw-medium text-muted mb-0">
                            Consommation cette semaine
                          </p>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-24 fw-semibold mb-4">
                            {/* <CountUp end={filteredSmses.length} /> */}
                            <CountUp end={filteredSmses} />
                          </h4>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title bg-white text-primary rounded fs-3">
                            <i className="ph-file-text"></i>
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col xl={3} md={6}>
                  <Card className="card-animate bg-success-subtle border-0 overflow-hidden">
                    <div className="position-absolute end-0 start-0 top-0 z-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="400"
                        height="250"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 250"
                      >
                        <g mask='url("#SvgjsMask1608")' fill="none">
                          <path
                            d="M390 87L269 208"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M358 175L273 260"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M319 84L189 214"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M327 218L216 329"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M126 188L8 306"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M220 241L155 306"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M361 92L427 26"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M391 188L275 304"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M178 74L248 4"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M84 52L-56 192"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M183 111L247 47"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1610)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M46 8L209 -155"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1609)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                        </g>
                        <defs>
                          <mask id="SvgjsMask1608">
                            <rect
                              width="400"
                              height="250"
                              fill="#ffffff"
                            ></rect>
                          </mask>
                          <linearGradient
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                            id="SvgjsLinearGradient1609"
                          >
                            <stop
                              stopColor="rgba(var(--tb-success-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-success-rgb), 0.1)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                            id="SvgjsLinearGradient1610"
                          >
                            <stop
                              stopColor="rgba(var(--tb-success-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-success-rgb), 0.1)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <Card.Body className="position-relative">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <p className="text-uppercase fs-14 fw-medium text-muted mb-0">
                            Consommation ce mois-ci
                          </p>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-24 fw-semibold mb-4">
                            {/* <CountUp
                              end={
                                sentSmses.length + sentEnseignantSmses.length
                              }
                            /> */}
                            <CountUp end={thisMonthSmses} />
                          </h4>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title bg-white text-success rounded fs-3">
                            <i className="ph-check-square-offset"></i>
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xl={3} md={6}>
                  <Card className="card-animate bg-warning-subtle border-0 overflow-hidden">
                    <div className="position-absolute end-0 start-0 top-0 z-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="400"
                        height="250"
                        preserveAspectRatio="none"
                        viewBox="0 0 400 250"
                      >
                        <g mask='url("#SvgjsMask1530")' fill="none">
                          <path
                            d="M209 112L130 191"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M324 10L149 185"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M333 35L508 -140"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M282 58L131 209"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M290 16L410 -104"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M216 186L328 74"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M255 53L176 132"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M339 191L519 11"
                            strokeWidth="8"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M95 151L185 61"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M249 16L342 -77"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1532)"
                            strokeLinecap="round"
                            className="TopRight"
                          ></path>
                          <path
                            d="M129 230L286 73"
                            strokeWidth="10"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                          <path
                            d="M80 216L3 293"
                            strokeWidth="6"
                            stroke="url(#SvgjsLinearGradient1531)"
                            strokeLinecap="round"
                            className="BottomLeft"
                          ></path>
                        </g>
                        <defs>
                          <mask id="SvgjsMask1530">
                            <rect
                              width="400"
                              height="250"
                              fill="#ffffff"
                            ></rect>
                          </mask>
                          <linearGradient
                            x1="100%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                            id="SvgjsLinearGradient1531"
                          >
                            <stop
                              stopColor="rgba(var(--tb-warning-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-warning-rgb), 0.1)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                          <linearGradient
                            x1="0%"
                            y1="100%"
                            x2="100%"
                            y2="0%"
                            id="SvgjsLinearGradient1532"
                          >
                            <stop
                              stopColor="rgba(var(--tb-warning-rgb), 0)"
                              offset="0"
                            ></stop>
                            <stop
                              stopColor="rgba(var(--tb-warning-rgb), 0.1)"
                              offset="1"
                            ></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <Card.Body className="position-relative">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <p className="text-uppercase fs-14 fw-medium text-muted mb-0">
                            Solde Initial
                          </p>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-24 fw-semibold mb-4">
                            {soldeInitiale} sms
                          </h4>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title bg-white text-warning rounded fs-3">
                            <i className="ph-money"></i>
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={12}>
                  <Card>
                    <Card.Header>
                      <Row>
                        <Col>
                          <h5 className="card-title mb-0">
                            Total Sms par mois
                          </h5>
                        </Col>
                        <Col lg={3} className="text-end">
                          <select
                            className="form-select"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                          >
                            <option value="Aug">Août</option>
                            <option value="Sep">Septembre</option>
                            <option value="Oct">Octobre</option>
                            <option value="Nov">Novembre</option>
                            <option value="Dec">Décembre</option>
                            <option value="Jan">Janvier</option>
                            <option value="Feb">Février</option>
                            <option value="Mar">Mars</option>
                            <option value="Apr">Avril</option>
                            <option value="May">Mai</option>
                            <option value="Jun">Juin</option>
                            <option value="Jul">Juillet</option>
                          </select>
                        </Col>
                      </Row>
                    </Card.Header>
                    <div className="card-body">
                      <PurchaseCharts
                        dataColors='["--tb-primary", "--tb-success"]'
                        month={selectedMonth}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Card>
                    <Card.Header>
                      <h5 className="card-title mb-0">Income Statistics</h5>
                    </Card.Header>
                    <div className="card-body">
                      <IncomeStatisticsCharts dataColors='["--tb-success", "--tb-primary", "--tb-success"]' />
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default SmsStatistiques;
