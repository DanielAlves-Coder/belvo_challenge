import { FC, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  Divider,
  alpha,
  styled,
  Avatar,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  TextField,
  Skeleton
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import {
  Input,
  Output
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';

import {
  MODE,
  BACKEND
} from '../../../constants/index'

const {
  BASE_URL
} = BACKEND[MODE]

const AvatarCashIn = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

const AvatarCashOut = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.warning.light};
    width: ${theme.spacing(5)};
    height: ${theme.spacing(5)};
`
);

interface Props {
  currentAccounts: any,
  currentLinkName: string
}

const Accounts: FC<Props> = (props) => {
  const [dateValues, setDateValues] = useState<any[]>([new Date(), new Date()]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [currentTransactions, setCurrentTransactions] = useState<any[]>([]);

  useEffect(() => {
    console.log("selectedAccount changed", props.currentAccounts, selectedAccount)
    if (selectedAccount !== null) {
      getTransactions()
    }
  }, [selectedAccount])

  useEffect(() => {
    console.log("props.currentAccounts changed", props.currentAccounts, selectedAccount)

    console.log("props.currentAccounts", props.currentAccounts)
    if (props.currentAccounts?.length > 0) {
      setSelectedAccount(props.currentAccounts[0])
    } else {
      setSelectedAccount(null)
    }
  }, [props.currentAccounts])

  async function getTransactions() {
    setCurrentTransactions([])
    await fetch(`${BASE_URL}/transactions/retrieve/${selectedAccount.link}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateFrom: dateValues[0],
        dateTo: dateValues[1]
      })
    }) 
      .then(response => response.json())
      .then((data) => {
        console.log("getTransactions:", data)
        setCurrentTransactions(data)
      })
      .catch(error => {
        console.error('getTransactions error:', error)
      })
  }

  function getEndOfDay() {
    return new Date(new Date().setHours(23,59,59,999))
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      >
        <Typography variant="h3">{`${props.currentLinkName} Accounts`}</Typography>
      </Box>
      {
        props.currentAccounts && selectedAccount ?
          (
            <Card>
              <Grid spacing={0} container>
                <Grid item xs={12} md={6}>
                  <Box p={3}>
                    {
                      props.currentAccounts[0] && selectedAccount?.id ? (
                        <>
                          <InputLabel id="account-selector-label">Select Account</InputLabel>
                          <Select
                            labelId="account-selector-label"
                            id="account-selector"
                            value={selectedAccount?.id}
                            label="Select Account"
                            onChange={(e)=> {
                              setSelectedAccount(
                                props.currentAccounts.filter((el) => {
                                  return el.id === e.target.value
                                })[0]
                              )
                              //console.log(e.target.value)
                            }}
                          >
                            {
                              props.currentAccounts.map((account) => {
                                if (account === null) {
                                  return ''
                                }

                                return (
                                  <MenuItem key={account.id} value={account.id}>{`${account.name} [${account.number}]`}</MenuItem>
                                )
                              })
                            }
                          </Select>
                        </>
                      ) : ('')
                    }
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography
                        sx={{
                          pt: 3,
                          pb: 1
                        }}
                        variant="h4"
                      >
                        Account Balance
                      </Typography>
                    </Stack>
                    <Box>
                      <Typography variant="h3" gutterBottom>
                        Current: {new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedAccount?.currency }).format(selectedAccount?.balance.current)}
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="normal"
                        color="text.secondary"
                      >
                        Available: {new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedAccount?.currency }).format(selectedAccount?.balance.available)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  sx={{
                    position: 'relative'
                  }}
                  display="flex"
                  alignItems="center"
                  item
                  xs={12}
                  md={6}
                >
                  <Box
                    component="span"
                    sx={{
                      display: { xs: 'none', md: 'inline-block' }
                    }}
                  >
                    <Divider absolute orientation="vertical" />
                  </Box>
                  <Box p={3}>
                    <InputLabel sx={{ mb: 1}} id="account-selector-label">Select Dates</InputLabel>
                    <Grid xs={12} sm={12} item alignItems="center">
                      <Grid xs={12} item>
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          spacing={2}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Start"
                              value={dateValues[0] ?? null}
                              onChange={(newValue) => {
                                console.log("newValue", newValue)
                                if (newValue < getEndOfDay()) {
                                  if (newValue > dateValues[1]) {
                                    setDateValues([newValue, newValue])
                                  } else {
                                    setDateValues([newValue, dateValues[1]])
                                  }
                                }
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                          <Typography
                            variant="h4"
                            fontWeight="normal"
                            color="text.secondary"
                          >to</Typography>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="End"
                              value={dateValues[1] ?? null}
                              onChange={(newValue) => {
                                if (newValue < getEndOfDay()) {
                                  if (newValue < dateValues[0]) {
                                    setDateValues([newValue, newValue])
                                  } else {
                                    setDateValues([dateValues[0], newValue])
                                  }
                                }
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        </Stack>
                      </Grid>
                      <Grid sx={{ mt: 1}} xs={4} item>
                        <Button onClick={() => {
                          getTransactions()
                        }}
                          fullWidth
                          variant="contained">
                          See Transactions
                        </Button>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                            Transactions in period
                          </Typography>
                          <List dense={true}>
                              {currentTransactions.length > 0 && currentTransactions.map((transaction) => {
                                
                                const transactionDate = new Date(transaction.created_at).toString().split(' ')
                                const formattedDate = `${transactionDate[1]} ${transactionDate[2]}`
                                const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency }).format(transaction.amount)

                                return (
                                  <ListItem key={transaction.id}>
                                    <ListItemAvatar>
                                      {transaction.type == "INFLOW" ? (
                                        <AvatarCashIn
                                          sx={{
                                            mr: 2
                                          }}
                                          variant="rounded"
                                        >
                                          <Input fontSize="large" />
                                        </AvatarCashIn>
                                      ) : (
                                        <AvatarCashOut
                                          sx={{
                                            mr: 2
                                          }}
                                          variant="rounded"
                                        >
                                          <Output fontSize="large" />
                                        </AvatarCashOut>
                                      )
                                      }
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          alignItems="center"
                                          spacing={2}
                                        >
                                          <span>{transaction.description}</span>
                                          <span>{formattedDate}</span>
                                        </Stack>
                                      }
                                      secondary={
                                        <Stack
                                          direction="row"
                                          justifyContent="space-between"
                                          alignItems="center"
                                          spacing={2}
                                        >
                                          <span>{`${transaction.merchant.name} (${transaction.status})`}</span>
                                          <span>{formattedValue}</span>
                                        </Stack>
                                      }
                                    />
                                  </ListItem>
                                )
                            })}
                          </List>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          ) : (
            <Card>
              <Grid xs={12} item>
                <Skeleton sx={{
                  transform: "initial",
                  height: "287px",
                  width: "100%"
                }} />
              </Grid>
            </Card>
          )
      }
      
    </>
  );
}

export default Accounts;
