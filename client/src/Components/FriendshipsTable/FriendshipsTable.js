import React from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import Style from '../Style/Style';

const FriendshipsTable = (props) => {
  const { friendships, displayActions, handleFriendshipClick } = props;

  const style = Style();

  return (
    friendships && (
      <TableContainer elevation={0} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {displayActions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {friendships.map((friendship) => (
              <TableRow key={friendship._id}>
                <TableCell component="th" scope="row">
                  <Link
                    href={`/users/${friendship.requestant._id}`}
                    variant="body1"
                  >
                    {friendship.requestant.name}
                  </Link>
                </TableCell>
                {displayActions && (
                  <TableCell align="center">
                    <Button
                      className={style.buttons}
                      variant="contained"
                      color="primary"
                      onClick={() => handleFriendshipClick(friendship, true)}
                    >
                      Accept
                    </Button>
                    <Button
                      className={style.buttons}
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleFriendshipClick(friendship)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
};

export default FriendshipsTable;
