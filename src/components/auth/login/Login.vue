<template>
  <div class="login">
    <h2>Login</h2>
    <form method="post" action="/auth/login" name="login">
      <div class="form-group">
        <div class="input-group">
          <input type="text" id="email" required="required"/>
          <label class="control-label" for="email">Email</label><i class="bar"></i>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <input type="password" id="password" required="required"/>
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
  name: 'login'
}
</script>

<style lang="scss">

</style>
