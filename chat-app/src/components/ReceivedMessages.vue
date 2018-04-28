<template>
  <div id="received-messages">
    <ul>
      <li v-for="currMsg in receivedMessages" :key="currMsg._id">
        <span style="color:#f90;">From {{currMsg.from}}: </span>
        <span>{{currMsg.content}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'SentMessages',
  props: ['receivedMessages']
};
</script>
