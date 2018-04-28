<template>
  <div id="sent-messages">
    <ul>
      <li v-for="currMsg in sentMessages" :key="currMsg._id">
        <p>To {{currMsg.to}} {{currMsg.content}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'SentMessages',
  props: ['sentMessages']
};
</script>
