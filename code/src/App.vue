<template>
  <div id="app">
    <VisualController>
      <Frame>
          <Clock :targetTime='Date.parse("23 Feb 2023 0:00:00")'/>
          <Holder/>
          <Liveline/>
      </Frame>
      <Background></Background>
    </VisualController>
  </div>
</template>

<script lang="js">
    import graphBuilder from '@/core/graph/base/loader';
    import Frame from '@/components/Frame.vue';
    import Holder from '@/components/tasks/Holder.vue';
    import Liveline from '@/components/liveline/Liveline.vue';
    import Clock from '@/components/misc/Clock.vue';
    import Background from '@/components/visuals/Background.vue';
    import VisualController from '@/components/visuals/Controller.vue';

    graphBuilder()
    export default {
      name: 'App',
      components: {
        Frame,
        Holder,
        Liveline,
        Clock,
        Background,
        VisualController
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
</style>
