import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'
import axios from 'axios'

const endpoint = process.env.REACT_APP_API_ENDPOINT

async function loginUser(credentials) {
    const login = {
        "email": credentials.email,
        "password": credentials.password
    }

    const url = endpoint + 'nutritionistLogin'

    console.log(login.email)

    const res = await axios.post(
        url,
        login,
        {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
        }
    ).catch(err => {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        throw err
    })

    // console.log(res.data)

    return res.data
}


export default function Login({ user, saveUser }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const user = await loginUser({
            email,
            password
        }).catch(err => {
            setError(true)
            throw (err)
        })

        // if (user["nutritionist"] == "1") {
        //     saveUser(user);
        // } else {
        //     setError(true)
        // }

        saveUser(user);

        navigate('/')
    }

    return user != null
        ?
        <Navigate to="/" />
        :
        <div>
            <div className="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        <b>Smart Nutri Track</b> Nutritionist Panel
                    </div>
                    {/* /.login-logo */}
                    <div className="card">
                        <div className="card-body login-card-body">
                            <p className="login-box-msg">Sign in page</p>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <input type="email" className={`form-control ${error ? 'is-invalid' : ''}`} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-3">
                                    <input type="password" className={`form-control ${error ? 'is-invalid' : ''}`} placeholder="Password" onChange={e => setPassword(e.target.value)} />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-lock" />
                                        </div>
                                    </div>
                                </div>

                                {
                                    error && <div className='help-block' style={{ color: 'red', textAlign: 'center', }}>Invalid Login Details!</div>
                                }

                                {/* <div className="icheck-primary">
                                    <input type="checkbox" id="remember" />
                                    <label htmlFor="remember">
                                        Remember Me
                                    </label>
                                </div> */}

                                <br />
                                <div>
                                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                                </div>
                            </form>
                        </div>
                        {/* /.login-card-body */}
                    </div>
                </div>
            </div>
        </div>

}

Login.propTypes = {
    user: PropTypes.object,
    saveUser: PropTypes.func.isRequired,
}


