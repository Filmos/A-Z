<template>
    <div class="frame">
        <svg class="top-shrinker">
            <polygon v-for="i in 100" :key="i" :points="`${i*30-7},0 ${i*30},12 ${i*30+7},0`" v-on:click="setWidth(i)"></polygon>
        </svg>
        <div class="liveline" />
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';


    export default Vue.extend({
        name: 'Frame',
        methods: {
            setWidth: function(i: number) {(this.$el as HTMLElement).style.maxWidth = (i*30-24)+"px"}
        }
    });
</script>

<style scoped lang="scss">
    .liveline {
        height: 2rem;
        background-color: green;
    }

    .frame {
        padding: 12px;
    }

    .top-shrinker {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 16px;
        fill: #0d1021;
        opacity: 0;
        transition: opacity 0.5s;
        &:hover {opacity: 0.8;}

        polygon {
            opacity: 0.5;
            &:hover {opacity: 1;}
        }
    }
</style>
<style>
    body {
        font-family: "EncodeSans",sans-serif;
        margin: 0;
        border: 0 solid transparent;
        background-image: radial-gradient(circle at 0% 0%, #373b52, #252736 51%, #1d1e26);
        background-attachment: fixed;
    }
</style>
