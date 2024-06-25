/*
npm init creates package.json file

Package.json file has all data about the third party libraries and dependencies used in our project

To install a package lets say express

npm install express (er can also specify version)

This installs express and in the package.json file a key named dependency 
with a value express and its value version is added

dependencies:{
"express":"4.01.2"
}
express is a regular dependency
After installing express dependency inside the node modules all its files will be available

We dont deploy node modules folder during deployemnt

nodemon is a development dependency
To make it a development dependency we have to install it like
npm install nodemon --save-dev


To install a package globally we need to 
npm install -g nodemon

npm install -g nodemon --save-dev   To install development dependency globally

To run nodemon in command prompt we need to 
nodemon fileName.js
*/