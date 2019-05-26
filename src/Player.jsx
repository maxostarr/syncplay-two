import React, { Component } from 'react'
import ReactPlayer from 'react-player'

class Player extends Component {
  state = {
    pip: false,
    controls: true,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false
  }

  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }

  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }

  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }

  onProgress = state => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }


  ref = player => {
    this.player = player
  }
  render() {
    const { onPause, onPlay, onSeek, url, isPlaying, played } = this.props;
    return (
      <div>
        <ReactPlayer
          ref={this.ref}
          url={url}
          playing={isPlaying}
          controls={true}
          onPause={onPause}
          onPlay={onPlay}
          onProgress={this.onProgress}
          onSeek={onSeek}
        />
      </div>
    )
  }
}

export default Player