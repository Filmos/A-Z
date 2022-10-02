<template>
    <svg viewBox="0 0 100 100">
        <defs>
            <radialGradient id="fill">
                <stop offset="0%" :style="{ stopColor: color('secondaryBackground'), stopOpacity: 1 }" />
                <stop offset="100%" :style="{ stopColor: color('secondaryBackgroundDark'), stopOpacity: 1 }" />
            </radialGradient>
        </defs>

        <g @click="clickEvent" transform-origin="50 6" clip-path="url(#clip)"
            @mouseover="$emit('displaytitle', expandedTitle)" @mouseleave="$emit('hidetitle', expandedTitle)">
            <path ref="path" d="M 50 0 L 100 50 L 50 100 L 0 50 L 50 0" fill="url(#fill)"/>
            <text x="50" y="50" dominant-baseline="middle" text-anchor="middle" :fill="color('primary')">{{
                    shortTitle
            }}</text>
        </g>
    </svg>
</template>

<script lang="js">
    import AZComponent from '@/core/azcomponent';
    export default AZComponent({
        name: 'Tile',
        inject: ['color'],
        computed: {
            title() {
                return "12345"
            },
            shortTitle() {
                let reg = this.title.match(/(?:^|\s)([A-Z]{2,3})(?:$|\s)/)
                if (reg) return reg[1]

                let phrase = this.title
                reg = phrase.match(/(?:^|\s)(\w{4,})(?:$|\s)/i)
                if (reg) phrase = reg[1]

                if (phrase.replace(/[\W]/gi, '').length > 1) phrase = phrase.replace(/[\W]/gi, '')
                if (phrase.replace(/[aioue]/gi, '').length > 1) phrase = phrase.replace(/[aioue]/gi, '')
                if (phrase.length < 2) phrase += "--"

                return phrase[0].toUpperCase() + phrase[1].toLowerCase()
            }
        }
    });
</script>

<style scoped lang="scss">
@use 'sass:math';
svg {
    width: 100%;
    height: 100%;
    
    g {
        path {
            transition: transform 0.5s, fill-opacity 0.2s;
            fill-opacity: 0.3;
            pointer-events: all;

            &:hover {
                fill-opacity: 0.6;
            }
        }

        text {
            cursor: default;
            user-select: none;
            pointer-events: none;
            font-size: 2em;
        }
    }
}
</style>
