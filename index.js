const HID = require('node-hid')

const USB_VENDOR_ID = 0x1D50
const USB_PRODUCT_ID = 0x6022

const VERSION_TO_NUMBER_OF_LEDS = {
  4: 8,
  5: 10,
  6: 10,
  7: 10
}

const CMD_UPDATE_LEDS = 1
const WRITE_BUFFER_INDEX_DATA_START = 2
const BUFFER_SIZE = 65

const SIZE_OF_LED_COLOR = 6
const LED_REMAP = [4, 3, 0, 1, 2, 5, 6, 7, 8, 9]

var deviceMemory = {}

function getDevices (_timeout, _forceupdate) {
  const timeout = _timeout || 1000
  const forceupdate = _forceupdate || false
  const devices = HID.devices()

  const discovered = devices.filter(dev => (
    dev.vendorId === USB_VENDOR_ID &&
    dev.productId === USB_PRODUCT_ID &&
    dev.serialNumber)
  )

  if (forceupdate) {
    deviceMemory = {}
  }

  /* decorate devices that were discovered */
  const output = discovered.map(function (deviceInfo) {
    const devid = deviceInfo.serialNumber
    if (deviceMemory[devid] && deviceMemory[devid].id) {
      return deviceMemory[devid]
    } else {
      const device = new HID.HID(deviceInfo.path)
      const data = readDeviceFrame(device, devid, timeout)
      const info = readDeviceInfo(data, deviceInfo)
      deviceMemory[devid] = info
      return info
    }
  })

  /* clean up old device memory */
  const discoveredIds = discovered.map(dev => dev.serialNumber)
  Object.keys(deviceMemory).forEach(id => {
    if (discoveredIds.indexOf(id) === -1) {
      delete deviceMemory[id]
    }
  })

  return output
}

exports.getDevices = getDevices

function readDeviceInfo (data, deviceInfo) {
  const major = data[1]
  const minor = data[2]
  const leds = VERSION_TO_NUMBER_OF_LEDS[major]

  return {
    version: major + '.' + minor,
    leds: leds,
    id: deviceInfo.serialNumber,
    manufacturer: deviceInfo.manufacturer,
    product: deviceInfo.product,
    write: function (data) {
      const device = new HID.HID(deviceInfo.path)
      device.write(data)
      device.close()
    },
    setColor: function (rgb, debug) {
      setColorArray(this, [ rgb ], debug || false)
    },
    setColorRGB: function (r, g, b, debug) {
      setColor(this, {
        r: r,
        g: g,
        b: b
      }, debug || false)
    },
    setColorArray: function ( colors, debug, repeatlast ) {
      setColorArray(this, colors, debug, repeatlast || false)
    },
    enable: function (debug) {
      this.setColorRGB(255, 255, 255, debug)
    },
    disable: function (debug) {
      this.setColorRGB(0, 0, 0, debug)
    }
  }
}

function readDeviceFrame (device, deviceId, timeout) {
  device.on('error', function (err) {
    console.error(deviceId, err)
  })
  device.on('data', function (data) {
    console.log(deviceId, data)
  })
  const data = device.readTimeout(timeout)
  device.close()
  return data
}

function setColorArray (device, color, debug, repeatlast) {
  if (debug) console.log('Setting color array', color, 'on device', device.id)

  repeatlast = repeatlast || false

  const command = Array(BUFFER_SIZE)

  for (var i = 0; i < command.length; i++) {
    command[i] = 0x00
  }

  command[1] = CMD_UPDATE_LEDS

  var arrayIndex = 0;
  for (var j = 0; j < device.leds; j++) {
    var buffIndex = WRITE_BUFFER_INDEX_DATA_START + LED_REMAP[j % 10] * SIZE_OF_LED_COLOR

    // Send main 8 bits for compability with existing devices
    command[buffIndex++] = (color[arrayIndex].r & 0x0FF0) >> 4
    command[buffIndex++] = (color[arrayIndex].g & 0x0FF0) >> 4
    command[buffIndex++] = (color[arrayIndex].b & 0x0FF0) >> 4

    // Send over 4 bits for devices revision >= 6
    // All existing devices ignore it
    command[buffIndex++] = (color[arrayIndex].r & 0x000F)
    command[buffIndex++] = (color[arrayIndex].g & 0x000F)
    command[buffIndex++] = (color[arrayIndex].b & 0x000F)

    // Figure out which color is next
    arrayIndex++
    if (arrayIndex >= color.length() ) {
      if ( repeatlast ) {
        arrayIndex = color.length - 1
      } else {
        arrayIndex = 0
      }
    }
  }

  if (debug) console.log(device.id, 'write', JSON.stringify(command))

  device.write(command)
}
