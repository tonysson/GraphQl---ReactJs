const Post = require('../../models/PostsModels')
const checkAuth = require('../../utils/checkAuth')
const {UserInputError , AuthenticationError} = require('apollo-server')

module.exports = {

    Mutation : {

        /**
         * @description Allow us to cmment a post
         */
        createComment : async (_ , {postId , body} , context) => {

            //get the authenticated username
            const {username} = checkAuth(context)
            // check for empty comment
            if(body.trim() === ""){
                throw new UserInputError('Empty Comment', {
                    errors:{
                        body: "Comment must not empty"
                    }
                })
            }

            //get the post
            const post = await Post.findById(postId)
            //if post create the comment and save it
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt : new Date().toISOString()
                })
                // save the newly post with the comment
                await post.save()
                return post
            }else{
                throw new UserInputError('Post not found')
            }

        },

        /**
         * @description Delete a comment
         * @param {parent} _ 
         * @param {postId , commentId} param1 
         * @param {allow us to acces the req object} context 
         */
        deleteComment : async (_, {postId , commentId}, context) => {

            //get the authenticated user
            const {username} = checkAuth(context)

            //get the post
            const post = await Post.findById(postId)

            if(post){
                // find the index of that comment
                const commentIndex = post.comments.findIndex(c => c.id === commentId)
                
                // check if the comment belongs to the authenticated user
                if(post.comments[commentIndex].username === username){

                    // we delete the comment
                    post.comments.splice(commentIndex , 1)

                    //save the post
                    await post.save()
                    return post
                }else{
                    throw new AuthenticationError('Action not allowed')
                }
            }else{
                 throw new AuthenticationError('Post not found')
            }
        }
    }
}




