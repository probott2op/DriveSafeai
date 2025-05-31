import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Badge,
  ProgressBar,
  Alert,
  Button
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserService from '../../services/UserService';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [driscScore, setDriscScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = localStorage.getItem('userId');
        if (currentUser) {
          const [user, score] = await Promise.all([
            UserService.getUserById(currentUser),
            UserService.getDriscScore(currentUser)
          ]);
          setUserData(user);
          setDriscScore(score);
          console.log('DRISC Score data:', score); // Debug log to check data structure
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'Low', variant: 'success', symbol: '✓' };
    if (score >= 60) return { level: 'Medium', variant: 'warning', symbol: '⚠' };
    return { level: 'High', variant: 'danger', symbol: '⚠' };
  };

  const getScoreVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const handleStartTrip = () => {
    navigate('/trip-monitor');
  };

  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading dashboard...</p>
          </div>
        </div>
    );
  }

  const riskData = driscScore ? getRiskLevel(driscScore.score) : null;
  const tripsCount = driscScore?.tripsConsidered || driscScore?.trips_considered || 0;

  return (
      <div className="min-vh-100 bg-light">
        {/* Header */}
        <Navbar bg="white" className="shadow-sm border-bottom">
          <Container fluid>
            <div className="d-flex justify-content-between align-items-center w-100 py-3">
              <div>
                <h1 className="h3 fw-bold text-dark mb-1">Risk Scoring Dashboard</h1>
                <p className="text-muted mb-0">Monitor and analyze driving risk metrics</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleStartTrip}
                    className="d-flex align-items-center gap-2"
                >
                  <span>🚗</span>
                  Show Live Trip
                </Button>
                <div className="d-flex align-items-center bg-light rounded px-3 py-2">
                  <span className="me-2">👤</span>
                  <span className="fw-medium text-dark">
                  {userData?.fullName || 'Loading...'}
                </span>
                </div>
              </div>
            </div>
          </Container>
        </Navbar>

        <Container fluid className="py-4">
          {/* Main Stats Grid */}
          <Row className="g-4 mb-4">
            {/* Risk Score Card */}
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small fw-medium mb-1">DRISC Score</p>
                      <h3 className={`fw-bold text-${getScoreVariant(driscScore?.score || 0)} mb-0`}>
                        {driscScore?.score?.toFixed(1) || '0.0'}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-circle bg-${riskData?.variant || 'secondary'} bg-opacity-10`}>
                      <span className={`text-${riskData?.variant || 'secondary'} fs-3`}>📊</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <span className="text-success me-2">📈</span>
                    <small className="text-muted">Risk assessment</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Risk Level Card */}
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small fw-medium mb-1">Risk Level</p>
                      <h4 className={`fw-bold text-${riskData?.variant || 'secondary'} mb-0`}>
                        {riskData?.level || 'N/A'}
                      </h4>
                    </div>
                    <div className={`p-3 rounded-circle bg-${riskData?.variant || 'secondary'} bg-opacity-10`}>
                    <span className={`text-${riskData?.variant || 'secondary'} fs-3`}>
                      {riskData?.symbol || '🛡'}
                    </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <span className="text-primary me-2">🛡</span>
                    <small className="text-muted">Current status</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Trips Analyzed Card */}
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small fw-medium mb-1">Trips Analyzed</p>
                      <h3 className="fw-bold text-primary mb-0">
                        {tripsCount}
                      </h3>
                    </div>
                    <div className="p-3 rounded-circle bg-primary bg-opacity-10">
                      <span className="text-primary fs-3">🚗</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <span className="text-muted me-2">🕒</span>
                    <small className="text-muted">
                      {tripsCount > 0 ? 'Data points collected' : 'No trips recorded'}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Premium Impact Card */}
            <Col xs={12} md={6} lg={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small fw-medium mb-1">Premium Impact</p>
                      <h4 className="fw-bold text-success mb-0">
                        {driscScore?.score >= 80 ? '↓ 15%' : driscScore?.score >= 60 ? '→ 0%' : '↑ 25%'}
                      </h4>
                    </div>
                    <div className="p-3 rounded-circle bg-success bg-opacity-10">
                      <span className="text-success fs-3">💰</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <span className="text-success me-2">📉</span>
                    <small className="text-muted">Estimated savings</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            {/* User Profile Card */}
            <Col lg={4}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-gradient d-flex align-items-center justify-content-center me-3"
                         style={{width: '64px', height: '64px', background: 'linear-gradient(135deg, #007bff, #6f42c1)'}}>
                      <span className="text-white fs-1">👤</span>
                    </div>
                    <div>
                      <h5 className="fw-semibold mb-1">
                        {userData?.fullName || 'Loading...'}
                      </h5>
                      <p className="text-muted mb-0">{userData?.email || 'Loading...'}</p>
                    </div>
                  </div>

                  <div className="border-top pt-3">
                    <Row className="align-items-center py-2">
                      <Col xs={6}>
                        <div className="d-flex align-items-center">
                          <span className="text-muted me-2">🚗</span>
                          <span className="fw-medium text-dark">Vehicle</span>
                        </div>
                      </Col>
                      <Col xs={6} className="text-end">
                        <code className="text-dark">
                          {userData?.vehicleNo || 'Loading...'}
                        </code>
                      </Col>
                    </Row>
                    <Row className="align-items-center py-2 border-top">
                      <Col xs={6}>
                        <div className="d-flex align-items-center">
                          <span className="text-muted me-2">📍</span>
                          <span className="fw-medium text-dark">User ID</span>
                        </div>
                      </Col>
                      <Col xs={6} className="text-end">
                      <span className="text-dark">
                        #{userData?.userId || 'Loading...'}
                      </span>
                      </Col>
                    </Row>
                    <Row className="align-items-center py-2 border-top">
                      <Col xs={6}>
                        <div className="d-flex align-items-center">
                          <span className="text-muted me-2">🛣️</span>
                          <span className="fw-medium text-dark">Total Trips</span>
                        </div>
                      </Col>
                      <Col xs={6} className="text-end">
                      <span className="text-dark">
                        {tripsCount} trips
                      </span>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Risk Analysis Chart */}
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-semibold mb-0">Risk Analysis</h5>
                    <div className="d-flex align-items-center">
                      <Badge bg="success" className="me-2">Safe</Badge>
                      <Badge bg="warning" className="me-2">Moderate</Badge>
                      <Badge bg="danger">High Risk</Badge>
                    </div>
                  </div>

                  {/* Score Visualization */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-medium">Overall Risk Score</span>
                      <span className={`fw-bold text-${getScoreVariant(driscScore?.score || 0)}`}>
                      {driscScore?.score?.toFixed(1) || '0.0'}/100
                    </span>
                    </div>
                    <ProgressBar
                        variant={getScoreVariant(driscScore?.score || 0)}
                        now={driscScore?.score || 0}
                        style={{height: '12px'}}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">
                        Based on {tripsCount} trip{tripsCount !== 1 ? 's' : ''}
                      </small>
                      <small className="text-muted">
                        {tripsCount < 5 ? 'More trips needed for accuracy' : 'Sufficient data'}
                      </small>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div>
                    <h6 className="fw-semibold mb-3">Risk Factors</h6>
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <span className="me-2">🏎</span>
                            <span className="text-dark">Speeding Events</span>
                          </div>
                          <Badge bg="success">Low</Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <span className="me-2">🛑</span>
                            <span className="text-dark">Hard Braking</span>
                          </div>
                          <Badge bg="warning">Moderate</Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <span className="me-2">🔄</span>
                            <span className="text-dark">Sharp Turns</span>
                          </div>
                          <Badge bg="success">Low</Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <span className="me-2">🌙</span>
                            <span className="text-dark">Night Driving</span>
                          </div>
                          <Badge bg="primary">Normal</Badge>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recommendations */}
          <Row className="mt-4">
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <h5 className="fw-semibold mb-4">Recommendations</h5>
                  <Row className="g-3">
                    <Col md={4}>
                      <Alert variant={tripsCount >= 5 ? "primary" : "info"} className="d-flex align-items-start">
                        <span className="me-3 mt-1 fs-5">{tripsCount >= 5 ? "✅" : "ℹ️"}</span>
                        <div>
                          <h6 className="alert-heading">
                            {tripsCount >= 5 ? "Good Score!" : "Getting Started"}
                          </h6>
                          <p className="mb-0 small">
                            {tripsCount >= 5
                                ? "Your driving behavior shows low risk patterns."
                                : `Complete ${5 - tripsCount} more trips for accurate scoring.`
                            }
                          </p>
                        </div>
                      </Alert>
                    </Col>
                    <Col md={4}>
                      <Alert variant="warning" className="d-flex align-items-start">
                        <span className="me-3 mt-1 fs-5">⚠️</span>
                        <div>
                          <h6 className="alert-heading">More Data Needed</h6>
                          <p className="mb-0 small">
                            {tripsCount < 10
                                ? "Complete more trips for better accuracy."
                                : "Your data is comprehensive for analysis."
                            }
                          </p>
                        </div>
                      </Alert>
                    </Col>
                    <Col md={4}>
                      <Alert variant="success" className="d-flex align-items-start">
                        <span className="me-3 mt-1 fs-5">💰</span>
                        <div>
                          <h6 className="alert-heading">Premium Benefits</h6>
                          <p className="mb-0 small">
                            {tripsCount >= 5
                                ? "Eligible for reduced insurance premiums."
                                : "Complete more trips to unlock premium benefits."
                            }
                          </p>
                        </div>
                      </Alert>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
  );
};

export default Dashboard;