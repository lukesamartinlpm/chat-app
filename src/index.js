const app = require('./app')
const port = process.env.PORT
const server = require('./io')
server.listen(port,()=>{
    console.log(`Server is running ${port}`)
})

