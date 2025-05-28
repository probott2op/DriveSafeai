import { useState } from 'react';
import { Form, Button, Container, Alert, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      login(response.data.token, response.data.user);
      navigate('/dashboard');
      
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Login failed');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className="shadow border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <h1 className="fw-bold text-primary mb-3">Welcome Back</h1>
                  <p className="text-muted fs-5">Sign in to your DriveSafeAI account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4 py-3" dismissible onClose={() => setError('')}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold fs-6 mb-3">
                      <i className="bi bi-envelope me-2"></i>
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      size="lg"
                      className="border-0 bg-white shadow-sm py-3"
                      style={{ fontSize: '1.1rem' }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold fs-6 mb-3">
                      <i className="bi bi-lock me-2"></i>
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      size="lg"
                      className="border-0 bg-white shadow-sm py-3"
                      style={{ fontSize: '1.1rem' }}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      className="text-muted fs-6"
                    />
                    <Link to="/forgot-password" className="text-decoration-none fs-6">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 mb-4 py-3 fs-5"
                    variant="primary"
                    disabled={loading}
                    style={{ borderRadius: '12px' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-muted fs-6">Don't have an account? </span>
                    <Link to="/register" className="text-decoration-none fw-semibold fs-6">
                      Sign up here
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Login;
