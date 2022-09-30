<template>
    <div id="tile">
        <slot>
        </slot>
    </div>
</template>

<script lang="js">
    import AZComponent from '@/core/azcomponent';
    export default AZComponent({
        name: 'Tile',
        mounted() {
            console.log("Tile mounted!", this.bind);
        }
    });
</script>

<style scoped lang="scss">
</style>