<template>
    <div class="list">
        <Binder v-for="tile in positionedTiles" :key="tile.bind.getPath()" :bind="tile.bind">
            <div class="tile" :style="{transform: `translate(${tile.posX}%, ${tile.posY}%) scale(${tile.scale})`, '--scale': tile.scale}">
                <slot/>
            </div>
        </Binder>
        <svg class="borders" viewBox="0 0 100 100">
            <path v-for="tile in positionedTiles" :key="tile.bind.getPath()" class="border" :stroke="color('primary')" fill="none"
                :d="`M ${tile.posX+50-tile.scale*50} ${tile.posY+tile.scale*50} L ${tile.posX+50} ${tile.posY+tile.scale*100} L ${tile.posX+50+tile.scale*50} ${tile.posY+tile.scale*50}`" />
        </svg>
    </div>
</template>

<script lang="js">
    import AZComponent from '@/core/azcomponent';
    import Binder from '@/core/binder.vue';
    import { sortedIndex } from '@/core/helper'

    export default AZComponent({
        name: 'List',
        components: {
            Binder
        },
        computed: {
            positionedTiles() {
                let tiles = [];
                let binds = this.bind.iterate();
                for(let i in this.bind.iterate()) tiles.push({bind: binds[i], priority: 1});
                if(tiles.length == 0) return []

                const initialScale = 1.243
                const overlap = 0 * 0.88
                const innerSize = 0.89 + overlap / 18
                const minStackSize = 0.11
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

                    tiles[t].posX = thisStack.x
                    tiles[t].posY = (thisStack.y + (1 - innerSize) / 2 * 100 + 0.2)
                    tiles[t].scale = thisSize / 2 * innerSize

                    let nextRL = thisSize
                    let nextRR = thisStack.maxR - thisSize
                    let indexR = sortedIndex(stack, Math.min(nextRL, nextRR), s => s.maxSize)
                    stack.splice(indexR, 0, { x: thisStack.x + thisSize * 25 * innerSize - overlap, y: thisStack.y + thisSize * 25 * innerSize - overlap, maxL: nextRL, maxR: nextRR, maxSize: Math.min(nextRL, nextRR) })
                    let nextLR = thisSize
                    let nextLL = thisStack.maxL - thisSize
                    let indexL = sortedIndex(stack, Math.min(nextLL, nextLR), s => s.maxSize)
                    stack.splice(indexL, 0, { x: thisStack.x - thisSize * 25 * innerSize + overlap, y: thisStack.y + thisSize * 25 * innerSize - overlap, maxL: nextLL, maxR: nextLR, maxSize: Math.min(nextLL, nextLR) })
                }
                return tiles
            }
        }
    });
</script>

<style scoped lang="scss">
    .list {
        width: 100%;
        height: 100%;
        display: inline-grid;

        .tile {
            transform-origin: top;
            grid-area: 1 / 1;
            pointer-events: none;
            z-index: 10;
        }

        .borders {
            z-index: 11;
            grid-area: 1 / 1;
            pointer-events: none;
            stroke-width: 0.7;
        }
    }
</style>