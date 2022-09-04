<!--
  Matomo - free/libre analytics platform

  @link https://matomo.org
  @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
-->

<template>
  <div>
      <div class="motomo-local-datetime">
        <p style="font-size:20px;">
          {{ localDateTime.year }}/{{ localDateTime.month }}/{{ localDateTime.date }}
          {{ localDateTime.hours }}:{{ localDateTime.minutes }}
          <span v-if="isTimeFormatTwelve">{{amOrPm}}</span>
        </p>
      </div>
      <div class="motomo-server-datetime" v-if="isTimeDifferent">
        <p>
          Server Time:
          {{ serverDateTime.year }}/{{ serverDateTime.month }}/{{ serverDateTime.date }}
          {{ serverDateTime.hours }}:{{ serverDateTime.minutes }}
          <span v-if="isTimeFormatTwelve">{{amOrPmServer}}</span>
        </p>
      </div>
  </div>
</template>

<style lang="less" scoped>
  .motomo-local-datetime,
  .motomo-server-datetime {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<script lang="ts">
import { defineComponent } from 'vue';

interface DateTime {
  year: string,
  month: string,
  date: string,
  hours: string,
  minutes: string,
}

interface LocalDateTimeState {
  localDateTime: DateTime;
  serverDateTime: DateTime;
  isTimeDifferent: boolean,
  amOrPm: string;
  amOrPmServer: string;
  timer: number;
  timerCount: number;
}

const date = new Date();
export default defineComponent({
  props: {
    isTimeFormatTwelve: Boolean,
    serverTimeInMillis: Number,
  },
  data(): LocalDateTimeState {
    return {
      localDateTime: {
        year: date.getFullYear().toString(),
        month: this.addLeadingZeros(date.getMonth()),
        date: this.addLeadingZeros(date.getDate()),
        hours: this.addLeadingZeros(date.getHours()),
        minutes: this.addLeadingZeros(date.getMinutes()),
      },
      serverDateTime: {
        year: '',
        month: '',
        date: '',
        hours: '',
        minutes: '',
      },
      isTimeDifferent: false,
      amOrPm: '',
      amOrPmServer: '',
      timer: 0,
      timerCount: 0,
    };
  },
  beforeMount() {
    if (this.serverTimeInMillis) {
      const serverTime = new Date(this.serverTimeInMillis);
      // Check time diff between server and local greater than 5 mins
      if (this.checkDateimeDiffInMins(serverTime, date) >= 5) {
        this.isTimeDifferent = true;
        this.serverDateTime = {
          year: serverTime.getFullYear().toString(),
          month: this.addLeadingZeros(serverTime.getMonth()),
          date: this.addLeadingZeros(serverTime.getDate()),
          hours: this.addLeadingZeros(serverTime.getHours()),
          minutes: this.addLeadingZeros(serverTime.getMinutes()),
        };
      }
      this.amOrPmServer = this.getAmOrPm((serverTime.getHours()));
    }
    this.amOrPm = this.getAmOrPm(Number(this.localDateTime.hours));
    this.timer = setInterval(this.setDateTime, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    setDateTime() {
      const currentDate = new Date();
      if (this.isTimeDifferent && this.serverTimeInMillis) {
        const serverDate = new Date(this.serverTimeInMillis);
        serverDate.setSeconds(serverDate.getSeconds() + this.timerCount);
        let serverHours = serverDate.getHours();
        if (this.isTimeFormatTwelve) {
          serverHours = (serverHours % 12) || 12;
        }
        this.serverDateTime = {
          year: serverDate.getFullYear().toString(),
          month: this.addLeadingZeros(serverDate.getMonth()),
          date: this.addLeadingZeros(serverDate.getDate()),
          hours: this.addLeadingZeros(serverHours),
          minutes: this.addLeadingZeros(serverDate.getMinutes()),
        };
      }
      let currentHours = currentDate.getHours();
      if (this.isTimeFormatTwelve) {
        currentHours = (currentHours % 12) || 12;
      }
      this.localDateTime = {
        year: currentDate.getFullYear().toString(),
        month: this.addLeadingZeros(currentDate.getMonth()),
        date: this.addLeadingZeros(currentDate.getDate()),
        hours: this.addLeadingZeros(currentHours),
        minutes: this.addLeadingZeros(currentDate.getMinutes()),
      };
      this.timerCount += 1;
    },
    getAmOrPm(dateTimeHours: number) {
      if (this.isTimeFormatTwelve) {
        return dateTimeHours >= 12 ? 'PM' : 'AM';
      }
      return '';
    },
    addLeadingZeros(num: number) {
      return String(num).padStart(2, '0');
    },
    checkDateimeDiffInMins(dt1: Date, dt2: Date) {
      let diff = (dt2.getTime() - dt1.getTime()) / 1000;
      diff /= 60;
      return Math.abs(Math.round(diff));
    },

  },
});
</script>
