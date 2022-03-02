<template>
    <div class="liveline">
        <input @input="(e) => update(e.target.value)" type="text" name="text" autocomplete="off" :class="Object.values(command).some(a=>!properArg(a))?'invalid':''">
        <div class="notes">
            <span v-for="(arg, argName) in command" :key="argName" :class="properArg(arg)?'':'invalid'"> {{ argName+": "+displayArg(arg) }} </span>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'Liveline',
        methods: {
            properArg(arg) {
                return !!arg.val
            },
            displayArg(arg) {
                console.log(arg)
                if (!arg.raw) return "<missing>"
                let ret = arg.display(arg.val)
                if (!ret) return "<invalid>"
                return ret
            },
            update(command) {
                function parseDate(val) {
                    if (!val) return
                    let reg = val.match(/^(next)? ?(?:(Su)|(M)|(Tu)|(W)|(Th)|(F)|(Sa))/i)
                    if (reg) {
                        let day = 0
                        for (let i = 0; i < 7; i++) {
                            if (reg[i + 2]) { day = i; break }
                        }
                        let time = ((day - (new Date()).getDay() + 7) % 7) || 7
                        if (reg[1]) time += 7

                        let date = new Date()
                        date.setDate(date.getDate() + time)
                        date.setHours(12, 0, 0, 0)
                        return date
                    }

                    reg = val.match(/(\d\d?)(?:.| -)(\d\d?)/i)
                    if (reg) {
                        let date = new Date()
                        date.setMonth(parseInt(reg[2]) - 1)
                        date.setDate(parseInt(reg[1]))
                        date.setHours(12, 0, 0, 0)
                        return date
                    }
                }
                function parseDuration(val) {
                    if (!val) return
                    let pat = val.match(/(?:(\d+) ?(?:w(?:e(?:e(?:k(?:s)?)?)?)?))? ?\+? ?(?:(\d+) ?(?:d(?:a(?:y(?:s)?)?)?)?)?/i)
                    if(!pat[1] && !pat[2]) return

                    let days = 0
                    days += (pat[1] || 0) * 7
                    days += (pat[2] || 0) * 1

                    return days
                }

                function displayDate(val: Date) {
                    if (!val) return
                    let time = Math.ceil((val.getTime() - (new Date()).getTime()) / 1000 / 60 / 60 / 24)
                    let specialNames = {"-1": "Yesterday", "0": "Today", "1": "Tomorrow"}
                    return (specialNames[time+""] || ("In " + time + " days")) + " (" + (val.getDate()+"").padStart(2, "0") + "." + ((val.getMonth() + 1)+"").padStart(2, "0") + ")"

                }
                function displayDuration(val) {
                    if(!val) return
                    return val + " day" + (val>1?"s":"")
                }

                this.command = {}
                if (!command) return

                let args = command.split(";").map(s => s.trim())
                this.command["Task"] = { raw: args[0], val: args[0], display: v=>v }
                this.command["Deadline"] = { raw: args[1], val: parseDate(args[1]), display: displayDate }

                if (args.length < 3) return
                this.command["Heads-up"] = { raw: args[2], val: parseDuration(args[2]), display: displayDuration }

                if (args.length < 4) return
                this.command["Repeats"] = { raw: args[3], val: parseDuration(args[3]), display: displayDuration }
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
