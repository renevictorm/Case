const port = 8000

const bodyParser = require('body-parser')
const express= require ('express')
const server = express()


server.use(bodyParser.urlencoded({extended:true})) // usando o bodyparser para aceitar requisições urlencodede e json 
server.use(bodyParser.json())

server.listen(port, function(){
    console.log(`Backend rodando na porta ${port}.`);
    
})  

module.exports = server