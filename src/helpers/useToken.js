import { useState } from 'react';

function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        console.log(5)
        console.log(userToken)
        return userToken?.token
    };

    const [token, setToken] = useState();

    const saveToken = userToken => {
        console.log(3)
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken.token);
        console.log(4)
    };

    return {
        setToken: saveToken,
        token
    }
}

export default useToken
