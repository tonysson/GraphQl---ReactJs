const {model , Schema} = require('mongoose')


const PostSchema = new Schema({

    body:{
        type:String,
    },

     username:{
        type:String,
    },

    comments: [
        {
            body : String ,
            username: String,
            createdAt: String,
        } 
    ],

    likes: [
        {
            username : String ,
            createdAt: String,
        } 
    ],

    user:{
        type: Schema.Types.ObjectId,
        ref:'users'
    },
     createdAt:{
        type:String,
    },
})

module.exports = model('Post', PostSchema)