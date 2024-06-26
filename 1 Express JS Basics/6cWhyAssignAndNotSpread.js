const index = movies.indexOf(movieToUpdate); // id=4 index=3

//Object.assign()
//The Object.assign() method is used to copy all enumerable own properties 
//from one or more source objects to a target object. It modifies the target object and returns it.

const target1 = { a: 1, b: 2 };
const source1 = { b: 4, c: 5 };

Object.assign(target1, source1);

console.log(target1); // { a: 1, b: 4, c: 5 }

//Spread Operator
//The spread operator ... allows you to create a new object by spreading the properties 
//of existing objects into a new one. 
//Unlike Object.assign(), it creates a shallow copy and does not mutate the original object.
const target2 = { a: 1, b: 2 };
const source2 = { b: 4, c: 5 };

const newObject = { ...target2, ...source2 };

console.log(newObject); // { a: 1, b: 4, c: 5 }
console.log(target2); // { a: 1, b: 2 }

//In our context
/*
Modification of Original Object:

Object.assign() modifies the movieToUpdate object directly.
The spread operator would create a new object, which means you would need to reassign it.
Direct Update vs. New Object:

Using Object.assign() directly updates the existing movieToUpdate object, which is the intent in your code.
Using the spread operator, you would need to reassign the result back to movieToUpdate, like so:

*/

//By using Spread Operator we have to do it like this
// Update the movie
const updatedMovie = { ...movieToUpdate, ...req.body };

// Save the updated movie back to the array
movies[movies.indexOf(movieToUpdate)] = updatedMovie;

//Here we are updating directly
Object.assign(movieToUpdate, req.body);

///
///
///

//Clear Example
// Example using Object.assign()

// Initial movie object
let movieToUpdate1 = { id: 1, title: "Inception", director: "Christopher Nolan" };

// Simulated req.body with updated properties
const reqBody1 = { title: "Interstellar" };

// Update the movie object using Object.assign()
Object.assign(movieToUpdate1, reqBody1);

console.log(movieToUpdate1);
// Output: { id: 1, title: "Interstellar", director: "Christopher Nolan" }


// Example using Spread Operator (...)

// Initial movie object
let movieToUpdate2 = { id: 1, title: "Inception", director: "Christopher Nolan" };

// Simulated req.body with updated properties
const reqBody2 = { title: "Interstellar" };

// Create a new updated movie object using spread operator
const updatedMovie2 = { ...movieToUpdate2, ...reqBody2 };

console.log(updatedMovie2);
// Output: { id: 1, title: "Interstellar", director: "Christopher Nolan" }

// If you need to update movieToUpdate in place, reassign it:
movieToUpdate2 = updatedMovie2;
//So object .assign updates same object but spread creates a new object
