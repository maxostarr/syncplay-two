import React from "react";
import ReactPlayer from "react-player";
import AppBar from "./AppBar";
import PeerList from "./PeerList";

import { CssBaseline, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

import ConnectionsManager from "./connectionsManager";

const styles = theme => ({
  player: {
    height: "50vh"
  }
});
class App extends React.Component {
  state = {
    url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
    myID: "",
    peers: [],
    isConnected: false,
    isLocalFile: false,
    isPlaying: false,
    played: 0,
    windowHeight: 100
  };

  componentWillMount() {
    this.setState({ height: window.innerHeight + "px" });
  }

  handlePeerEvents = eventObj => {
    console.log(eventObj);
    switch (eventObj.type) {
      case "ID":
        this.setState({
          myID: eventObj.data
        });
        break;
      case "open":
        this.setState(state => {
          const newPeerList = [...state.peers, eventObj.data];
          return {
            ...state,
            isConnected: true,
            peers: newPeerList
          };
        });
        break;
      case "data":
        console.log("Data: " + eventObj.data);
        switch (eventObj.data.type) {
          case "urlUpdate":
            this.setState({
              url: eventObj.data.data,
              isLocalFile: false
            });
            break;
          case "playPause":
            this.setState({
              isPlaying: eventObj.data.data
            });
            break;
          case "seeking":
            if (eventObj.data.data === this.state.played) {
              return;
            }
            this.setState({
              played: eventObj.data.data
            });
            this.player.seekTo(parseFloat(this.state.played));
            break;
          default:
            break;
        }
        break;
      case "newPeers":
        console.log("New Peers");

        this.setState(state => {
          const mergedPeerList = [...state.peers, ...eventObj.data];
          return {
            ...state,
            peers: mergedPeerList
          };
        });
        break;
      default:
        break;
    }
  };

  playPause = () => {
    console.log("ok playpause");

    this.setState({ isPlaying: !this.state.isPlaying });
    // ConnectionsManager.sendDataToPeer({ type: "playPause", data: this.state.isPlaying })
  };

  onPlay = () => {
    console.log("onPlay");
    this.setState({ isPlaying: true });
    ConnectionsManager.sendDataToPeer({
      type: "playPause",
      data: this.state.isPlaying
    });
  };

  onPause = () => {
    console.log("onPause");
    this.setState({ isPlaying: false });
    ConnectionsManager.sendDataToPeer({
      type: "playPause",
      data: this.state.isPlaying
    });
  };

  onSeek = e => {
    console.log("On seeq: ", e);
    this.setState({
      played: e
    });
    setTimeout(() => {
      ConnectionsManager.sendDataToPeer({
        type: "seeking",
        data: this.state.played
      });
    }, 500);
  };

  onProgress = e => {
    console.log(e.playedSeconds);
    if (
      !this.state.isPlaying &&
      e.playedSeconds !== 0 &&
      e.playedSeconds !== this.state.played
    ) {
      this.setState({
        played: e.playedSeconds
      });
      ConnectionsManager.sendDataToPeer({
        type: "seeking",
        data: this.state.played
      });
    }
  };

  componentDidMount() {
    ConnectionsManager.initPeer(this.handlePeerEvents);
  }

  onChangeUrl = (newUrl, isLocalFile) => {
    this.setState({
      url: newUrl,
      isLocalFile: isLocalFile
    });

    if (!isLocalFile) {
      ConnectionsManager.sendDataToPeer({ type: "urlUpdate", data: newUrl });
    }
  };

  handleConnectToPeer = peerID => {
    // this.setState(state => {
    //   const newPeerList = [...state.peers, peerID];

    //   return {
    //     ...state,
    //     peers: newPeerList
    //   }
    // })
    ConnectionsManager.connectToPeer(peerID, this.handlePeerEvents);
  };

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  ref = player => {
    this.player = player;
  };

  render() {
    const { classes } = this.props;
    let { url, isPlaying, peers } = this.state;
    return (
      <div className={classes.app}>
        <CssBaseline />
        <Grid container direction="column">
          <Grid item xs={12}>
            <AppBar
              onChangeUrl={this.onChangeUrl.bind(this)}
              handleConnectToPeer={this.handleConnectToPeer}
              myID={this.state.myID}
              isConnected={this.state.isConnected}
              peerID={this.state.peerID}
            />
            {/* <Box height={100} width="100%" bgcolor="background.paper">Reet</Box> */}
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item xs={8}>
                {/* <Box height={100} width="100%" bgcolor="background.paper">Reet</Box> */}
                <ReactPlayer
                  ref={this.ref}
                  url={url}
                  playing={isPlaying}
                  controls={true}
                  onPause={this.onPause}
                  onPlay={this.onPlay}
                  onSeek={this.onSeek}
                  onProgress={this.onProgress}
                  width="100%"
                  height="100%"
                />
              </Grid>
              <Grid item xs></Grid>
              <Grid item xs={2}>
                {/* <Box height={100} width="100%" bgcolor="background.paper">Reet</Box> */}
                <PeerList peers={peers} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
