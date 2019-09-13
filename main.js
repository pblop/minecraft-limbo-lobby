const mc = require('minecraft-protocol')
const config = require('./config.js')

const server = mc.createServer({
  'online-mode': false,
  encryption: true,
  host: config.host,
  port: config.port,
  version: '1.14.4'
})

console.log(`Server listening on ${config.host}:${config.port}!`)

server.on('error', (err) => console.error(err))

server.on('login', client => {
  console.log(`${client.username} joined the server!`)

  client.write('login', {
    entityId: client.id,
    levelType: 'flat',
    gameMode: 3,
    dimension: 1,
    difficulty: 2,
    maxPlayers: server.maxPlayers,
    reducedDebugInfo: true
  })

  client.write('position', {
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    flags: 0x00
  })

  if (config.join_messages) {
    for (const message of config.join_messages) {
      client.write('chat', {
        message: JSON.stringify(message),
        position: message.position
      })
    }
  }

  if (config.boss_bar) {
    client.write('boss_bar', {
      entityUUID: 0,
      action: 0,
      title: JSON.stringify(config.boss_bar.title),
      health: config.boss_bar.health == null ? 1 : config.boss_bar.health,
      color: config.boss_bar.color == null ? 2 : config.boss_bar.color,
      division: config.boss_bar.division == null ? 0 : config.boss_bar.division,
      flags: 0x00
    })
  }
})
