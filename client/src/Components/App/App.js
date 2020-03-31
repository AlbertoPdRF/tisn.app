import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import Navigation from '../Navigation/Navigation';

const App = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Navigation />
    </BrowserRouter>
  );
};

export default App;
