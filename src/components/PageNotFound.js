import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types'

export default function PageNotFound({ user }) {
    return user == null
        ?
        <Navigate to="/login" />
        :
        <div>
            <div className="hold-transition login-page">
                <div className="login-box">
                    <div className="login-logo">
                        Page Not Found
                    </div>
                </div>
            </div>
        </div>

}

PageNotFound.propTypes = {
    user: PropTypes.object,
}



