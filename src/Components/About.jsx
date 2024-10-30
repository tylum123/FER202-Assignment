import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { ThemeContext } from '../ThemeContext';

export default function About() {
  const { isDarkTheme } = useContext(ThemeContext);

  const getResponsiveStyles = () => ({
    container: {
      backgroundColor: isDarkTheme ? '#2c2c2c' : '#f4f4f4',
      color: isDarkTheme ? '#f0f0f0' : '#333',
      minHeight: '100vh',
      padding: '30px 0',
    },
    card: {
      backgroundColor: isDarkTheme ? '#333' : '#fff',
      color: isDarkTheme ? '#f0f0f0' : '#333',
      border: 'none',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    header: {
      textAlign: 'center',
      color: '#4CAF50',
      marginBottom: '20px',
    },
    mapContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px',
    },
    iframe: {
      border: '2px solid #4CAF50',
      borderRadius: '10px',
      width: '100%',
      height: '450px',
    },
  });

  const styles = getResponsiveStyles();

  return (
    <div style={styles.container}>
      <Container>
        <h1 style={styles.header}>About Orchids</h1>
        <Row>
          <Col md={6}>
            <Card style={styles.card}>
              <Card.Body>
                <Card.Title>Orchids Overview</Card.Title>
                <Card.Text>
                  Orchids are exotic flowers known for their unique shapes and patterns. They have a rich history and fascinating origins.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card style={styles.card}>
              <Card.Body>
                <Card.Title>History and Origin</Card.Title>
                <Card.Text>
                  Orchids have been cultivated for thousands of years, with their origins tracing back to ancient Greece and China. They were often associated with luxury and elegance.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card style={styles.card}>
              <Card.Body>
                <Card.Title>Our Locations</Card.Title>
                <ul className="list-unstyled">
                  <li>123 Orchid Lane, Flower City</li>
                  <li>456 Blossom Street, Garden Town</li>
                  <li>789 Petal Avenue, Bloom Village</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h2 style={styles.header}>Find Us on the Map</h2>
        <div style={styles.mapContainer}>
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153167!3d-37.8162797797517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d1f9c1b1a1b1!2s123%20Orchid%20Lane%2C%20Flower%20City!5e0!3m2!1sen!2sus!4v1616161616161!5m2!1sen!2sus"
            style={styles.iframe}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </Container>
    </div>
  );
}
