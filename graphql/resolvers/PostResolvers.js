const Post = require('../../models/PostsModels')
const checkAuth = require('../../utils/checkAuth')
const {AuthenticationError , UserInputError} = require('apollo-server')

module.exports ={

    Subscription : {
        newPost : {
            subscribe: (_, __ , {pubsub}) => pubsub.asyncIterator('NEW_POST')
        }
    },
     
     Query: {

        /**
         * @description Allow us to get all the posts
         */
      async  getPosts(){
         try {
             const posts = await Post.find().sort({createdAt : -1})
             return posts
         }catch (error) {
             throw new Error(error)
         }
      },
      
      /**
       * @description Allow us to get a single post
       * @param {postId} 
       */
      async getPost(_, {postId}){
          try {
              const post = await Post.findById(postId)
              if(post){
                  return post
              }else{
                  throw new Error('Post not found')
              }
          } catch (error) {
              throw new Error(error)
          }
      }
    },

    Mutation : {

         /**
       * @description Allow us to create a post
       * @param {parent} _ 
       * @param {body of the post} param1 
       * @param {allow us to access the req object} conntext
       */
        async createPost(_, {body}, context) {

            // check if the user has a valid token
            const user = checkAuth(context)
            // console.log(user);

            // make sure the body is not empty
            if(body.trim() === ""){
                throw new Error('Post must not be empty')
            }

            //create the post
            const newPost = new Post({
                body,
                user: user.id, 
                username:user.username,
                createdAt: new Date().toISOString()
            })
             
            // save and return the post
            const post = await newPost.save()

              //Subscription
            context.pubsub.publish('NEW_POST', {
                newPost : post
            })

            return post
        },

        /**
         * @description Allow us to delete a post
         * @param {parent} _ 
         * @param {postId} param1 
         * @param {context allow us us to get acces to req object} context 
         */

        async deletePost(_ , {postId} , context){

            // check if the user is authenticated
            const user = checkAuth(context)

            try {
                // get the post
                const post = await Post.findById(postId)
                // if the logged in user is the creator of the post?
                if(user.username === post.username){
                    await post.delete()
                    return "Post deleted successfully"
                }else{
                    throw new AuthenticationError("Action not allowed")
                }
            } catch (error) {
                throw new Error(error)
            }
        },


        /**
         * @description Like or unlike a post
         * @param {parent} _ 
         * @param {postId} param1 
         * @param {access the req object} context 
         */

        likePost : async  (_ , {postId} , context) => {
            
            //get the authenticated user
            const {username} = checkAuth(context)

            //find the post
            const post = await Post.findById(postId)

            if(post){
                //check if the user has not liked the post already
                if(post.likes.find(like => like.username === username)){

                    // Post already liked , so unlike it
               post.likes = post.likes.filter(like => like.username !== username)

                }else{
                    //not like yet , so we like the post
                    post.likes.push({
                        username,
                        createdAt : new Date().toISOString()
                    })
                }
                
                  //save the post
                   await post.save()
                   return post
            }else{
                throw new UserInputError('Post not found')
            }
        }
    }
}





