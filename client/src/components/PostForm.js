import React from 'react'
import {Form , Button} from 'semantic-ui-react'
import {useForm} from '../utils/hooks'
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag'
import {FETCH_POSTS_QUERY} from '../utils/graphql'
const PostForm = () => {

    // get our useForm
    const {handleSubmit , handleChange , values} = useForm(createPostCallback ,{
        body: ""
    })

    // consume ou mutation
    const [createPost , {error}] = useMutation(CREATE_POST_MUTATION,{
        variables : values,
        update(proxy , result){
            // console.log(result);
            //Instead of when creating post we have to send request to our graph ql server to fecth it before displaying it , we will just retrieve the post in Memory of graphql and add it to the array of our posts
           const data =   proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
             proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
            getPosts: [
              result.data.createPost,
              ...data.getPosts,
            ],
          },
        })
            // data.getPosts = [ ...data.getPosts,  result.data.createPost ]
            // proxy.writeQuery({query:FETCH_POSTS_QUERY , data})
            values.body = ""
        }
    })

    function createPostCallback(){
        createPost()
    }

    return (
        
        <div className="">
            <Form onSubmit={handleSubmit}>
            <h2>Create  a post</h2>
            <Form.Field>
                <Form.Input
                  placehoder="Share smthing..."
                  name="body"
                  onChange={handleChange}
                  value={values.body}
                  error={error ? true : false}
                />
                <Button type="submit" color="teal">
                    send
                </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" style={{marginBottom:20}}>
               <ul className="list">
                   <li>
                        {error.graphQLErrors[0].message}
                   </li>
               </ul>
            </div>
        )}
        </div>
    )
}

// Get data from our mutation
const CREATE_POST_MUTATION = gql`
  
  mutation createPost($body:String!){
      createPost(body: $body){
          id body createdAt username
          likes{
              id  username createdAt
          }
          likeCount commentCount
          comments{
              id  username  body createdAt
          }
      }
  }

`



export default PostForm
