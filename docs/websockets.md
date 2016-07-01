# Weboskets

    NOTE: not yet implemented
    
```js
import DataSource from 'bivrost/data/source';
import websocketApi from 'bivrost-websocket-api';

import websocketAdapter from 'bivrost-websocket-adapter';

// import socketIoAdapter from 'bivrost-socketio-adapter';
// import signalRAdapter from 'bivrost-signalr-adapter';

const websocket = websocketApi({
  host: 'example.com',
  adapter: websocketAdapter()
})

class SocketDataSource extends DataSource {
  preapre = {
    message: data => ({
      ...data,
      time: Date.now()
    });
  };
  
  api = {
    messages: websocket('/chat/message')
  }
  
  process = {
    message: message => sanitize(message)
  } 
  
  
  messages() {
    return this.invoke('message');
  }
}
```

```js
const socketDataSource = new SocketDataSource();
const messagesSocket = socketDataSource.messages();

messagesSocket.receive(processedMessage => {
  // ...
});

messagesSocket.send({
  // ...
});
```
