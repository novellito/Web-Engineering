<template>
  <div id="received-messages">
    <ul>
      <li v-for="currMsg in receivedMessages" :key="currMsg._id">
        <p>From {{currMsg.from}} : {{currMsg.content}}</p>
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
