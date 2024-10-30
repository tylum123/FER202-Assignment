import React, { useContext } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { auth, createUserWithEmailAndPassword } from "../Config/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import bcrypt from 'bcryptjs'; // Import bcryptjs
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const navigate = useNavigate();
  const { isDarkTheme } = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleRegister = async (values) => {
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      setUser(userCredential.user);

      // Post user data to your API without hashing the password
      const response = await fetch("https://670a18acaf1a3998baa30805.mockapi.io/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          role: "user",
          password: values.password, // Store password as is
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add user to API");
      }

      const data = await response.json();
      console.log("User added to API:", data);

      // Show success toast
      toast.success("Registration successful! You are now logged in.");

      // Redirect to home page after registration
      navigate("/");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already in use. Please use a different email.");
      } else {
        console.error("Error during registration:", error);
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleRegister = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setUser(result.user);

        // Generate a random password and hash it
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(randomPassword, 10);

        const userInfo = {
          name: result.user.displayName,
          email: result.user.email,
          role: "user",
          password: hashedPassword, // Store hashed password
        };
        console.log("User registered with Google:", userInfo);

        // Post user data to your API
        try {
          const response = await fetch("https://670a18acaf1a3998baa30805.mockapi.io/test", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userInfo),
          });

          if (!response.ok) {
            throw new Error("Failed to add user to API");
          }

          const data = await response.json();
          console.log("User added to API:", data);

          // Show success toast
          toast.success("Registration successful! You are now logged in.");

          // Redirect to home page
          navigate("/");
        } catch (error) {
          console.error("Error adding user to API:", error);
          toast.error("Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error registering with Google:", error);
        toast.error("Google registration failed. Please try again.");
      });
  };

  const containerStyle = {
    backgroundColor: isDarkTheme ? "#333" : "#f0f0f0",
    color: isDarkTheme ? "#f0f0f0" : "#333",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Container style={containerStyle} fluid>
      <ToastContainer />
      <Card
        className={`p-4 shadow ${isDarkTheme ? "bg-secondary" : "bg-white"}`}
        style={{ width: "400px", borderRadius: "10px" }}
      >
        <Card.Body className="text-center">
          <Card.Title
            className="mb-3"
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            Create an Account
          </Card.Title>
          <Card.Text
            className="mb-4"
            style={{ fontSize: "1rem", color: "#666" }}
          >
            Sign up to get started
          </Card.Text>
          <Button
            variant={isDarkTheme ? "outline-light" : "outline-dark"}
            onClick={handleGoogleRegister}
            className="mb-3 d-flex align-items-center justify-content-center"
            style={{ width: "100%" }}
          >
            <i className="bi bi-google me-2"></i> Register with Google
          </Button>
          <hr />
          <Formik
            initialValues={{
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={values.fullName}
                    onChange={handleChange}
                    isInvalid={touched.fullName && !!errors.fullName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    isInvalid={
                      touched.confirmPassword && !!errors.confirmPassword
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="mb-3"
                  style={{ width: "100%" }}
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-3">
            <span>Already have an account? </span>
            <Link
              to="/login"
              style={{ color: isDarkTheme ? "#f0f0f0" : "#007bff" }}
            >
              Login here
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
