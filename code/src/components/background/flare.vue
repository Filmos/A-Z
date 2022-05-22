<template>
    <div class="background-flare" :style="{background: flareGradient}"></div>
</template>

<script lang="js">
    export default {
        name: 'BackgroundFlare',
        props: ['color'],
        computed: {
            flareGradient() {
                return `radial-gradient(${this.color}ff, ${this.color}8a 25%, ${this.color}47 42%, ${this.color}31 50%, ${this.color}10 62%, transparent 70%)`
            }
        }
    };
</script>

<style scoped lang="scss">
    .background-flare {
        z-index: -9000;
        position: absolute;
        width: 200px;
        height: 200px;
        display: none;
    }
</style>