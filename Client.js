import WebSocket from 'ws';
import inquirer from 'inquirer';

export default function connectClientToServer(){

  const socket = new WebSocket('ws://localhost:8080');
  
  socket.on('open', async() => {

    console.log('Connected to server.');

    while (socket.CLOSED !== 3){
      const {message} = await inquirer.prompt([{type:'input', name:'message', message:'message to server'}])
      socket.send(message)
    }
  });
  
  socket.on('message', (message) => {
    console.log(message.toString());
  });
  
  socket.on('error', ()=> console.log('Ann error occurred'))
  
  socket.on('close', () => {
    console.log('Disconnected from server.');
  });
}
