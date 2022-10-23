import server from "./server";
import institutions from './routes/institutions';
import links from './routes/links';
import testDBRoute from './routes/testDb';
 
 
server.use("/institutions", institutions);
server.use("/links", links);
server.use("/testDB", testDBRoute);

server.listen(3001);