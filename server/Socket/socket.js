const socket = async (server)=>{
const     io = require('socket.io')(server, {
        cors: {
          origin: '*',
        }
      });
    io.on("connection",(socket)=>{
      console.log(`${socket.id} joined.`);
        socket.on('SendData',(uid)=>{
            if(uid){
              io.emit(uid,Math.random());
            }
        });
        socket.on('newupload',()=>{
            io.emit('newupload',Math.random());
      });
      socket.on('disconnect',()=>{
        console.log(`${socket.id} left.`)
      });
    });
}
module.exports = socket;