
console.log('Program has started')

//STORED - 2ND PHASE
fs.readFile('./Files/input.txt', () => {
    console.log('File read complete!');

    //STORED IN - 1ST PHASE
    setTimeout(() => {
        console.log('Timer callback executed')
    }, 0);

    //STORED IN - 3RD PHASE
    setImmediate(() => {console.log('SetImmediate callback executed')});

    process.nextTick(() => {console.log('Process.nextTick callback executed')})
})

console.log('Program has completed')

/*
The output for above will be

Program has started
Program has completed
File read complete!
Process.nextTick callback executed
SetImmediate callback executed
Timer callback executed Beacuse this will be executed in the next cycle which starts from phase 1
*/

/*
console.log('Program has started')

//STORED - 2ND PHASE
fs.readFile('./Files/input.txt', () => {
    console.log('File read complete!');})


//STORED IN - 1ST PHASE
setTimeout(() => {
    console.log('Timer callback executed')
}, 0);


//STORED IN - 3RD PHASE
setImmediate(() => {console.log('SetImmediate callback executed')});

console.log('Program has completed')

Program has started
Program has completed
Timer callback executed
SetImmediate callback executed
File read complete!     Though in second phase teh file reading might not have been completed
*/