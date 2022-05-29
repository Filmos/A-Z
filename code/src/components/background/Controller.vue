<template>
    <div class="background">
        <div class="backdrop"></div>
        <Pattern class="overlay"/>
    </div>
</template>

<script lang="js">
    import Pattern from './Pattern.vue';
    export default {
        name: "FullBackground",
        expose: ["addFlare"],
        data() {
            return {
                flares: []
            };
        },
        methods: {
            flareGradient(color) {
                return `radial-gradient(${color}ff, ${color}8a 25%, ${color}47 42%, ${color}31 50%, ${color}10 62%, transparent 70%)`;
            }
        },
        components: { Pattern }
    };
</script>

<style scoped lang="scss">

    .overlay {
        z-index: -9000;
    }
    .backdrop {
        background-color: #0c0e0c;
        z-index: -9002;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
</style>