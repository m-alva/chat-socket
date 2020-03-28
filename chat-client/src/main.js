import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'http://127.0.0.1:3001',
  }),
);

new Vue({
  render: h => h(App),
}).$mount('#app');
