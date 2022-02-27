<template>
    <div class="outer-holder">
        <svg class="inner-holder" viewBox="0 0 100 100" ref="tiles">
            <path class="border" d="M 50 3 L 97 50 L 50 97 L 3 50 L 50 3" v-on:dblclick="addNew()"/>
            <Tile v-for="(tile, key) in orderedTiles" :key="key" :title="tile.title" :priority="tile.priority"/>
        </svg>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { ref, onValue, push, set } from "firebase/database";
    import Tile from './Tile.vue';
    import db from '@/core/database';

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
                return Object.fromEntries(Object.entries(this.tiles || {}).map(([k, t]: [string, Object]) => {
                    let prior = Math.random()
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
            },
            arrangeTiles() {
                let tiles = [...(this.$refs["tiles"] as HTMLElement).querySelectorAll(".inner-holder > *:not(.border)")] as HTMLElement[]
                tiles = tiles.sort((a: HTMLElement, b: HTMLElement) => (parseFloat(a.getAttribute("priority") || "0") - parseFloat(b.getAttribute("priority") || "0")))
                setTimeout(() => {
                    for(let t = 0; t < tiles.length; t++) {
                        let trans = Math.round((1 - 1 / (2 ** t)) * 44 * 1000) / 1000
                        tiles[t].style.transform = "translate(" + trans + "px, " + trans + "px) scale(" + 1 / (2 ** t) + ")"
                        tiles[t].style.transitionDelay = Math.round(Math.random()*150)/1000+"s"
                    }
                }, 20)
            }
        },
        mounted() {
            onValue(dbRef, (snapshot) => {
                this.tiles = snapshot.val();
            })
        },
        updated() {
            this.arrangeTiles()
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
