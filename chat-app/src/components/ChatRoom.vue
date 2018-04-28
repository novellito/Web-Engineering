<template>
  <div id="chat">
    <router-link to="/" class="nav-link btn-home btn waves-effect waves-light">
      <i class="fa fa-home fa-2x"></i>
    </router-link>
    <div class="row">
      <div class="col s12 m3">
        <div class="card chat-log grey-card">
          <div class="card-content white-text">
            <span class="card-title">Chat Log</span>
            <div class="switch">
              <label>
                Sent
                <input v-model="msgToggle" type="checkbox">
                <span class="lever"></span>
                Received
              </label>
            </div>
            <div class="logs">
              <SentMessages v-if="chatRoomLoaded && !msgToggle" :sentMessages="sentMessages"></SentMessages>
              <ReceivedMessages v-if="chatRoomLoaded && msgToggle" :receivedMessages="receivedMessages"></ReceivedMessages>
            </div>
          </div>
        </div>
      </div>
      <div class="col s12 m6">
        <div class="card grey-card">
          <div class="card-content curr-chat white-text">
            <span class="card-title">Current Chat</span>
            <p class="feedback" v-if="!valid">
              Please enter a message & select a recepient!
            </p>
            <ul class="current-chat">
              <li v-for="currMsg in currChat" :key="currMsg.id">
                <span style="color:#f90;">{{currMsg.prefix}}</span>
                <span> {{currMsg.msg}}</span>
              </li>
            </ul>
          </div>
          <div class="card-action">
            <div class="input-field">
              <label for="message">message</label>
              <input id="message" @keyup.enter="sendMessage" type="text" v-model="message" class="msg">
            </div>
            <button v-on:click="sendMessage" class="btn btn-main waves-effect waves-light" type="submit" name="action">Send</button>
          </div>
        </div>
      </div>
      <div v-if="chatRoomLoaded" class="col s12 m3">
        <div class="card grey-card">
          <div class="card-content white-text">
            <span class="card-title">Send To</span>
            <ul>
              <li v-for="recepient in recepients" :key="recepient.userId">
                <label>
                  <input @keyup.enter="sendMessage" v-model="currRec" v-bind:value="recepient.userId +' '+recepient.username" name="currRec"
                    type="radio" />
                  <span>{{recepient.username}} </span>
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import SentMessages from '@/components/SentMessages';
import ReceivedMessages from '@/components/ReceivedMessages';
export default {
  data() {
    return {
      valid: true, // verify recepient and messages are both non-empty
      chatRoomLoaded: false, // Ensure chat log is mounted after data is fetched
      message: '', // current message in input field
      currUser: '', // current user
      currRec: '', // current recepient selected
      msgToggle: '', // toggles view for sent/received messages
      currChat: [], // current chat room messages
      recepients: [], // list of recepients
      sentMessages: [],
      receivedMessages: []
    };
  },
  components: {
    SentMessages,
    ReceivedMessages
  },
  beforeMount: function() {
    axios
      .get(`http://localhost:5000/api/user/${this.$route.params.userId}`)
      .then(res => {
        if (res.data.found) {
          this.chatRoomLoaded = true;
          this.currUser = res.data.data.username;
          this.sentMessages = res.data.data.sentMessages;
          this.receivedMessages = res.data.data.receivedMessages;

          this.$socket.emit('storeClient', {
            clientId: this.$route.params.userId
          });

          axios // load the recepients
            .get(
              `http://localhost:5000/api/userRecepients/${
                this.$route.params.userId
              }`
            )
            .then(res => {
              this.recepients = res.data.users;
            });
        } else {
          // User is not found -- redirect them to register page
          this.$router.push({
            name: 'Register'
          });
        }
      });
  },
  methods: {
    // This method handles what happends when a message is sent
    sendMessage: function() {
      if (this.message === '' || this.currRec === '') {
        this.valid = false;
      } else {
        // format recepient
        const to = this.currRec.match(/[^ ]*$/)[0];

        // Add message to the current chat log
        this.currChat.push({
          prefix: `To ${to}:`,
          msg: `${this.message}`,
          id: Math.random()
        });
        this.sentMessages.push({
          to,
          content: this.message
        });

        // Add the current message to the message schema
        axios
          .post(`http://localhost:5000/api/message`, {
            msg: this.message,
            from: this.currUser,
            sending: true,
            to
          })
          .then(res => {
            this.$socket.emit('message', {
              to: this.currRec.substr(0, this.currRec.indexOf(' ')),
              from: this.currUser,
              msg: res.data.data.content,
              msgId: res.data.data._id
            });

            // update the current users schema with the message
            axios
              .put(
                `http://localhost:5000/api/user/${this.$route.params.userId}`,
                {
                  msg: res.data.data._id,
                  sending: true
                }
              )
              .then(res => {
                console.log(res);
              });
          });

        // reset vars
        this.valid = true;
        this.message = '';
      }
    }
  },
  sockets: {
    // emitted when a user sends a message to another user that is online
    sendMessage: function(data) {
      this.currChat.push({
        prefix: `From ${data.from}:`,
        msg: `${data.msg}`,
        id: Math.random()
      });
      this.receivedMessages.push({
        from: data.from,
        content: data.msg
      });
      axios
        .put(`http://localhost:5000/api/user/${this.$route.params.userId}`, {
          msg: data.msgId,
          receiving: true
        })
        .then(res => {
          console.log(res);
        });
    },
    // update the users received messages even if theyre offline
    updateOfflineUser: function(data) {
      axios
        .put(`http://localhost:5000/api/user/${data.to}`, {
          msg: data.msgId,
          receiving: true
        })
        .then(res => {
          console.log('offline user updated!');
        });
    }
  }
};
</script>
<style scoped>
.card-action {
  border: none;
}

.current-chat,
.logs {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
}

.card-content.curr-chat {
  height: 475px;
  overflow: auto;
  overflow-x: hidden;
}

.chat-log {
  height: 600px;
  overflow: auto;
  overflow-x: hidden;
}
</style>
