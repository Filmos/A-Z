<template>
    <div class="outer-holder">
        <svg class="inner-holder" viewBox="0 0 100 100" ref="tiles">
            <path class="border" d="M 50 3 L 97 50 L 50 97 L 3 50 L 50 3" @dblclick="addNew()"/>
            <Tile v-for="(tile, key) in orderedTiles" :key="key" :title="tile.title" :priority="tile.priority"/>
        </svg>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { ref, onValue, push, set } from "firebase/database";
    import Tile from './Tile.vue';
    import db from '@/core/database';
    import { sortedIndex } from '@/core/helper'

    const dbRef = ref(db, 'tasks/');

    export default Vue.extend({
        name: 'Frame',
        components: {
            Tile
        },
        data() {
            return { tiles: null }
        },
        computed: {
            orderedTiles() {
                return Object.fromEntries(Object.entries(this.tiles || {}).map(([k, t]: [string, any]) => {
                    let prior = Math.floor(Math.random()*100)+1
                    return [k, { ...t, priority: prior }]
                }))
            }
        },
        methods: {
            addNew() {
                set(push(dbRef), {
                    title: String.fromCharCode(Math.floor(Math.random() * 25 + 65)) + String.fromCharCode(Math.floor(Math.random() * 25 + 97)) + String.fromCharCode(Math.floor(Math.random() * 25 + 97)) + String.fromCharCode(Math.floor(Math.random() * 25 + 97)),
                    priority: Math.floor(Math.random()*10)
                })
            }
        },
        mounted() {
            onValue(dbRef, (snapshot) => {
                this.tiles = snapshot.val();
            })
        },
        updated() {
            let tiles = ([...(this.$refs["tiles"] as HTMLElement).querySelectorAll(".inner-holder > *:not(.border)")] as HTMLElement[])
                .map(el => { return { element: el, priority: parseFloat(el.getAttribute("priority") || "0") } })
                .sort((a, b) => (b["priority"] - a["priority"]))

            setTimeout(() => {
                const initialScale = 1.243
                let recentScale = initialScale/tiles[0].priority
                let stack = [{ x: 0, y: 0, maxL: 2, maxR: 2, maxSize: initialScale}]

                for (let t = 0; t < tiles.length; t++) {
                    let thisStack = stack.pop()
                    if (!thisStack) break

                    let thisSize = recentScale * tiles[t].priority
                    if (thisSize > thisStack.maxSize) {
                        thisSize = thisStack.maxSize
                        recentScale = thisStack.maxSize / tiles[t].priority
                    }

                    tiles[t].element.style.transform = "translate(" + thisStack.x + "px, " + thisStack.y + "px) scale(" + thisSize + ")"
                    tiles[t].element.style.transitionDelay = Math.round(Math.random() * 150) / 1000 + "s"

                    let nextRL = thisSize
                    let nextRR = thisStack.maxR - thisSize
                    let indexR = sortedIndex(stack, Math.min(nextRL, nextRR), (s: any) => s.maxSize)
                    stack.splice(indexR, 0, { x: thisStack.x + thisSize * 22, y: thisStack.y + thisSize * 22, maxL: nextRL, maxR: nextRR, maxSize: Math.min(nextRL, nextRR) })
                    let nextLR = thisSize
                    let nextLL = thisStack.maxL - thisSize
                    let indexL = sortedIndex(stack, Math.min(nextLL, nextLR), (s: any) => s.maxSize)
                    stack.splice(indexL, 0, { x: thisStack.x - thisSize * 22, y: thisStack.y + thisSize * 22, maxL: nextLL, maxR: nextLR, maxSize: Math.min(nextLL, nextLR) })
                }
            }, 20)
        }
    });
</script>

<style scoped lang="scss">
    $base-color: #03010e;

    .inner-holder {
        width: min(80%, 55vh);
        height: min(80%, 55vh);

        .border {
            stroke-width: 4;
            fill: rgba($base-color, 0.4);
            stroke: $base-color;
            stroke-linecap: square;
            stroke-linejoin: miter;
        }
    }
</style>
