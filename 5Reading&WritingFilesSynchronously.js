//Lecture 5
const fs = require('fs');       //File system module

//READING & WRITING TO A FILE
//*************************************
let textIn = fs.readFileSync('./Files/input.txt', 'utf-8'); //10min utf-8 is encoding
console.log(textIn)

//We store the data to be written in a varibale and write to another file specified by name
let content = `Data read from input.txt: ${textIn}. \nDate created ${new Date()}`
fs.writeFileSync('./Files/output.txt', content);

//If that file is not present then nodeJS creates that file