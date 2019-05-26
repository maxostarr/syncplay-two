import React, { Component } from 'react'

class FileUpload extends Component {
  openPopup = () => {
    window.dialog.showOpenDialog({
      filters: [{
        name: 'Movies',
        extensions: ['mkv', 'avi', 'mp4']
      }],
      title: "Chose Video File",
      properties: ['openFile']
    }, files => {
      console.log(files[0]);
      this.props.onChangeUrl(
        files[0],
        true
      )
    })
  }

  onUrlInputCange = (e) => {
    if (e.key === "Enter") {
      this.props.onChangeUrl(
        e.target.value,
        false
      )
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.openPopup}> Pick File</button>
        <input ref='urlInput' value="https://www.youtube.com/watch?v=CWR1KA5E260" onKeyPress={this.onUrlInputCange} />
      </div>
    )
  }
}

export default FileUpload