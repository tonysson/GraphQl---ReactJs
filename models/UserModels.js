const {model , Schema} = require('mongoose')


const UserSchema = new Schema({

    username:{
        type:String,
    },

     email:{
        type:String,
    },

     password:{
        type:String,
    },

     createdAt:{
        type:String,
    },
})

module.exports = model('User', UserSchema)