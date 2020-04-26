import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import GitHubIcon from '@material-ui/icons/GitHub';

const WelcomeFooter = () => {
  return (
    <Grid container justify="flex-start" spacing={1}>
      <Grid item>
        <Link
          href="https://github.com/AlbertoPdRF/tisn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </Link>
      </Grid>
    </Grid>
  );
};

export default WelcomeFooter;
