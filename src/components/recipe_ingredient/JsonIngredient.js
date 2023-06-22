import React, { useEffect, useState, useRef } from "react";
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
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
// import DataTable from "react-data-table-component";
import JsonIngredientForm from "./JsonIngredientForm";
import axios from "axios";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { DataTable } from "primereact/datatable";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

function JsonIngredient() {
  const [jsonText, setJsonText] = useState();
  const [decodeIngredientsList, setDecodeIngredientsList] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [ingredientName, setIngredientName] = useState();
  const [recipeSelected, setRecipeSelected] = useState();
  const [recipeID, setRecipeId] = useState();
  const [amount, setAmount] = useState();
  const [measure_name, setMeasureName] = useState();
  const [cups, setCups] = useState();
  const [comments, setComments] = useState("");
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const handleOpenConfirmBox = () => {
    setOpenConfirmBox(true);
  };
  const handleCloseConfirmBox = () => {
    setOpenConfirmBox(false);
  };

  const generateList = async () => {
    const jsonObject = eval("(" + jsonText + ")");
    const ingList = (obj) => {
      const ing = {
        // key :
        name: obj["name"],
        comments: obj["comment"],
        recipe_id: null,
        measure_name: obj["measure"]["name"],
        amount: obj["measure"]["amount"],
        cups: obj["measure"]["cups"],
      };

      setDecodeIngredientsList((decodeIngredientsList) => [
        ...decodeIngredientsList,
        ing,
      ]);
    };
    for (let i = 0; i < jsonObject.ingredients.length; i++) {
      ingList(jsonObject.ingredients[i]);
    }
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

  const [openSB, setOpenSB] = useState(false);

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
    fetchRecipe();
  }, []);

  const onRowEditComplete = (e) => {
    let _editedIng = [...decodeIngredientsList];
    let { newData, index } = e;

    const ing = {
      // key :
      name: newData["name"],
      comments: newData["comments"],
      // recipe_id: recipeSelected,
      measure_name: measure_name,
      amount: newData["amount"],
      cups: newData["cups"],
    };

    _editedIng[index] = ing;

    setDecodeIngredientsList(_editedIng);
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const measureNameEditor = (options) => {
    return (
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={measure_name == null ? options.value : measure_name}
        onChange={(e) => {
          setMeasureName(e.target.value);
        }}
      >
        <MenuItem value={"cup"}>cup</MenuItem>
        <MenuItem value={"ounces"}>ounces</MenuItem>
        <MenuItem value={"teaspoons"}>teaspoons</MenuItem>
        <MenuItem value={"tablespoons"}>tablespoons</MenuItem>
        <MenuItem value={"whole"}>whole</MenuItem>
        <MenuItem value="others">
          <em>others</em>
        </MenuItem>
      </Select>
    );
  };

  const measureNameBodyTemplate = (rowData) => {
    return <Tag value={rowData.measure_name}></Tag>;
  };

  const createAllIngredient = async () => {
    const loggedInUser = localStorage.getItem("user");
    const currentUser = JSON.parse(loggedInUser);
    const accessToken =
      currentUser[0].tokenType + " " + currentUser[0].accessToken;

    const url = endpoint + "create_ingredients";

    let _editedIng = [...decodeIngredientsList];
    let successBool = Array(decodeIngredientsList.length);

    for (let i = 0; i < decodeIngredientsList.length; i++) {
      const data = new FormData();

      data.append("ingredients_name", _editedIng[i]["name"]);
      data.append("recipe_id", recipeSelected);
      data.append("amount", _editedIng[i]["amount"]);
      data.append("measure_name", _editedIng[i]["measure_name"]);
      data.append("cups", _editedIng[i]["cups"]);
      data.append(
        "comments",
        _editedIng[i]["comments"] === undefined ? "" : _editedIng[i]["comments"]
      );
      console.log("comments", _editedIng[i]["comments"]);

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
          successBool[i] = true;
        })
        .catch((error) => {
          console.log(error);

          successBool[i] = false;
          //
        });

      // _editedIng[i] = ing;
    }
    console.log("bool", successBool);
    for (let i = 0; i < successBool.length; i++) {
      if (successBool[i] === false) {
        setMessage({
          status: "error",
          statusText: "Failed to add the ingredients.",
        });
        handleCloseConfirmBox();
        setOpenSB(true);
        break;
      }
      setMessage({
        status: "success",
        statusText: "The ingredients are added successfully.",
      });
      handleCloseConfirmBox();
      setOpenSB(true);
    }
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Recipe Name",
      selector: (row) => row.recipe_id,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
    },
    {
      name: "Measure Name",
      selector: (row) => row.measure_name,
      sortable: true,
    },
    {
      name: "Cups",
      selector: (row) => row.cups,
      sortable: true,
    },
    {
      name: "Comments",
      selector: (row) => row.comments,
      sortable: true,
    },

    {
      cell: (row) => <></>,

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Ingredients Json Form</h1>
                <p>
                  Paste the json text generated from
                  <a
                    href="https://schollz.com/tinker/ingredients/#try"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    here{" "}
                  </a>{" "}
                  to generate ingredients.
                </p>
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
                      <Card.Body>
                        <Form>
                          <Row>
                            <Col className="pr-1" md="3">
                              {/* <InputLabel>Json Text</InputLabel> */}
                              <TextField
                                value={jsonText == null ? "" : jsonText}
                                size="small"
                                id="jsonText"
                                multiline
                                rows={15}
                                label="Paste your json text here."
                                sx={{ marginBottom: "20px" }}
                                fullWidth
                                onChange={(e) => {
                                  setJsonText(e.target.value);
                                }}
                              />
                              <Button
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={() => {
                                  if (jsonText === "") {
                                    setMessage({
                                      status: "error",
                                      statusText:
                                        "You are required to fill in all the details.",
                                    });
                                    setOpenSB(true);
                                  } else {
                                    generateList();
                                  }
                                }}
                                disabled={
                                  decodeIngredientsList.length === 0
                                    ? false
                                    : true
                                }
                              >
                                Generate List
                              </Button>
                            </Col>
                            <Col className="pr-1" md="6">
                              <Card.Header>
                                <Card.Title as="h3">
                                  Ingredients Result
                                </Card.Title>
                              </Card.Header>
                              <div className="card-body">
                                <DataTable
                                  // columns={columns}
                                  value={decodeIngredientsList}
                                  // pagination
                                  // highlightOnHover
                                  // size={"normal"}
                                  tableStyle={{ width: "50rem" }}
                                  editMode="row"
                                  onRowEditComplete={onRowEditComplete}
                                >
                                  <Column
                                    field="name"
                                    header="Name"
                                    editor={(options) => textEditor(options)}
                                    style={{ width: "20%" }}
                                  ></Column>
                                  <Column
                                    field="amount"
                                    header="Amount"
                                    editor={(options) => textEditor(options)}
                                    style={{ width: "20%" }}
                                  ></Column>
                                  <Column
                                    field="measure_name"
                                    header="Measure Name"
                                    body={measureNameBodyTemplate}
                                    editor={(options) =>
                                      measureNameEditor(options)
                                    }
                                    style={{ width: "20%" }}
                                  ></Column>
                                  <Column
                                    field="cups"
                                    header="Cups"
                                    editor={(options) => textEditor(options)}
                                    style={{ width: "20%" }}
                                  ></Column>
                                  <Column
                                    field="comments"
                                    header="Comments"
                                    editor={(options) => textEditor(options)}
                                    style={{ width: "20%" }}
                                  ></Column>
                                  <Column
                                    rowEditor
                                    headerStyle={{
                                      width: "10%",
                                      minWidth: "8rem",
                                    }}
                                    bodyStyle={{ textAlign: "center" }}
                                  ></Column>
                                </DataTable>
                                <div>&nbsp;</div>
                                <Row>
                                  <InputLabel>
                                    Select the recipe ingredients to insert.
                                  </InputLabel>
                                  <FormControl fullWidth>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      value={recipeSelected || ""}
                                      onChange={(e) => {
                                        setRecipeSelected(e.target.value);
                                      }}
                                    >
                                      {recipe?.map((rec) => (
                                        <MenuItem value={rec.recipe_id}>
                                          {rec.recipe_name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Row>
                              </div>
                              <div>&nbsp;</div>
                              <Row>
                                <Button
                                  variant="contained"
                                  sx={{ mt: 3, mb: 2 }}
                                  disabled={
                                    decodeIngredientsList.length === 0
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    if (decodeIngredientsList.length === 0) {
                                      setMessage({
                                        status: "error",
                                        statusText:
                                          "There is no ingredients to insert.",
                                      });
                                      setOpenSB(true);
                                    } else {
                                      handleOpenConfirmBox();
                                      createAllIngredient();
                                    }
                                  }}
                                >
                                  Insert All
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
                            </Col>
                          </Row>
                          <div className="clearfix"></div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </div>
            <Dialog
              open={openConfirmBox}
              onClose={handleCloseConfirmBox}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Inserting"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {"The data is inserting to the database......"}
                </DialogContentText>
              </DialogContent>
              {/* <DialogActions>
                <Button onClick={handleCloseConfirmBox}>No</Button>
                <Button onClick={() => saveIngredient()} autoFocus>
                  Yes
                </Button>
              </DialogActions> */}
            </Dialog>
          </div>

          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
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
    </div>
  );
}

const data = [];

const processData = (listData) => {
  data = listData;
};

export default JsonIngredient;
