<template>
    <div class="background">
        <div class="backdrop" :style="{ backgroundColor: color('primaryBackgroundDark') }"></div>
        <Pattern class="overlay" />
    </div>
</template>

<script lang="js">
import Pattern from './Pattern.vue';
export default {
    name: "FullBackground",
    components: { Pattern },
    inject: ["color"]
};
</script>

<style scoped lang="scss">
.overlay {
    z-index: -9000;
}

.backdrop {
    z-index: -9002;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
}
</style>