import { FC, useState, useEffect } from 'react'
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
  Skeleton,
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

const LinkedAccounts: FC = () => {
  useScript('https://cdn.belvo.io/belvo-widget-1-stable.js');
  const [widgetAccessToken, setWidgetAccessToken] = useState<string | null>(null)
  const [institutionList, setInstitutionList] = useState<any>([]);
  const [activeLinks, setActiveLinks] = useState<any>([]);

  const handleClickOpen = () => {
    createWidget()
  };

  useEffect(() => {
    async function init() {
      await queryAllInstitutions()
      await queryAllLinks()
      await getWidgetAccessToken()
    }
    init()
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
        setInstitutionList(data)
      })
  }

  async function queryAllLinks() {
    const url = `${BASE_URL}/links/getall`

    await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("queryAllLinks", data)
        setActiveLinks(data)
      })
  }

  async function storeLink(link: string, institution: string) {
    const url = `${BASE_URL}/links/store`

    await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        link,
        institution
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("storeLink", data)
      })
  }

  /*async function registerLink() {
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
  }*/
  
  function useScript(src) {
    useEffect(
        () => {
          // Create script
          const node = document.createElement('script');
          node.src = src;
          node.type = 'text/javascript';
          node.async = true;
          //node.onload = createWidget
          // Add script to document body
          document.body.appendChild(node);
        },
        [src] // Only re-run effect if script src changes
    )
}

  async function getWidgetAccessToken() {
  // Make sure to change /get-access-token to point to your server-side.
    await fetch(`${BASE_URL}/belvo/token`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
        }) 
        .then(response => response.json())
        .then((data) => {
          console.log("GetWidgetAccessToken:", data)
          setWidgetAccessToken(data)
        })
        .catch(error => {
          console.error('GetWidgetAccessToken Error:', error)
          setWidgetAccessToken(null)
      })
  }

  async function removeLink(linkId: string) {
  // Make sure to change /get-access-token to point to your server-side.
    await fetch(`${BASE_URL}/links/remove/${linkId}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
        }) 
        .then(response => response.json())
        .then((data) => {
          console.log("removeLink:", data)
          queryAllLinks()
        })
        .catch(error => {
          console.error('RemoveLink error:', error)
          queryAllLinks()
      })
  }  

  async function createWidget() {
    const callback = () => { }
    
    const successCallbackFunction = (link, institution) => {
      console.log("successCallbackFunction", link, institution)
      storeLink(link, institution)
      getWidgetAccessToken()
      queryAllLinks()
      // Do something with the link and institution,
      // such as associate it with your registered user in your database.
    }
    const onExitCallbackFunction = (data) => {
      console.log("onExitCallbackFunction", data)
      // Do something with the exit data.
    }
    const onEventCallbackFunction = (data) => {
      console.log("onEventCallbackFunction", data)
        // Do something with the exit data.
    }
    const config = {

        // Add your startup configuration here.
        locale: 'en',
        callback: (link, institution) => successCallbackFunction(link, institution),
        onExit: (data) => onExitCallbackFunction(data),
        onEvent: (data) => onEventCallbackFunction(data)
    }
    if (widgetAccessToken) {
      window.belvoSDK.createWidget(widgetAccessToken, config).build()
    }
  }

  return (
    <>
      <div id="belvo"/>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      >
        <Typography variant="h3">Linked Accounts</Typography>
      </Box>
      <Grid container spacing={3}>
        {
          activeLinks.map((link) => {
            if (link === null) {
              return ''
            }
            const currInstitution = institutionList.filter((el) => {
              return el.name === link.institution
            })[0]

            if(currInstitution === null){
              return ''
            }
            console.log("currInstitution", currInstitution, link)
            return(
              <Grid key={link.id} xs={12} sm={6} md={3} item>
                <Card
                  sx={{
                    px: 1
                  }}
                >
                  <CardContent>
                    <AvatarWrapper>
                      <img
                        alt={currInstitution.display_name}
                        src={currInstitution.icon_logo}
                      />
                    </AvatarWrapper>
                    <Typography variant="h5" noWrap>
                      {`${currInstitution.display_name} [${currInstitution.id}]`}
                    </Typography>
                    <Typography variant="subtitle1" noWrap>
                      {link.access_mode}
                    </Typography>
                    <Typography variant="subtitle2" noWrap>
                      {`Created: ${new Date(link.created_at).toDateString()}`}
                    </Typography>
                    <Typography variant="subtitle2" noWrap>
                      {`Last Access: ${new Date(link.last_accessed_at).toDateString()}`}
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid sm item>
                        <Button fullWidth variant="outlined">
                          Details
                        </Button>
                      </Grid>
                      <Grid sm item>
                        <Button onClick={() => removeLink(link.id)} fullWidth variant="contained">
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        }
          {widgetAccessToken ? (
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
          ) : (
            <Grid xs={12} sm={6} md={3} item>
              <Skeleton sx={{
                height: "100%",
                width: "100%"
              }} />
            </Grid>
          )}
      </Grid>
    </>
  );
}

export default LinkedAccounts;
