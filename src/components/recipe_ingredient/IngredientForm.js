import React, { useEffect, useState, useRef } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import WYSIWYGEditor from "../Form/WYSIWYGEditor.js";
import CustomDatePicker from "../Form/CustomDatePicker.js";
import { isUrlMethod, validateRichText } from "../Form/ValidationSchema.js";
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  convertDateFormat,
  convertToIntIfString,
} from "../../helpers/helper.js";

import useImage from "../../hooks/useImage.js";

import * as Yup from "yup";
import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Snackbar,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Chip,
  TextField,
  Button,
} from "@mui/material";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

function IngredientForm({ match }) {
  const { id, rec_id } = useParams();
  const MySwal = withReactContent(Swal);

  const isAddMode = !id;
  const [ingredient, setIngredient] = useState({});
  const [dialogMessage, setDialogMessage] = useState("");

  const getIngredientById = async (id) => {
    const url = endpoint + "get_ing_by_id/" + parseInt(id);

    console.log(url);

    await axios
      .get(url, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
      .then((response) => {
        setIngredient(response.data);
        setIngredientName(response.data[0].ingredients_name);
        // setRecipeId(response.data[0].recipe_id);
        setAmount(response.data[0].amount);
        setMeasureName(response.data[0].measure_name);
        setCups(response.data[0].cups);
        setComments(response.data[0].comments);

        console.log(response.data[0].measure_name);
      })
      .catch((error) => console.log(error));
  };

  const fetchRecipe = async () => {
    const url = endpoint + "get_recipe";
    const res = await axios
      .get(url, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
      .then((response) => {
        setRecipe(response.data);
        console.log(recipe);
      })
      .catch((error) => console.log(error));
  };

  const getRecipeById = async (id) => {
    const url = endpoint + "get_recipe_by_id/" + parseInt(id);

    console.log(url);

    await axios
      .get(url, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
      .then((response) => {
        setRecipeSelected([
          response.data[0].recipe_id,
        ]);

        console.log("recipe selected", recipeSelected);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getRecipeById(rec_id);
  }, []);

  useEffect(() => {
    getIngredientById(id);
    fetchRecipe();
  }, []);

  // set value
  const [ingredientName, setIngredientName] = useState();
  const [recipeSelected, setRecipeSelected] = useState();
  const [recipeID, setRecipeId] = useState();
  const [amount, setAmount] = useState();
  const [measure_name, setMeasureName] = useState();
  const [cups, setCups] = useState();
  const [comments, setComments] = useState("");
  const [recipe, setRecipe] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [openDoneDialog, setOpenDoneDialog] = useState(false);
  const [openSB, setOpenSB] = useState(false);

  const createIngredient = async () => {
    const loggedInUser = localStorage.getItem("user");
    const currentUser = JSON.parse(loggedInUser);
    const accessToken =
      currentUser[0].tokenType + " " + currentUser[0].accessToken;

    const url = endpoint + "create_ingredients";

    const data = new FormData();

    data.append("ingredients_name", ingredientName);
    data.append("recipe_id", recipeSelected);
    data.append("amount", amount);
    data.append("measure_name", measure_name);
    data.append("cups", cups);
    data.append("comments", comments);

    const res = await axios
      .post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: accessToken,
        },
      })
      .then((response) => {
        console.log(response);
        setMessage({
          status: "success",
          statusText: "The ingredient is added successfully.",
        });
        setOpenSB(true);
        handleCloseConfirmBox();
        // handleOpenDoneDialog();
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          status: "error",
          statusText: "Failed to add the ingredient.",
        });
        setOpenSB(true);
      });
  };

  const updateIngredient = async () => {
    const url = endpoint + "update_ingredients";
    const loggedInUser = localStorage.getItem("user");
    const currentUser = JSON.parse(loggedInUser);
    const accessToken =
      currentUser[0].tokenType + " " + currentUser[0].accessToken;

    console.log("id", recipeSelected);

    const data = new FormData();

    data.append("id", id);
    data.append("ingredients_name", ingredientName);
    data.append("recipe_id", recipeSelected);
    data.append("amount", amount);
    data.append("measure_name", measure_name);
    data.append("cups", cups);
    data.append("comments", comments);

    const res = await axios
      .post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: accessToken,
        },
      })
      .then((response) => {
        console.log(response);
        setMessage({
          status: "success",
          statusText: "The ingredient is updated successfully.",
        });
        setOpenSB(true);
        handleCloseConfirmBox();
        // handleOpenDoneDialog();
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          status: "error",
          statusText: "Failed to update the ingredient.",
        });
        setOpenSB(true);
      });
  };

  const handleOpenConfirmBox = () => {
    setOpenConfirmBox(true);
  };
  const handleCloseConfirmBox = () => {
    setOpenConfirmBox(false);
  };

  const handleCloseSB = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSB(false);
  };

  const [message, setMessage] = useState({
    status: "info",
    statusText: "",
  });

  useEffect(() => {
    if (isAddMode) {
      setDialogMessage("Are you sure you want to add this ingredient?");
    } else {
      setDialogMessage("Are you sure you want to update this ingredient?");
    }
  }, []);

  const saveIngredient = async () => {
    try {
      if (isAddMode) {
        await createIngredient();
      } else {
        await updateIngredient();
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <div>
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Ingredient Form</h1>
                  <p>Create or edit ingredient information.</p>
                </div>
              </div>
            </div>
            {/* /.container-fluid */}
          </section>
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <Container fluid>
                  <Row>
                    <Col>
                      <Card>
                        <Card.Header>
                          <Card.Title as="h4">Ingredient Form</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Form>
                            <Row>
                              <Col className="pr-1" md="6">
                                <InputLabel>Name</InputLabel>
                                <TextField
                                  value={
                                    ingredientName == null ? "" : ingredientName
                                  }
                                  size="small"
                                  id="ingredientName"
                                  sx={{ marginBottom: "20px" }}
                                  fullWidth
                                  onChange={(e) => {
                                    setIngredientName(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="6">
                                <InputLabel>Recipe</InputLabel>
                                <FormControl fullWidth>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={recipeSelected || ""}
                                    onChange={(e) => {
                                      setRecipeSelected(
                                        e.target.value,);
                                    }}
                                  >
                                    {recipe?.map((rec) => (
                                      <MenuItem
                                        value={rec.recipe_id}
                                      >
                                        {rec.recipe_name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="pr-1" md="6">
                                <InputLabel>Amount</InputLabel>
                                <TextField
                                  value={amount == null ? "" : amount}
                                  size="small"
                                  id="amount"
                                  fullWidth
                                  sx={{ marginBottom: "30px" }}
                                  onChange={(e) => {
                                    setAmount(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="6">
                                <InputLabel>Measure Name</InputLabel>
                                <FormControl fullWidth>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={measure_name || ""}
                                    onChange={(e) => {
                                      setMeasureName(e.target.value);
                                    }}
                                  >
                                    <MenuItem value={"cup"}>cup</MenuItem>
                                    <MenuItem value={"ounces"}>ounces</MenuItem>
                                    <MenuItem value={"teaspoons"}>
                                      teaspoons
                                    </MenuItem>
                                    <MenuItem value={"tablespoons"}>
                                      tablespoons
                                    </MenuItem>
                                    <MenuItem value={"whole"}>whole</MenuItem>
                                    <MenuItem value="others">
                                      <em>others</em>
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </Col>
                            </Row>
                            <Row>
                              <Col className="pr-1" md="6">
                                <InputLabel>Cups</InputLabel>
                                <TextField
                                  value={cups == null ? "" : cups}
                                  type="number"
                                  fullWidth
                                  size="small"
                                  id="cups"
                                  sx={{ marginBottom: "20px" }}
                                  onChange={(e) => {
                                    setCups(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="6">
                                <InputLabel>Ingredient Comments</InputLabel>
                                <TextField
                                  value={comments == null ? null : comments}
                                  type="text"
                                  fullWidth
                                  size="small"
                                  id="comments"
                                  sx={{ marginBottom: "20px" }}
                                  onChange={(e) => {
                                    setComments(e.target.value);
                                  }}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Button
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => {
                                  if (
                                    ingredientName === "" ||
                                    recipeSelected === null ||
                                    amount === null ||
                                    measure_name === "" ||
                                    cups === null
                                  ) {
                                    setMessage({
                                      status: "error",
                                      statusText:
                                        "You are required to fill in all the details.",
                                    });
                                    setOpenSB(true);
                                  } else {
                                    handleOpenConfirmBox();
                                  }
                                }}
                                disabled={
                                  message.status === "success" ? true : false
                                }
                              >
                                {isAddMode ? "Create" : "Edit"}
                              </Button>
                              <div>&nbsp;</div>
                              <Link stl to="/ingredients">
                                <Button
                                  variant="contained"
                                  sx={{ mt: 3, mb: 2 }}
                                >
                                  Back
                                </Button>
                              </Link>
                              
                            </Row>
                            <div className="clearfix"></div>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Dialog
        open={openConfirmBox}
        onClose={handleCloseConfirmBox}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmBox}>No</Button>
          <Button onClick={() => saveIngredient()} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSB}
        autoHideDuration={6000}
        onClose={handleCloseSB}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSB}
          severity={message.status}
          sx={{ width: "100%" }}
        >
          {message.statusText}
        </Alert>
      </Snackbar>
    </>
  );
}

export default IngredientForm;
