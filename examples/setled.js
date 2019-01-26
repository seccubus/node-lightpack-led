const lp = require('../index.js'); // require('node-lightpack-led')

let inc = 25

for (let x=0; x <= 255; x+=inc ) {
	    msleep(150);
	    leds(x, 0, 0);
}

for (let x=0; x <= 255; x+=inc ) {
	    msleep(150);
	    leds(0, x, 0);
}

for (let x=0; x <= 255; x+=inc ) {
	    msleep(150);
	    leds(0, 0, x);
}

for (let x=0; x <= 255; x+=inc ) {
	    msleep(150);
	    leds(x, x, 0);
}

for (let x=0; x <= 255; x+=inc ) {
	    msleep(150);
	    leds(x, 0, x);
}

for (let x=0; x <= 255; x+=inc ) {
	    msleep(150);
	    leds(0, x, x);
}

for (let x=0; x <= 255; x+=inc ) {
	    msleep(150);
	    leds(x, x, x);
}

leds(0,0,0);


function leds(red,green,blue) {   
    lp.getDevices().forEach(function(device) {
        device.setColorRGB(red, green, blue);
    });
}
    
function msleep(n) {
   	Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,n);
}
