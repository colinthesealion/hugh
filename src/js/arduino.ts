interface Options {
  server: string;
  port: number;
  endpoint: string;
  debug?: boolean;
}
export default class Arduino {
  private arduino: WebSocket;
  private isConnected: boolean = false;
  
  constructor({ server, port, endpoint, debug }: Options) {
    if (!('WebSocket' in window)) {
      throw new Error('WebSockets not supported by this browser');
    }

    const address = `ws://${server}:${port}/${endpoint}`;
    this.arduino = new WebSocket(address);

    this.arduino.onopen = () => {
      console.log(`Connected to ${address}`);
      this.isConnected = true;
    };
    this.arduino.onerror = (error) => {
      console.error('Arduino connection error', error);
      this.isConnected = false;
    };  
    if (debug) {
      this.arduino.onmessage = (event) => {
        console.log('Server: ' + event.data);
      };
    }
  }

  public isAvailable(): boolean {
    return this.isConnected;
  }

  public sendData(data: any): boolean {
    if (this.isConnected) {
      this.arduino.send(JSON.stringify(data));
    }
    return this.isConnected;
  }
}
