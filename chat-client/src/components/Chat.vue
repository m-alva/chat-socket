<template>
  <div class="chat-room">
    <div class="chat-conector" v-if="!connected">
      <input
        class="chat-conector__input"
        type="text"
        v-model="username"
        placeholder="Nombre de usuario"
      />
      <button class="chat-conector__button" @click="addUser">Add user</button>
    </div>
    <div class="chat-space" v-if="connected">
      <div class="chat-space__connected-label">
        Conectado como <span>{{ username }}</span>
      </div>
      <div class="chat-space__container">
        <div class="user-list-panel">
          <span
            class="user-list-panel__name"
            v-for="(user, index) in listUser"
            :key="index"
          >
            {{ user.username }}
          </span>
        </div>
        <div class="message-list-panel">
          <div
            class="message-item"
            v-for="(msg, index) in messages"
            :key="index"
          >
            <div class="message-item__user">{{ msg.username }}</div>
            <div class="message-item__message">
              {{ msg.message }}
            </div>
          </div>
        </div>
        <div class="message-input">
          <div class="message-input__typing">
            <span v-for="(user, index) in userTyping" :key="index"
              >{{ user }} está escribiendo...</span
            >
          </div>
          <input
            class="message-input__input"
            v-model="chatInput"
            @keyup="userWriting"
          />
          <button class="message-input__button" @click="sendMessage">
            Enviar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  data() {
    return {
      username: '',
      connected: false,
      listUser: [],
      messages: [],
      chatInput: '',
      userTyping: [],
      writingOff: undefined
    };
  },
  methods: {
    addUser() {
      this.$socket.emit('add user', this.username);
    },
    sendMessage() {
      this.$socket.emit('newMessage', this.chatInput);
    },
    userWriting() {
      console.log('Writing');
      this.$socket.emit('typing', this.username);
      if (this.writingOff) {
        clearTimeout(this.writingOff);
      }
      this.writingOff = setTimeout(() => {
        this.writingOff = undefined;
        this.$socket.emit('stopTyping', this.username);
      }, 1200);
    }
  },
  sockets: {
    login(data) {
      this.connected = data;
    },
    userJoined(data) {
      this.listUser = data.listUsers;
    },
    newMessage(message) {
      this.messages.push(message);
    },
    typing(data) {
      const index = this.userTyping.findIndex(user => user === data.username);
      if (index === -1) {
        this.userTyping.push(data.username);
      }
    },
    stopTyping(data) {
      const index = this.userTyping.findIndex(user => user === data.username);
      this.userTyping.splice(index, 1);
    }
  }
};
</script>

<style scoped lang="scss">
.chat-room {
  .chat-conector {
    width: 100%;
    height: 4rem;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    &__input {
      flex-grow: 1;
      height: 100%;
      border: 0;
      margin: 0;
      padding: 0.6rem 1.4rem;
      &:focus {
        outline: none;
      }
    }
    &__button {
      display: block;
      appearance: none;
      border: none;
      height: 100%;
      margin: 0;
      padding: 0.6rem 1rem;
      color: white;
      background: lightsteelblue;
      cursor: pointer;
      transition: 0.45s background;
      &:hover {
        background: blueviolet;
      }
    }
  }
  .chat-space {
    &__connected-label {
      padding: 0.5rem 1.2rem;
      span {
        color: green;
      }
    }
    &__container {
      display: grid;
      margin: 0.6rem 0;
      grid-template-columns: 1fr 3fr;
      grid-template-rows: 60vh 4rem;
      .user-list-panel {
        grid-area: 1 / 1 / 1 / 2;
        padding: 1rem 0.6rem;
        background: #ddd;
        &__name {
          display: inline-block;
          padding: 0.3rem 0.5rem;
          margin: 0.2rem;
          background: lightgreen;
          border-radius: 4rem;
          width: 100%;
        }
      }
      .message-list-panel {
        grid-area: 1 / 2 / 1 / 3;
        .message-item {
          display: block;
          max-width: 80%;
          border-radius: 0.6rem;
          padding: 0.3rem 0.6rem;
          margin: 1rem;
          text-align: left;
          font-size: 0.8rem;
          &__user {
            font-size: 0.65rem;
            text-align: right;
          }
          &__message {
            font-size: 0.65rem;
            text-align: left;
          }
          background: lightgray;
          margin-left: auto;
          &:nth-child(odd) {
            margin-left: 1rem;
            background: yellow;
            &__user {
              font-size: 0.65rem;
              text-align: left;
            }
          }
        }
      }
      .message-input {
        grid-area: 2 / 1 / 2 / 3;
        width: 100%;
        height: 4rem;
        box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        left: 2rem;
        &__typing {
          font-size: 0.7rem;
        }
        &__input {
          flex-grow: 1;
          height: 100%;
          border: 0;
          margin: 0;
          padding: 0.6rem 1.4rem;
          &:focus {
            outline: none;
          }
        }
        &__button {
          display: block;
          appearance: none;
          border: none;
          height: 100%;
          margin: 0;
          padding: 0.6rem 1rem;
          color: white;
          background: greenyellow;
          cursor: pointer;
          transition: 0.45s background;
          &:hover {
            background: blueviolet;
          }
        }
      }
    }
  }
}
</style>
