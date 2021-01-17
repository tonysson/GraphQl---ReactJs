const User = require('../../models/UserModels');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../../config');
const {UserInputError} = require('apollo-server');
const { validateRegisterInput , validateLoginInput } = require('../../utils/validators');


/**
 * @description Generate token helper function
 * @param {user}
 */
const generateToken = (user) => {
    
   return  jwt.sign({
                email: user.email,
                username: user.username,
                id: user.id
            }, SECRET_KEY , {expiresIn : '1h'})
}



module.exports = {

    Mutation : {

        /**
         * @description Allow us to login a user
         * @param {parent} _ 
         * @param {type of loginInput} param1 
         */

        async login(_, {loginInput: {username, password}}) {
               
            //validation for empty values
            const {errors , valid} = validateLoginInput(username, password)
            if(!valid){
                throw new UserInputError("Errors", {errors})
            }

            // check for the user in database
            const user = await User.findOne({username})
            if(!user){
                errors.general = "User not found"
                throw new UserInputError('User not fount', {errors})
            }

            // check for the user passsword with the one in DB
            const match = await bcrypt.compare(password , user.password)
            if(!match){
                 errors.general = "Wrong credentials"
                throw new UserInputError('Wrong credentials', {errors})
            }
           
            // if everything good ? generate token
            const token = generateToken (user)

            //return the entire user
            return{
                ...user._doc,
                token,
                id: user._id,
            }
        },

        /**
         * @description Allow us to register a user
         * @param {parent} _ 
         * @param {registerInput} param1 
         */
         async register(_ , {registerInput : {username, email, password, confirmPassword}}){

            //TODO: validate user data
            const {valid , errors} = validateRegisterInput(username, email, password, confirmPassword)
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }


            //TODO: Make sure uer doesn't already exist

             const user = await User.findOne({username})
             if(user){
                 throw new UserInputError("Username is taken", {
                     errors:{
                         username: 'This username is taken'
                     }
                 })
             }

            //TODO: hash the passwpord and create an auth token

            //hash password
            password = await bcrypt.hash(password , 10)
            //create th user
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })
            //save the user
            const res = await newUser.save()
            //create the token
            const token = generateToken (res)
            //return the user
            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}




