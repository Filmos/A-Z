<template>
    <div class="background-tracker"></div>
</template>

<script lang="js">
    export default {
        name: 'BackgroundFlare',
        props: ['color'],
        inject: ['BackgroundController'],
        created() {
            this.BackgroundController.addFlare(this, {color: this.color})
        }
    };
</script>

<style scoped lang="scss">
    .background-tracker {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
    }
</style>