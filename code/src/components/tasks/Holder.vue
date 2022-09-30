<template>
    <div class="outer-holder">
        <div class="task-title" ref="title" :style="{ color: color('primary') }" />
        <div class="inner-holder">
            <svg viewBox="0 0 100 100">
                <path class="border" d="M 50 3 L 97 50 L 50 97 L 3 50 L 50 3" :stroke="color('primary')"
                    :fill="color('primaryBackgroundDarkTransparent')" />
            </svg>
            <Tile v-for="(tile, key) in orderedTiles" ref="tiles" style="grid-area: 1 / 1; transform-origin: top;"
                :key="key" :dbKey="key" :full="tile" :title="tile.title" :priority="tile.priority"
                @displaytitle="displayTitle" @hidetitle="hideTitle" />
        </div>
    </div>
</template>

<script lang="js">
import { child, onValue } from "firebase/database";
import Tile from './Tile.vue';
import db from '@/core/database';
import { sortedIndex, dateDifferenceInDays } from '@/core/helper'

export default {
    name: 'Frame',
    components: {
        Tile
    },
    inject: ['color'],
    data() {
        return { tiles: null }
    },
    computed: {
        orderedTiles() {
            return Object.fromEntries(Object.entries(this.tiles || {})
                .filter(([, t]) => {
                    if (t.headsup === undefined) return true
                    return dateDifferenceInDays(t.deadline, new Date()) <= t.headsup
                })
                .map(([k, t]) => {
                    let prior = 1 / (Math.max(dateDifferenceInDays(t.deadline, new Date()), -1) + 2)
                    return [k, { ...t, priority: prior }]
                })
            )
        }
    },
    async mounted() {
        // TODO: handle loss of connection
        onValue(child(await db, 'tasks/'), (snapshot) => {
            this.tiles = snapshot.val();
        })
    },
    updated() {
        let tiles = (this.$refs["tiles"] || [])
            .map(el => { return { element: el.$el, priority: parseFloat(el.priority || "0") } })
            .sort((a, b) => (b["priority"] - a["priority"]))
        if (tiles.length == 0) return

        setTimeout(() => {
            // TODO: this is a hacky way to do this, it needs to be corrected for the absolute width of the border
            const initialScale = 1.243
            const overlap = 0.25 * 0.88
            const innerSize = 0.88 + overlap / 18
            let minStackSize = 0.11
            let recentScale = initialScale / tiles[0].priority
            let stack = [{ x: 0, y: overlap * 1.3, maxL: 2, maxR: 2, maxSize: initialScale }]

            for (let t = 0; t < tiles.length; t++) {
                let thisStack = stack.pop()
                if (!thisStack) break

                let thisSize = recentScale * tiles[t].priority
                if (thisSize > thisStack.maxSize) {
                    thisSize = thisStack.maxSize
                    recentScale = thisStack.maxSize / tiles[t].priority
                } else if (thisSize < minStackSize) {
                    thisSize = Math.min(minStackSize, thisStack.maxSize)
                    recentScale = thisSize / tiles[t].priority
                }

                tiles[t].element.style.transform = "translate(" + thisStack.x + "%, " + (thisStack.y + (1 - innerSize) / 2 * 100) + "%) scale(" + thisSize / 2 * innerSize + ")"
                tiles[t].element.style.setProperty("--scale", thisSize / 2 * innerSize)
                tiles[t].element.style.transitionDelay = Math.round(Math.random() * 150) / 1000 + "s"

                let nextRL = thisSize
                let nextRR = thisStack.maxR - thisSize
                let indexR = sortedIndex(stack, Math.min(nextRL, nextRR), s => s.maxSize)
                stack.splice(indexR, 0, { x: thisStack.x + thisSize * 25 * innerSize - overlap, y: thisStack.y + thisSize * 25 * innerSize - overlap, maxL: nextRL, maxR: nextRR, maxSize: Math.min(nextRL, nextRR) })
                let nextLR = thisSize
                let nextLL = thisStack.maxL - thisSize
                let indexL = sortedIndex(stack, Math.min(nextLL, nextLR), s => s.maxSize)
                stack.splice(indexL, 0, { x: thisStack.x - thisSize * 25 * innerSize + overlap, y: thisStack.y + thisSize * 25 * innerSize - overlap, maxL: nextLL, maxR: nextLR, maxSize: Math.min(nextLL, nextLR) })
            }
        }, 20)
    },
    methods: {
        displayTitle(title) {
            this.$refs["title"].innerText = title
        },
        hideTitle(title) {
            if (this.$refs["title"].innerText != title) return
            this.$refs["title"].innerText = ""
        }
    }
};
</script>

<style scoped lang="scss">
.inner-holder {
    width: min(80%, 55vh);
    height: min(80%, 55vh);
    display: inline-grid;

    svg {
        grid-area: 1 / 1;

        .border {
            stroke-width: 4;
            stroke-linecap: square;
            stroke-linejoin: miter;
        }
    }

}

.task-title {
    font-size: 1.75rem;
    line-height: 2rem;
    font-weight: 700;
    min-height: 2rem;

    cursor: default;
    user-select: none;
    pointer-events: none;
}
</style>
