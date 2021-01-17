const postsResolvers = require('./PostResolvers')
const usersResolvers = require('./UserResolvers')
const commentsResolvers = require('./CommentResolvers')


module.exports = {

    // To get the count of our likes and comments
    Post : {

         likeCount(parent){
            // console.log(parent);
            return parent.likes.length
        },
        commentCount : (parent) => parent.comments.length
    },

    Query : {
        ...postsResolvers.Query
    },

    Mutation:{
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    },

    Subscription : {
        ...postsResolvers.Subscription
    }
}