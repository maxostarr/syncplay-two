import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));



const PeerList = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>

          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem button>

          <ListItemText primary="Drafts" />
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="secondary mailbox folders">
        <ListItem button>
          <ListItemText primary="Trash" />
        </ListItem>
        <ListItemText primary="Spam" />

      </List>
    </div>
  );
}

export default PeerList