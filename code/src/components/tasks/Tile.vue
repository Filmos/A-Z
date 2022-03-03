<template>
    <g @click="clickEvent" transform-origin="50 6" :priority="priority" @mouseover="$emit('displaytitle', title)" @mouseleave="$emit('hidetitle', title)">
        <path d="M 50 6 L 72 28 L 50 50 L 28 28 L 50 6" />
        <text x="50" y="30" dominant-baseline="middle" text-anchor="middle">{{ shortTitle }}</text>
    </g>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { ref, remove } from "firebase/database";
    import db from '@/core/database';
    import { multiClick, randomColorFromString } from '@/core/helper';

    export default Vue.extend({
        name: 'Tile',
        props: ['title', 'priority', 'dbKey'],
        data() {
            return {
                mycolor: randomColorFromString(this.dbKey) + "44",
                clickEvent: multiClick(300, (clicks) => {
                    if (clicks != 2) return
                    const dbRef = ref(db, 'tasks/' + this.dbKey)
                    remove(dbRef)
                    this.$emit('hidetitle', this.title)
                })
            }
        },
        mounted() {
            (this["$el"].children[0] as HTMLElement).style.fill = this.mycolor;
        },
        computed: {
            shortTitle() {
                let reg = this.title.match(/(?:^|\s)([A-Z]{2,3})(?:^|\s)/)
                if (reg) return reg[1]

                let phrase = this.title as string
                reg = this.title.match(/(?:^|\s)(\w{4,})(?:$|\s)/i)
                if (reg) phrase = reg[1]

                if (phrase.replace(/[\W]/gi, '').length > 1) phrase = phrase.replace(/[\W]/gi, '')
                if (phrase.replace(/[aioue]/gi, '').length > 1) phrase = phrase.replace(/[aioue]/gi, '')
                if (phrase.length < 2) phrase += "--"

                return phrase[0].toUpperCase()+phrase[1].toLowerCase()
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
