import Peer from 'peerjs';

let peer = new Peer()
let connections = [];

let initPeer = (callback) => {
  peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
    callback({
      type: "ID",
      data: id
    })
  });

  peer.on('connection', (conn) => {
    connections.push(conn);
    console.log("Connection from: " + connections[connections.length - 1].peer);
    addConnectionListeners(callback);
  })
}

let addConnectionListeners = (callback) => {
  connections[connections.length - 1].on('open', () => {
    // Receive messages
    callback({
      type: "open",
      data: connections[connections.length - 1].peer
    })
    connections[connections.length - 1].on('data', function (data) {
      console.log('Received', data);
      if (data.type === "peerList") {
        const recievedPeerList = data.data
        console.log("Peer List", recievedPeerList);
        const indexOfOwnID = recievedPeerList.indexOf(peer.id)
        console.log("indexOfOwnID", indexOfOwnID);
        if (indexOfOwnID > -1) {
          recievedPeerList.splice(indexOfOwnID, 1);
        }
        console.log("Peer List without self", recievedPeerList);
        const currentPeers = connections.map(connection => connection.peer)
        const newPeers = recievedPeerList.filter((item) => !currentPeers.includes(item))
        console.log('newPeers: ', newPeers);
        if (newPeers.length > 0) {
          newPeers.forEach(peerID => {
            peer.connect(peerID)
          })
          callback({
            type: "newPeers",
            data: newPeers
          })
        }
      } else {
        callback({
          type: "data",
          data: data
        })
      }
    });

    // Send messages
    const peerList = connections.map(connection => connection.peer)

    connections[connections.length - 1].send({
      type: "peerList",
      data: peerList
    });
  })
}

export default {
  initPeer: (callback) => {
    initPeer(callback)
  },

  connectToPeer: (peerID, callback) => {
    if (!connections.map(connection => connection.peer).includes(peerID)) {
      connections.push(peer.connect(peerID));
      addConnectionListeners(callback);
    }
  },

  sendDataToPeer: (data) => {
    connections.forEach(connection => {
      connection.send(data)
    })
  }
}