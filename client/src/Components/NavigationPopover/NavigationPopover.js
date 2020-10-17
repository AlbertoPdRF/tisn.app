import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import Style from '../Style/Style';

const NavigationPopover = (props) => {
    const { id, isOpen, popoverAnchorEl, handlePopoverClose, type, total, children } = props;
    const style = Style();
    const history = useHistory();
    const { t } = useTranslation();

    const popoverTypes = {
        messages: {
            path: '/chats',
            message: 'NewMessages',
            buttonText: 'allMessages'
        },
        notifications: {
            path: '/notifications',
            message: 'NewNotifications',
            buttonText: 'allNotifications'
        }
    }

    const { path, message, buttonText } = popoverTypes[type];

    return (
        <Popover
            id={id}
            open={isOpen}
            className={style.popover}
            anchorEl={popoverAnchorEl}
            onClose={() => handlePopoverClose()}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Grid container direction="column" alignItems="center" spacing={0}>
                {children}
                <Grid item className={`${style.popoverGridItem} ${style.center}`}>
                    <Typography gutterBottom variant="body1">
                        {t(
                            `navigationBarAndDrawer.no${total > 0 ? 'More' : ''
                            }${message}`
                        )}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            history.push(path);
                            handlePopoverClose();
                        }}
                    >
                        {t(`navigationBarAndDrawer.${buttonText}`)}
                    </Button>
                </Grid>
            </Grid>
        </Popover>
    )

}

export default NavigationPopover;