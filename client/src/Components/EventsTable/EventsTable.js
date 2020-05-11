import React from 'react';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();
  const history = useHistory();
  const confirm = useConfirm();
  const style = Style();

  const link = (event) => {
    const decodedName = decodeText(event.name);

    return (
      <Link href={`/events/${event._id}`} variant="body1">
        {decodedName.length < 20
          ? decodedName
          : `${decodedName.substring(0, 19)}...`}
      </Link>
    );
  };

  return (
    events && (
      <TableContainer elevation={0} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('eventsTable.name')}</TableCell>
              <TableCell align="right">{t('eventsTable.startDate')}</TableCell>
              <TableCell align="right">{t('eventsTable.endDate')}</TableCell>
              {displayActions && (
                <TableCell align="center">{t('eventsTable.actions')}</TableCell>
              )}
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
                      {t('eventsTable.edit')}
                    </Button>
                    <Button
                      className={style.buttons}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        confirm({
                          title: t('eventsTable.confirm.title'),
                          description: t('eventsTable.confirm.description'),
                          confirmationText: t(
                            'eventsTable.confirm.confirmationText'
                          ),
                          confirmationButtonProps: {
                            variant: 'contained',
                            color: 'secondary',
                          },
                          cancellationText: t(
                            'eventsTable.confirm.cancellationText'
                          ),
                          cancellationButtonProps: {
                            variant: 'contained',
                            color: 'primary',
                          },
                        }).then(() => handleDeleteClick(event));
                      }}
                    >
                      {t('eventsTable.delete')}
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
