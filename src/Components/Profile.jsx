import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../Context/AuthContext";
import { ThemeContext } from "../ThemeContext";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";

export default function Profile() {
  const { user, loading, setUser } = useContext(AuthContext);
  const { isDarkTheme } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth state
  }

  if (!user) {
    return <Navigate to="/" />; // Redirect if not authenticated
  }

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required("Display Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    fetch(`https://670a18acaf1a3998baa30805.mockapi.io/test/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    .then(response => response.json())
    .then(data => {
      toast.success("Profile updated successfully!");
      console.log("Updated Data:", data);
      setUser(data);
      setShowModal(false); // Close the modal on success
    })
    .catch(error => {
      toast.error("Failed to update profile.");
      console.error("Error:", error);
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  // Define styles based on the theme
  const containerStyle = {
    backgroundColor: isDarkTheme ? "#333" : "#f0f0f0",
    color: isDarkTheme ? "#f0f0f0" : "#333",
    minHeight: "100vh",
    padding: "20px",
    borderRadius: "8px",
  };

  return (
    <Container fluid style={containerStyle}>
      <ToastContainer />
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="text-center mb-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="User Avatar"
                className="rounded-circle"
                style={{ width: "150px", height: "150px" }}
              />
            ) : (
              <i className="bi bi-person-circle" style={{ fontSize: "150px", color: isDarkTheme ? "#f0f0f0" : "#333" }}></i>
            )}
            <h2>{user.displayName || user.name}</h2>
            <p>Email: {user.email}</p>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Update Profile
            </Button>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              displayName: user.displayName || user.name,
              email: user.email,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formDisplayName">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="displayName"
                    value={values.displayName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.displayName && !!errors.displayName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.displayName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formEmail" className="mt-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4" disabled={isSubmitting}>
                  Save Changes
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
