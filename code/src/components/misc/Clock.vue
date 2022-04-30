<template>
    <svg class="clock" viewBox="0 0 100 16">
        <filter id="glow" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"></feGaussianBlur>
            <feMerge>
                <feMergeNode in="blur"></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
            </feMerge>
        </filter>
        <text class="clockBackdrop" dominant-baseline="middle" text-anchor="middle" x="50" y="9">888:88:88:88</text>
        <text class="clockFace" dominant-baseline="middle" text-anchor="middle" x="50" y="9" ref="face">000:00:00:00</text>
    </svg>
</template>

<script lang="js">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'Clock',
        props: ['targetTime'],
        data() {
            return {
                interval: null
            }
        },
        mounted() {
            this.interval = setInterval(this.refresh, 1000)
        },
        unmounted() {
            if (this.interval !== undefined) clearInterval(this.interval)
        },
        methods: {
            refresh() {
                let time = this.targetTime - Date.now()
                time = Math.floor(time / 1000)
                let sec = time % 60
                time = Math.floor(time / 60)
                let min = time % 60
                time = Math.floor(time / 60)
                let hour = time % 24
                let day = Math.floor(time / 24)

                this.$refs.face.innerHTML = ("00" + day).slice(-3) + ":" + ("0" + hour).slice(-2) + ":" + ("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2)
            }
        }
    });
</script>

<style scoped lang="scss">

    .clock {
        max-width: min(62.5vh, 80vw);
        margin: auto;
        display: block;
        position: relative;
        top: 1rem;

        text {
            font-family: 'LCD',monospace;
            fill: #BFD2FF;
            filter: url(#glow);
            user-select: none;
        }

        .clockBackdrop {
            fill: #15161e;
            opacity: 0.38;
            filter: none;
        }
    }
</style>
