import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Dashboard</h1>
              </div>
              {/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            {/* Small boxes (Stat box) */}
            <Row>
              <Link stl to="/recipe">
                <Card
                  sx={{ minWidth: 345 }}
                  style={{ backgroundColor: "#71C79C" }}
                >
                  <CardActionArea>
                    <CardContent>
                      <i className="nav-icon fas fa-book" />
                      <Typography gutterBottom variant="h5" component="div">
                        Recipe
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create, read, update or delete recipes and ingredients
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
              <div>&nbsp;&nbsp;&nbsp;</div>
              <Link stl to="/food">
                <Card
                  sx={{ minWidth: 345 }}
                  style={{ backgroundColor: "#4A90E2" }}
                >
                  <CardActionArea>
                    <CardContent>
                      <i className="fas fa-utensils" />
                      <Typography gutterBottom variant="h5" component="div">
                        Food
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Create, read, update or delete food
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Row>
            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
}

export default Home;
