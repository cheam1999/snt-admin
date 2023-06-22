import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useLocation } from "react-router-dom";

export default function Sidebar({ currentUser }) {

    //assigning location variable
    const location = useLocation();

    //destructuring pathname from location
    const { pathname } = location;

    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");

    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                {/* Brand Logo */}
                {/* <Link to='/' className="brand-link">
                    <img src="https://ksyong.s3.ap-southeast-1.amazonaws.com/ugek-logo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">Ugek</span>
                </Link> */}
                {/* Sidebar */}
                <div className="sidebar">
                    {/* Sidebar user panel (optional) */}
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        {/* <div className="image">
                            <img src={currentUser.profileImage} style={{
                                backgroundColor: 'white'
                            }} className="img-circle elevation-2" alt="User Image" />
                        </div> */}
                        <div className="info">
                            <a href="#" className="d-block">{currentUser.fullname}</a>
                        </div>
                    </div>
                    {/* SidebarSearch Form */}
                    <div className="form-inline">
                        <div className="input-group" data-widget="sidebar-search">
                            <input className="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div className="input-group-append">
                                <button className="btn btn-sidebar">
                                    <i className="fas fa-search fa-fw" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar Menu */}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
                            <li className="nav-item menu-open">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fas fa-book" />
                                    <p>
                                        Recipe & Ingredients
                                        <i className="right fas fa-angle-left" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link className={`nav-link ${splitLocation[1] === "recipe" ? "active" : ""}`} to='/recipe'><i className="far fa-file nav-icon" />
                                            <p>Recipes Listing</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${splitLocation[1] === "ingredients" ? "active" : ""}`} to='/ingredients'><i className="fas fa-list nav-icon" />
                                            <p>Ingredients Listing</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${splitLocation[1] === "jsonIngredient" ? "active" : ""}`} to='/jsonIngredient'><i className="far fa-file-code nav-icon" />
                                            <p>Ingredients Json Form</p>
                                        </Link>
                                    </li>

                                </ul>
                            </li>

                            <li className="nav-item menu-open">
                                <a href="#" className="nav-link">
                                    <i className="nav-icon fas fa-utensils" />
                                    <p>
                                        Food
                                        <i className="right fas fa-angle-left" />
                                    </p>
                                </a>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        {/* <Link className={`nav-link ${splitLocation[1] === "organizers" ? "active" : ""}`} to='/organizers'><i className="far fa-circle nav-icon" />
                                            <p>Organizers</p>
                                        </Link> */}
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${splitLocation[1] === "food" ? "active" : ""}`} to='/food'><i className="far fa-file nav-icon" />
                                            <p>Food Listing</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className={`nav-link ${splitLocation[1] === "unverifiedFood" ? "active" : ""}`} to='/unverifiedFood'><i className="fas fa-check nav-icon" />
                                            <p>Food Verification</p>
                                        </Link>
                                    </li>

                                </ul>
                            </li>
                        </ul>
                    </nav>
                    {/* /.sidebar-menu */}
                </div>
                {/* /.sidebar */}
            </aside>
        </div>

    )
}

Sidebar.propTypes = {
    currentUser: PropTypes.object.isRequired
}


