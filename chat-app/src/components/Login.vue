<template>
  <div id="login">
  <div class="container center-align">
      <div class="row">
        <div class="col s12 m6 offset-m3">
          <div class="card grey-card">
            <div class="card-content white-text">
              <span class="card-title">Login</span>
              <span class="feedback" v-if="!valid">Invalid Credentials!</span>
              <div class="row">
                <div class="input-field col s12">
                  <input 	@keydown.enter="login" id="username" v-model="username" type="text" class="validate">
                  <label for="username">username</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <input 	@keydown.enter="login" id="password" v-model="password" type="password" class="validate">
                  <label for="password">password</label>
                </div>
              </div>
              <div class="row">
                 <router-link to="/" class="nav-link btn-home btn waves-effect waves-light">
                  <i class="fa fa-home fa-2x"></i>    
                </router-link>
                 <button v-on:click="login"  class="btn btn-main waves-effect waves-light" type="submit" name="action">Login</button>
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
    login: function() {
      if (this.username === '' || this.password === '') {
        this.valid = false;
      } else {
        const data = {
          username: this.username,
          password: this.password
        };
        axios
          .post('http://localhost:5000/api/userCreds', { data })
          .then(res => {
            if (res.data.found) {
              // user exists
              this.$router.push({
                name: 'ChatRoom',
                params: { userId: res.data.data.userId }
              });
            } else {
              this.valid = false;
            }
          });
      }
    }
  }
};
</script>
