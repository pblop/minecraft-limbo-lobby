const blessed = require('blessed')

class Display {
  constructor () {
    this.userInputCallback = () => {}

    this.screen = blessed.screen({
      ignoreLocked: ['C-c']
    })
    this.body = blessed.box({
      top: 0,
      left: 0,
      height: '100%-1',
      width: '100%',
      alwaysScroll: true,
      scrollable: true,
      scrollbar: {
        ch: ' ',
        bg: 'white'
      }
    })
    this.inputLineMarker = blessed.box({
      bottom: 0,
      left: 0,
      height: 1,
      width: 2
    })
    this.inputBar = blessed.textbox({
      bottom: 0,
      left: 2,
      height: 1,
      width: '100%-2',
      keys: true,
      mouse: true,
      inputOnFocus: true
    })

    // Add body to blessed screen
    this.screen.append(this.body)
    // Add input marker and bar to blessed screen
    this.screen.append(this.inputLineMarker)
    this.screen.append(this.inputBar)

    // Close the program on ctrl+c
    this.screen.key(['C-c'], (ch, key) => process.exit(0))

    // Handle user input
    this.inputBar.on('submit', (text) => {
      this.log(`> ${text}`)
      this.userInputCallback(text)
      this.inputBar.clearValue()
      this.inputBar.focus()
      this.inputBar.render()
    })

    // Focus input
    this.inputBar.focus()
    // Set the marker value
    this.inputLineMarker.setContent('> ')
    // Show our screen right now
    this.screen.render()
    this.body.pushLine(this)
  }

  // Logging function. Use this instead of console.log
  log (text) {
    this.body.pushLine(text)
    this.screen.render()
  }
}

module.exports = Display
