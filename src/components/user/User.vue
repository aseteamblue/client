<template>
  <div class="user">
    <h1>User</h1>
    <p>Username: {{ username }}</p>
    <p>Thingy: {{ thingyName }}</p>
  </div>
</template>

<script>

export default {
  name: 'user',
  data: function () {
    return {
      username: this.$store.state.auth.user.username,
      thingyName: this.$store.state.auth.user.thingyUri
    }
  },
  methods: {

  }
}

</script>
<style lang="scss" scoped>
</style>
