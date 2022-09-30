<template>
    <slot/>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    export default defineComponent({
        name: 'Binder',
        props: {
            bind: {
                type: Object,
                required: true
            }
        },
        provide() {
            return {
                bind: this.bind
            }
        }
    });
</script>

<style scoped lang="scss">
</style>