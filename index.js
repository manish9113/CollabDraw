import express from 'express';
import cors from 'cors';

import { createServer } from 'http';
import { Server } from 'socket.io';

const app=express();
app.use(cors());
app.use(express.json());


app.use(express.static("public"));

const httpServer=createServer(app);
const io=new Server(httpServer);


const PORT=process.env.PORT||8000;


let connections=[];

io.on('connection',(socket)=>{
    connections.push(socket);
    console.log('A user Connected ',socket.id);

    socket.on('draw',(data)=>{
        connections.forEach((con)=>{
            if(con.id!=socket.id){
                con.emit("ondraw",{x:data.x,y:data.y});
            }
        })
    })
    socket.on('down', (data) => {
        connections.forEach((con) => {
            if (con.id != socket.id) {
                con.emit("ondown", { x:data.x, y:data.y });
            }
        })
    })


    socket.on('disconnect',(reason)=>{
        console.log('A user Disconnected',socket.id);
       connections=connections.filter((con)=> con.id!=socket.id);
    })
})


httpServer.listen(PORT,()=>{
    console.log(`app listening at port ${PORT}`)
})