<template>
  <div class="login">
    <h2>Login</h2>
    <form method="post" @submit.prevent="login">
      <div class="form-group">
        <div class="input-group">
          <input type="text" id="username" v-model="username" required="required"/>
          <label class="control-label" for="username">Username</label><i class="bar"></i>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <input type="password" v-model="password" id="password" required="required"/>
          <label class="control-label" for="password">Password</label><i class="bar"></i>
        </div>
      </div>
      <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between down-container">
        <button class="btn btn-primary" type="submit">
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      username: 'test',
      password: 'emf123',
    }
  },
  methods: {
    login: function () {
      let username = this.username
      let password = this.password
      this.$store.dispatch('login', { username, password })
        .then(() => this.$router.push('/'))
    },
  },
}
</script>

<style lang="scss">

</style>
