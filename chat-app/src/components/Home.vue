<template>
  <div id="home">
    <div class="row">
      <div class="col s12 m6 offset-m3">
        <div class="card grey-card">
          <div class="card-content white-text">
            <span class="card-title">
              <img src="../assets/vueChat.png" alt="A Vuetiful Chat App" width="50%">
            </span>
            <div class="row home-btns">
              <router-link to="/login" class="nav-link btn-main btn waves-effect waves-light">Login</router-link>
              <router-link to="/register" class="nav-link btn-home btn waves-effect waves-light">Register</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home'
};
</script>
