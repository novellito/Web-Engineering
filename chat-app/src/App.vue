<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.css';
export default {
  name: 'App'
};
</script>

<style>
body {
  background-color: #000;
}
.grey-card {
  background-color: #1b1b1b;
}
input {
  color: white;
}
.btn-main {
  background-color: #41b883;
}
.feedback {
  color: #f90;
}
.btn-home {
  background-color: #2f2f2f;
}
/* override input focus */
input[type='text']:not(.browser-default):focus:not([readonly]),
input[type='password']:not(.browser-default):focus:not([readonly]),
input[type='text'].valid:not(.browser-default),
input[type='text'].valid:not(.browser-default):focus,
input[type='password'].valid:not(.browser-default),
input[type='password'].valid:not(.browser-default):focus {
  border-bottom: 1px solid #f90 !important;
  box-shadow: 0 1px 0 0#f90;
}

input[type='text']:focus:not(.browser-default):focus + label,
input[type='password']:focus:not(.browser-default):focus + label {
  color: #f90;
}
#app {
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
