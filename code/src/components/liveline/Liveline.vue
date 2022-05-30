<template>
    <div class="liveline" :style="{borderColor: color('primary'), color: color('primaryInput'), '--invalidColor': color('invalidInput')}">
        <input @input="(e) => update(e.target.value)" @keyup.enter="(e) => execute(e.target)" type="text" name="text" autocomplete="off" :class="isValid?'':'invalid'" :style="{background: color('secondaryBackgroundTransparent')}">
        <div class="notes" :style="{background: color('secondaryBackgroundExtraTransparent')}">
            <span v-for="(arg, argName) in command" :key="argName" :class="properArg(arg)?'':'invalid'"> {{ argName+": "+displayArg(arg) }} </span>
        </div>
    </div>
</template>

<script lang="js">
    import db from '@/core/database';
    import { child, push, set } from "firebase/database";
    import { displayDate } from '@/core/helper';

    export default {
        name: 'Liveline',
        inject: ['color'],
        methods: {
            properArg(arg) {
                return arg.val !== undefined
            },
            displayArg(arg) {
                if (arg === undefined || arg.raw === undefined) return "<missing>"
                let ret = arg.display(arg.val)
                if (ret === undefined) return "<invalid>"
                return ret
            },
            update(command) {
                function parseDate(val) {
                    if (val === undefined) return
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
                    if (val === undefined) return
                    let pat = val.match(/(?:(\d+) ?(?:w(?:e(?:e(?:k(?:s)?)?)?)?))? ?\+? ?(?:(\d+) ?(?:d(?:a(?:y(?:s)?)?)?)?)?/i)
                    if(!pat || (!pat[1] && !pat[2])) return

                    let days = 0
                    days += (parseInt(pat[1]) || 0) * 7
                    days += (parseInt(pat[2]) || 0) * 1

                    return days
                }

                function displayDuration(val) {
                    if(val === undefined) return
                    return val + " day" + (val>1?"s":"")
                }

                this.command = {}
                if (!command) return

                let args = command.split(";").map((s) => s.trim())
                this.command["Task"] = { raw: args[0], val: args[0], display: v=>v }
                this.command["Deadline"] = { raw: args[1], val: parseDate(args[1]), display: displayDate }

                if (args.length < 3) return
                this.command["Heads-up"] = { raw: args[2], val: parseDuration(args[2]), display: displayDuration }

                if (args.length < 4) return
                this.command["Repeats"] = { raw: args[3], val: parseDuration(args[3]), display: displayDuration }
            },
            async execute(input) {
                if (!this.isValid) return
                let newEntry = {
                    title: this.command["Task"].val,
                    deadline: this.command["Deadline"].val.getTime()
                }
                if (this.command["Heads-up"]?.val !== undefined) newEntry.headsup = this.command["Heads-up"]?.val
                if (this.command["Repeats"]?.val !== undefined) newEntry.repeats = this.command["Repeats"]?.val

                set(push(child(await db, 'tasks/')), newEntry)
                this.command = {}
                input.value = ""
            }
        },
        computed: {
            isValid() {
                if(!this.command) return false
                return !Object.values(this.command).some(a => !this.properArg(a))
            }
        },
        data() {
            return { command: {} }
        }
    };
</script>

<style scoped lang="scss">

    .liveline {
        position: relative;
        display: flex;
        flex-direction: column;
        width: calc(100% - 2.8rem);
        margin: 1.3rem auto;
        border-width: 3px;
        border-style: solid;
        border-radius: 4px;
        align-items: flex-start;

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
        }

        .notes {
            padding: 0.75rem 1.2rem;
            white-space: pre-wrap;
            text-align: left;
            width: calc(100% - 2.4rem);

            &:empty {
                padding: 0 0;
            }

            span {
                display: block;
            }
        }

        .invalid {
            color: var(--invalidColor);
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
