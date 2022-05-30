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
    primaryInput: c => c('primary').setLightness(85),

    secondary: c => c('primary').rotateHue(120).saturate(0.65),
    secondaryBackground: c => c('secondary').darken(0.1),
    secondaryBackgroundDark: c => c('secondary').rotateHue(-40).darken(0.5),
    secondaryBackgroundTransparent: c => c('secondaryBackground').setAlpha(0.25),
    secondaryBackgroundExtraTransparent: c => c('secondaryBackgroundTransparent').setAlpha(0.1),

    invalidInput: c => c('primaryInput').setHue(345)
}

export default {
    name: "VisualController",
    data() {
        return {
            colorScheme: {}
        };
    },
    created() {
        this.generateColorScheme();
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