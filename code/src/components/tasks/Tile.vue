<template>
    <path d="M 50 6 L 72 28 L 50 50 L 28 28 L 50 6" transform-origin="50 6"/>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'Frame',
        methods: {
        },
        data() {
            return { mycolor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16) + "44" }
        },
        mounted() {
            (this["$el"] as HTMLElement).style.fill = this.mycolor;
        }
    });
</script>

<style scoped lang="scss">
    path {
        fill: rgba(255, 0, 0, 0.3);
    }
</style>
