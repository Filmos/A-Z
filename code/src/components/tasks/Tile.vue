<template>
    <div class="tile">
        <svg viewBox="0 0 100 100">
            <defs>
                <clipPath id="clip">
                    <path d="M 50 0 L 100 50 L 50 100 L 0 50 L 50 0" />
                </clipPath>
                <radialGradient id="fill">
                    <stop offset="0%" style="stop-color:#c25fd6;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#47406c;stop-opacity:1" />
                </radialGradient >
            </defs>

            <g @click="clickEvent" transform-origin="50 6" clip-path="url(#clip)"
                @mouseover="$emit('displaytitle', expandedTitle)" @mouseleave="$emit('hidetitle', expandedTitle)">
                <path ref="path" d="M 50 0 L 100 50 L 50 100 L 0 50 L 50 0" fill="url(#fill)" />
                <text x="50" y="50" dominant-baseline="middle" text-anchor="middle" fill="#2af4f8">{{ shortTitle }}</text>
            </g>
        </svg>
    </div>
</template>

<script lang="js">
    import { child, remove, push, set } from "firebase/database";
    import db from '@/core/database';
    import { multiClick, displayDate, hslToHex } from '@/core/helper';

    export default {
        name: 'Tile',
        props: ['title', 'priority', 'dbKey', 'full'],
        data() {
            return {
                clickEvent: multiClick(300, async (clicks) => {
                    if (clicks != 2) return
                    const dbRemRef = child(await db, 'tasks/' + this.dbKey)
                    remove(dbRemRef)
                    this.$emit('hidetitle', this.expandedTitle)

                    if (!this.full.repeats) return
                    let newDate = new Date(this.full.deadline)
                    newDate.setDate(newDate.getDate() + this.full.repeats)
                    set(push(child(await db, 'tasks/')), {
                        ...this.full,
                        deadline: newDate.getTime()
                    })
                }),
                colorHue: 240
            }
        },
        computed: {
            shortTitle() {
                let reg = this.title.match(/(?:^|\s)([A-Z]{2,3})(?:$|\s)/)
                if (reg) return reg[1]

                let phrase = this.title
                reg = phrase.match(/(?:^|\s)(\w{4,})(?:$|\s)/i)
                if (reg) phrase = reg[1]

                if (phrase.replace(/[\W]/gi, '').length > 1) phrase = phrase.replace(/[\W]/gi, '')
                if (phrase.replace(/[aioue]/gi, '').length > 1) phrase = phrase.replace(/[aioue]/gi, '')
                if (phrase.length < 2) phrase += "--"

                return phrase[0].toUpperCase()+phrase[1].toLowerCase()
            },
            expandedTitle() {
                return `${this.title} [${displayDate(this.full.deadline)}]`
            },
            flareColor() {
                return hslToHex(this.colorHue, 69, 69)
            }
        }
    };
</script>

<style scoped lang="scss">
    @use 'sass:math';
    .tile {
        pointer-events: none;
        transition: transform 0.5s, --scale 0.5s, opacity 0.2s;
        transform: translate(0%, 50%) scale(0);
        --scale: 0;
    }

    g {
        path {
            transition: transform 0.5s, fill-opacity 0.2s;
            fill-opacity: 0.3;
            pointer-events: all;
            stroke: #2af4f8;
            stroke-width: calc(0.4% / var(--scale));

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
</style>
