import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, insuranceAPI } from '../services/apiService';

const Dashboard = () => {
  const [driscScore, setDriscScore] = useState(null);
  const [premium, setPremium] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userId) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch DriscScore
      const driscResponse = await userAPI.getDriscScore(user.userId);
      setDriscScore(driscResponse.data);

      // Fetch Premium calculation
      try {
        const premiumResponse = await insuranceAPI.calculatePremium(user.userId);
        setPremium(premiumResponse.data);
      } catch (premiumError) {
        // Premium might not be available if no policy exists
        console.log('Premium calculation not available');
      }

      // Fetch recent notifications
      const notificationsResponse = await userAPI.getNotifications(user.userId);
      setNotifications(notificationsResponse.data.slice(0, 5)); // Show only 5 recent notifications

    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (category) => {
    switch (category?.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2>Welcome to your Dashboard</h2>
          <p className="text-muted">Overview of your driving performance and account</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5>DriscScore (Risk Assessment)</h5>
            </Card.Header>
            <Card.Body>
              {driscScore ? (
                <>
                  <div className="text-center mb-3">
                    <h2 className={`display-4 text-${getScoreColor(driscScore.score)}`}>
                      {driscScore.score?.toFixed(2)}
                    </h2>
                    <p className="text-muted">Risk Score</p>
                  </div>
                  <p><strong>Trips Considered:</strong> {driscScore.tripsConsidered}</p>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate('/trip-history')}
                  >
                    View Trip History
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-muted">No driving data available yet</p>
                  <Button variant="primary" onClick={() => navigate('/trip')}>
                    Submit Your First Trip
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5>Insurance Premium</h5>
            </Card.Header>
            <Card.Body>
              {premium ? (
                <>
                  <div className="mb-3">
                    <Badge bg={getRiskBadgeVariant(premium.riskCategory)} className="fs-6">
                      {premium.riskCategory} Risk
                    </Badge>
                  </div>
                  <p><strong>Policy ID:</strong> {premium.policyId}</p>
                  <p><strong>Risk Score:</strong> {premium.riskScore?.toFixed(2)}</p>
                  <p><strong>Base Premium:</strong> ${premium.basePremium}</p>
                  <p><strong>Risk Multiplier:</strong> {premium.riskMultiplier}x</p>
                  <hr />
                  <h5><strong>Final Premium:</strong> ${premium.finalPremium}</h5>
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    onClick={() => navigate('/insurance')}
                  >
                    Manage Insurance
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-muted">No insurance policy found</p>
                  <Button variant="info" onClick={() => navigate('/insurance')}>
                    Create Insurance Policy
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-2">
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={() => navigate('/trip')}
                  >
                    Submit New Trip
                  </Button>
                </Col>
                <Col md={3} className="mb-2">
                  <Button 
                    variant="success" 
                    className="w-100"
                    onClick={() => navigate('/trip-history')}
                  >
                    View Trip History
                  </Button>
                </Col>
                <Col md={3} className="mb-2">
                  <Button 
                    variant="info" 
                    className="w-100"
                    onClick={() => navigate('/insurance')}
                  >
                    Insurance
                  </Button>
                </Col>
                <Col md={3} className="mb-2">
                  <Button 
                    variant="warning" 
                    className="w-100"
                    onClick={() => navigate('/claims')}
                  >
                    Claims
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Recent Notifications</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigate('/notifications')}
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {notifications.length > 0 ? (
                <div>
                  {notifications.map((notification, index) => (
                    <div key={index} className={`p-2 mb-2 rounded ${!notification.isRead ? 'bg-light' : ''}`}>
                      <div className="d-flex justify-content-between">
                        <span>{notification.message}</span>
                        {!notification.isRead && <Badge bg="danger">New</Badge>}
                      </div>
                      <small className="text-muted">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No notifications available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
