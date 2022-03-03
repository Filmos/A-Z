<template>
    <g @click="clickEvent" transform-origin="50 6" :priority="priority">
        <path d="M 50 6 L 72 28 L 50 50 L 28 28 L 50 6" />
        <text x="50" y="30" dominant-baseline="middle" text-anchor="middle">{{ title }}</text>
    </g>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { ref, remove } from "firebase/database";
    import db from '@/core/database';
    import { multiClick } from '@/core/helper';

    export default Vue.extend({
        name: 'Tile',
        props: ['title', 'priority', 'dbKey'],
        methods: {
        },
        data() {
            return {
                mycolor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16) + "44",
                clickEvent: multiClick(1000, (clicks) => {
                    if (clicks != 2) return
                    const dbRef = ref(db, 'tasks/' + this.dbKey)
                    remove(dbRef)
                })
            }
        },
        mounted() {
            (this["$el"].children[0] as HTMLElement).style.fill = this.mycolor;
        }
    });
</script>

<style scoped lang="scss">
    g {
        transform: translate(0, 44px) scale(0);
        transition: transform 0.5s;

        path {
            fill: rgba(255, 0, 0, 0.3);
        }
    }
</style>
