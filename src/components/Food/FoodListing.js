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

const fetchFood = async () => {
  const url = endpoint + "get_all_food";
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

export default function FoodListing() {
  const [food, setFood] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [foodId, setFoodId] = useState([]);
  const [openSB, setOpenSB] = useState(false);

  useEffect(() => {
    const getFood = async () => {
      const results = await fetchFood();
      setFood(results);
    };

    getFood();
  }, []);

  const archivedFood = async () => {
    const url = endpoint + "archived_food/" + parseInt(foodId);
    const loggedInUser = localStorage.getItem("user");
    const currentUser = JSON.parse(loggedInUser);
    const accessToken =
      currentUser[0].tokenType + " " + currentUser[0].accessToken;

    console.log(accessToken);

    const res = await axios
      .post(url, "", {
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: accessToken,
        },
      })
      .catch((error) => {
        console.log(error);
        setMessage({
          status: "error",
          statusText: "Failed to archive the food!",
        });
        setOpenSB(true);
      });

    if (res.data) {
      // await fetchFood();
      setMessage({
        status: "success",
        statusText: "Food is archived successfully!",
      });
    } else {
      setMessage({
        status: "error",
        statusText: "Failed to archive the food!",
      });
    }

    setOpenSB(true);
    handleCloseConfirmBox();
    window.location.reload();
  };

  const handleOpenConfirmBox = (id) => {
    setFoodId(id);
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

  

  const columns = [
    {
      name: "Name",
      selector: (row) => row.food_name,
      sortable: true,
    },
    {
      name: "Barcode",
      selector: (row) => row.food_code,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.food_quantity,
      sortable: true,
    },
    {
      name: "Serving Size",
      selector: (row) => row.food_serving_size,
      sortable: true,
    },
    {
      name: "Enery_kcal",
      selector: (row) => row.energy_kcal_100g,
      sortable: true,
    },
    {
      name: "Carbohydrates/100g (g)",
      selector: (row) => row.carbohydrates_100g,
      sortable: true,
      width: "200px"
    },
    {
      name: "Proteins/100g (g)",
      selector: (row) => row.proteins_100g,
      sortable: true,
    },
    {
      name: "Sodium/100g (mg)",
      selector: (row) => row.sodium_100g,
      sortable: true,
    },
    {
      name: "Calcium/100g (mg)",
      selector: (row) => row.calcium_100g,
      sortable: true,
    },
    {
      cell: (row) => (
        <>
          <Link to={`/food/${row.id}`}>
                    <button className="btn btn-primary " id={row.id}>
                        <i className="fas fa-edit" />
                    </button>
                </Link>
          {/* <button
            className="btn btn-primary "
            onClick={() => handleOpenConfirmBox(row.id)}
            id={row.id}
          > */}
            {/* <i className="fas fa-edit" /> */}
          {/* </button> */}
          <div>&nbsp;</div>
          <button
            className="btn btn-danger "
            onClick={() => {
              handleOpenConfirmBox(row.id);
            }}
            id={row.id}
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
                <h1>Food Listing</h1>
                <p>All food information in the database.</p>
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
                    <Link stl to="/food/add">
                      <button className="btn btn-success ">
                        <i className="fas fa-plus" /> Add New
                      </button>
                    </Link>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <DataTable
                      columns={columns}
                      data={food}
                      pagination
                      highlightOnHover
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
            Are you sure to archived this food?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmBox}>No</Button>
          <Button onClick={() => archivedFood()} autoFocus>
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
