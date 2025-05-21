import { WebSocketServer } from 'ws';
import { Command } from 'commander';
import connectClientToServer from './Client.js';

const broadCastServer  = new Command();

function startServer(){
  
  const wss = new WebSocketServer({ port: 8080 });
  const history = [];

  console.log('Sever is running on port 8080')

  wss.on('connection', function connection(socket) {
  
    socket.on('error',()=> console.log('an error occurred'));
  
    socket.on('message', function message(data) {
  
      history.push(data);
  
      wss.clients.forEach((clientSocket)=>{
        if(clientSocket !== socket && clientSocket.readyState === 1){
          clientSocket.send(data);
        }
      })
    });
    
    socket.on('close', (code, reason)=>{
      console.log(`Client disconnected. Code : ${code} \n Reason: ${reason}`);
    })
    
    sendMessageHistory(socket, history);
    
  });
}  

function sendMessageHistory(socket, history){
  
  history.forEach((message)=>{
    socket.send(message);
  })
  
}

broadCastServer.name('Broadcast Server')
  .version('0.0.1')
  .description('This is a simple broadcast server. \nWhen a client connects and sends a message, the server will broadcast this message to all connected clients.')
  .command('broadcast-server')
  .argument('[start]', ' This command will connect the client to the server.')
  .argument('[connect]', 'This command will start the server.')
  .action((option)=>{
    
    switch(option){
      case 'start':
        startServer();
        break;
      case 'connect':
        connectClientToServer();
        break;
      default:
        broadCastServer.help();
        break;
      }
  });

broadCastServer.parse();  