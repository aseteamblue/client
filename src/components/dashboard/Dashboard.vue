<template>
  <div class="dashboard">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><router-link tag="li" to="/"><a>Dashboard</a></router-link></li>
      <li class="breadcrumb-item active">Overview</li>
    </ol>

    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <div class="text-center">
            <i class="fas fa-user fa-6x"></i>
            <h3>Johan Jobin</h3>
            <p>Welcome on Thingy Sport</p>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-row>
            <b-col>
              <div class="text-center">
                <i class="fas fa-info fa-2x"></i>
                <h3> Global information</h3>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-card bg-variant="primary" text-variant="white" header="Total distance" class="text-center" style="height:100px;">
                <p class="card-text">300 km</p>
              </b-card>
            </b-col>
            <b-col>
              <b-card bg-variant="info" text-variant="white" header="Total time" class="text-center" style="height: 100px;">
                <p class="card-text">jfdlkjfl.</p>
              </b-card>
            </b-col>
            <b-col>
              <b-card bg-variant="success" text-variant="white" header="Nb. of sessions" class="text-center" style="height: 100px;">
                <p class="card-text">55</p>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="6">
          <b-row>
            <b-col>
              <div class="text-center">
                <i class="fas fa-trophy fa-2x"></i>
                <h3> Collected trophies</h3>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div id="result_panel">
                <div class="panel-body">
                  <ul class="list-group">
                    <li class="list-group-item"><strong>Signature
                      Accommodations</strong>(1480m)
                    </li>
                  </ul>
              </div>
            </div>

            </b-col>

          </b-row>
        </b-col>
      </b-row>

      <b-row style="padding-top:30px;">
        <b-col>
          <div class="text-center">
            <i class="fas fa-running fa-2x"></i>
            <h3>5 last sessions</h3>
            <datatable :columns="columns" :data="rows"></datatable>
          </div>
        </b-col>
      </b-row>
      <b-row style="padding-top:30px;">
        <b-col>

        </b-col>

      </b-row>
    </b-container>

  </div>
</template>

<script>

import DatatableFactory from 'vuejs-datatable'
import Vue from 'vue'
Vue.use(DatatableFactory)

export default {
  name: 'dashboard',
  data () {
    return {
      columns: [
        { label: 'Title', field: 'id', align: 'center', filterable: false },
        { label: 'Total Distance', field: 'user.username' },
        { label: 'Duration', field: 'user.first_name' },
        { label: 'Date', field: 'user.last_name' },
        { label: 'See more', field: 'user.email' }
      ],
      rows: [{
        'id': 1,
        'user': {
          'username': 'dprice0',
          'first_name': 'Daniel',
          'last_name': 'Price',
          'email': 'dprice0@blogs.com'
        },
        'address': '3 Toban Park',
        'city': 'Pocatello',
        'state': 'Idaho'
      },
      {
        'id': 1,
        'user': {
          'username': 'dprice0',
          'first_name': 'Daniel',
          'last_name': 'Price',
          'email': 'dprice0@blogs.com'
        },
        'address': '3 Toban Park',
        'city': 'Pocatello',
        'state': 'Idaho'
      }],

    }
  },

  methods: {

  }
}

</script>
<style lang="scss" scoped>

.list-group{
    height: 100px;
    margin-bottom: 10px;
    overflow:scroll;
    -webkit-overflow-scrolling: touch;
}
</style>
