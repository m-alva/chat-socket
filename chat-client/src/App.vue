<template>
  <div id="app">
    <Chat />
  </div>
</template>

<script>
import Chat from './components/Chat.vue';

export default {
  name: 'App',
  components: {
    Chat
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
