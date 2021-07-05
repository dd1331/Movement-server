import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
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
    this.server.to(this.getRoomId(payload)).emit('message', 'ddd');
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: any, payload: any) {
    const roomId = this.getRoomId(payload);
    client.join(roomId);
  }
  @SubscribeMessage('leaveRoom')
  leaveRoom(client: any, payload: any) {
    client.leave(payload.roomId);
  }

  getRoomId(payload) {
    return '1';
  }
}
