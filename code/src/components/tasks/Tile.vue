<template>
    <div class="tile">
        <div class="flare-wrapper">
            <BackgroundFlare :color="flareColor"></BackgroundFlare>
        </div>
        <svg viewBox="0 0 100 100">
            <g @click="clickEvent" transform-origin="50 6" @mouseover="$emit('displaytitle', expandedTitle)" @mouseleave="$emit('hidetitle', expandedTitle)">
                <path ref="path" d="M 50 0 L 100 50 L 50 100 L 0 50 L 50 0" :style="{fill: `hsl(${colorHue}deg 90% 60% / 60%)`}" />
                <text x="50" y="50" dominant-baseline="middle" text-anchor="middle">{{ shortTitle }}</text>
            </g>
        </svg>
    </div>
</template>

<script lang="js">
    import { child, remove, push, set } from "firebase/database";
    import db from '@/core/database';
    import { multiClick, hashString, displayDate, hslToHex } from '@/core/helper';
    import BackgroundFlare from '@/components/background/Flare.vue';

    export default {
        name: 'Tile',
        components: {
            BackgroundFlare
        },
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
                colorHue: Math.floor(Math.abs(hashString(this["dbKey"]))%360)
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
        transition: transform 0.5s, opacity 0.2s;
        transform: translate(0%, 50%) scale(0);
    }

    g {
        path {
            transition: transform 0.5s, opacity 0.2s;
            opacity: 0.5;
            pointer-events: all;

            &:hover {
                opacity: 1;
            }
        }

        text {
            cursor: default;
            user-select: none;
            pointer-events: none;
            font-size: 2em;
        }
    }

    .flare-wrapper {
        width: 90%;
        height: 90%;    
        position: absolute;
        top: 5%;
        left: 5%;
        pointer-events: none;
    }
</style>
