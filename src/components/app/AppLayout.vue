<template>
  <div class="app-layout">
    <div class="container-fluid">
      <div class="row no-gutter">
        <div class="d-block d-sm-none col-12">
          <div>
            <b-navbar type="light" variant="light" toggleable>
              <b-navbar-toggle target="nav_dropdown_collapse"></b-navbar-toggle>
                <b-collapse is-nav id="nav_dropdown_collapse">
                  <b-navbar-nav>
                    <b-nav-item><router-link to='/dashboard'>Home</router-link></b-nav-item>
                    <b-nav-item><router-link to='/user'>User's profile</router-link></b-nav-item>
                    <b-nav-item><router-link to='/statistics'>Statistics</router-link></b-nav-item>
                    <b-nav-item><router-link to='/calendar'>Calendar</router-link></b-nav-item>
                    <b-nav-item><router-link to='/wall'>My wall</router-link></b-nav-item>
                    <!-- Navbar dropdowns -->
                    <!-- <b-nav-item-dropdown text="My account" right>
                      <b-dropdown-item href="#">Account</b-dropdown-item>
                      <b-dropdown-item href="#">Settings</b-dropdown-item>
                    </b-nav-item-dropdown> -->
                  </b-navbar-nav>
                </b-collapse>
              </b-navbar>
            </div>
        </div>
      </div>
      <div class="row no-gutter">
        <div class="d-none d-sm-block col-sm-2">
          <div class="side-bar">
                <ul>
                    <li class="menu-head2">
                         Thingy Sport<br><hr>
                    </li>
                    <div class="menu">
                        <li>
                            <i class="fab fa-vuejs"></i>
                            <router-link to="/dashboard">Dashboard</router-link>
                        </li>
                        <li>
                            <router-link to="/user">User's profile </router-link>
                        </li>
                        <li>
                            <router-link to="/statistics" class="active">Statistics</router-link>
                        </li>
                        <li>
                            <router-link to="/calendar">Calendar</router-link>
                        </li>
                        <li>
                            <router-link to="/wall">My wall</router-link>
                        </li>
                        <li>
                            <button v-on:click="logout">Logout</button>
                        </li>
                    </div>
                </ul>
            </div>
        <!-- End of Sidebar -->
        </div>
        <div class="col-sm-10">
          <router-view></router-view>
        </div>

      </div>
      <!-- End of a row -->
      <div class="row">
        <div class="offset-sm-2 d-sm-block col-sm-10">
          <footer class="page-footer font-small blue">

            <div class="footer-copyright text-center py-3">Julien Clément, Johan Jobin, Thomas Schaller , Romain Maillard
              <a href="https://github.com/aseteamblue"> Our Github</a>
            </div>
          </footer>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AppLayout',

  methods: {
    logout: function () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/auth/login'))
    },
  }
}
</script>

<style lang="scss">

#navTop{
  width: 100%;
}

/*Remove the space between Boostrap Columns*/
.no-gutter > [class*='col-'] {
    padding-right:0;
    padding-left:0px;
}

hr {
  border: 0;
  clear:both;
  display:block;
  margin-left: 50px;
  margin-right: 50px;
  background-color:#e1e1e3;
  height: 1px;
}

.side-bar
{

    // background:#white;
    min-height: 100vh;
    width: 100%;
    height:100vh;
    color:#black;
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
}
.side-bar::after {
  content: "";
  background: url(./../../pictures/sidebar-1.jpg);
  opacity: 0.1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}

.menu a{
  color:grey;
  font-family: arial;
}
.menu-head2 {
    text-transform: uppercase;
    padding: 5px 0px;
    font-size: 30px;
    color: #3C4858;
    white-space:normal;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
}

.side-bar ul
{
    list-style:none;
    padding:0px;
    text-align: center;

}
.side-bar ul li.menu-head
{
    font-family: 'Lato', sans-serif;
    padding:20px;

}

.side-bar ul .menu li  a
{
    display:inline-table;
    padding-top:20px;
    padding-bottom:20px;
}

.side-bar ul .menu li  a:hover
{

    background-color: #fafbfd;
    width: 90%;
    border-radius: 5px;
    text-decoration: none;
    color:grey;

}

.side-bar ul .menu li  a.active
{
  color:white;
  background-color: #9c27b0;
  border-radius: 5px;
  width: 90%;
  box-shadow: 0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px rgba(156, 39, 176, 0.4);
}

</style>
