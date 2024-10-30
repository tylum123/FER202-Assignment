import React, { useState, useEffect, useContext } from "react";
import { Card, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";

export default function Natural() {
  const [orchids, setOrchids] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const { isDarkTheme } = useContext(ThemeContext);
  const baseURL = `https://670a18acaf1a3998baa30805.mockapi.io/orchids`;

  const fetchOrchids = () => {
    fetch(baseURL + "?sortBy=id&order=desc")
      .then((resp) => resp.json())
      .then((data) => {
        setOrchids(data);
        const uniqueCategories = [
          ...new Set(data.map((orchid) => orchid.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrchids();
  }, []);

  const getResponsiveStyles = () => {
    const isSmallScreen = window.innerWidth < 768;

    return {
      container: {
        backgroundColor: isDarkTheme ? "#333" : "#f9f9f9",
        minHeight: "100vh",
        padding: isSmallScreen ? "10px" : "20px",
      },
      searchFilterContainer: {
        backgroundColor: isDarkTheme ? "#444" : "#fff",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
      },
      card: {
        margin: isSmallScreen ? "10px" : "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s",
        backgroundColor: isDarkTheme ? "#444" : "#fff",
        color: isDarkTheme ? "#fff" : "#000",
      },
      cardImage: {
        borderRadius: "10px 10px 0 0",
        height: isSmallScreen ? "150px" : "200px",
        objectFit: "cover",
      },
      cardText: {
        fontSize: isSmallScreen ? "14px" : "18px",
      },
    };
  };

  const styles = getResponsiveStyles();

  const filteredOrchids = orchids.filter((orchid) => {
    const orchidName = orchid.name || "";
    return (
      orchid.isSpecial &&
      orchidName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "" || orchid.category === selectedCategory)
    );
  });

  return (
    <div style={styles.container}>
      <Container>
        <div style={styles.searchFilterContainer}>
          <Row className="align-items-center">
            <Col md={6} className="mb-3 mb-md-0">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by orchid name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
        </div>
        <Row>
          {filteredOrchids.map((orchid) => (
            <Col key={orchid.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <Card
                className="h-100 d-flex flex-column"
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Card.Img
                  variant="top"
                  src={orchid.image}
                  style={styles.cardImage}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{orchid.name}</Card.Title>
                  <Card.Text className="flex-grow-1" style={styles.cardText}>
                    Origin: {orchid.origin} <br />
                    Color: {orchid.color} <br />
                    Category: {orchid.category} <br />
                    Rating: {"⭐️".repeat(orchid.rating)} <br />
                    {orchid.isSpecial && (
                      <span style={{ fontWeight: "bold", color: "#4CAF50" }}>
                        Special: Yes
                      </span>
                    )}{" "}
                    <br />
                    <Link
                      to={`/detail/${orchid.id}`}
                      className="btn btn-outline-primary mt-2 d-block text-center"
                    >
                      View Details
                    </Link>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
