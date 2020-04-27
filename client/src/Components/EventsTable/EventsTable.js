import React from 'react';
import { useHistory } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { decodeText } from '../../logic/utils';
import { formatDateTime } from '../../logic/date-time';

import { useConfirm } from 'material-ui-confirm';

import Style from '../Style/Style';

const EventsTable = (props) => {
  const { events, displayActions, handleDeleteClick } = props;

  const history = useHistory();
  const confirm = useConfirm();
  const style = Style();

  const link = (event) => {
    const decodedName = decodeText(event.name);

    return (
      <Link href={`/events/${event._id}`} variant="body1">
        {decodedName.length < 30
          ? decodedName
          : `${decodedName.substring(0, 29)}...`}
      </Link>
    );
  };

  return (
    events && (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Start date</TableCell>
              <TableCell align="right">End date</TableCell>
              {displayActions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell component="th" scope="row">
                  {link(event)}
                </TableCell>
                <TableCell align="right">
                  <Typography className={style.preLine} variant="body1">
                    {formatDateTime(event.startDate)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography className={style.preLine} variant="body1">
                    {formatDateTime(event.endDate)}
                  </Typography>
                </TableCell>
                {displayActions && (
                  <TableCell align="center">
                    <Button
                      className={style.buttons}
                      variant="outlined"
                      color="primary"
                      onClick={() => history.push(`/events/${event._id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      className={style.buttons}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        confirm({
                          description:
                            'Deleting an event is a permanent action!',
                          confirmationText: 'Delete',
                          confirmationButtonProps: {
                            variant: 'contained',
                            color: 'secondary',
                          },
                          cancellationButtonProps: {
                            variant: 'contained',
                            color: 'primary',
                          },
                        }).then(() => handleDeleteClick(event));
                      }}
                    >
                      Delete
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

export default EventsTable;
