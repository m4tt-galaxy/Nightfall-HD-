const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");

const app = express();
app.use(express.static("public"));
app.get("/health", (_, res) => res.json({ok:true, game:"Nightfall Escape"}));
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const players = new Map();
const rooms = new Map();

function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}
function roomPlayers(room) {
  return [...players.values()].filter(p => p.room === room);
}
function broadcast(room, data, except=null) {
  for (const p of roomPlayers(room)) if (p.ws !== except) send(p.ws, data);
}
wss.on("connection", ws => {
  const id = crypto.randomUUID().slice(0,8);
  const p = {id, ws, room:"PUBLIC", name:"Runner", x:0, y:0, z:0, yaw:0, hp:100, down:false, last:Date.now()};
  players.set(id,p);
  send(ws,{type:"welcome",id,room:p.room,players:roomPlayers(p.room).filter(q=>q.id!==id).map(({id,name,x,y,z,yaw,hp,down})=>({id,name,x,y,z,yaw,hp,down}))});
  broadcast(p.room,{type:"join",player:{id,name:p.name,x:0,y:0,z:0,yaw:0,hp:100,down:false}},ws);

  ws.on("message", raw => {
    let m; try { m=JSON.parse(raw.toString()); } catch { return; }
    if (m.type==="joinRoom") {
      const room=String(m.room||"PUBLIC").toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,12)||"PUBLIC";
      broadcast(p.room,{type:"leave",id:p.id},ws);
      p.room=room;
      p.name=String(m.name||"Runner").replace(/[<>]/g,"").slice(0,16)||"Runner";
      send(ws,{type:"roomJoined",room,players:roomPlayers(room).filter(q=>q.id!==id).map(({id,name,x,y,z,yaw,hp,down})=>({id,name,x,y,z,yaw,hp,down}))});
      broadcast(room,{type:"join",player:{id:p.id,name:p.name,x:p.x,y:p.y,z:p.z,yaw:p.yaw,hp:p.hp,down:p.down}},ws);
    } else if (m.type==="state") {
      const n=v=>Number.isFinite(Number(v))?Number(v):0;
      p.x=Math.max(-90,Math.min(90,n(m.x))); p.y=Math.max(0,Math.min(8,n(m.y))); p.z=Math.max(-150,Math.min(30,n(m.z)));
      p.yaw=n(m.yaw); p.hp=Math.max(0,Math.min(100,n(m.hp))); p.down=!!m.down; p.last=Date.now();
      broadcast(p.room,{type:"state",player:{id:p.id,name:p.name,x:p.x,y:p.y,z:p.z,yaw:p.yaw,hp:p.hp,down:p.down}},ws);
    } else if (m.type==="revive") {
      const target=players.get(String(m.id));
      if (target && target.room===p.room) { target.hp=60; target.down=false; send(target.ws,{type:"revived",hp:60}); broadcast(p.room,{type:"state",player:{id:target.id,name:target.name,x:target.x,y:target.y,z:target.z,yaw:target.yaw,hp:60,down:false}}); }
    } else if (m.type==="ping") send(ws,{type:"pong",at:m.at});
  });
  ws.on("close",()=>{players.delete(id);broadcast(p.room,{type:"leave",id});});
});
const PORT=process.env.PORT||3000;
server.listen(PORT,()=>console.log(`Nightfall Escape running on ${PORT}`));
