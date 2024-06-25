//EMITTING & HANDLING CUSTOM EVENTS
const events = require('events');
const  replaceHtml = require('./Modules/replaceHtml');
const user = require('./Modules/user');

/*
let myEmitter = new events.EventEmitter();

//Whenever a user is created console.log("A New User is Created")
//We are listening to this event using on method
myEmitter.on('UserCreated',()=>{
    console.log("A New User is Created")
})

//We can use multiple event handlers on the same event listener
myEmitter.on('UserCreated',()=>{
    console.log("A New User is added in db")
})

myEmitter.emit('UserCreated')   //This event emitter emits an event called UserCreated

*/
let myEmitter = new user(); //Since user class also has all properties of eventEmitter class we can use user

myEmitter.on('userCreated', (id, name) => {
    console.log(`A new user ${name} with ID ${id} is created!`)
})

myEmitter.on('userCreated', (id, name) => {
    console.log(`A new user ${name} with ID ${id} is added to database!`)
})

myEmitter.emit('userCreated', 101, 'John'); //We can pass the paramters along with the event id and name

/*


// Import the 'events' module
const EventEmitter = require('events');

// Create an instance of EventEmitter
const myEmitter = new EventEmitter();

// Register a listener for the 'data' event
myEmitter.on('data', (data) => {
  console.log('Data received:', data);
  // You can perform additional processing with the received data here
});

// Emit the 'data' event with some data
myEmitter.emit('data', 'Hello, World!');
myEmitter.emit('data', { message: 'Hello, World!', timestamp: Date.now() });


OUTPUT
Data received: Hello, World!
Data received: { message: 'Hello, World!', timestamp: 1672525800000 }

*/

