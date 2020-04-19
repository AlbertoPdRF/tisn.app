import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import { formatDateTime } from '../../logic/date-time';

import CommentForm from '../CommentForm/CommentForm';

import Style from '../Style/Style';

const CommentCard = (props) => {
  const { commentsGroup, handleClick } = props;

  const style = Style();

  const [nestedDisplay, setNestedDisplay] = useState(
    commentsGroup.nestedComments.length > 0
  );

  const cardFragment = (comment) => {
    return (
      <Fragment>
        <CardActionArea
          component={Link}
          to={`/users/${comment.user._id}`}
          color="inherit"
          underline="none"
        >
          <CardHeader
            avatar={
              <Avatar
                src={comment.user.avatar}
                alt={`${comment.user.name}'s avatar`}
              >
                {comment.user.name.charAt(0).toUpperCase()}
              </Avatar>
            }
            title={comment.user.name}
            subheader={formatDateTime(comment.createdAt)}
          />
        </CardActionArea>
        <CardContent className={style.commentCardContent}>
          {comment.content.split('\n').map((text, index) => (
            <Typography key={index} variant="body1">
              {text}
            </Typography>
          ))}
        </CardContent>
      </Fragment>
    );
  };

  return (
    <Card className={style.commentCard}>
      {cardFragment(commentsGroup.comment)}
      {nestedDisplay ? (
        <CardContent>
          <Grid
            container
            style={{ marginTop: '-32px' }}
            direction="column"
            alignItems="flex-end"
            spacing={2}
          >
            {commentsGroup.nestedComments.length > 0 &&
              commentsGroup.nestedComments.map((nestedComment) => (
                <Grid item key={nestedComment._id}>
                  <Card className={style.nestedComments}>
                    {cardFragment(nestedComment)}
                  </Card>
                </Grid>
              ))}
            <Grid item>
              <CommentForm
                parentComment={commentsGroup.comment._id}
                handleClick={handleClick}
              />
            </Grid>
          </Grid>
        </CardContent>
      ) : (
        <CardActions className={style.commentCardActions}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setNestedDisplay(true)}
          >
            Reply
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default CommentCard;
