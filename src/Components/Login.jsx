import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Container, Card, Form } from "react-bootstrap";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Config/firebaseConfig";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";


export default function Login() {
  const navigate = useNavigate()
  const { isDarkTheme } = useContext(ThemeContext);
  const { setUser } = useContext(AuthContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values) => {
    try {
      // Fetch user data from the API
      const response = await fetch("https://670a18acaf1a3998baa30805.mockapi.io/test");
      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const users = await response.json();
      const user = users.find(user => user.email === values.email && user.password === values.password);

      if (!user) {
        throw new Error("Invalid email or password.");
      }

      console.log("User logged in:", user);

      // Set user in AuthContext
      setUser(user);

      // Show success toast
      toast.success("Login successful!");

      // Redirect to home page after login
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    signInWithPopup(auth, provider)
      .then((result) => {
        const userInfo = {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };
        console.log("User Info:", userInfo);

        // Set user in AuthContext
        setUser(result.user);

        // Show success toast
        toast.success("Google login successful!");

        // Redirect to home page
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
        toast.error("Google login failed. Please try again.");
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
      <Card
        className={`p-4 shadow ${isDarkTheme ? "bg-secondary" : "bg-white"}`}
        style={{ width: "400px", borderRadius: "10px" }}
      >
        <Card.Body className="text-center">
          <Card.Title className="mb-3" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Welcome Back!
          </Card.Title>
          <Card.Text className="mb-4" style={{ fontSize: "1rem", color: "#666" }}>
            Sign in to continue
          </Card.Text>
          <Button
            variant={isDarkTheme ? "outline-light" : "outline-dark"}
            onClick={handleGoogleLogin}
            className="mb-3 d-flex align-items-center justify-content-center"
            style={{ width: "100%" }}
          >
            <i className="bi bi-google me-2"></i> Sign in with Google
          </Button>
          <hr />
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
              <Form noValidate onSubmit={handleSubmit}>
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
                <Button variant="primary" type="submit" className="mb-3" style={{ width: "100%" }}>
                  Login
                </Button>
              </Form>
            )}
          </Formik>
          <div className="mt-3">
            <span>Don't have an account? </span>
            <Link to="/register" style={{ color: isDarkTheme ? "#f0f0f0" : "#007bff" }}>
              Register here
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
