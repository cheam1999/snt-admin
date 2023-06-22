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
import { Link } from "react-router-dom";
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
  TextField,
  Button,
} from "@mui/material";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

function FoodForm({ match }) {
  const { id } = useParams();
  const MySwal = withReactContent(Swal);

  const isAddMode = !id;
  const [food, setFood] = useState({});
  const [dialogMessage, setDialogMessage] = useState("");

  const getFoodById = async (id) => {
    const url = endpoint + "get_food_by_id/" + parseInt(id);

    console.log("url: ", url);

    await axios
      .get(url, {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
      .then((response) => {
        setFood(response.data);
        setFoodName(response.data[0].food_name);
        setFoodCode(response.data[0].food_code);
        setQuanity(response.data[0].food_quantity);
        setServingSize(response.data[0].food_serving_size);
        setEnergy(response.data[0].energy_kcal_100g);
        setCarb(response.data[0].carbohydrates_100g);
        setProteins(response.data[0].proteins_100g);
        setSodium(response.data[0].sodium_100g);
        setCalcium(response.data[0].calcium_100g);
        console.log(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getFoodById(id);
  }, []);
  const navigate = useNavigate();

  // set value
  const [foodName, setFoodName] = useState();
  const [foodCode, setFoodCode] = useState();
  const [quantity, setQuanity] = useState();
  const [serving_size, setServingSize] = useState();
  const [energy, setEnergy] = useState();
  const [carb, setCarb] = useState();
  const [proteins, setProteins] = useState();
  const [sodium, setSodium] = useState();
  const [calcium, setCalcium] = useState();
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [openDoneDialog, setOpenDoneDialog] = useState(false);
  const [openSB, setOpenSB] = useState(false);

  const createFood = async () => {
    const loggedInUser = localStorage.getItem("user");
    const currentUser = JSON.parse(loggedInUser);
    const accessToken =
      currentUser[0].tokenType + " " + currentUser[0].accessToken;

    const url = endpoint + "create_food";

    console.log(accessToken);

    const data = new FormData();

    data.append("food_name", foodName);
    data.append("food_code", foodCode);
    data.append("food_quantity", quantity);
    data.append("food_serving_size", serving_size);
    data.append("energy_kcal_100g", energy);
    data.append("carbohydrates_100g", carb);
    data.append("proteins_100g", proteins);
    data.append("sodium_100g", sodium);
    data.append("calcium_100g", calcium);

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
          statusText: "The food is added successfully.",
        });
        setOpenSB(true);
        handleCloseConfirmBox();
        // handleOpenDoneDialog();
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          status: "error",
          statusText: "Failed to add the food.",
        });
        setOpenSB(true);
      });
  };

  const updateFood = async () => {
    const url = endpoint + "update_food";
    const loggedInUser = localStorage.getItem("user");
    const currentUser = JSON.parse(loggedInUser);
    const accessToken =
      currentUser[0].tokenType + " " + currentUser[0].accessToken;

    console.log(accessToken);

    const data = new FormData();

    data.append("id", id);
    data.append("food_name", foodName);
    data.append("food_code", foodCode);
    data.append("food_quantity", quantity);
    data.append("food_serving_size", serving_size);
    data.append("energy_kcal_100g", energy);
    data.append("carbohydrates_100g", carb);
    data.append("proteins_100g", proteins);
    data.append("sodium_100g", sodium);
    data.append("calcium_100g", calcium);

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
          statusText: "The food is updated successfully.",
        });
        setOpenSB(true);
        handleCloseConfirmBox();
        // handleOpenDoneDialog();
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          status: "error",
          statusText: "Failed to update the food.",
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

  // const handleOpenDoneDialog = () => {
  //   setOpenDoneDialog(true);
  // };
  // const handleCloseDoneDialog = () => {
  //   setOpenDoneDialog(false);
  //   // window.open('/food',"_self");
  // };

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
      setDialogMessage("Are you sure you want to add this food?");
    } else {
      setDialogMessage("Are you sure you want to update this food?");
    }
  }, []);

  const saveFood = async () => {
    // console.log(data);

    try {
      if (isAddMode) {
        await createFood();
      } else {
        await updateFood();
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
                  <h1>Food Form</h1>
                  <p>Create or edit food information.</p>
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
                          <Card.Title as="h4">Food Form</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Form>
                            <Row>
                              <Col className="pr-1" md="4">
                                <InputLabel>Name</InputLabel>
                                <TextField
                                  value={foodName == null ? "" : foodName}
                                  size="small"
                                  id="foodName"
                                  sx={{ marginBottom: "20px" }}
                                  fullWidth
                                  onChange={(e) => {
                                    setFoodName(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="4">
                                <InputLabel>Barcode Value</InputLabel>
                                <TextField
                                  value={foodCode == null ? "" : foodCode}
                                  size="small"
                                  id="foodCode"
                                  // disabled
                                  onChange={(e) => {
                                    setFoodCode(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="4">
                                <InputLabel>Quantity</InputLabel>
                                <TextField
                                  value={quantity == null ? "" : quantity}
                                  size="small"
                                  id="quantity"
                                  // disabled
                                  onChange={(e) => {
                                    setQuanity(e.target.value);
                                  }}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="pr-1" md="4">
                                <InputLabel>Serving Size (g/ml)</InputLabel>
                                <TextField
                                  value={
                                    serving_size == null ? "" : serving_size
                                  }
                                  size="small"
                                  id="servingSize"
                                  sx={{ marginBottom: "20px" }}
                                  onChange={(e) => {
                                    setServingSize(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="4">
                                <InputLabel>Energy in kcal</InputLabel>
                                <TextField
                                  value={energy == null ? "" : energy}
                                  size="small"
                                  id="energy"
                                  // disabled
                                  onChange={(e) => {
                                    setEnergy(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="4">
                                <InputLabel>Carbohydrates (g)</InputLabel>
                                <TextField
                                  value={carb == null ? "" : carb}
                                  size="small"
                                  id="carb"
                                  // disabled
                                  onChange={(e) => {
                                    setCarb(e.target.value);
                                  }}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col className="pr-1" md="4">
                                <InputLabel>Proteins (g)</InputLabel>
                                <TextField
                                  value={proteins == null ? "" : proteins}
                                  size="small"
                                  id="proteins"
                                  sx={{ marginBottom: "20px" }}
                                  onChange={(e) => {
                                    setProteins(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="4">
                                <InputLabel>Sodium (g) </InputLabel>
                                <TextField
                                  value={sodium == null ? "" : sodium}
                                  size="small"
                                  id="sodium"
                                  onChange={(e) => {
                                    setSodium(e.target.value);
                                  }}
                                />
                              </Col>
                              <Col className="pr-1" md="4">
                                <InputLabel>Calcium (g)</InputLabel>
                                <TextField
                                  value={calcium == null ? "" : calcium}
                                  size="small"
                                  id="calcium"
                                  // disabled
                                  onChange={(e) => {
                                    setCalcium(e.target.value);
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
                                    foodName === "" ||
                                    // foodCode === "" ||
                                    quantity === null ||
                                    serving_size === null ||
                                    energy === null ||
                                    carb === null ||
                                    proteins === null ||
                                    sodium === null
                                    // calcium === null
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
                              <Link stl to="/food">
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
      {/* <Dialog
        open={openDoneDialog}
        onClose={handleCloseDoneDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The food is updated successfully!
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
          <Button onClick={() => saveFood()} autoFocus>
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

export default FoodForm;
