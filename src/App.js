import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import SuperHeros from './SuperHeros';
// import DisplayLocations from './DisplayLocations';

function App() {
  // const urlServer = process.env.URL_SERVER;
  const urlServer = process.env.REACT_APP_URL_SERVER;
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri: urlServer,
    // uri: "http://localhost:4000/graphql", // this is also works
    // uri: 'https://flyby-router-demo.herokuapp.com/',
  });
  
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <SuperHeros> List of SuperHeros </SuperHeros>
        {/* <DisplayLocations></DisplayLocations> was purely for debugging usage*/}
        {/* <DisplayLocations></DisplayLocations> */}
      </div>
     </ApolloProvider>
  );
}

export default App;
