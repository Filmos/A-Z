<template>
  <div id="app">
    <Frame>
        <Clock :targetTime='Date.parse("23 Feb 2023 0:00:00")'/>
        <Holder/>
        <Liveline/>
    </Frame>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Frame from './components/Frame.vue';
    import Holder from './components/tasks/Holder.vue';
    import Liveline from './components/liveline/Liveline.vue';
    import Clock from './components/misc/Clock.vue';

    export default Vue.extend({
      name: 'App',
      components: {
        Frame,
        Holder,
        Liveline,
        Clock
      }
    });
</script>

<style>
    @font-face {
        font-family: LCD;
        src: url(assets/fonts/LCD+.ttf);
    }

    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }

    .temp {
        height: 2rem;
        background-color: dodgerblue;
    }
</style>
