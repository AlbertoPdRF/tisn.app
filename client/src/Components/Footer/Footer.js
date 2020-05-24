import React from 'react';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';

const Footer = () => (
  <Grid container justify="center" spacing={2}>
    <Grid item>
      <Link
        href="https://www.instagram.com/tisn.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramIcon />
      </Link>
    </Grid>
    <Grid item>
      <Link
        href="https://twitter.com/tisn_app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterIcon />
      </Link>
    </Grid>
    <Grid item>
      <Link
        href="https://www.facebook.com/tisnapp/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon />
      </Link>
    </Grid>
  </Grid>
);

export default Footer;
