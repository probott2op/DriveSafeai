import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';


const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    drivingLicense: '',
    password: '',
    chasisNo: '',
    vehicleNo: '',
    model: '',
    manufacturer: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/register', formData);
      setMessage(`Registration successful! User ID: ${response.data.userId}`);
      setFormData({
        fullName: '',
        email: '',
        drivingLicense: '',
        password: '',
        chasisNo: '',
        vehicleNo: '',
        model: '',
        manufacturer: ''
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h3>Register New User & Vehicle</h3>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <h5>Personal Information</h5>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Driving License</Form.Label>
                      <Form.Control
                        type="text"
                        name="drivingLicense"
                        value={formData.drivingLicense}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <h5>Vehicle Information</h5>
                    <Form.Group className="mb-3">
                      <Form.Label>Chassis Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="chasisNo"
                        value={formData.chasisNo}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Vehicle Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="vehicleNo"
                        value={formData.vehicleNo}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Model</Form.Label>
                      <Form.Control
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Manufacturer</Form.Label>
                      <Form.Control
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button type="submit" variant="primary" disabled={loading} className="w-100">
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
