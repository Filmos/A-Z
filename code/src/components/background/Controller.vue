<template>
    <div class="background">
        <div class="backdrop"></div>
        <div class="flares">
            <div class="flare" v-for="(flare, index) in flares" :key="index" 
                :style="{background: flareGradient(flare.options.color)}"
                :ref="'flare' + index"
            ></div>
        </div>
        <div class="overlay"></div>
    </div>
</template>

<script lang="js">
    export default {
        name: 'FullBackground',
        expose: ['addFlare'],
        data() {
            return {
                flares: []
            }
        },
        methods: {
            addFlare(flareTrackerDiv, options) {
                let flareIndex = this.flares.length;
                let thisFlare = {
                    tracker: {
                        interval: setInterval(() => {
                            this.updateFlarePosition(flareIndex)
                        }, 100),
                        div: flareTrackerDiv,
                        box: {
                            width: 0,
                            height: 0,
                            top: 0,
                            left: 0
                        }
                    },
                    options: options
                };
                this.flares.push(thisFlare);
                // this.updateFlarePosition(flareIndex);
            },
            updateFlarePosition(index) {
                let currentPosition = this.flares[index].tracker.div.$el.getBoundingClientRect()

                this.flares[index].tracker.box = {
                    width: currentPosition.width,
                    height: currentPosition.height,
                    top: currentPosition.top,
                    left: currentPosition.left
                }

                let flareRef = this.$refs['flare' + index][0];
                flareRef.style.top = currentPosition.top + 'px';
                flareRef.style.left = currentPosition.left + 'px';
                flareRef.style.width = currentPosition.width + 'px';
                flareRef.style.height = currentPosition.height + 'px';
            },
            flareGradient(color) {
                return `radial-gradient(${color}ff, ${color}8a 25%, ${color}47 42%, ${color}31 50%, ${color}10 62%, transparent 70%)`
            }
        }
    };
</script>

<style scoped lang="scss">
    .background div {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
    .flares .flare {
        transition: top 1s, left 1s, width 1s, height 1s;
    }

    .overlay {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='-80 -80 180 180'%3E%3Cpath fill='%23999' d='M 50 3 L 97 50 L 50 97 L 3 50 L 50 3' /%3E%3C/svg%3E"),
                          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='-80 -80 180 180'%3E%3Cpath fill='%23999' d='M 50 3 L 97 50 L 50 97 L 3 50 L 50 3' /%3E%3C/svg%3E");
        background-position: 0 0, -4px -4px;
        z-index: -9000;
        mix-blend-mode: multiply;
    }
    .flares {
        z-index: -9001;
    }
    .backdrop {
        background-color: #0c0e0c;
        z-index: -9002;
    }
</style>