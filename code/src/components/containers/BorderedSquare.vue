<template>
    <div class="bordered-square">
        <svg viewBox="0 0 100 100">
            <path class="border" d="M 50 3 L 97 50 L 50 97 L 3 50 L 50 3" :stroke="color('primary')"
                :fill="color('primaryBackgroundDarkTransparent')" />
        </svg>
        <div class="inner-slot"><slot/></div>
    </div>
</template>

<script lang="js">
    import AZComponent from '@/core/azcomponent.js';
    export default AZComponent({
        name: 'BorderedSquare'
    });
    </script>

    <style scoped lang="scss">
    .bordered-square {
        width: min(80%, 55vh);
        height: min(80%, 55vh);
        display: inline-grid;

        > svg {
            grid-area: 1 / 1;

            .border {
                stroke-width: 4;
                stroke-linecap: square;
                stroke-linejoin: miter;
            }
        }

        .inner-slot {
            grid-area: 1 / 1;
            display: inline-grid;
        }

    }
</style>
