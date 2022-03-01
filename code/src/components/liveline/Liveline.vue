<template>
    <div class="liveline">
        <input @input="(e) => update(e.target.value)" type="text" name="text" autocomplete="off" :class="Object.values(command).some(a=>!properArg(a))?'invalid':''">
        <div class="notes">
            <span v-for="(arg, argName) in command" :key="argName" :class="properArg(arg)?'':'invalid'"> {{ argName+": "+(arg.display || "&lt;missing&gt;") }} </span>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'Liveline',
        methods: {
            properArg(arg) {
                return !!arg.display
            },
            update(command) {
                this.command = {}
                if (!command) return

                let args = command.split(";").map(s => s.trim())
                this.command["Task"] = { val: args[0], display: args[0] }
                this.command["Deadline"] = { val: args[1], display: args[1] }

                if (args.length < 3) return
                this.command["Heads-up"] = { val: args[2], display: args[2] }

                if (args.length < 4) return
                this.command["Repeats"] = { val: args[3], display: args[3] }
            }
        },
        data() {
            return { command: "" }
        },
        mounted() {
            (this["$el"].children[0] as HTMLElement).style.fill = this.mycolor;
        }
    });
</script>

<style scoped lang="scss">

    .liveline {
        position: relative;
        display: flex;
        flex-direction: column;
        width: calc(100% - 2.8rem);
        margin: 1.3rem auto;
        border-radius: 4px;
        color: #BFD2FF;
        align-items: flex-start;
        /* Border */
        &:after, &:before, div:after, div:before {
            content: "";
            position: absolute;
            z-index: 999;
            background-position: 0 0;
            background: linear-gradient(to right, #B294FF, #57E6E6, #FEFFB8, #57E6E6, #B294FF);
            background-size: 500vw 100vh;
            animation: gradient 4s linear infinite;
        }

        &:before, &:after {
            left: 0;
            right: 0;
            height: 3px;
        }

        &:before {
            top: 0;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }

        &:after {
            bottom: 0;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
        }

        div:before, div:after {
            top: 3px;
            bottom: 3px;
            width: 3px;
        }

        div:before {
            left: 0;
        }

        div:after {
            right: 0;
            background-position: calc(2.8rem - 100vw) 0;
            animation-name: gradient-right;
        }


        input {
            flex-grow: 1;
            color: inherit;
            font-size: 1.5rem;
            line-height: 2rem;
            vertical-align: middle;
            border-style: none;
            background: transparent;
            outline: none;
            width: calc(100% - 2.4rem);
            padding: 0.8rem 1.2rem 0.6rem;
            background: #4e567373;

            &::-webkit-input-placeholder {
                color: #7881A1;
            }
        }

        .notes {
            padding: 0.75rem 1.2rem;
            white-space: pre-wrap;
            text-align: left;

            &:empty {
                padding: 0 0;
            }

            span {
                display: block;
            }
        }

        .invalid {
            color: #ffadc2;
        }
    }


    @keyframes gradient {
        0% {
            background-position: 0 0;
        }

        100% {
            background-position: 500vw 0;
        }
    }
    @keyframes gradient-right {
        0% {
            background-position: calc(2.8rem - 100vw) 0;
        }

        100% {
            background-position: calc(2.8rem + 400vw) 0;
        }
    }
</style>
