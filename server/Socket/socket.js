const socket = async (server)=>{
const     io = require('socket.io')(server, {
        cors: {
          origin: '*',
        }
      });
    io.on("connection",(socket)=>{
        console.log('Socket connection is made...');
        socket.on('SendData',(uid)=>{
            if(uid){
              io.emit(uid,Math.random());
            }
        });
        socket.on('newupload',(data)=>{
          console.log(data);
            io.emit('newupload',Math.random());
      });
    });
    io.on('disconnect',()=>{
      console.log('user left');
  });
}
module.exports = socket;