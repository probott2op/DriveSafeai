import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4">Welcome to DriveSafeAI</h1>
          <p className="lead">AI-powered driving safety and insurance platform</p>
        </Col>
      </Row>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Smart Driving Analysis</Card.Title>
              <Card.Text>
                Get real-time feedback on your driving performance with our AI-powered analysis system.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate('/trip')}>
                Submit Trip Data
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Risk Assessment</Card.Title>
              <Card.Text>
                Monitor your DriscScore and understand your driving risk profile for better insurance rates.
              </Card.Text>
              <Button variant="success" onClick={() => navigate('/dashboard')}>
                View Dashboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Insurance Management</Card.Title>
              <Card.Text>
                Manage your insurance policies and claims with personalized premium calculations.
              </Card.Text>
              <Button variant="info" onClick={() => navigate('/insurance')}>
                Manage Insurance
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col className="text-center">
          <Button variant="outline-primary" size="lg" onClick={() => navigate('/register')}>
            Get Started - Register Now
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
