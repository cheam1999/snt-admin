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
import { Row } from "react-bootstrap";

const endpoint = process.env.REACT_APP_API_ENDPOINT;

const fetchIng = async () => {
  const url = endpoint + "get_ingredients";
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

export default function IngListing() {
  const [ing, setIng] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [id, setIngId] = useState([]);
  const [openSB, setOpenSB] = useState(false);

  useEffect(() => {
    const getIng = async () => {
      const results = await fetchIng();
      setIng(results);
    };

    getIng();
    // console.log("Ing", Ing);
  }, []);

  const archivedIng = async () => {
    const url = endpoint + "archived_ingredients/" + parseInt(id);
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
          statusText: "Failed to archive the ingredients!",
        });
        setOpenSB(true);
      });

    if (res.data) {
      // await fetchingredients();
      setMessage({
        status: "success",
        statusText: "Ingredient is archived successfully!",
      });
    } else {
      setMessage({
        status: "error",
        statusText: "Failed to archive the ingredient!",
      });
    }

    setOpenSB(true);
    handleCloseConfirmBox();
    window.location.reload();
  };

  const handleOpenConfirmBox = (id) => {
    console.log("open", id);
    setIngId(id);
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
      selector: (row) => row.ingredients_name,
      sortable: true,
    },
    {
      name: "Recipe Id",
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
      cell: (row) => (
        <>
          <Link to={`/ingredients/${row.id}/${row.recipe_id}`}>
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
              console.log("on click", row.id);
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
                <h1>Ingredients Listing</h1>
                <p>All ingredients in the database.</p>
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
                    <Row>
                      <Link stl to="/ingredients/add">
                        <button className="btn btn-success ">
                          <i className="fas fa-plus" /> Add New
                        </button>
                      </Link>
                      <div>&nbsp;</div>
                      <Link stl to="/jsonIngredient">
                      <button className="btn btn-success ">
                          <i className="fas fa-file-code" /> Batch Insert
                        </button>
                      </Link>
                    </Row>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <DataTable
                      columns={columns}
                      data={ing}
                      pagination
                      highlightOnHover
                      size={"normal"}
                      tableStyle={{ width: "50rem" }}
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
            Are you sure to archive this ingredients?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmBox}>No</Button>
          <Button onClick={() => archivedIng()} autoFocus>
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
