class CustomError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        //Client Error fail and if server error error
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

        //To use for operational errors
        //for programming or other errors we set it to false
        this.isOperational = true;

        //this to correctly know the current object
        //this.constructor to pass the custom error class
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;

//const error = new CustomError('some error message', 404)

/*
EXAMPLE
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}

class Employee extends Person {
    constructor(name, age, employeeId) {
        // Call the constructor of the superclass (Person)
        super(name, age);
        // Initialize the employeeId property
        this.employeeId = employeeId;
    }

    work() {
        console.log(`Employee ${this.name} is working with ID ${this.employeeId}.`);
    }
}

// Create an instance of Person
const person = new Person('Alice', 30);
person.greet(); // Output: Hello, my name is Alice and I am 30 years old.

// Create an instance of Employee
const employee = new Employee('Bob', 25, 'E12345');
employee.greet(); // Output: Hello, my name is Bob and I am 25 years old.
employee.work(); // Output: Employee Bob is working with ID E12345.

*/