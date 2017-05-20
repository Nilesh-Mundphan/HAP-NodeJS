//var cmd = require('node-cmd');
var Accessory = require('../').Accessory;
var Service = require('../').Service;
var Characteristic = require('../').Characteristic;
var uuid = require('../').uuid;

var relayPin = 16; //Physical Pin Number for the relay you wish to be able to use. Change as you desire...

var LightController2 = {
  name: "Light2", //name of accessory
  pincode: "031-45-154",
  username: "F1:3C:E2:5A:1A:1B", // MAC like address used by HomeKit to differentiate accessories.
  manufacturer: "Embedded Makes", //manufacturer (optional)
  model: "v1.1", //model (optional)
  serialNumber: "A12S345KGL", //serial number (optional)

  power: false, //curent power status

  outputLogs: false, //output logs

  setPower: function(status) { //set power of accessory
    console.log("Turning the '%s' %s", this.name, status ? "on" : "off");
    if(this.outputLogs) console.log("Turning the '%s' %s", this.name, status ? "on" : "off");
    this.power = status;
    //if(status) cmd.run('sudo python /home/pi/HAP-NodeJS/python/light1.py ' + relayPin);
    //else cmd.run('sudo python /home/pi/HAP-NodeJS/python/light0.py ' + relayPin);
  },

  getPower: function() { //get power of accessory
    if(this.outputLogs) console.log("'%s' is %s.", this.name, this.power ? "on" : "off");
    return this.power ? true : false;
  },

  identify: function() { //identify the accessory
    if(this.outputLogs) console.log("Identify the '%s'", this.name);
  }
}

// Generate a consistent UUID for our light Accessory that will remain the same even when
// restarting our server. We use the `uuid.generate` helper function to create a deterministic
// UUID based on an arbitrary "namespace" and the word "light".
var lightUUID1 = uuid.generate('hap-nodejs:accessories:light2' + LightController2.name);

// This is the Accessory that we'll return to HAP-NodeJS that represents our light.
var lightAccessory1 = exports.accessory = new Accessory(LightController2.name, lightUUID1);

// Add properties for publishing (in case we're using Core.js and not BridgedCore.js)
lightAccessory1.username = LightController2.username;
lightAccessory1.pincode = LightController2.pincode;

lightAccessory1
  .getService(Service.AccessoryInformation)
    .setCharacteristic(Characteristic.Manufacturer, LightController2.manufacturer)
    .setCharacteristic(Characteristic.Model, LightController2.model)
    .setCharacteristic(Characteristic.SerialNumber, LightController2.serialNumber);

lightAccessory1.on('identify', function(paired, callback) {
  LightController2.identify();
  callback();
});

lightAccessory1
  .addService(Service.Lightbulb, LightController2.name)
  .getCharacteristic(Characteristic.On)
  .on('set', function(value, callback) {
    LightController2.setPower(value);
    callback();
  })
  .on('get', function(callback) {
    callback(null, LightController2.getPower());
  });
