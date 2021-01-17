import React ,{useContext} from 'react';
import {Route , Redirect} from 'react-router-dom';
import {AuthContext} from '../context/Auth'


/**
 * @description Redirect authenticated user trying to reach login / register page by the url
 * @param {component} param0 
 */

function AuthRoute({component : Component , ...rest}){

    const {user } = useContext(AuthContext)
    return (
        <Route
         {...rest}
         render={props => user ? <Redirect to="/"/> : <Component {...props} />}
        />
    )
}

export default AuthRoute ;
