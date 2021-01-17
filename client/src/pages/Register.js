import React , {useState , useContext} from 'react';
import {Form , Button} from 'semantic-ui-react';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { useForm } from '../utils/hooks';
import {AuthContext} from '../context/Auth'


const Register = ({history}) => {

    //Consume our context
    const context = useContext(AuthContext)

   //UseState
    const [errors , setErrors] = useState({})
   
   // get our object from our useForm hooks
   const { handleSubmit , handleChange , values} = useForm(registerUser , {
        username:"",
        password:"",
        email:"",
        confirmPassword:""
   } )

    

    // Get data from our mutation definition
     const [addUser , {loading}] = useMutation(REGISTER_USER, {

      update(_ , {data : {register : userData}}){
        context.login(userData)
        history.push('/')
      },

      onError(err){
        setErrors(err.graphQLErrors[0].extensions.exception.errors)
      },
      variables: values
  })

  // to get our addUser function define
  function registerUser(){
    addUser()
  } 


    return (
        <div className="form-container">
            <Form 
               className={loading? "loading" : ''}
                onSubmit={handleSubmit} 
                noValidate>
                <h1 className="pageTitle">Register</h1>
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
                 label="Email"
                 type="text"
                 error={ errors.email ? true : false}
                 placeholder="Enter an email..."
                 name="email"
                 value={values.email}
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
                 <Form.Input
                 label="Confirm password"
                 error={ errors.confirmPassword ? true : false}
                 type="password"
                 placeholder="*********"
                 name="confirmPassword"
                 value={values.confirmPassword}
                 onChange={handleChange}
                />
                <Button type="submit" primary>
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput:{
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id email username createdAt token
        }
    }
`

export default Register
