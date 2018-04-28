<template>
  <div id="sent-messages">
    <ul>
      <li v-for="currMsg in sentMessages" :key="currMsg._id">
        <span style="color:#f90;">To {{currMsg.to}}:</span>
        <span>{{currMsg.content}}</span>
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
