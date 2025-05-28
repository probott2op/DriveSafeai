import { Container, Row, Col, Card, Form, Button, Alert, Badge, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useState } from 'react';

const Notifications = () => {
  const [userId, setUserId] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/notifications/${userId}`);
      setNotifications(response.data);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Notifications</h2>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>User ID</Form.Label>
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
                onClick={fetchNotifications}
                disabled={!userId || loading}
              >
                {loading ? 'Loading...' : 'Get Notifications'}
              </Button>
            </div>
          </Form.Group>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Your Notifications</h5>
              {notifications.length > 0 && (
                <Badge bg="primary">{notifications.length} notifications</Badge>
              )}
            </Card.Header>
            <Card.Body>
              {notifications.length > 0 ? (
                <ListGroup variant="flush">
                  {notifications.map((notification, index) => (
                    <ListGroup.Item 
                      key={index}
                      className={`d-flex justify-content-between align-items-start ${
                        !notification.isRead ? 'bg-light' : ''
                      }`}
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">
                          {notification.message}
                          {!notification.isRead && (
                            <Badge bg="danger" className="ms-2">New</Badge>
                          )}
                        </div>
                        <small className="text-muted">
                          {formatDate(notification.createdAt)}
                        </small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : userId && !loading ? (
                <Alert variant="info">No notifications found for this user.</Alert>
              ) : (
                <p className="text-muted">Enter your User ID and click "Get Notifications" to view your notifications.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Notifications;
