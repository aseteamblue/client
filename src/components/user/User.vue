<template>
  <div class="user">
    <h1>User</h1>
    <p>Username: {{ username }}</p>
    <p>Thingy: {{ thingyName }}</p>
    <h2>Sessions</h2>
    <div v-for="s in sessions" :key="s._id">
      <p>Id: {{ s.id }}</p>
      <p>Start: {{ s.dateStart }}</p>
      <p>End: {{ s.dateEnd }}</p>
      <p>Active: {{ s.active }}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'user',
  data: function () {
    return {
      username: this.$store.state.auth.user.username,
      thingyName: this.$store.state.auth.user.thingyUri,
      sessions: this.$store.state.user.sessions
    }
  },
  created: function () {
    this.$store.dispatch('getUserSession')
  },
  methods: {

  }
}

</script>
<style lang="scss" scoped>
</style>
