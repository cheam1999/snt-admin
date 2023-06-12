import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

const fetchRecipe = async () => {
  const url = endpoint + "get_recipe";
  const res = await axios
    .get(url, {
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
    .catch((err) => {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      throw err;
    });
  
  return res.data;
};

export default function RecipeListing() {
  const [recipe, setRecipe] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [recipe_id, setRecipeId] = useState([]);
  const [openSB, setOpenSB] = useState(false);

  useEffect(() => {
    const getRecipe = async () => {
      const results = await fetchRecipe();
      setRecipe(results);
      
    };

    getRecipe();
    console.log("recipe", recipe);
  }, []);

  const archivedRecipe = async () => {
    const url = endpoint + "archived_recipe/" + parseInt(recipe_id);
    const loggedInUser = localStorage.getItem("user");
    const currentUser = JSON.parse(loggedInUser);
    const accessToken =
      currentUser[0].tokenType + " " + currentUser[0].accessToken;

    console.log(url);

    const res = await axios
      .post(url, "", {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: accessToken,
        },
      })
      .catch((error) => {
        console.log("???", error);
        setMessage({
          status: "error",
          statusText: "Failed to archive the recipe!",
        });
        setOpenSB(true);
      });

    if (res.data) {
      // await fetchrecipe();
      setMessage({
        status: "success",
        statusText: "Recipe is archived successfully!",
      });
    } else {
      setMessage({
        status: "error",
        statusText: "Failed to archive the Recipe!",
      });
    }

    setOpenSB(true);
    handleCloseConfirmBox();
    window.location.reload();
  };

  const handleOpenConfirmBox = (id) => {
    console.log("open", id);
    setRecipeId(id);
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
  const mealNumber = ["Breakfast", "Lunch", "Snacks", "Dinner"];

  const columns = [
    {
      name: "Name",
      selector: (row) => row.recipe_name,
      sortable: true,
    },
    {
      name: "Image URL",
      selector: (row) => row.recipe_image,
      sortable: true,
    },
    {
      name: "Ingredients",
      selector: (row) => row.recipe_ingredients,
      sortable: true,
    },
    {
      name: "Instructions",
      selector: (row) => row.recipe_instructions,
      sortable: true,
    },
    {
      name: "Source",
      selector: (row) => row.recipe_source,
      sortable: true,
    },
    {
      name: "Meal",
      selector: (row) => mealNumber[row.recipe_meal],
      sortable: true,
    },

    {
      cell: (row) => (
        <>
        
          <Link to={`/recipe/${row.recipe_id}`}>
            
            <button className="btn btn-primary " id={row.recipe_id}>
              <i className="fas fa-edit" />
            </button>
          </Link>
          {/* <button
            className="btn btn-primary "
            onClick={() => handleOpenConfirmBox(row.recipe_id)}
            id={row.recipe_id}
          > */}
          {/* <i className="fas fa-edit" /> */}
          {/* </button> */}
          <div>&nbsp;</div>
          <button
            className="btn btn-danger "
            onClick={() => {
              console.log("on click",row.recipe_id);
              handleOpenConfirmBox(row.recipe_id);
            }}
            id={row.recipe_id}
          >
            <i className="fas fa-times" />
          </button>
        </>
      ),
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
                <h1>Recipe Listing</h1>
                <p>All recipe in the database.</p>
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </section>
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <Link stl to="/recipe/add">
                      <button className="btn btn-success ">
                        <i className="fas fa-plus" /> Add New
                      </button>
                    </Link>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <DataTable
                      columns={columns}
                      data={recipe}
                      pagination
                      highlightOnHover
                      size={"normal"}
                      tableStyle={{ width: '50rem' }}
                    />
                  </div>
                  {/* /.card-body */}
                </div>
                {/* /.card */}
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
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
            Are you sure to archived this recipe?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmBox}>No</Button>
          <Button onClick={() => archivedRecipe()} autoFocus>
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
    </div>
  );
}
