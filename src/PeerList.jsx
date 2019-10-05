import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    // width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

const PeerList = ({ peers }) => {
  console.log(peers);

  const classes = useStyles();
  const peerListItems = peers.map(peer => {
    return (
      <ListItem key={peer}>
        <ListItemText primary={peer} />
      </ListItem>
    );
  });
  return (
    <div className={classes.root}>
      <List aria-label="peers">{peerListItems}</List>
    </div>
  );
};

export default PeerList;
