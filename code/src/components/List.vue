<template>
    <div id="list">
        <Binder v-for="i in [1, 2, 3]" :key="i" :bind="bind.subpath(i)">
            <slot>
                {{i}}--
            </slot>
        </Binder>
    </div>
</template>

<script lang="js">
    import AZComponent from '@/core/azcomponent';
    import Binder from '@/core/binder.vue';

    export default AZComponent({
        name: 'List',
        components: {
            Binder
        },
        mounted() {
            console.log("List mounted!");
        }
    });
</script>

<style scoped lang="scss">
</style>