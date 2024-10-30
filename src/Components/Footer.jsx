import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ThemeContext } from "../ThemeContext";

const Footer = () => {
  const { isDarkTheme } = useContext(ThemeContext);

  // Function to get responsive styles
  const getResponsiveStyles = () => {
    const isSmallScreen = window.innerWidth < 768;

    return {
      footer: {
        backgroundColor: isDarkTheme ? "#343a40" : "#f8f9fa",
        color: isDarkTheme ? "#fff" : "#000",
        padding: "20px 0",
        borderTop: "1px solid #e7e7e7",
        textAlign: isSmallScreen ? "center" : "left",
      },
      col: {
        marginBottom: isSmallScreen ? "20px" : "0",
      },
      icon: {
        fontSize: "1.5rem",
        marginRight: "10px",
      },
    };
  };

  const styles = getResponsiveStyles();

  return (
    <footer style={styles.footer}>
      <Container>
        <Row>
          <Col md={4} style={styles.col}>
            <h5>About Us</h5>
            <p>
              We are passionate about orchids and aim to provide the best
              information and resources for orchid enthusiasts.
            </p>
          </Col>
          <Col md={4} style={styles.col}>
            <h5>Contact</h5>
            <p>Email: info@orchids.com</p>
            <p>Phone: +123 456 7890</p>
          </Col>
          <Col md={4} style={styles.col}>
            <h5>Follow Us</h5>
            <p>
              <i className="bi bi-facebook" style={styles.icon}></i>
              <i className="bi bi-twitter" style={styles.icon}></i>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
