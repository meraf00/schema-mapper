import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'ws';

@WebSocketGateway(8080)
export class GeneratorGateway {
  @WebSocketServer() server: Server;

  private clients: Set<any> = new Set();

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
    this.clients.add(client);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client);
  }

  sendToAll(message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (let c of this.clients) {
      c.send(broadCastMessage);
    }
  }
}
