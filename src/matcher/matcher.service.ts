import { Injectable } from '@nestjs/common';

@Injectable()
export class MatcherService {
  getRoomId(payload) {
    console.log(payload);
    return '';
  }
  setRoomId(payload) {
    console.log(payload);
    return '';
  }
}
