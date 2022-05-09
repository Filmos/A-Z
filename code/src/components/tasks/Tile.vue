<template>
    <g @click="clickEvent" transform-origin="50 6" :priority="priority" @mouseover="$emit('displaytitle', expandedTitle)" @mouseleave="$emit('hidetitle', expandedTitle)">
        <path ref="path" d="M 50 6 L 72 28 L 50 50 L 28 28 L 50 6" />
        <text x="50" y="30" dominant-baseline="middle" text-anchor="middle">{{ shortTitle }}</text>
    </g>
</template>

<script lang="js">
    import Vue from 'vue';
    import { child, remove, push, set } from "firebase/database";
    import db from '@/core/database';
    import { multiClick, randomColorFromString, displayDate } from '@/core/helper';

    export default Vue.extend({
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
                })
            }
        },
        mounted() {
            this.$refs.path.style.fill = randomColorFromString(this["dbKey"]) + "44";
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
            }
        }
    });
</script>

<style scoped lang="scss">
    g {
        transform: translate(0, 44px) scale(0);
        transition: transform 0.5s;

        path {
            fill: rgba(255, 0, 0, 0.3);
            transition: transform 0.5s, opacity 0.2s;
            opacity: 0.6;

            &:hover {
                opacity: 1;
            }
        }

        text {
            cursor: default;
            user-select: none;
            pointer-events: none;
        }
    }
</style>
