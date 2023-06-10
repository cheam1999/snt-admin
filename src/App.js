import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import './App.css';

import UnverifiedFoodListing from './components/Food/UnverifiedFoodListing';
import FoodListing from './components/Food/FoodListing';
import FoodForm from './components/Food/FoodForm';
import RecipeListing from './components/recipe_ingredient/Recipe';
import RecipeForm from './components/recipe_ingredient/RecipeForm';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import PageNotFound from './components/PageNotFound';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import PrivateRoute from './routes/PrivateRoute';


export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function saveUser(user) {
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user));
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      // console.log(foundUser)
      setUser(foundUser);

    }
    setLoading(false)
  }, []);


  const MainLayout = ({ user }) => {
    return user == null
      ?
      <Navigate to="/login" />
      :
      <>
        <Header setUser={setUser} />
        <Sidebar currentUser={user} />
        <Outlet />
      </>;
  }
  

  const Main = ({ user }) => {
    // console.log(user)
    return (
      <Routes>
        <Route path="/" element={<MainLayout user={user} />} >
          <Route index element={<Home />} />       
          {/* recipe and ingredients */}
          <Route path="/recipe" element={<RecipeListing />} />
          <Route path="/recipe/:id" element={<RecipeForm />} />
          <Route path="/recipe/add" element={<RecipeForm />} />
          {/* food */}
          <Route path="/unverifiedFood" element={<UnverifiedFoodListing />} />
          <Route path="/food" element={<FoodListing />} />
          <Route path="/food/add" element={<FoodForm />} />
          <Route path="/food/:id" element={<FoodForm />} /> 
        </Route>
        <Route path="*" element={<PageNotFound user={user} />} />
      </Routes>
    );
  };

  return loading ?
    <div className="preloader flex-column justify-content-center align-items-center">
      <img className="animation__shake" src="dist/img/ugek-appicon.png" alt="Ugek Logo" height={100} width={100} />
    </div>
    :
    <div className="wrapper">

      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login user={user} saveUser={saveUser} />} />
          <Route path="/*" element={<Main user={user} />} />
        </Routes>
        <Footer />
      </BrowserRouter>

    </div>

}


