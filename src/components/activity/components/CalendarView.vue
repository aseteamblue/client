<template>
  <div id="global" class="container-fluid">
    <h1>Calendar</h1>
    <div id="cal">
      <div class="calendar-parent">
        <calendar-view
        :events="events"
        :show-date="showDate"
        :time-format-options="{hour: 'numeric', minute:'2-digit'}"
        :enable-drag-drop="false"
        :disable-past="disablePast"
        :disable-future="disableFuture"
        :show-event-times="showEventTimes"
        :display-period-uom="displayPeriodUom"
        :display-period-count="displayPeriodCount"
        :starting-day-of-week="startingDayOfWeek"
        :class="themeClasses"
        :period-changed-callback="periodChanged"
        @click-date="onClickDay"
        @click-event="onClickEvent"
        >
          <calendar-view-header slot="header" slot-scope="{ headerProps }" :header-props="headerProps" @input="setShowDate" />
        </calendar-view>
      </div>
      <div>
        <!-- Modal Components -->
        <b-modal id="modalPrevent"
        ref="modal"
        title="Create a new session"
        @ok="handleOk"
        @shown="clear">
          <form @submit.stop.prevent="handleSubmit">
            <b-form-group label="<b>Title</b>">
              <b-form-input type="text"
              placeholder="Enter a title"
              :state="titleState"
              v-model="newSessionTitle"></b-form-input>
            </b-form-group>
            <b-form-group label="<b>Date</b>">
              <b-form-input type="date"
              :state="dateState"
              v-model="newSessionDate"></b-form-input>
            </b-form-group>
            <b-form-group label="<b>Time</b>">
              Start
              <b-form-input type="time"
              :state="startTimeState"
              v-model="newSessionStartTime"></b-form-input>
              <br>End
              <b-form-input type="time"
              :state="endTimeState"
              v-model="newSessionEndTime"></b-form-input>
            </b-form-group>
            <b-form-group label="<b>Total distance in km</b>" v-if="isPastSession">
              <b-form-input type="number"
              placeholder="Enter a number"
              v-model="newSessionTotalDistance"></b-form-input>
            </b-form-group>
            <b-form-group label="<b>Share this session</b>">
              <b-form-radio-group
                v-model="newSessionIsPublic"
                :options="[{text: 'Yes', value: true}, {text: 'No', value: false}]"
                name="radioNewSessionIsPublic">
              </b-form-radio-group>
            </b-form-group>
          </form>
        </b-modal>
        <b-modal id="modalInfoSession"
        ref="modalInfoSession"
        title="Overview of your session">
          <div>
            <b>Title: </b>{{ modalInfoTitle }}<br>
            <b>Start: </b>{{ modalInfoStart }}<br>
            <b>End: </b>{{ modalInfoEnd }}<br>
            <b>Distance: </b>{{ modalInfoDistance }} km<br>
            <b>Speed: </b>{{ modalInfoSpeed }} km/h<br>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin,
} from 'vue-simple-calendar'
require('./default.css')

export default {
  name: 'Cal',
  components: {
    CalendarView,
    CalendarViewHeader
  },
  mixins: [CalendarMathMixin],
  data () {
    return {
      /* Show the current month, and give it some fake events to show */
      showDate: this.thisMonth(1),
      message: '',
      startingDayOfWeek: 1,
      disablePast: false,
      disableFuture: false,
      displayPeriodUom: 'month',
      displayPeriodCount: 1,
      showEventTimes: false,
      newEventTitle: '',
      newEventStartDate: '',
      newEventEndDate: '',
      useDefaultTheme: false,
      useHolidayTheme: false,
      events: this.$store.state.user.sessions,
      newSessionTitle: '',
      newSessionDate: '',
      newSessionStartTime: '',
      newSessionEndTime: '',
      newSessionIsPublic: true,
      newSessionTotalDistance: '',
      modalInfoTitle: '',
      modalInfoStart: '',
      modalInfoEnd: '',
      modalInfoDistance: '',
      modalInfoSpeed: ''
    }
  },
  beforeCreate: function () {
    this.$store.dispatch('getUserSession')
  },
  computed: {
    userLocale () {
      return this.getDefaultBrowserLocale
    },
    dayNames () {
      return this.getFormattedWeekdayNames(this.userLocale, 'long', 0)
    },
    themeClasses () {
      return {
        'theme-default': './default.css'
      }
    },
    titleState () {
      return this.newSessionTitle.length > 0
    },
    startTimeState () {
      return this.newSessionStartTime.length > 0
    },
    endTimeState () {
      return this.newSessionEndTime.length > 0 && this.newSessionStartTime <= this.newSessionEndTime
    },
    dateState () {
      return this.newSessionDate.length > 0
    },
    isPastSession () {
      let dateSplit = this.newSessionDate.split('-')
      let d = new Date(dateSplit[0], parseInt(dateSplit[1]) - 1, dateSplit[2])
      let today = new Date()
      return (d.getDate() <= today.getDate() && d.getMonth() <= today.getMonth() && d.getYear() <= today.getYear())
    }
  },
  mounted () {
    this.newEventStartDate = this.isoYearMonthDay(this.today())
    this.newEventEndDate = this.isoYearMonthDay(this.today())
  },
  methods: {
    periodChanged (range, eventSource) {
    },
    thisMonth (d, h, m) {
      const t = new Date()
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
    },
    onClickDay (d) {
      this.newSessionDate = this.isoYearMonthDay(d)
      this.$refs.modal.show()
    },
    onClickEvent (e) {
      this.modalInfoTitle = e.title
      this.modalInfoStart = e.startDate.toLocaleString()
      this.modalInfoEnd = e.endDate.toLocaleString()
      this.modalInfoDistance = e.originalEvent.totalDistance
      this.modalInfoSpeed = e.originalEvent.averageSpeed
      this.$refs.modalInfoSession.show()
    },
    setShowDate (d) {
      this.message = `Changing calendar view to ${d.toLocaleDateString()}`
      this.showDate = d
    },
    clear () {
      this.newSessionTitle = ''
      this.newSessionStartTime = ''
      this.newSessionEndTime = ''
      this.newSessionTotalDistance = ''
    },
    handleOk (evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (this.newSessionTitle.length > 0 &&
          this.newSessionStartTime.length > 0 &&
          this.newSessionEndTime.length > 0 &&
          this.newSessionStartTime <= this.newSessionEndTime
      ) {
        this.handleSubmit()
      }
    },
    handleSubmit () {
      let dateSplit = this.newSessionDate.split('-')
      let startTimeSplit = this.newSessionStartTime.split(':')
      let endTimeSplit = this.newSessionEndTime.split(':')
      let session = {
        title: this.newSessionTitle,
        startDate: new Date(dateSplit[0], parseInt(dateSplit[1]) - 1, parseInt(dateSplit[2]), parseInt(startTimeSplit[0]) + 1, startTimeSplit[1]),
        endDate: new Date(dateSplit[0], parseInt(dateSplit[1]) - 1, parseInt(dateSplit[2]), parseInt(endTimeSplit[0]) + 1, endTimeSplit[1]),
        share: this.newSessionIsPublic,
        totalDistance: (this.newSessionTotalDistance) ? parseFloat(this.newSessionTotalDistance) : 0
      }
      this.$store.dispatch('postSession', session)
      this.events.push(session)
      this.clear()
      this.$refs.modal.hide()
    }
  },
}
</script>
