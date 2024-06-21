//READING & WRITING TO FILE ASYNCHRONOUSLY
//***************************************


/*
fs.readFile('./Files/start.txt', 'utf-8', ()=>{})
//The inner callback function is called only when thw readFiel method is complete
*/
//In the below function read file 2 only after reading file 1 and after reading all files write to the file
//We can achieve thsi because they are in the same function

//If we read both files in two async functions then we cannot predict which will execute first
fs.readFile('./Files/start.txt', 'utf-8', (error1, data1) => {
    console.log(data1)
    fs.readFile(`./Files/${data1}.txt`, 'utf-8', (error2, data2) => {
        console.log(data2);
        fs.readFile('./Files/append.txt', 'utf-8', (error3, data3) => {
            console.log(data3);
            fs.writeFile('./Files/output.txt', `${data2}\n\n${data3}\n\nDate created ${new Date()}`, () => {
                console.log('File writen successfully');
            });
        })
    })
})


console.log('Reading file....');


/*
fs.readFile('./Files/start.txt', 'utf-8', (error1, data1) => {console.log(data1)})
console.log("Hello")

The output will be 
Hello
Data1   because the file is read asynchronously and hello is being run on main thread 
*/


/*


*/

/*
The provided code uses nested setTimeout functions to print "One", "Two", and "Three"
to the console with a delay of 1 second (1000 milliseconds) between each message. 
Here's a step-by-step explanation of how it works:

The first setTimeout is set to execute after 1 second. 
When it triggers, it logs "One" to the console and sets up the next setTimeout.
The second setTimeout, nested inside the first, is also set to execute after 1 second. 
When it triggers, it logs "Two" to the console and sets up another setTimeout.
The third setTimeout, nested inside the second, is set to execute after 1 second. 
When it triggers, it logs "Three" to the console.

*/

/*
setTimeout(()=>{console.log("One")
    setTimeout(()=>{console.log("Two")
        setTimeout(()=>{console.log("Three")},1000)
    },1000)
},1000)
*/