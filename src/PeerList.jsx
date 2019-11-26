import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    padding: "10px"
  }
}));

const PeerList = ({ peers }) => {
  const classes = useStyles();
  const peerListItems = peers.map(peer => {
    return (
      <ListItem divider key={peer}>
        <ListItemText primary={peer} />
      </ListItem>
    );
  });
  return (
    <div className={classes.root} aria-label="peers">
      <Typography variant="h5">Peers</Typography>
      <List>{peerListItems}</List>
    </div>
  );
};

export default PeerList;
