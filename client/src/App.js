import React from 'react';
import {BrowserRouter as Router , Route, Switch} from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register';
import SinglePost from './pages/SinglePost'
import   MenuBar from './components/MenuBar'
import {Container} from 'semantic-ui-react'
import {AuthProvider} from './context/Auth'
import 'semantic-ui-css/semantic.min.css';
import './app.css';
import AuthRoute from './utils/authRoute';




const App = () => {
    return (
        <AuthProvider>
             <Router>
                <Container>
                    <MenuBar/>
                <Switch>
                        <Route exact path="/" component={Home} />
                        <AuthRoute exact path="/login" component={Login} />
                        <AuthRoute exact path="/register" component={Register} />
                        <Route exac path="/posts/:postId" component={SinglePost}/>
                </Switch>
                </Container>
            </Router>
        </AuthProvider>
    )
}

export default App
