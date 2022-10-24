import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';

import AccountBalance from './AccountBalance';
import LinkedAccounts from './LinkedAccounts';
import AccountSecurity from './AccountSecurity';
import WatchList from './WatchList';

function BelvoLinksDashboard() {
  return (
    <>
      <Helmet>
        <title>Links Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item lg={12} xs={12}>
            <LinkedAccounts />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default BelvoLinksDashboard;
