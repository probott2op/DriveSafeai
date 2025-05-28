import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';

const Dashboard = () => {
  const [userId, setUserId] = useState('');
  const [driscScore, setDriscScore] = useState(null);
  const [premium, setPremium] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDriscScore = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/drisc-score/${userId}`);
      setDriscScore(response.data);
    } catch (err) {
      setError('Failed to fetch DriscScore');
    } finally {
      setLoading(false);
    }
  };

  const fetchPremium = async () => {
    if (!userId) return;
    
    try {
      const response = await axios.get(`/api/insurance/premium/${userId}`);
      setPremium(response.data);
    } catch (err) {
      setError('Failed to fetch premium calculation');
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

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Dashboard</h2>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Enter User ID</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your User ID"
              />
              <Button 
                variant="primary" 
                className="ms-2"
                onClick={() => {
                  fetchDriscScore();
                  fetchPremium();
                }}
                disabled={!userId || loading}
              >
                Load Data
              </Button>
            </div>
          </Form.Group>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>DriscScore (Risk Assessment)</h5>
            </Card.Header>
            <Card.Body>
              {driscScore ? (
                <>
                  <div className="text-center mb-3">
                    <h2 className="display-4">{driscScore.score?.toFixed(2)}</h2>
                    <p className="text-muted">Risk Score</p>
                  </div>
                  <p><strong>Trips Considered:</strong> {driscScore.tripsConsidered}</p>
                </>
              ) : (
                <p className="text-muted">Enter User ID and click "Load Data" to view DriscScore</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5>Premium Calculation</h5>
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
                </>
              ) : (
                <p className="text-muted">Premium calculation will appear here</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
