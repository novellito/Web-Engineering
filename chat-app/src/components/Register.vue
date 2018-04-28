<template>
  <div id="register">
    <router-link to="/" class="nav-link">Home</router-link>
    <div class="container center-align">

      <div class="row">
        <div class="col s12 m6 offset-m3">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title">Register</span>
              <span v-if="!valid">Please fill in all fields</span>
              <div class="row">
                <div class="input-field col s12">
                  <input @keydown.enter="register" id="username" v-model="username" type="text" class="validate">
                  <label for="username">username</label>
                </div>
              </div>

              <div class="row">
                <div class="input-field col s12">
                  <input @keydown.enter="register" id="password" v-model="password" type="password" class="validate">
                  <label for="password">password</label>
                </div>
                 <button v-on:click="register"  class="btn waves-effect waves-light" type="submit" name="action">Send
              </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      username: '',
      password: '',
      valid: true
    };
  },
  methods: {
    register: function() {
      if (this.username === '' || this.password === '') {
        this.valid = false;
      } else {
        const data = {
          username: this.username,
          password: this.password,
          userId: Date.now()
        };
        console.log(data);
        axios.post('http://localhost:5000/api/user', { data }).then(res => {
          console.log(res);
          this.$router.push({
            name: 'ChatRoom',
            params: { userId: res.data.data.userId }
          });
        });
      }
    }
  }
};
</script>
