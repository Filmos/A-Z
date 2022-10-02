<template>
  <div id="app">
    <VisualController>
      <Frame>
        <Clock :targetTime='Date.parse("1 Jan 2023 0:00:00")'/>
        <BorderedSquare bindTo="tasks">
          <List><Tile/></List>
        </BorderedSquare>
        <Liveline/>
      </Frame>
      <Background></Background>
    </VisualController>
  </div>
</template>

<script lang="js">
import Frame from '@/components/Frame.vue';
import Liveline from '@/components/liveline/Liveline.vue';
import Clock from '@/components/misc/Clock.vue';
import Background from '@/components/visuals/Background.vue';
import VisualController from '@/components/visuals/Controller.vue';
import BorderedSquare from './components/containers/BorderedSquare.vue';
import Tile from './components/containers/Tile.vue';
import List from './components/groups/List.vue';

export default {
  name: 'App',
  components: {
    Frame,
    Liveline,
    Clock,
    Background,
    VisualController,
    BorderedSquare,
    Tile,
    List
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
