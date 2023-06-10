import React, { useEffect, useState, useRef } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import WYSIWYGEditor from "../Form/WYSIWYGEditor.js";
import CustomDatePicker from "../Form/CustomDatePicker.js";
import { isUrlMethod, validateRichText } from "../Form/ValidationSchema.js";
import { Card, Form, Container, Row, Col } from "react-bootstrap";
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

function RecipeForm({ match }) {
  const { id } = useParams();
  const MySwal = withReactContent(Swal);

  const isAddMode = !id;
  const [recipe, setRecipe] = useState({});
  const [dialogMessage, setDialogMessage] = useState("");

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
        setRecipe(response.data);
        setRecipeName(response.data[0].recipe_name);
        setRecipeImage(response.data[0].recipe_image);
        setIngredients(response.data[0].recipe_ingredients);
        setInstructions(response.data[0].recipe_instructions);
        setSource(response.data[0].recipe_source);
        setMeal(response.data[0].recipe_meal);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getRecipeById(id);
  }, []);
  const navigate = useNavigate();

  // set value
  const [recipeName, setRecipeName] = useState();
  const [recipeImage, setRecipeImage] = useState();
  const [ingredients, setIngredients] = useState();
  const [instructions, setInstructions] = useState();
  const [source, setSource] = useState();
  const [meal, setMeal] = useState("");
  const [mealNumber, setMealNumber] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [openDoneDialog, setOpenDoneDialog] = useState(false);
  const [openSB, setOpenSB] = useState(false);

  const mealOnChange = (event) => {
    setMeal(event.target.key);
    console.log(meal);
  };

  const createRecipe = async () => {
    // const loggedInUser = localStorage.getItem("user");
    // const currentUser = JSON.parse(loggedInUser);
    // const accessToken =
    //   currentUser[0].tokenType + " " + currentUser[0].accessToken;

    const url = endpoint + "create_recipe";

    const data = new FormData();

    data.append("recipe_name", recipeName);
    data.append("recipe_image", recipeImage);
    data.append("recipe_ingredients", ingredients);
    data.append("recipe_instructions", instructions);
    data.append("recipe_source", source);
    data.append("recipe_meal", meal);

    console.log("ssdata", mealNumber);
    console.log("ssdata", meal);

    const res = await axios
      .post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          //   Authorization: accessToken,
        },
      })
      .then((response) => {
        console.log(response);
        setMessage({
          status: "success",
          statusText: "The recipe is added successfully.",
        });
        setOpenSB(true);
        handleCloseConfirmBox();
        // handleOpenDoneDialog();
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          status: "error",
          statusText: "Failed to add the recipe.",
        });
        setOpenSB(true);
      });
  };

  const updateRecipe = async () => {
    const url = endpoint + "update_recipe";
    const loggedInUser = localStorage.getItem("user");
    const currentUser = JSON.parse(loggedInUser);
    const accessToken =
      currentUser[0].tokenType + " " + currentUser[0].accessToken;

    console.log(accessToken);

    const data = new FormData();

    data.append("recipe_name", recipeName);
    data.append("recipe_image", recipeImage);
    data.append("recipe_ingredients", ingredients);
    data.append("recipe_instructions", instructions);
    data.append("recipe_source", source);
    data.append("recipe_meal", meal);

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
          statusText: "The recipe is updated successfully.",
        });
        setOpenSB(true);
        handleCloseConfirmBox();
        // handleOpenDoneDialog();
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          status: "error",
          statusText: "Failed to update the recipe.",
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
      setDialogMessage("Are you sure you want to add this recipe?");
    } else {
      setDialogMessage("Are you sure you want to update this recipe?");
    }
  }, []);

    // useEffect(() => {
    //   switch(meal){
    //     case("Breakfast"):{

    //     }
    //   }
    // }, [meal]);

  const saveRecipe = async () => {
    // console.log(data);

    try {
      if (isAddMode) {
        await createRecipe();
      } else {
        await updateRecipe();
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
                  <h1>Recipe Form</h1>
                  <p>Create or edit recipe information.</p>
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
                          <Card.Title as="h4">Recipe Form</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Form>
                            <Row>
                              <Col className="pr-1" md="6">
                                <InputLabel>Name</InputLabel>
                                <TextField
                                  value={recipeName == null ? "" : recipeName}
                                  size="small"
                                  id="recipeName"
                                  sx={{ marginBottom: "20px" }}
                                  fullWidth
                                  onChange={(e) => {
                                    setRecipeName(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="6">
                                <InputLabel>Image URL</InputLabel>
                                <TextField
                                  value={recipeImage == null ? "" : recipeImage}
                                  size="small"
                                  id="recipeImage"
                                  type="url"
                                  fullWidth
                                  onChange={(e) => {
                                    setRecipeImage(e.target.value);
                                  }}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="pr-1" md="6">
                                <InputLabel>Source URL</InputLabel>
                                <TextField
                                  value={source == null ? "" : source}
                                  size="small"
                                  id="source"
                                  fullWidth
                                  sx={{ marginBottom: "30px" }}
                                  onChange={(e) => {
                                    setSource(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="6">
                                <InputLabel>Meal</InputLabel>
                                {/* <TextField
                                  value={meal == null ? "" : meal}
                                  size="small"
                                  id="meal"
                                  sx={{ marginBottom: "20px" }}
                                  fullWidth
                                  onChange={(e) => {
                                    setMeal(e.target.value);
                                  }}
                                /> */}
                                <FormControl fullWidth>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={meal}
                                    onChange={(e) => {
                                        setMealNumber(e.target.id);
                                        setMeal(e.target.value);
                                      }}
                                  >
                                    <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  <MenuItem id="0" value={0}>
                                    Breakfast
                                  </MenuItem>
                                  <MenuItem id="1" value={1}>
                                    Lunch
                                  </MenuItem>
                                  <MenuItem id="2" value={2}>
                                    Snacks
                                  </MenuItem>
                                  <MenuItem id="3" value={3}>
                                    Dinner
                                  </MenuItem>
                                  </Select>
                                </FormControl>
                                {/* <Select
                                  fullWidth
                                  required
                                  //   defaultValue="Breakfast"
                                  value={meal === "" ? "" : meal}
                                  //   onChange = {(event) => { {

                                  //     await setMeal(event.target.value);
                                  //     console.log(meal);

                                  // }}}
                                  onChange={(e) => {
                                    setMeal(e.target.key);
                                  }}
                                >
                                  <MenuItem value="">
                                    <em>None</em>
                                  </MenuItem>
                                  <MenuItem key="0" value={"Breakfast"}>
                                    Breakfast
                                  </MenuItem>
                                  <MenuItem key="1" value={"Lunch"}>
                                    Lunch
                                  </MenuItem>
                                  <MenuItem key="2" value={"Snacks"}>
                                    Snacks
                                  </MenuItem>
                                  <MenuItem key="3" value={"Dinner"}>
                                    Dinner
                                  </MenuItem>
                                </Select> */}
                              </Col>
                            </Row>
                            <Row>
                              <Col className="pr-1" md="6">
                                <InputLabel>Ingredients</InputLabel>
                                <TextField
                                  value={ingredients == null ? "" : ingredients}
                                  size="small"
                                  id="ingredients"
                                  multiline
                                  rows={4}
                                  type="text"
                                  fullWidth
                                  sx={{ marginBottom: "20px" }}
                                  onChange={(e) => {
                                    setIngredients(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="6">
                                <InputLabel>Recipe Instructions</InputLabel>
                                <TextField
                                  value={
                                    instructions == null ? "" : instructions
                                  }
                                  multiline
                                  rows={4}
                                  type="text"
                                  fullWidth
                                  size="small"
                                  id="instructions"
                                  sx={{ marginBottom: "20px" }}
                                  onChange={(e) => {
                                    setInstructions(e.target.value);
                                  }}
                                />
                              </Col>
                            </Row>

                            <Button
                              variant="contained"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={() => {
                                if (
                                  recipeName === "" ||
                                  recipeImage === "" ||
                                  ingredients === "" ||
                                  instructions === "" ||
                                  source === "" ||
                                  meal === null
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
      {/* <Dialog
        open={openDoneDialog}
        onClose={handleCloseDoneDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The Recipe is updated successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDoneDialog()}>No</Button>
        </DialogActions>
      </Dialog> */}
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
          <Button onClick={() => saveRecipe()} autoFocus>
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

export default RecipeForm;
