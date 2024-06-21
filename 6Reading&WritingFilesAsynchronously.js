const fs = require('fs');       //File system module

//READING & WRITING TO A FILE
//*************************************
//Here while file is being read it will print "Reading File..."
let textIn = fs.readFileSync('./Files/input.txt', 'utf-8',(err,data)=>{
    console.log(data)
}); //10min utf-8 is encoding
console.log('.Reading File...')

//After the file is read the call back function is executed and the data read is logged
//Having callback doesnt mean it is asynchronous