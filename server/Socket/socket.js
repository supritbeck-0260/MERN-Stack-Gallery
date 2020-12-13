const socket = async (server)=>{
const     io = require('socket.io')(server, {
        cors: {
          origin: '*',
        }
      });
    io.on("connection",(socket)=>{
        console.log('Socket connection is made...');
        
        socket.on('online',(uid)=>{
            console.log(uid);
        });
        io.on('disconnect',()=>{
            console.log('user left');
        });
    });
}
module.exports = socket;