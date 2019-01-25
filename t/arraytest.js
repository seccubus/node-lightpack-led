
const lp = require('node-lightpack-led');

rwb = [
  {r: 255, g:0, b:0 },
  {r:255, g:255, b:255 },
  {r:0, g:0, b:255 }
]

console.log("LEDS off")
lp.getDevices().forEach(function(device) {
    device.enable();
});
msleep(1000)
console.log("Setting to red- whte- blue, iterating")
lp.getDevices().forEach(function(device) {
    device.setColorArray(rwb, true, false);
});
msleep(3000)
console.log("Setting to red- whte- blue, repeating last")
lp.getDevices().forEach(function(device) {
    device.setColorArray(rwb, true, true);
});
    
function msleep(n) {
   	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,n);
}