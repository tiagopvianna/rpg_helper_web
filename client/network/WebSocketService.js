import io from "socket.io-client";

export default class WebSocketService {
  constructor(url) {
    this.socket = io(url);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }
}
