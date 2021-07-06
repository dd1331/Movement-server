import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatcherService } from './matcher.service';

@WebSocketGateway()
export class MatcherGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly matcherService: MatcherService) {}
  afterInit(server: any) {
    console.log('init');
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('connected');
  }
  handleDisconnect(client: any) {
    console.log('disconnected');
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('match')
  handleMessage(client: any, payload: any) {
    this.server.to(payload.roomId).emit('message', payload.message);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(client: any, payload: any) {
    const { topic } = payload;
    const room = await this.matcherService.getRoomOrCreate(topic);
    client.join(room.id.toString());
    client.emit('join', room);
  }
  @SubscribeMessage('leaveRoom')
  leaveRoom(client: any, payload: any) {
    client.leave(payload.roomId);
  }
}
