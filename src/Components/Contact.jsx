import { useFormik } from "formik";
import React, { useContext } from "react";
import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { ThemeContext } from "../ThemeContext";

export default function ContactDemo() {
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      phone: 0,
      menu: "",
      content: "",
      agree: false,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values));
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Required.")
        .min(2, "Must be 2 characters or more"),
      email: Yup.string().required("Required.").email("Invalid email"),
      phone: Yup.number().integer().typeError("Please enter a valid number"),
      menu: Yup.string().required("Please select a program."),
      content: Yup.string()
        .required("Required.")
        .min(10, "Must be 10 characters or more"),
      agree: Yup.boolean().oneOf(
        [true],
        "The terms and conditions must be accepted."
      ),
    }),
  });

  const { isDarkTheme } = useContext(ThemeContext);

  // Function to get responsive styles
  const getResponsiveStyles = () => {
    const isSmallScreen = window.innerWidth < 768;

    return {
      page: {
        backgroundColor: isDarkTheme ? "#343a40" : "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        padding: isSmallScreen ? "10px" : "20px",
      },
      imageContainer: {
        color: isDarkTheme ? "#fff" : "#000",
        flex: 1,
        marginBottom: isSmallScreen ? "20px" : "0",
        marginRight: isSmallScreen ? "0" : "20px",
        textAlign: "center",
      },
      form: {
        flex: 1,
        backgroundColor: isDarkTheme ? "#343a40" : "#f8f9fa",
        color: isDarkTheme ? "#fff" : "#000",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: isDarkTheme
          ? "0 0 10px rgba(255, 255, 255, 0.1)"
          : "0 0 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        fontSize: isSmallScreen ? "10px" : "15px",
        width: "100%",
      },
    };
  };

  const styles = getResponsiveStyles();

  return (
    <div style={styles.page}>
      <div style={styles.imageContainer}>
        <h2 className="text-center">Contact Us</h2>
        <img
          src="https://www.finwave.co/images/gif/Contact-1.gif"
          alt="Contact"
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </div>
      <div style={styles.form}>
        <form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Your email..."
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your name..."
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="number"
              placeholder="Your phone..."
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Menu</Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="menu"
              value={formik.values.menu}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.menu}
            >
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {formik.errors.menu}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.content}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.content}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              label="I agree to the terms and conditions"
              name="agree"
              checked={formik.values.agree}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.agree}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.agree}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="text-center">
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form.Group>
        </form>
      </div>
    </div>
  );
}
