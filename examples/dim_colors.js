const lp = require('../index.js') // require('node-lightpack-led')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const inc = 25
const delay = 150

async function run () {
  console.log(`Dim to red (0-255) in ${inc}`)
  for (let x = 0; x <= 255; x += inc) {
    await sleep(delay)
    rgb(x, 0, 0)
  }

  console.log(`Dim to green (0-255) in ${inc}`)
  for (let x = 0; x <= 255; x += inc) {
    await sleep(delay)
    rgb(0, x, 0)
  }

  console.log(`Dim to blue (0-255) in ${inc}`)
  for (let x = 0; x <= 255; x += inc) {
    await sleep(delay)
    rgb(0, 0, x)
  }

  console.log(`Dim to red & blue (0-255) in ${inc}`)
  for (let x = 0; x <= 255; x += inc) {
    await sleep(delay)
    rgb(x, x, 0)
  }

  console.log(`Dim to red & green (0-255) in ${inc}`)
  for (let x = 0; x <= 255; x += inc) {
    await sleep(delay)
    rgb(x, 0, x)
  }

  console.log(`Dim to green & blue (0-255) in ${inc}`)
  for (let x = 0; x <= 255; x += inc) {
    await sleep(delay)
    rgb(0, x, x)
  }

  console.log(`Dim to white (0-255) in ${inc}`)
  for (let x = 0; x <= 255; x += inc) {
    await sleep(delay)
    rgb(x, x, x)
  }

  rgb(0, 0, 0)
}

function rgb (red, green, blue) {
  lp.getDevices().forEach(function (device) {
    device.setColorRGB(red, green, blue)
  })
}

run()
