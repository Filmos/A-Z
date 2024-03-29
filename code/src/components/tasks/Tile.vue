<template>
    <div class="tile">
        <svg viewBox="0 0 100 100">
            <defs>
                <clipPath id="clip">
                    <path d="M 50 0 L 100 50 L 50 100 L 0 50 L 50 0" />
                </clipPath>
                <radialGradient id="fill">
                    <stop offset="0%" :style="{ stopColor: color('secondaryBackground'), stopOpacity: 1 }" />
                    <stop offset="100%" :style="{ stopColor: color('secondaryBackgroundDark'), stopOpacity: 1 }" />
                </radialGradient>
            </defs>

            <g @click="clickEvent" transform-origin="50 6" clip-path="url(#clip)"
                @mouseover="$emit('displaytitle', expandedTitle)" @mouseleave="$emit('hidetitle', expandedTitle)">
                <path ref="path" d="M 50 0 L 100 50 L 50 100 L 0 50 L 50 0" fill="url(#fill)"
                    :stroke="color('primary')" />
                <text x="50" y="50" dominant-baseline="middle" text-anchor="middle" :fill="color('primary')">{{
                        shortTitle
                }}</text>
            </g>
        </svg>
    </div>
</template>

<script lang="js">
import { child, remove, push, set } from "firebase/database";
import db from '@/core/database';
import { multiClick, displayDate } from '@/core/helper';

export default {
    name: 'Tile',
    props: ['title', 'priority', 'dbKey', 'full'],
    inject: ['color'],
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
            })
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

            return phrase[0].toUpperCase() + phrase[1].toLowerCase()
        },
        expandedTitle() {
            return `${this.title} [${displayDate(this.full.deadline)}]`
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
