import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Style from '../Style/Style';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const style = Style();

  return (
    <div className={style.root}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item className={style.center}>
          <Typography variant="h2">{t('adminDashboard.title')}</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
