<template>
    <div class="outer-holder">
        <svg class="inner-holder" viewBox="0 0 100 100">
            <path class="border" d="M 50 3 L 97 50 L 50 97 L 3 50 L 50 3" />
            <Tile transform="scale(1.2)" />
            <Tile transform="translate(0 44)" />
            <Tile transform="translate(26.5 26.5) scale(0.8)" />
            <Tile transform="translate(-26.5 26.5) scale(0.4)" />
        </svg>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Tile from './Tile.vue';


    export default Vue.extend({
        name: 'Frame',
        methods: {
        },
        components: {
            Tile
        }
    });
</script>

<style scoped lang="scss">
    $base-color: #03010e;

    .inner-holder {
        width: min(80%, 55vh);
        height: min(80%, 55vh);

        .border {
            stroke-width: 4;
            fill: rgba($base-color, 0.4);
            stroke: $base-color;
            stroke-linecap: square;
            stroke-linejoin: miter;
        }
    }
</style>
