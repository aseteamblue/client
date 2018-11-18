<template>
  <div class="calendar container-fluid" id="calendar">
    <h1>Calendar</h1>
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
    <div v-if="message" class="notification is-success">{{ message }}</div>
  </div>
</template>
<script>
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin,
} from 'vue-simple-calendar'
require('vue-simple-calendar/static/css/default.css')

export default {
  name: 'calendar',
  components: {
    CalendarView,
    CalendarViewHeader,
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
      showEventTimes: true,
      newEventTitle: '',
      newEventStartDate: '',
      newEventEndDate: '',
      useDefaultTheme: true,
      events: [
        {
          id: 'e0',
          startDate: '2018-01-05',
        },
        {
          id: 'e1',
          startDate: this.thisMonth(15, 18, 30),
        },
        {
          id: 'e2',
          startDate: this.thisMonth(15),
          title: 'Single-day event with a long title',
        },
        {
          id: 'e3',
          startDate: this.thisMonth(7, 9, 25),
          endDate: this.thisMonth(10, 16, 30),
          title: 'Multi-day event with a long title and times',
        },
        {
          id: 'e4',
          startDate: this.thisMonth(20),
          title: 'My Birthday!',
          classes: 'birthday',
          url: 'https://en.wikipedia.org/wiki/Birthday',
        },
        {
          id: 'e5',
          startDate: this.thisMonth(5),
          endDate: this.thisMonth(12),
          title: 'Multi-day event',
          classes: 'purple',
        },
        {
          id: 'foo',
          startDate: this.thisMonth(29),
          title: 'Same day 1',
        },
        {
          id: 'e6',
          startDate: this.thisMonth(29),
          title: 'Same day 2',
          classes: 'orange',
        },
        {
          id: 'e7',
          startDate: this.thisMonth(29),
          title: 'Same day 3',
        },
        {
          id: 'e8',
          startDate: this.thisMonth(29),
          title: 'Same day 4',
          classes: 'orange',
        },
        {
          id: 'e9',
          startDate: this.thisMonth(29),
          title: 'Same day 5',
        },
        {
          id: 'e10',
          startDate: this.thisMonth(29),
          title: 'Same day 6',
          classes: 'orange',
        },
        {
          id: 'e11',
          startDate: this.thisMonth(29),
          title: 'Same day 7',
        },
      ],
    }
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
        'theme-default': this.useDefaultTheme
      }
    },
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
      this.message = `You clicked: ${d.toLocaleDateString()}`
    },
    onClickEvent (e) {
      this.message = `You clicked: ${e.title}`
    },
    setShowDate (d) {
      this.message = `Changing calendar view to ${d.toLocaleDateString()}`
      this.showDate = d
    },
    clickTestAddEvent () {
      this.events.push({
        startDate: this.newEventStartDate,
        endDate: this.newEventEndDate,
        title: this.newEventTitle,
      })
      this.message = 'You added an event!'
    },
  },
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  background-color: #f7fcff;
}
#calendar {
  display: flex;
  flex-direction: column;
  font-family: Calibri, sans-serif;
  width: 95vw;
  min-width: 30rem;
  max-width: 100rem;
  min-height: 40rem;
  margin-left: auto;
  margin-right: auto;
}
.calendar-parent {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: 80vh;
  background-color: white;
  margin-right: 1rem;
  margin-left: 1rem;
}
/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
  min-height: 6rem;
}
/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */
/* Add some styling for events tagged with the "birthday" class */
.calendar .event.birthday {
  background-color: #e0f0e0;
  border-color: #d7e7d7;
}
.calendar .event.birthday::before {
  content: "\1F382";
  margin-right: 0.5em;
}
</style>
