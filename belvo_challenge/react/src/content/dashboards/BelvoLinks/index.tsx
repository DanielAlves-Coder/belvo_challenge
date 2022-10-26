import { FC, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';

import Accounts from './Accounts';
import Links from './Links';

const BelvoLinksDashboard: FC = () => {
  const [currentAccounts, setCurrentAccounts] = useState<any>(null);
  const [currentLinkName, setCurrentLinkName] = useState<string>("");

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
            <Links setCurrentLinkName={setCurrentLinkName} setCurrentAccounts={setCurrentAccounts} />
          </Grid>
          {
            currentLinkName ? (
              <Grid item lg={12} xs={12}>
                <Accounts currentLinkName={currentLinkName} currentAccounts={currentAccounts} />
              </Grid>
            ) : ('')
          }
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default BelvoLinksDashboard;
