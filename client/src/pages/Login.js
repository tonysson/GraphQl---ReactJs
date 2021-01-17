import React , {useState , useContext} from 'react';
import {Form , Button} from 'semantic-ui-react';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { useForm } from '../utils/hooks';
import {AuthContext} from  "../context/Auth"


const  Login = ({history}) => {

    // use our useContext
   const context = useContext(AuthContext)

   //UseState
    const [errors , setErrors] = useState({})
   
   // get our object from our useForm hooks
   const { handleSubmit , handleChange , values} = useForm(loginUserCallback , {
        username:"",
        password:"",
   } )


    // Get data from our mutation definition
     const [loginUser , {loading} ] = useMutation(LOGIN_USER, {

      update(_ , result){
        // console.log(result);
        context.login(result.data.login)
        history.push('/')
      },

      onError(err){
        setErrors(err.graphQLErrors[0].extensions.exception.errors)
      },
      variables: values
  })



  function loginUserCallback(){
      loginUser()
  }



    return (
        <div className="form-container">
            <Form 
               className={loading? "loading" : ''}
                onSubmit={handleSubmit} 
                noValidate>
                <h1 className="pageTitle">Login</h1>
                <Form.Input
                 label="Name"
                 placeholder="Enter a username..."
                 name="username"
                 type="text"
                 error={ errors.username ? true : false}
                 value={values.username}
                 onChange={handleChange}
                />
               
                 <Form.Input
                 label="Password"
                 error={ errors.password ? true : false}
                 placeholder="********"
                 type="password"
                 name="password"
                 value={values.password}
                 onChange={handleChange}
                />
                
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {
                Object.keys(errors).length > 0 && (
                    <div className="ui error message">
                        <ul className="list">
                            {Object.values(errors).map(value => (
                                <li key={value}>
                                    {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
       
    ){
        login(
            loginInput:{
                username: $username
                password: $password
            }
        ){
            id email username createdAt token
        }
    }
`

export default Login
