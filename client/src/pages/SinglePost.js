import React , {useContext , useState , useRef}  from 'react'
import  gql  from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Card, Grid , Image , Icon , Label, Form } from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../components/LikeButton';
import {AuthContext} from '../context/Auth'
import DeleteButton from '../components/DeleteButton';




const SinglePost = (props) => {

  //destructure user from our context
    const {user} = useContext(AuthContext)
    
    //REF
    const commentInputRef = useRef(null)

    //STATE
    const [comment , setComment] = useState("")

    //get the postId from the url
    const postId = props.match.params.postId

    //GET OUR QUERY
    const {data } = useQuery(FETCH_POST_QUERY, {
        variables: {
      postId
     }
  });

  // Get our commennt mutation
  const [createComment] = useMutation(SUBMIT_COMMENT_MUTATION,{
    update(){
    setComment('')
    commentInputRef.current.blur()
    },
      variables :  {
        postId,
        body: comment
      }
    })

  // call back
  function deletePostCallback(){
      props.history.push('/')
  }

  //PostMarkup
  let postMarkup ;

  if(!data){
      postMarkup = <p>loading....</p>
  }else{
      const {
          
        id , body , createdAt , username , comments , likes , likeCount , commentCount
    } = data.getPost
    postMarkup = (
        <Grid>
            <Grid.Row>
               <Grid.Column  width={2}>
                     <Image
                    src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                    size="small"
                    float="right"
                   />
               </Grid.Column>
                <Grid.Column  width={10}>
                    <Card fluid>
                      <Card.Content>
                        <Card.Header>
                            {username}
                        </Card.Header>
                        <Card.Meta>
                            {moment(createdAt).fromNow()}
                        </Card.Meta>
                        <Card.Description>
                            {body}
                        </Card.Description>
                      </Card.Content>
                      <hr/>
                      <Card.Content extra>
                         <LikeButton user ={user} post ={{id , likeCount , likes}} />
                         <Button 
                         onClick={() => console.log("comment")}
                         labelPosition="right"
                         as="div" >
                             <Button basic color="blue">
                                 <Icon name="comments"/>
                                 <Label basic color="blue" pointing="left">
                                     {commentCount}
                                 </Label>
                             </Button>
                         </Button>
                         {user && user.username === username && (
                             <DeleteButton postId ={id} callback={deletePostCallback} />
                         )}
                      </Card.Content>
                    </Card>
                    {
                      user && (
                        <Card fluid>
                           <Card.Content>
                                <p>
                                  Post a comment
                               </p>
                            <Form>
                              <div className="ui action input fluid">
                                <input 
                                ref={commentInputRef}
                                 type="text" 
                                 name="comment"
                                 value={comment}
                                 onChange={e => setComment(e.target.value)}
                                 placeholder="comment..."/>
                                <button 
                                  onClick={createComment}
                                  disabled={comment.trim() === ""}
                                  type="submit" 
                                  className="ui button teal">
                                    send
                                </button>
                              </div>
                             
                            </Form>
                           </Card.Content>
                        </Card>
                      )
                    }
                    {
                      comments && comments.map(c => (
                        <Card fluid key={c.id}>
                          <Card.Content>
                            {user && user.username === c.username && (
                              <DeleteButton postId={id} commentId ={c.id} />
                            )}
                            <Card.Header>
                               {c.username}
                            </Card.Header>
                            <Card.Meta>
                              {moment(c.createdAt).fromNow()}
                            </Card.Meta>
                            <Card.Description>
                              {c.body}
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      ))
                    }
               </Grid.Column>
            </Grid.Row>
        </Grid>
    )
  }

    return  postMarkup ;
}


const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId:String! , $body:String!){
    createComment(postId:$postId , body:$body){
      id
      comments{
        id body createdAt username
      }
      commentCount
    }
  }
`

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost
