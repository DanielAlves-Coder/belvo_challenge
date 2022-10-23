import { FC, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  Avatar,
  alpha,
  Tooltip,
  CardActionArea,
  styled,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  DialogTitle,
  DialogContent,
  Dialog,
  TextField,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import {
  MODE,
  BACKEND
} from '../../../constants/index'

const {
  BASE_URL
} = BACKEND[MODE]


const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[10]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`
);

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.colors.primary.main} dashed 1px;
        height: 100%;
        color: ${theme.colors.primary.main};
        transition: ${theme.transitions.create(['all'])};
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
        &:hover {
          border-color: ${theme.colors.alpha.black[70]};
        }
`
);

let credentials: any = {}
const LinkedAccounts: FC = () => {
  //const [links, setLinks] = useState<any>({})
  const [openModal, setOpenModal] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<any>({});
  const [institutionList, setInstitutionList] = useState<any>([]);

  const handleClickOpen = () => {
    console.log("Open modal")
    setOpenModal(true);
  };

  const handleClose = (institution) => {
    console.log("Close modal", institution)
    setOpenModal(false);
    setSelectedInstitution(institution)
    credentials = {}
  };

  useEffect(() => {
    queryAllInstitutions()
  }, [])

  async function queryAllInstitutions() {
    const url = `${BASE_URL}/institutions/list`

    await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("queryAllInstitutions", data)
        
        setInstitutionList(data.results.sort((a,b)=>{return a.country_code.localeCompare(b.country_code)}))
      })
  }

  async function registerLink() {
    const url = `${BASE_URL}/links/register`

    await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        institution: selectedInstitution.name,
        ...credentials
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("registerLink", data)
      })
  }

  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.object.isRequired
  };
  
  function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
      onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
      onClose(value);
    };

    return (
      <Dialog fullWidth={true} onClose={handleClose} open={open}>
        <DialogTitle>Select institution to link</DialogTitle>
        <DialogContent dividers>
          <List sx={{ pt: 0 }}>
            {institutionList.map((institution) => (
              <ListItem
                button
                onClick={() => handleListItemClick(institution)}
                key={institution.id}
              >
                <ListItemAvatar>
                  <Avatar alt={institution.display_name} src={institution.icon_logo} sx={{ bgcolor: blue[100], color: blue[600] }}>
                    {institution.display_name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${institution.display_name} - ID: [${institution.id}]`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    );
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
        <Typography variant="h3">Linked Accounts</Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={handleClickOpen}
        >
          Link new account
        </Button>
      </Box>
      <Grid container spacing={3}>
        {
          selectedInstitution.id ? (
            <Grid xs={12} sm={6} md={3} item>
              <Card
                sx={{
                  px: 1
                }}
              >
                <CardContent>
                  <AvatarWrapper>
                    <img
                      alt={selectedInstitution.display_name}
                      src={selectedInstitution.icon_logo}
                    />
                  </AvatarWrapper>
                  <Typography variant="h5" noWrap>
                    {selectedInstitution.display_name}
                  </Typography>
                  <Typography variant="subtitle1" noWrap>
                    {selectedInstitution.id}
                  </Typography>
                  <Box
                    sx={{
                      '& .MuiTextField-root': { mb: 1, mt: 1, width: '24ch' }
                    }}
                  >
                    {selectedInstitution.form_fields.map((field, index) => {
                      if (field.type === 'select') {
                        return (
                        <TextField
                          required
                          id={`form-field-${index}`}
                          label={field.label}
                          select
                          key={`form-field-${index}`}
                          onChange={(e) => { credentials[field.name] = e.target.value }}
                        >                       
                          {field.values.map((option, subIndex) => (
                            <MenuItem key={`option-${option.code}-${subIndex}`} value={option.code}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>)
                      } else {
                        return (<TextField
                          required
                          id={`form-field-${index}`}
                          label={field.label}
                          type={field.type}
                          key={`form-field-${index}`}
                          onChange={(e) => { credentials[field.name] = e.target.value }}
                        />)
                      }
 
                    })}
                    <Button
                      variant="contained"
                      onClick={registerLink}
                    >
                      Submit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ) : ('')
        }
        <Grid xs={12} sm={6} md={3} item>
          <Tooltip arrow title="Click to link new account">
            <CardAddAction onClick={handleClickOpen}>
              <CardActionArea
                sx={{
                  px: 1
                }}
              >
                <CardContent>
                  <AvatarAddWrapper>
                    <AddTwoToneIcon fontSize="large" />
                  </AvatarAddWrapper>
                </CardContent>
              </CardActionArea>
            </CardAddAction>
          </Tooltip>
        </Grid>
        <SimpleDialog
          selectedValue={selectedInstitution}
          open={openModal}
          onClose={handleClose}
        />
      </Grid>
    </>
  );
}

export default LinkedAccounts;
