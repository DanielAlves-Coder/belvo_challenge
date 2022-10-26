import { FC, useState, useEffect } from 'react'
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
  Stack,
  Skeleton,
} from '@mui/material';
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

interface Props {
  setCurrentLinkName: any;
  setCurrentAccounts: any;
}

const Links: FC<Props> = (props) => {
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
    await fetch(`${BASE_URL}/auth/token`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
        }) 
        .then(response => response.json())
        .then((data) => {
          console.log("GetWidgetAccessToken:", data.slice(0, 10) + data.slice(10).replace(new RegExp(".", "g"),"*"))
          setWidgetAccessToken(data)
        })
        .catch(error => {
          console.error('GetWidgetAccessToken Error:', error)
          setWidgetAccessToken(null)
      })
  }

  async function getAccounts(linkId: string) {
    props.setCurrentAccounts(null)
    await fetch(`${BASE_URL}/accounts/retrieve/${linkId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
        }) 
        .then(response => response.json())
      .then((data) => {
          props.setCurrentAccounts(data)
          console.log("getAccounts:", data)
        })
        .catch(error => {
          console.error('getAccounts error:', error)
      })
  }  

  async function removeLink(linkId: string) {
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
    const callback = (e) => { console.log("createWidget callback", e)}
    
    const successCallbackFunction = (link, institution) => {
      console.log("successCallbackFunction", link, institution)
      storeLink(link, institution)
      setWidgetAccessToken(null)
      queryAllLinks()
      getWidgetAccessToken()
      // Do something with the link and institution,
      // such as associate it with your registered user in your database.
    }
    const onExitCallbackFunction = (data) => {
      //console.log("onExitCallbackFunction", data)
      // Do something with the exit data.
    }
    const onEventCallbackFunction = (data) => {
      //console.log("onEventCallbackFunction", data)
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
        <Typography variant="h3">Links</Typography>
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
            //console.log("currInstitution", currInstitution, link)
            return(
              <Grid key={link.id} xs={12} sm={6} md={4} item>
                <Card
                  sx={{
                    px: 1
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <AvatarWrapper>
                        <img
                          alt={currInstitution.display_name}
                          src={currInstitution.icon_logo}
                        />
                      </AvatarWrapper>
                      <Stack spacing={0}>
                        <Typography variant="h5" noWrap>
                          {currInstitution.display_name}
                        </Typography>
                        <Typography variant="subtitle1" noWrap>
                          {`Access: ${link.access_mode}`}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack spacing={0}>
                      <Typography variant="body2" noWrap>
                        {`Created: ${new Date(link.created_at).toDateString()}`}
                      </Typography>
                      <Typography variant="body2" noWrap>
                        {`Last Access: ${new Date(link.last_accessed_at).toDateString()}`}
                      </Typography>
                      <Grid sx={{ mt: 1}} container spacing={1}>
                        <Grid sm item>
                          <Button onClick={() => {
                            props.setCurrentLinkName(currInstitution.display_name)
                            getAccounts(link.id)
                          }} fullWidth
                            variant="contained">
                            Details
                          </Button>
                        </Grid>
                        <Grid sm item>
                          <Button onClick={() => removeLink(link.id)} fullWidth color="error" variant="outlined">
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        }
          {widgetAccessToken ? (
            <Grid xs={12} sm={6} md={4} item>
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
            <>
              <Grid xs={12} sm={6} md={3} item>
                <Skeleton sx={{
                  transform: "initial",
                  height: "100%",
                  width: "100%"
                }} />
              </Grid>
              {activeLinks.length === 0 ? (
              <Grid sx={{visibility: "hidden"}} xs={12} sm={6} md={3} item>
                <Card
                    sx={{
                      px: 1
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <AvatarWrapper>
                          <img
                            alt="loading"
                            src="loading"
                          />
                        </AvatarWrapper>
                        <Stack spacing={0}>
                          <Typography variant="h5" noWrap>
                            loading
                          </Typography>
                          <Typography variant="subtitle1" noWrap>
                            Access: loading
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack spacing={0}>
                        <Typography variant="body2" noWrap>
                          Created: loading
                        </Typography>
                        <Typography variant="body2" noWrap>
                          Last Access: loading
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid sm item>
                            <Button fullWidth variant="contained">
                              Details
                            </Button>
                          </Grid>
                          <Grid sm item>
                            <Button fullWidth color="error" variant="outlined">
                              Remove
                            </Button>
                          </Grid>
                        </Grid>
                      </Stack>
                    </CardContent>
                  </Card>
              </Grid>
              ) : ('')}
            </>
          )}
      </Grid>
    </>
  );
}

export default Links;
