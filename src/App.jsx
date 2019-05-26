import React from 'react';
import ReactPlayer from 'react-player'
import './App.css';
import Player from './Player.jsx';
import SelectVid from './SelectVid.jsx';


import ConnectionsManager from './connectionsManager'

class App extends React.Component {
  state = {
    url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
    myID: "",
    peerID: "",
    message: "",
    isLocalFile: false,
    isPlaying: false,
    played: 0
  }

  handlePeerEvents = (eventObj) => {
    console.log(eventObj);
    switch (eventObj.type) {
      case "ID":
        this.setState({
          myID: eventObj.data
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
    ConnectionsManager.sendDataToPeer({ type: "seeking", data: this.state.played })
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

  handleSubmitID = (event) => {
    ConnectionsManager.connectToPeer(this.state.peerID, this.handlePeerEvents)
    event.preventDefault();
  }

  handleSubmitMessage = (event) => {
    ConnectionsManager.sendDataToPeer(this.state.message)
    event.preventDefault();
  }

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  ref = player => {
    this.player = player
  }

  render() {
    let { url, isPlaying, played } = this.state
    return (
      <div className="App" >
        {/* <Player
          url={this.state.url}
          isPlaying={this.state.isPlaying}
          playPause={this.playPause}
          onPlay={this.onPlay}
          onPause={this.onPause}
          onSeek={this.onSeek}
          played={this.state.played}
        /> */}

        <ReactPlayer
          ref={this.ref}
          url={url}
          playing={isPlaying}
          controls={true}
          onPause={this.onPause}
          onPlay={this.onPlay}
          onSeek={this.onSeek}
          onProgress={this.onProgress}
        />

        <SelectVid onChangeUrl={this.onChangeUrl.bind(this)} />
        <form onSubmit={this.handleSubmitID}>
          <input type="text" id="peerID" placeholder="PeerID" value={this.state.peerID} onChange={this.handleChange} ></input>
          <button type="submit">Connect to Peer</button>
        </form>
        <form onSubmit={this.handleSubmitMessage}>
          <input type="text" id="message" value={this.state.message} onChange={this.handleChange} ></input>
          <button type="submit">Send</button>
        </form>
        {this.state.myID || "Yeet"}
      </div>
    );
  }
}

export default App;
