import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

const Header = ({setUser}) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null)
        localStorage.clear();
        navigate("/login")
      };

    return (
        
        <div>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                {/* Left navbar links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                    </li>
               
                </ul>
                {/* Right navbar links */}
                <ul className="navbar-nav ml-auto">
                    
                    
                    {/* <li className="nav-item">
                        <a className="nav-link" data-widget="fullscreen" href="#" role="button">
                            <i className="fas fa-expand-arrows-alt" />
                        </a>
                    </li> */}
                    <button onClick={handleLogout} className="btn btn-block">Sign Out</button>
               
                </ul>
            </nav>
        </div>
    )
}

Header.propTypes = {
    setUser: PropTypes.func.isRequired,
}


export default Header
