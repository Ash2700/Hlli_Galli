const roomManager = require('../service/room-service');

const roomController = {

  createRoom: async (name, hostId, playerName) => {
    const room = await roomManager.createRoom(name, hostId, playerName)
    const rooms = await roomManager.getRooms()
    return { room, rooms }
  },

  joinRoom: async (roomId, playerId, playerName) => {
    console.log('controller join start')
    return Promise.all([
      roomManager.joinRoom(roomId, playerId, playerName),
      roomManager.getRooms(),
      roomManager.checkIfReadyToStart(roomId)
    ]).then(async ([room, rooms, isStartGame]) => {
      console.log('isStartGame',isStartGame)
      if (isStartGame) {
        const game = await roomManager.getTheGameData(roomId)
        return { room, rooms, game }
      }
      else return { room, rooms }
    }).catch(err => err)

  },

  leaveRoom: async (roomId, playerId) => {
    return roomManager.leaveRoom(roomId, playerId)
  },

  playerReady: async (roomId, playerId) => {
    if (!roomId) throw new Error('some thing wrong: not roomId')
    let game = await roomManager.getTheGameData(roomId)
    //防止遊戲中變更
    if (!game) {
      const room = await roomManager.setPlayerReady(roomId, playerId, true)
      console.log('controller', room)
      const isStartGame = await roomManager.checkIfReadyToStart(roomId)
      console.log('controller player ready', isStartGame)
      if (isStartGame) {
        game = await roomManager.getTheGameData(roomId) || null
        await console.log('controller palyer ready game', game)
        return { room, game }
      }
      return {room} 
    }
  },

  flipCard: async (roomId, playerId) => {
    return roomManager.flipCard(roomId, playerId).then(() => {
      const game = roomManager.getTheGameData(roomId)
      return game
    })
  },

  ringTheBell: async (roomId, playerId) => {
    return roomManager.ringTheBell(roomId, playerId).then(() => {
      const game = roomManager.getTheGameData(roomId)
      return game
    })
  },

  updateTheRoom: async roomId => {
    console.log('room-controller update room', roomId)
    const room = await roomManager.getTheRoom(roomId)
    console.log('room-controller update room', room)
    const game = await roomManager.getTheGameData(roomId) || null
    console.log('經過updatatheRoom', game)
    return { room, game }
  },

  getRooms: async () => {
    const rooms = await roomManager.getRooms()
    return rooms
  }

}

module.exports = roomController