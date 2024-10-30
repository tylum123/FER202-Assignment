import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Button, Modal, Row, Col, Form } from "react-bootstrap";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../Context/AuthContext";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orchid, setOrchid] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const { isDarkTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const baseURL = `https://670a18acaf1a3998baa30805.mockapi.io/orchids`;
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingComment, setEditingComment] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShow(true);
  };

  useEffect(() => {
    fetch(`${baseURL}/${id}`)
      .then((resp) => resp.json())
      .then((data) => setOrchid(data))
      .catch((err) => console.error(err));
  }, [id]);

  const containerStyles = {
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: isDarkTheme ? "#444" : "#fff",
    color: isDarkTheme ? "#fff" : "#000",
    minHeight: "100vh",
    padding: "20px",
  };

  const hasUserCommented = orchid?.feedback?.some(fb => fb.author === user?.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasUserCommented) {
      setError('You have already commented on this orchid.');
      return;
    }

    const newFeedback = {
      comment,
      author: user.email,
      date: new Date().toISOString(),
    };

    const updatedFeedback = [...(orchid.feedback || []), newFeedback];

    // Update the feedback on the server
    fetch(`${baseURL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...orchid, feedback: updatedFeedback }),
    })
    .then((resp) => resp.json())
    .then((data) => {
      setOrchid(data); // Update local state with the new data
      setComment('');
      setError('');
    })
    .catch((err) => console.error(err));
  };

  const handleEditSubmit = (e, feedbackId) => {
    e.preventDefault();

    // Update only the feedback of the current user
    const updatedFeedback = orchid.feedback.map(fb =>
      fb.id === feedbackId && fb.author === user.email ? { ...fb, comment: editingComment } : fb
    );

    // Update the feedback on the server
    fetch(`${baseURL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback: updatedFeedback }), // Only update feedback
    })
    .then((resp) => resp.json())
    .then((data) => {
      setOrchid(prevOrchid => ({ ...prevOrchid, feedback: data.feedback })); // Update only feedback in local state
      setEditingCommentId(null); // Reset editing state
      setEditingComment(''); // Clear the editing comment
    })
    .catch((err) => console.error(err));
  };

  return (
    <div
      style={{
        backgroundColor: isDarkTheme ? "#333" : "#f9f9f9",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container style={containerStyles}>
        {orchid ? (
          <Row>
            <Col md={6}>
              <Card.Img
                src={orchid.image}
                style={{
                  borderRadius: "8px 0 0 8px",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Col>
            <Col md={6}>
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  style={{
                    fontSize: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <strong>{orchid.name}</strong>
                  <Button
                    variant="outline-danger"
                    onClick={() => navigate("/")}
                    style={{ marginLeft: "auto" }}
                  >
                    Back
                  </Button>
                </Card.Title>
                <Card.Text>
                  <strong>Origin:</strong> {orchid.origin} <br />
                  <strong>Color:</strong> {orchid.color} <br />
                  <strong>Category:</strong> {orchid.category} <br />
                  <strong>Rating:</strong> {"⭐️".repeat(orchid.rating)}
                  <br />
                  <strong style={{ color: orchid.isSpecial ? "#4CAF50" : "inherit" }}>
                    {orchid.isSpecial ? "Special" : ""}
                  </strong>
                </Card.Text>
                <Card.Text className="flex-grow-1">
                  {orchid.description}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleShow(orchid.video)}
                >
                  Watch Video
                </Button>
                <h5 className="mt-4">Feedback</h5>
                <div style={{ maxWidth: '100%', overflowY : 'auto', maxHeight: '200px' }}>
                  {orchid.feedback?.map((fb, index) => (
                    <div key={index} style={{ marginBottom: '10px', overflowWrap: 'break-word' }}>
                      <strong>{fb.author}</strong> ({new Date(fb.date).toLocaleString()}): {fb.comment}
                      {fb.author === user?.email && (
                        <>
                          <Button
                            onClick={() => setEditingCommentId(fb.id)}
                            aria-label="Edit comment"
                            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'blue' }}
                          >
                            Edit <i className="bi bi-pencil-square"></i>
                          </Button>
                          {editingCommentId === fb.id && (
                            <Form onSubmit={(e) => handleEditSubmit(e, fb.id)}>
                              <Form.Group controlId={`editCommentForm-${fb.id}`}>
                                <Form.Control
                                  type="text"
                                  value={editingComment}
                                  onChange={(e) => setEditingComment(e.target.value)}
                                  placeholder="Edit your comment"
                                />
                              </Form.Group>
                              <Button variant="primary" type="submit">
                                Save
                              </Button>
                            </Form>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {user && (
                  <Form onSubmit={handleSubmit} className="mt-3">
                    <Form.Group controlId="feedbackForm">
                      <Form.Label>Leave a Comment</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={hasUserCommented}
                      />
                    </Form.Group>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <Button variant="primary" type="submit" disabled={hasUserCommented} style={{ marginTop: '10px',marginBottom: '10px' }}>
                      Submit
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Col>
          </Row>
        ) : (
          <div>Orchid not found</div>
        )}

        <Modal show={show} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Orchid Video</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="ratio ratio-16x9">
              <iframe
                src={selectedVideo}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
