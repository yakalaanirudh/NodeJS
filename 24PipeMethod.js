
//UNDERSTANDING PIPE() METHOD
//SOLUTION 3: USING PIPE METHOD
//Lets we are reading at 4MBps and writing only at 3MBps this creates back pressure
//Back pressure happens when response cant send data as fast being read
server.on('request', (req, res) => {
let rs = fs.createReadStream('./Files/large-file.txt');
rs.pipe(res);       //To the pipe method we need to pass a writable stream //response is a writtable stream
//redableSource.pipe(writableDest)
})

console.log('Nodemon is working')

/*
Pipe method is only available on readable streams
Pipe methods pipes the output of readable stream to input of writtable stream
redableSource.pipe(writableDest)
Pipe Method handles backpressure as it matches both data speed
*/