
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Container className="mt-5">
      <Row className="text-center mb-5">
        <Col>
          <div className="bg-primary text-white p-5 rounded mb-4">
            <h1 className="display-4">Welcome to DriveSafeAI</h1>
            <p className="lead">AI-powered driving safety and insurance platform</p>
            {!isAuthenticated() && (
              <div className="mt-4">
                <Button 
                  variant="light" 
                  size="lg" 
                  className="me-3"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
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
              {isAuthenticated() ? (
                <Button variant="primary" onClick={() => navigate('/trip')}>
                  Submit Trip Data
                </Button>
              ) : (
                <Button variant="outline-primary" onClick={() => navigate('/login')}>
                  Login to Access
                </Button>
              )}
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
              {isAuthenticated() ? (
                <Button variant="success" onClick={() => navigate('/dashboard')}>
                  View Dashboard
                </Button>
              ) : (
                <Button variant="outline-success" onClick={() => navigate('/login')}>
                  Login to Access
                </Button>
              )}
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
              {isAuthenticated() ? (
                <Button variant="info" onClick={() => navigate('/insurance')}>
                  Manage Insurance
                </Button>
              ) : (
                <Button variant="outline-info" onClick={() => navigate('/login')}>
                  Login to Access
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
