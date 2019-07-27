import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => (
  {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(1),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    },
    findFileButtonContainer: {
      padding: theme.spacing(1),
    },
    findFileButton: {
      color: "white",
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
    },
    peerID: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(1),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    inputInputPeer: {
      padding: theme.spacing(1),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200,
      },
    }
  }));

const SimpleAppBar = (props) => {
  const classes = useStyles();
  const [url, setUrl] = useState("");
  const [peerID, setPeerID] = useState("");


  const openPopup = () => {
    window.dialog.showOpenDialog({
      filters: [{
        name: 'Movies',
        extensions: ['mkv', 'avi', 'mp4']
      }],
      title: "Chose Video File",
      properties: ['openFile']
    }, files => {
      console.log(files[0]);
      props.onChangeUrl(
        files[0],
        true
      )
    })
  }

  const handleConnectToPeer = e => {
    props.handleConnectToPeer(peerID)
    e.preventDefault()
  }

  const onSubmit = (e) => {
    props.onChangeUrl(
      url,
      false
    )
    e.preventDefault()
  }


  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Syncplay V2.0
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <form onSubmit={onSubmit}>
              <InputBase
                placeholder="Vid URL"
                value={url}
                onChange={e => { setUrl(e.target.value) }}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </form>
          </div>
          <Typography variant="h6" color="inherit">
            OR
          </Typography>
          <div className={classes.findFileButtonContainer}>
            <Button variant="contained" className={classes.findFileButton} onClick={openPopup}>Select File</Button>
          </div>
          <div className={classes.grow} />
          <div>
            <Typography color="inherit">
              Your ID: {props.myID}
            </Typography>
          </div>
          <form onSubmit={handleConnectToPeer}>
            <div className={classes.peerID}>
              <InputBase
                placeholder="Peer ID"
                value={peerID}
                onChange={e => { setPeerID(e.target.value) }}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInputPeer,
                }}
              />
              {/* </div>
            <div> */}
              <Button variant="contained" className={classes.findFileButton} type="submit" >{props.isConnected ? "Connected" : "Connect"}</Button>
            </div>
          </form>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default SimpleAppBar;