import React , {useState , useEffect } from 'react'
import { Button , Label , Icon , Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import  gql  from 'graphql-tag';

const LikeButton = ({user ,   post : {id , likeCount , likes}}) => {

    // state
    const [isLiked , setIsLiked] = useState(false)

     
     // UseEfffect   
    useEffect(() => {
    
        if(user && likes.find(like => like.username === user.username)){
            setIsLiked(true)
        }else{
            setIsLiked(false)
        }
    },[user , likes])

    // get our mutation
    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables : {postId : id}
    })


    //Render the button based on if we are logged In and if we have already liked the post
    const likeButton = user ?  (

        isLiked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as ={Link} to="/login" color='teal' basic>
        <Icon name='heart' />
        </Button>
    )

    return (
        <div>
            <Popup content={isLiked ? "Unlike" : "Like"} inverted trigger ={
                        <Button 
                        as='div' 
                        labelPosition='right' 
                        onClick={likePost}
                        style={{marginBottom:10}}>
                            {likeButton}
                            <Label  basic color='teal' pointing='left'>
                                {likeCount}
                            </Label>
                        </Button>
            } />
        
        </div>
    )
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId : ID!){
      likePost(postId: $postId){
          id 
          likeCount
          likes{
              id username 
          }
      }
  }

`

export default LikeButton
