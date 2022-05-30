<template>
    <div class="background-pattern" :style="style"></div>
</template>

<script lang="js">
    export default {
        name: 'BackgroundPattern',
        props: {
            size: {
                type: Number,
                default: 8
            }
        },
        computed: {
            style() {
                return {
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${this.size}' height='${this.size}' viewBox='-80 -80 180 180'%3E%3Cpath fill='%23999' d='M 50 3 L 97 50 L 50 97 L 3 50 L 50 3' /%3E%3C/svg%3E"),
                                      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${this.size}' height='${this.size}' viewBox='-80 -80 180 180'%3E%3Cpath fill='%23999' d='M 50 3 L 97 50 L 50 97 L 3 50 L 50 3' /%3E%3C/svg%3E")`,
                    backgroundPosition: `50% 50%, calc(50% - ${this.size/2}px) calc(50% - ${this.size/2}px)`
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .background-pattern {
        mix-blend-mode: multiply;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
</style>