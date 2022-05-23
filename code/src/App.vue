<template>
  <div id="app">
    <Frame>
        <Clock :targetTime='Date.parse("23 Feb 2023 0:00:00")'/>
        <Holder/>
        <Liveline/>
    </Frame>
    <BackgroundController ref="background"></BackgroundController>
  </div>
</template>

<script lang="js">
    import { computed } from 'vue';
    import Frame from '@/components/Frame.vue';
    import Holder from '@/components/tasks/Holder.vue';
    import Liveline from '@/components/liveline/Liveline.vue';
    import Clock from '@/components/misc/Clock.vue';
    import BackgroundController from '@/components/background/Controller.vue';

    export default {
      name: 'App',
      components: {
        Frame,
        Holder,
        Liveline,
        Clock,
        BackgroundController
      },
      provide() {
        return {
          BackgroundController: computed(() => this.$refs['background'])
        }
      }
    };
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
