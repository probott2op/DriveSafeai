import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown, Badge, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import NotificationService from '../../services/NotificationService';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const id = localStorage.getItem("userId");
          const data = await NotificationService.getUserNotifications(id);
          setNotifications(data);
          setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    };

    fetchNotifications();
    // Set up polling for notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={Link} to="/">DriveSafeAI</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              {user && (
                  <>
                    <Nav.Link as={Link} to="/dashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/trip-history">
                      Trip History
                    </Nav.Link>
                    <Nav.Link as={Link} to="/insurance">
                      Insurance
                    </Nav.Link>
                  </>
              )}
            </Nav>

            <Nav>
              {user ? (
                  <>
                    <NavDropdown
                        title={
                          <>
                            Notifications
                            {unreadCount > 0 && (
                                <Badge bg="danger" pill className="ms-1">
                                  {unreadCount}
                                </Badge>
                            )}
                          </>
                        }
                        id="notifications-dropdown"
                    >
                      {notifications.length === 0 ? (
                          <NavDropdown.Item disabled>No notifications</NavDropdown.Item>
                      ) : (
                          <>
                            {notifications.map(notification => (
                                <NavDropdown.Item
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    className={notification.read ? "" : "fw-bold"}
                                >
                                  {notification.message}
                                  <div className="text-muted small">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </div>
                                </NavDropdown.Item>
                            ))}
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/notifications">
                              View All Notifications
                            </NavDropdown.Item>
                          </>
                      )}
                    </NavDropdown>

                    <Navbar.Text className="me-3">
                      Welcome, {user?.email}
                    </Navbar.Text>
                    <Button variant="outline-light" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
              ) : (
                  <>
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register">
                      Register
                    </Nav.Link>
                  </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};

export default Header;
