import React , {useContext} from 'react';
import {useQuery} from '@apollo/react-hooks';
import { Grid , Transition } from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import {AuthContext} from '../context/Auth'
import PostForm from './../components/PostForm';
import  {FETCH_POSTS_QUERY} from '../utils/graphql'


const Home = () => {

    // load data from our apollo-server
    const {loading , data} = useQuery(FETCH_POSTS_QUERY)

    //get the user from our context
    const {user} = useContext(AuthContext)
 
    return (
        <Grid columns={3} >
            <Grid.Row className="pageTitle">
                <h1>Recent posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm/>
                    </Grid.Column>
                )}
                {loading ? (
                    <p>Loading posts...</p>
                ): (
                       <Transition.Group>
                           {
                                data.getPosts && data.getPosts.map(post => (
                                <Grid.Column key={post.id} style={{marginBottom:20}}>
                                    <PostCard  post = {post} />
                                </Grid.Column>
                              ))
                           }
                       </Transition.Group>
                )}
             </Grid.Row>
        </Grid>
    )
}


export default Home
