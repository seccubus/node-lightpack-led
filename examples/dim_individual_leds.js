const lp = require('../index.js') // require('node-lightpack-led')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const rwb = [
  { r: 255, g: 0, b: 0 },
  { r: 255, g: 255, b: 255 },
  { r: 0, g: 0, b: 255 }
]

async function main () {
  console.log('Enable all LEDs')
  lp.getDevices().forEach(function (device) {
    device.enable()
  })

  sleep(1000)

  console.log('Setting to red-white-blue, iterating')
  lp.getDevices().forEach(function (device) {
    device.setColorArray(rwb, true, false)
  })

  sleep(3000)

  console.log('Setting to red-white-blue, repeating last')
  lp.getDevices().forEach(function (device) {
    device.setColorArray(rwb, true, true)
  })
}

main()
