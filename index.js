const HID = require('node-hid');

const USB_VENDOR_ID   = 0x1D50;
const USB_PRODUCT_ID  = 0x6022;

const VERSION_TO_NUMBER_OF_LEDS = {
	4: 8,
	5: 10,
	6: 10,
	7: 10
};

const CMD_UPDATE_LEDS = 1;
const WRITE_BUFFER_INDEX_DATA_START = 2;
const BUFFER_SIZE = 65;

const SIZE_OF_LED_COLOR = 6;
const LED_REMAP = [4, 3, 0, 1, 2, 5, 6, 7, 8, 9];

var device_memory = {};

function getDevices(_timeout) {
	const timeout = _timeout || 1000;
	const devices = HID.devices();
	const lightpacks = devices.filter(function select (dev, idx) {
		return dev.vendorId == USB_VENDOR_ID && dev.productId == USB_PRODUCT_ID;
	});

	if (lightpacks.length === 0) {
        device_memory = {};
	}

	return lightpacks.map (function(device_info) {
		const device_id = device_info.serialNumber;
		if (device_memory[device_id]) {
			return device_memory[device_id];
		} else {
			const device = new HID.HID(device_info.path);
			const data = readDeviceFrame(device, device_id, timeout);
            const info = readDeviceInfo(data, device_info);
            device_memory[device_id] = info;
            return info;
		}
	});
}

exports.getDevices = getDevices;

function readDeviceInfo(data, device_info) {
    const major = data[1];
    const minor = data[2];
    const leds = VERSION_TO_NUMBER_OF_LEDS[major];

    return {
        version: major + "." + minor,
        leds: leds,
        id: device_info.serialNumber,
        manufacturer: device_info.manufacturer,
        product: device_info.product,
        write: function (data) {
            const device = new HID.HID(device_info.path);
            device.write(data);
            device.close();
        },
        setColor: function (rgb, debug) {
            setColor(this, rgb, debug || false);
        },
        setColorRGB: function (r, g, b, debug) {
            setColor(this, {r: r, g: g, b: b}, debug || false);
        },
        enable: function (debug) {
            this.setColorRGB(255, 255, 255, debug);
        },
        disable: function (debug) {
            this.setColorRGB(0, 0, 0, debug);
        }
    };
}

function readDeviceFrame(device, device_id, timeout) {
    device.on("error", function (err) {
        console.error(device_id, err);
    });
    device.on("data", function (data) {
        console.log(device_id, data);
    });
    const data = device.readTimeout(timeout);
    device.close();
    return data;
}

function setColor(device, color, debug) {
	if (debug) console.log("Setting color", color, "on device", device.id);

	const command = Array(BUFFER_SIZE);

	for (var i = 0; i < command.length; i++) {
		command[i] = 0x00;
	}

	command[1] = CMD_UPDATE_LEDS;

	for (var i = 0; i < device.leds; i++) {

        var buffIndex = WRITE_BUFFER_INDEX_DATA_START + LED_REMAP[i % 10] * SIZE_OF_LED_COLOR;

        // Send main 8 bits for compability with existing devices
        command[buffIndex++] = (color.r & 0x0FF0) >> 4;
        command[buffIndex++] = (color.g & 0x0FF0) >> 4;
        command[buffIndex++] = (color.b & 0x0FF0) >> 4;

        // Send over 4 bits for devices revision >= 6
        // All existing devices ignore it
        command[buffIndex++] = (color.r & 0x000F);
        command[buffIndex++] = (color.g & 0x000F);
        command[buffIndex++] = (color.b & 0x000F);

    }

    if (debug) console.log(device.id, "write", JSON.stringify(command));

	device.write(command);
}

