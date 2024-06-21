//Lecture 4
//The below to read input from command prompt
const readline= require('readline')

//the input from process.stdin is stored in input
//the output from process.stdout is stored in output
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

//To close after console.logging the input
//rl.question: This method displays the prompt ("Please enter your name:") to the user and waits for input.
rl.question("Please enter your name:",(name)=>{
    console.log("You entered: "+name);
    rl.close()
})

//After closing print interface closed
rl.on('close',()=>{
    console.log("Interface closed");
    process.exit(0)
})
