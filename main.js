const mc = require('minecraft-protocol')
const config = require('./config.js')
const Display = require('./display.js')

const display = config.commandInterface ? new Display() : { log: console.log }

display.log(`Initializing server...`)

const server = mc.createServer({
  'online-mode': false,
  encryption: true,
  host: config.host,
  port: config.port,
  version: config.version
})

if (config.commandInterface) {
  display.userInputCallback = function commandHandler (command) {
    switch (command) {
      case 'list':
        let clients = Object.values(server.clients)
          .map(element => element.username)
        const clientsLength = clients.length
        if (clientsLength === 0) clients = 'None'
        else clients = clients.join(', ')
        display.log(`Clients connected (${clientsLength}): ${clients}`)
        break
      case 'end':
      case 'stop':
      case 'close':
        display.log('Stopping the server')
        process.exit(0)
      default:
        display.log(`Unknown command ${command}`)
        break
    }
  }
}

display.log(`Server listening on ${config.host}:${config.port}!`)

server.on('error', (err) => display.log(`Error: ${err}`))

const the_end = {
  piglin_safe: {
    type: 'byte',
    value: 0
  },
  natural: {
    type: 'byte',
    value: 0
  },
  ambient_light: {
    type: 'float',
    value: 0
  },
  infiniburn: {
    type: 'string',
    value: 'minecraft:infiniburn_end'
  },
  respawn_anchor_works: {
    type: 'byte',
    value: 0
  },
  has_skylight: {
    type: 'byte',
    value: 0
  },
  bed_works: {
    type: 'byte',
    value: 0
  },
  has_raids: {
    type: 'byte',
    value: 1
  },
  name: {
    type: 'string',
    value: 'minecraft:the_end'
  },
  logical_height: {
    type: 'int',
    value: 256
  },
  shrunk: {
    type: 'byte',
    value: 0
  },
  ultrawarm: {
    type: 'byte',
    value: 0
  },
  has_ceiling: {
    type: 'byte',
    value: 0
  },
  fixed_time: {
    type: 'int',
    value: 6000
  }
}

server.on('login', client => {
  display.log(`${client.username} joined the server!`)
  client.registerChannel('minecraft:brand', ['string', []])

  client.write('login', {
    entityId: client.id,
    levelType: 'flat',
    gameMode: 3,
    previousGameMode: 255,
    worldNames: ['minecraft:the_end'],
    dimensionCodec: {name: '', type:'compound', value: {dimension: {type: 'list', value: {type: 'compound', value: [the_end]}}}},
    dimension: 'minecraft:the_end',
    worldName: 'minecraft:the_end',
    difficulty: 2,
    hashedSeed: [0, 0],
    maxPlayers: server.maxPlayers,
    reducedDebugInfo: true,
    enableRespawnScreen: true
  })
  client.writeChannel('minecraft:brand', 'PabloPerezRodriguez/minecraft-limbo-lobby')

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
        position: message.position, 
        sender: '0'
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
