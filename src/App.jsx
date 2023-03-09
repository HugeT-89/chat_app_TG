import { Component } from "react";
import { randomColor, randomName } from "./Helpers/Utility";
import Messages from "./Components/Messages";
import './App.css';
import Input from "./Components/Input"
import { Header } from "./Components/Header";

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor()
    }
  }
  
    constructor() {
      super();
      this.drone = new window.Scaledrone("YaWv0lRgntPUIOuL", {
        data: this.state.member
      });
    }

    componentDidMount(){
      this.drone.on('open', error => {
        if (error) {
          return console.error(error);
        }
        const member = {...this.state.member};
        member.id = this.drone.clientId;
        this.setState({member});
      });

      const room = this.drone.subscribe("observable-room");

      room.on('data', (data, member) => {
        const messages = this.state.messages;
        messages.push({member, text: data});
        this.setState({messages});
      });
    }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

  render() {
    return(
      <div className="App">
      <Header/>
      <Messages
        messages={this.state.messages}
        currentMember={this.state.member}
      />
      <Input
        onSendMessage={this.onSendMessage}
      />
    </div>
    )
  }
}

export default App;