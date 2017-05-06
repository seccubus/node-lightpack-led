# node-lightpack-led
Control you lightpack directly without the Prismatik software using node and HID.

[![npm version](https://badge.fury.io/js/node-lightpack-led.svg)](https://badge.fury.io/js/node-lightpack-led)

## Getting started

`npm install git+ssh://git@github.com:tkhduracell/node-lightpack-led.git --save`

## Usage
**Get devices**
```js
const lp = require('node-lightpack-led');
console.log(lp.getDevices());
```

Returns a list of devices.
```js
[
  {
    version: "7.5",
    leds: 10,
    id: "95230303231351210201",
    manufacturer: "lightpack.googlecode.com",
    product: "Lightpack",
    setColor: function(color: color-struct, debug: bool) { ... },
    setColorRGB: function(r: int, g: int, b: int, debug: bool) { ... },
    enable: function(debug: bool) { ... },
    disable: function(debug: bool) { ... },
    write: function(data: int[65]) { ... }
  }
]
```

**Set color of leds to red**
```js
    const lp = require('node-lightpack-led');
    lp.getDevice().forEach(function(devive) {
        device.setColorRGB(255, 0, 0);
    });
```