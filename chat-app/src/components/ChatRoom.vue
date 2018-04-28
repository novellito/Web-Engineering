<template>
  <div id="chat">
    <router-link to="/" class="nav-link">Home</router-link>
      <div class="row">
        <div class="col s3">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">Chat Log</span>
              <SentMessages v-if="chatRoomLoaded && !msgToggle" :sentMessages="sentMessages"></SentMessages>
              <ReceivedMessages v-if="chatRoomLoaded && msgToggle" :receivedMessages="receivedMessages"></ReceivedMessages>
            </div>
            <div class="switch">
              <label>
                Sent
                <input v-model="msgToggle" type="checkbox">
                <span class="lever"></span>
                Received
              </label>
            </div>
          </div>
        </div>
        <div class="col s6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">Chat Room</span>
              <p v-if="!valid">
                Please Enter a message & select a recepient!
              </p>
              <ul>
                <li v-for="currMsg in currChat" :key="currMsg.id">
                  <p> {{currMsg.msg}}</p>
                </li>
              </ul>
            </div>
            <div class="card-action">
              <input id="message" @keyup.enter="sendMessage" type="text" v-model="message" class="msg">
              <button v-on:click="sendMessage" class="btn waves-effect waves-light" type="submit" name="action">Send</button>
            </div>
          </div>
        </div>
        <div v-if="chatRoomLoaded" class="col s3">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">Send To</span>
              <ul>
                <li v-for="recepient in recepients" :key="recepient.userId">
                  <label>
                    <input v-model="currRec" v-bind:value="recepient.userId +' '+recepient.username" name="currRec" type="radio" />
                    <span ref="toUser">{{recepient.username}} </span>
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
        const to = this.currRec.substr(
          this.currRec.indexOf(' '),
          this.currRec.length
        );

        // Add message to the current chat log
        this.currChat.push({
          msg: `To ${to}: ${this.message}`,
          id: Math.random()
        });

        this.sentMessages.push({ to, content: this.message });

        // Add the current message to the message schema
        axios
          .post(`http://localhost:5000/api/message`, {
            msg: this.message,
            from: this.currUser,
            to,
            sending: true
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
    sendMessage: function(data) {
      this.currChat.push({
        msg: `From ${data.from}: ${data.msg}`,
        id: Math.random()
      });
      axios
        .put(`http://localhost:5000/api/user/${this.$route.params.userId}`, {
          msg: data.msgId,
          receiving: true
        })
        .then(res => {
          console.log(res);
        });
    }
  }
};
</script>
