import React , {useReducer , createContext} from 'react';
import jwtDecode  from 'jwt-decode'

const initialState = {
    user: null
}

// Verify if our token is valid or not
// That help us to be connected until the token is valid
if(localStorage.getItem("jwtToken")){
    const decodedToken = jwtDecode(localStorage.getItem("jwtToken"))
    // console.log(decodedToken);
    if(decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem("jwtToken")
    }else{
        initialState.user = decodedToken
    }
}


const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout : () => {}
})

function AuthReducer(state , action){
    switch(action.type){

        case  'LOGIN' :
            return {
                ...state,
                user : action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state
    }
}

// Provider
function AuthProvider(props) {

    // to dispatch some actions
    const [state , dispatch] = useReducer(AuthReducer , initialState)

    function login(userData) {

        // set the token into the local storage
        localStorage.setItem("jwtToken", userData.token)
        //dispatch the LOGIN action
        dispatch({
            type: 'LOGIN',
            payload : userData
        })
    }

    function logout () {
        //remove the token from the localStorage
        localStorage.removeItem("jwtToken")
        dispatch({
            type: 'LOGOUT'
        })
    }

    return (
        <AuthContext.Provider 
         value={{user : state.user , login , logout}}
         {...props}
         />
        
       
    )
}

export {AuthContext , AuthProvider}

