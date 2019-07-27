import Peer from 'peerjs';

let peer = new Peer()
let connection = null;

let initPeer = (callback) => {
  peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
    callback({
      type: "ID",
      data: id
    })
  });

  peer.on('connection', (conn) => {
    connection = conn;
    console.log("Connection from: " + connection.peer);
    addConnectionListeners(callback);
  })
}

let addConnectionListeners = (callback) => {
  connection.on('open', () => {
    // Receive messages
    callback({
      type: "open",
      data: connection.peer
    })
    connection.on('data', function (data) {
      console.log('Received', data);
      callback({
        type: "data",
        data: data
      })
    });

    // Send messages
    connection.send('Hello!');
  })
}

export default {
  initPeer: (callback) => {
    initPeer(callback)
  },

  connectToPeer: (peerID, callback) => {
    connection = peer.connect(peerID)
    addConnectionListeners(callback);
  },

  sendDataToPeer: (data) => {
    connection.send(data)
  }
}