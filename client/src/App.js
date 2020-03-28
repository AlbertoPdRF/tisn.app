import React from 'react';
import { Container } from '@material-ui/core';
import { Typography } from '@material-ui/core';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }
  
  callAPI() {
    fetch("http://localhost:9000/api/")
      .then(res => res.json())
      .then(res => this.setState({ apiResponse: res.message }));
    }
  
  componentDidMount() {
    this.callAPI();
  }
  
  render() {
    return (
      <Container maxWidth="sm">
        <Typography variant="h1">
          Tisn
        </Typography>
        <Typography variant="h2">
          The introverts' social network
        </Typography>
        <Typography variant="body1">
          {this.state.apiResponse}
        </Typography>
      </Container>
    );
  }
}

export default App;
