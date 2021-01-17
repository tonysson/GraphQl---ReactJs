const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index');

//  for Subscription
const pubsub = new PubSub()


//Appolo server 
const  server = new ApolloServer({
    typeDefs,
    resolvers,
    context : ({req}) => ({req , pubsub})  // to access the req or pubsub on our context (createPost)
})

// connection to ourDatabase and running server
mongoose.connect(MONGODB, {
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connected to mongo DB`)
    return server.listen({port:5500})
}).then(res =>{
    console.log(`Server running at port ${res.url}`);
}).catch(error => console.log(error))



