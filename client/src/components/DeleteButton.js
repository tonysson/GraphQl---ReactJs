import React , {useState} from 'react'
import  gql  from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button , Confirm , Icon ,Popup } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const DeleteButton = ({postId , commentId , callback}) => {


    // State
    const [confirmOpen , setConfirmOpen] = useState(false)

    // render mution dynamic based on if we are deleting a post or a comment
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    //Use of our mutation
    const [deletePostOrComment] = useMutation(mutation , {
        update(proxy){
            setConfirmOpen(false)
            // clear the post from the cache
            if(!commentId){
                const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
               })
               data.getPosts = data.getPosts.filter(p => p.id !== postId)
               proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
               ...data
              })
            }
            //redirect to the home page if we were on the single page
            if(callback) callback()
        },
        variables:{
            postId,
            commentId
        }
    })

    return (
        <div>
           <Popup inverted content={commentId ? "Delete comment" : "Delete post"}    trigger ={
                 <Button  
                floated="right"
                as="div" 
                color='red' 
                style={{marginTop:10}}
                onClick={() => setConfirmOpen(true)}>
               <Icon name="trash" style={{margin:0}} />
               </Button>
           } />
            <Confirm
            onConfirm={deletePostOrComment}
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            />
        </div>
    )
}

const DELETE_POST_MUTATION = gql`
mutation deletePost($postId :ID!){
    deletePost(postId : $postId)
}
`

const DELETE_COMMENT_MUTATION = gql`
mutation deleteComment($postId :ID! , $commentId : ID!){
    deleteComment(postId : $postId , commentId: $commentId){
        id
        comments{
            id username createdAt body
        }
        commentCount
    }
}
`



export default DeleteButton
