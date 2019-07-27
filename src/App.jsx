import React from 'react';
import ReactPlayer from 'react-player'
import AppBar from './AppBar'

import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/styles';

import ConnectionsManager from './connectionsManager'

const styles = theme => ({
  player: {
    height: '90vh'
  },
});
class App extends React.Component {
  state = {
    url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
    myID: "",
    peerID: "",
    isConnected: false,
    isLocalFile: false,
    isPlaying: false,
    played: 0,
    windowHeight: 100
  }

  componentWillMount() {
    this.setState({ height: window.innerHeight + 'px' });
  }

  handlePeerEvents = (eventObj) => {
    console.log(eventObj);
    switch (eventObj.type) {
      case "ID":
        this.setState({
          myID: eventObj.data
        })
        break;
      case "open":
        this.setState({
          isConnected: true,
          peerID: eventObj.data
        })
        break;
      case "data":
        console.log("Data: " + eventObj.data);
        switch (eventObj.data.type) {
          case "urlUpdate":
            this.setState({
              url: eventObj.data.data,
              isLocalFile: false
            })
            break;
          case "playPause":
            this.setState({
              isPlaying: eventObj.data.data
            })
            break;
          case "seeking":
            if (eventObj.data.data === this.state.played) {
              return;
            }
            this.setState({
              played: eventObj.data.data
            })
            this.player.seekTo(parseFloat(this.state.played))
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

  }

  playPause = () => {
    this.setState({ isPlaying: !this.state.isPlaying })
    ConnectionsManager.sendDataToPeer({ type: "playPause", data: this.state.isPlaying })
  }

  onPlay = () => {
    console.log('onPlay')
    this.setState({ isPlaying: true })
    ConnectionsManager.sendDataToPeer({ type: "playPause", data: this.state.isPlaying })
  }

  onPause = () => {
    console.log('onPause')
    this.setState({ isPlaying: false })
    ConnectionsManager.sendDataToPeer({ type: "playPause", data: this.state.isPlaying })
  }

  onSeek = (e) => {
    console.log("On seeq: ", e);
    this.setState({
      played: e
    })
    setTimeout(() => {
      ConnectionsManager.sendDataToPeer({ type: "seeking", data: this.state.played })
    }, 500);
  }

  onProgress = (e) => {
    console.log(e.playedSeconds);
    if (!this.state.isPlaying && e.playedSeconds !== 0 && e.playedSeconds !== this.state.played) {
      this.setState({
        played: e.playedSeconds
      })
      ConnectionsManager.sendDataToPeer({ type: "seeking", data: this.state.played })
    }

  }

  componentDidMount() {
    ConnectionsManager.initPeer(this.handlePeerEvents)
  }

  onChangeUrl = (newUrl, isLocalFile) => {
    this.setState({
      url: newUrl,
      isLocalFile: isLocalFile
    })

    if (!isLocalFile) {
      ConnectionsManager.sendDataToPeer({ type: "urlUpdate", data: newUrl })
    }
  }

  handleConnectToPeer = (peerID) => {
    this.setState({
      peerID: peerID
    })
    ConnectionsManager.connectToPeer(peerID, this.handlePeerEvents)
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  ref = player => {
    this.player = player
  }

  render() {
    const { classes } = this.props;
    let { url, isPlaying } = this.state
    return (
      <div className={classes.app} >
        <CssBaseline />

        <AppBar
          onChangeUrl={this.onChangeUrl.bind(this)}
          handleConnectToPeer={this.handleConnectToPeer}
          myID={this.state.myID}
          isConnected={this.state.isConnected}
          peerID={this.state.peerID} />

        <div className={classes.player}>

          <ReactPlayer
            ref={this.ref}
            url={url}
            playing={isPlaying}
            controls={true}
            onPause={this.onPause}
            onPlay={this.onPlay}
            onSeek={this.onSeek}
            onProgress={this.onProgress}
            width='100%'
            height='100%'
          />
        </div>
      </div >
    );
  }
}

export default withStyles(styles)(App);

