<template>
    <div class="background">
        <div class="backdrop"></div>
        <div class="overlay"></div>
    </div>
</template>

<script lang="js">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'FullBackground',
    });
</script>

<style scoped lang="scss">
    .background div {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }

    .overlay {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='-80 -80 180 180'%3E%3Cpath fill='%23000' d='M 50 3 L 97 50 L 50 97 L 3 50 L 50 3' /%3E%3C/svg%3E"),
                          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='-80 -80 180 180'%3E%3Cpath fill='%23000' d='M 50 3 L 97 50 L 50 97 L 3 50 L 50 3' /%3E%3C/svg%3E");
        background-position: 0 0, -4px -4px;
        z-index: -8999;
    }
    .backdrop {
        background-color: #0c0e0c;
        z-index: -9011;
    }
</style>