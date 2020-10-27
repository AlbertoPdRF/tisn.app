import { useState, createRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

import AvatarEditor from 'react-avatar-editor';

import Style from '../Style/Style';

const UploadAvatarTextFieldAndDialog = (props) => {
  const { handleUpload, validationErrors } = props;

  const { t } = useTranslation();
  const style = Style();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const avatarEditorRef = createRef();

  const handleDialogToggle = () => setDialogOpen(!dialogOpen);

  const uploadAvatar = () => {
    fetch(avatarEditorRef.current.getImageScaledToCanvas().toDataURL())
      .then((res) => res.blob())
      .then((blob) => handleUpload(blob));
    setAvatar(null);
    handleDialogToggle();
  };

  return (
    <Fragment>
      <TextField
        className={style.formInput}
        type="file"
        accept="image/*"
        label={t('uploadAvatarTextFieldAndDialog.avatar')}
        variant="outlined"
        onChange={(event) => {
          if (event.target.files[0]) {
            setAvatar(event.target.files[0]);
            handleDialogToggle();
          }
        }}
        InputLabelProps={{ shrink: true }}
        error={!!validationErrors.fileType || !!validationErrors.avatar}
        helperText={
          (validationErrors.fileType &&
            t(`errorsList.${validationErrors.fileType}`)) ||
          (validationErrors.avatar &&
            t(`errorsList.${validationErrors.avatar}`))
        }
      />
      <Dialog
        disableBackdropClick
        maxWidth={false}
        open={dialogOpen}
        onClose={() => handleDialogToggle()}
      >
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <AvatarEditor
              ref={avatarEditorRef}
              image={avatar}
              width={200}
              height={200}
              border={50}
              borderRadius={100}
              scale={zoom}
              rotate={rotation}
              style={{ maxWidth: '100%' }}
            />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              {t('uploadAvatarTextFieldAndDialog.zoom')}
            </Typography>
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={zoom}
              onChange={(event, newValue) => setZoom(newValue)}
              style={{ width: 200 }}
            />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              {t('uploadAvatarTextFieldAndDialog.rotation')}
            </Typography>
            <Slider
              min={0}
              max={360}
              step={90}
              marks
              value={rotation}
              onChange={(event, newValue) => setRotation(newValue)}
              style={{ width: 200 }}
            />
          </Grid>
          <Grid item>
            <Button
              className={style.buttons}
              variant="outlined"
              color="primary"
              onClick={() => {
                setAvatar(null);
                handleDialogToggle();
              }}
            >
              {t('uploadAvatarTextFieldAndDialog.cancel')}
            </Button>
            <Button
              className={style.buttons}
              variant="contained"
              color="primary"
              onClick={() => uploadAvatar()}
            >
              {t('uploadAvatarTextFieldAndDialog.upload')}
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Fragment>
  );
};

export default UploadAvatarTextFieldAndDialog;
