<template>
  <div id="app">
    <Frame>
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

    export default Vue.extend({
      name: 'App',
      components: {
        Frame,
        Holder,
        Liveline
      }
    });
</script>

<style>
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
