# node-lightpack-led
Control you lightpack directly without the Prismatik software using node and HID.

## Getting started

`npm install git+ssh://git@github.com:tkhduracell/node-lightpack-led.git --save`

## Usage
```js
const lp = require('node-lightpack-led');
console.log(lp.getDevices());
```

**Output**
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
