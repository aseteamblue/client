<template>
  <div class="app-layout" v-bind:class="{ collapsed: isCollapsed }">
<ion-icon name="add"></ion-icon>
    <sidebar-menu width="200px" :menu="menu" @collapse="onCollapse" />
    <router-view></router-view>
      <!-- End of a row -->
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  data () {
    return {
      isCollapsed: false,
      menu: [
        {
          header: true,
          title: 'Thingy Sport',
        },
        {
          href: '/',
          title: 'Dashboard',
          icon: 'fas fa-tachometer-alt',
        },
        {
          href: '/user',
          title: 'User\'s profile',
          icon: 'fas fa-user',
        },
        {
          href: '/activity',
          title: 'Activity',
          icon: 'fas fa-hiking',
        },
        {
          href: '/statistics',
          title: 'Statistics',
          icon: 'fas fa-chart-bar',
        },
        {
          href: '/calendar',
          title: 'Calendar',
          icon: 'fas fa-calendar-alt',
        },
        {
          href: '/wall',
          title: 'My wall',
          icon: 'fas fa-newspaper',
        },
        {
          href: '/logout',
          title: 'Logout',
          icon: 'fas fa-sign-out-alt',
        },
      ]
    }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/auth/login'))
    },
    onCollapse: function () {
      this.isCollapsed = !this.isCollapsed
    },
  },
  created: function () {

  }
}
</script>

<style lang="scss">
.app-layout {
  padding-left: 200px;
  &.collapsed {
    padding-left: 50px;
  }
}

.v-sidebar-menu .vsm-header {
  font-size: 24px !important;
  text-align: center;
}
</style>
