import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const ShareMenu = (props) => {
  const { title, text, url } = props;
  const params = { title, text, url };

  const { t } = useTranslation();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (navigator.share) {
      setAnchorEl(event.currentTarget);
    } else {
      handleChatsClick();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChatsClick = () => {
    handleClose();
    history.push(`/chats?${new URLSearchParams(params).toString()}`);
  };

  const handleMoreClick = () => {
    handleClose();
    navigator.share(params);
  };

  return (
    <Fragment>
      <IconButton color="primary" onClick={(event) => handleClick(event)}>
        <ShareIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => handleClose()}
      >
        <MenuItem onClick={() => handleChatsClick()}>
          {t('shareMenu.chats')}
        </MenuItem>
        <MenuItem onClick={() => handleMoreClick()}>
          {t('shareMenu.more')}
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

export default ShareMenu;
