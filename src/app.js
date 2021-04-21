const express = require('express')
const app = express()
const hbs = require('hbs')
const user = require('./routers/main')
const path = require('path')
//SETUP DIRECTORIES
const publicDirectoryPath = path.join(__dirname,'./public');
const viewsTemplatesDirectory = path.join(__dirname,'./templates/views');
const partialsTemplatesDirectory = path.join(__dirname,'./templates/partials')
//Setup Handbar and Templates   
 hbs.registerPartials(partialsTemplatesDirectory);

 app.set('view engine','hbs');
 app.set('views',viewsTemplatesDirectory);
 app.use(express.static(publicDirectoryPath));
 app.use(user)
 
 module.exports = app
