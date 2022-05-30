<template>
    <div>
        <slot></slot>
    </div>
</template>

<script lang="js">
import Color from '@/core/color';
const colorDefinitions = {
    primary: () => new Color("#2af4f8"),
    primaryBackgroundDark: c => c('primary').setLightness(8).saturate(0.5),
    primaryBackgroundDarkTransparent: c => c('primary').setLightness(20).saturate(0.35).setAlpha(0.4),

    secondary: c => c('primary').rotateHue(120).saturate(0.65),
    secondaryBackground: c => c('secondary').darken(0.1),
    secondaryBackgroundDark: c => c('secondary').rotateHue(-40).darken(0.5),
}

export default {
    name: "VisualController",
    data() {
        return {
            colorScheme: {}
        };
    },
    created() {
        this.generateColorScheme({ "primary": "#f8d62a" });
    },
    methods: {
        generateColorScheme(overwrite = {}) {
            this.colorScheme = {}
            for (let c in overwrite) {
                this.colorScheme[c] = new Color(overwrite[c])
            }
        },
        color(name) {
            if (!this.colorScheme[name]) {
                this.colorScheme[name] = colorDefinitions[name](this.color);
            }
            return this.colorScheme[name].clone();
        }
    },
    provide() {
        return {
            color: this.color
        };
    }
};
</script>

<style scoped lang="scss">
</style>