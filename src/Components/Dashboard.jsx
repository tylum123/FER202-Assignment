import { useState, useEffect, useContext } from "react";
import { Col, Row, Image } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ThemeContext } from "../ThemeContext";
import { AuthContext } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const [api, setAPI] = useState([]);
  const [show, setShow] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkTheme } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext);

  const handleClose = () => {
    setShow(false);
    setEditItem(null);
  };
  const handleShow = () => setShow(true);
  const baseURL = `https://670a18acaf1a3998baa30805.mockapi.io/orchids`;

  const fetchAPI = () => {
    fetch(baseURL + "?sortBy=id&order=desc")
      .then((resp) => resp.json())
      .then((data) => setAPI(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleDelete = (id) => {
    fetch(baseURL + "/" + id, { method: "DELETE" })
      .then(() => {
        toast.success("Delete successfully!");
        fetchAPI();
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShow(true);
  };

  const formik = useFormik({
    initialValues: {
      name: editItem ? editItem.name : "",
      description: editItem ? editItem.description : "",
      image: editItem ? editItem.image : "",
      category: editItem ? editItem.category : "Cattleya",
      origin: editItem ? editItem.origin : "",
      color: editItem ? editItem.color : "#ffffff",
      rating: editItem ? editItem.rating : 1,
      isSpecial: editItem ? editItem.isSpecial : false,
      video: editItem ? editItem.video : "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Required.")
        .min(2, "Must be 2 characters or more"),
      description: Yup.string()
        .required("Required.")
        .min(10, "Must be 10 characters or more"),
      image: Yup.string()
        .required("Required.")
        .url("Must be a valid URL"),
      category: Yup.string().required("Required."),
      origin: Yup.string().required("Required."),
      color: Yup.string().required("Required."),
      rating: Yup.number()
        .required("Required.")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
      video: Yup.string()
        .required("Required.")
        .url("Must be a valid URL"),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true);
      const method = editItem ? "PUT" : "POST";
      const url = editItem ? `${baseURL}/${editItem.id}` : baseURL;

      fetch(url, {
        method: method,
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      })
        .then((response) => response.json())
        .then((newItem) => {
          handleClose();
          toast.success(editItem ? "Update successfully" : "Create successfully");
          if (!editItem) {
            setAPI((prevAPI) => [newItem, ...prevAPI]); // Thêm mục mới vào đầu danh sách
          } else {
            fetchAPI(); // Tải lại danh sách nếu là cập nhật
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
  });

  // Function to get responsive styles
  const getResponsiveStyles = () => {
    const isSmallScreen = window.innerWidth < 768;

    return {
      container: {
        backgroundColor: isDarkTheme ? "#333" : "#f0f0f0",
        color: isDarkTheme ? "#f0f0f0" : "#333",
        padding: isSmallScreen ? "10px" : "20px",
        minHeight: "100vh",
        height: "100%",
      },
      table: {
        fontSize: isSmallScreen ? "10px" : "15px",
        width: "100%",
        overflowX: isSmallScreen ? "auto" : "visible",
      },
      modal: {
        width: "100%",
        margin: "auto",
      },
      button: {
        fontSize: isSmallScreen ? "5px" : "14px",
        padding: isSmallScreen ? "5px 5px" : "10px 20px",
      },
    };
  };

  const styles = getResponsiveStyles();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth state
  }

  return user ? (
    <div style={styles.container}>
      <ToastContainer />
      <h2 className="text-center my-4">Orchid Management</h2>
      <Row className="py-2">
        <Col>
          <div className="d-flex justify-content-end mb-2">
            <Button variant="primary" onClick={handleShow} style={styles.button}>
              Add Orchid
            </Button>
          </div>
          <Modal show={show} onHide={handleClose} style={styles.modal}>
            <Modal.Header closeButton>
              <Modal.Title>{editItem ? "Edit Orchid" : "Add Orchid"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="name of orchid"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.name && !!formik.errors.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-danger">{formik.errors.name}</div>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="image url"
                    name="image"
                    value={formik.values.image}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.image && !!formik.errors.image}
                  />
                  {formik.touched.image && formik.errors.image ? (
                    <div className="text-danger">{formik.errors.image}</div>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.description && !!formik.errors.description}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="text-danger">{formik.errors.description}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Video URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="video url"
                    name="video"
                    value={formik.values.video}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.video && !!formik.errors.video}
                  />
                  {formik.touched.video && formik.errors.video ? (
                    <div className="text-danger">{formik.errors.video}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.category && !!formik.errors.category}
                  >
                    {api.map((a) => (
                      <option key={a.id} value={a.category}>
                        {a.category}
                      </option>
                    ))}
                  </Form.Select>
                  {formik.touched.category && formik.errors.category ? (
                    <div className="text-danger">{formik.errors.category}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Origin</Form.Label>
                  <Form.Control
                    type="country"
                    placeholder="origin"
                    name="origin"
                    value={formik.values.origin}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.origin && !!formik.errors.origin}
                  />
                  {formik.touched.origin && formik.errors.origin ? (
                    <div className="text-danger">{formik.errors.origin}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Color</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      name="color"
                      placeholder="Enter color name or hex code"
                      value={formik.values.color}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.color && !!formik.errors.color}
                      style={{ marginRight: "10px" }}
                    />
                    <Form.Control
                      type="color"
                      name="color"
                      value={formik.values.color}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.color && !!formik.errors.color}
                    />
                  </div>
                  {formik.touched.color && formik.errors.color ? (
                    <div className="text-danger">{formik.errors.color}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="rating"
                    name="rating"
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.rating && !!formik.errors.rating}
                  />
                  {formik.touched.rating && formik.errors.rating ? (
                    <div className="text-danger">{formik.errors.rating}</div>
                  ) : null}
                </Form.Group>
                <Form.Group>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Special"
                    name="isSpecial"
                    checked={formik.values.isSpecial}
                    onChange={formik.handleChange}
                  />
                </Form.Group>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose} style={styles.button}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    style={styles.button}
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>

          <Table striped bordered hover style={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Origin</th>
                <th>Color</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Special</th>
                <th>Video URL</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {api.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Image src={a.image} thumbnail style={{ width: 50, height: 50 }} />
                  </td>
                  <td>{a.name}</td>
                  <td>{a.origin}</td>
                  <td>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: a.color,
                        borderRadius: "50%",
                      }}
                    ></div>
                  </td>
                  <td>{a.category}</td>
                  <td>{"⭐️".repeat(a.rating)}</td>
                  <td>
                    {a.isSpecial && (
                      <i className="bi bi-check-circle-fill" style={{ color: "green" }}></i>
                    )}
                  </td>
                  <td>
                    <a href={a.video} target="_blank" rel="noopener noreferrer">
                      View Video
                    </a>
                  </td>
                  <td>
                    <Button variant="success" onClick={() => handleEdit(a)} style={styles.button}>
                      <i className="bi bi-pencil-square"></i>
                      Edit
                    </Button>
                    {" "}|{" "}
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (confirm("Do you want to delete?")) handleDelete(a.id);
                      }}
                      style={styles.button}
                    >
                      <i className="bi bi-trash3-fill"></i>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default Dashboard;
