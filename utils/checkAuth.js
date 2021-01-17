const jwt = require('jsonwebtoken');
const {SECRET_KEY } = require('../config')        
const {AuthenticationError} = require('apollo-server')                

/**
 * @description Allow us to verify if there is a token in the header and if it is valid
 * @param {context} 
 */
module.exports = (context) => {

    //context = {...headers}
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //get the token
        const token = authHeader.split('Bearer ')[1]

        if(token){
            // Verify if the token still valid
            try {
                const user = jwt.verify(token, SECRET_KEY)
                return user
            } catch (error) {
                throw new AuthenticationError('Invalid/Expire token')
            }
        }

        // if no token
        throw new Error('You are not well authenticated')
    }

    // no token
        throw new Error('Authorization header not found')
}


