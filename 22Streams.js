/*
Streams

fs.readFile('source-file.txt','utf-8',(err,data)=>{
    fs.writeFile('dest-file.txt',data,()=>{
        console.log("file written from source to destination")
    })
})


When reading files from a source file
It creates a read buffer between source file and fs.readfile
The read buffer reads all data and send to fs.readfile
source file =>read buffer => fs.readfile

When writing files from a source file
It creates a write buffer between fs.writefile and destinationfile
the write buffer  collects all write data to buffer then to destination
data file =>write buffer => fs.writefile

If the file is large then we need to read or write piece by piece instead of doing it all at once

In this a read stream is created between source file and read buffer
source file => read stream =>read buffer => fs.readfile
Similarly
a write stream is created between data and write buffer
data file => write stream =>write buffer => fs.writefile

Advantage of streaming is
Streaming makes the data processing more efficient in terms of memory. Because
there is no need to keep all the data in the memory.
In terms of performance & time also, streaming has its advantage because we can
start processing the data as soon as the first chunk of data arrives.
*/
//SOLUTION 1: WITHOUT READABLE OR WRITABLE STREAM
//large-file.txt is a very large file
//So when sent to reponse the loading takes a lot of time might even crash
//In thsi method all file is read at once and displayed
server.on('request', (req, res) =>{
    //After data is completely read from file it is assigned to data variable
    fs.readFile('./Files/large-file.txt', (err, data) =>{
        if(err){
            res.end('Something went wrong!');
            return;
        }
    res.end(data);
    })
})

//SOLUTION 2: USING READABLE & WRITABLE STREAM
//If we want to write data to another file then we need to create writable stream
//But here we are sending response and since response is a writtable stream we are not creating write stream
server.on('request', (req, res) =>{

    //This readstream reads data from the large file in small chunks
    let rs = fs.createReadStream('./Files/large-file.txt');

    //Whenever data is read it emits data event and that data say chunk is written out to response
    //We are not using res.end() beacuse end is used when only all data is written
    //But here we are writing chunks so we use res.write()
    //Here as a small part read user will see the response
    rs.on('data', (chunk) => {
        res.write(chunk)            ///res itself is a write stream
    })

    //When read streams emits end write end to response
    //Read stream emits end only when there is no more data to read
    rs.on('end', () => {
        res.end();
    })

    rs.on('error', (error) => {
        res.end(error.message);
    })
})


