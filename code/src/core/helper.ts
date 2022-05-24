export function sortedIndex<ArrayType, ValueType>(array: ArrayType[], value: ValueType, transform: (a: ArrayType) => ValueType) {
    let low = 0,
        high = array.length;

    while (low < high) {
        const mid = (low + high) >>> 1;
        if (transform(array[mid]) < value) low = mid + 1;
        else high = mid;
    }
    return low;
}

export function multiClick(maxDelay: number, func: (clicks: number, ...args: any[]) => void): (...args: any[]) => void {
    let lastClick = 0
    let clickCount = 0

    function ret(...passThrough: any[]) {
        if ((new Date()).getTime() - lastClick > maxDelay) clickCount = 0
        clickCount+=1
        lastClick = (new Date()).getTime()

        return func(clickCount, ...passThrough)
    }
    return ret
}

export function hashString(input: string): number {
    let hash = 0, i, chr
    if (input.length === 0) return hash
    for (i = 0; i < input.length; i++) {
        chr = input.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0
    }
    return hash
}
export function randomColorFromString(input: string): string {
    const randomHue = Math.abs(hashString(input)) % 360
    return hslToHex(randomHue, 89, 38)
}
export function hslToHex(h: number, s: number, l: number) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function dateDifferenceInDays(a: Date | number, b: Date | number): number {
    if (typeof a === 'number') a = new Date(a)
    if (typeof b === 'number') b = new Date(b)

    const a_zeroed = new Date(a.getFullYear(), a.getMonth(), a.getDate())
    const b_zeroed = new Date(b.getFullYear(), b.getMonth(), b.getDate())

    return (a_zeroed.getTime()-b_zeroed.getTime())/1000/60/60/24
}
export function displayDate(date: Date | number) : string {
    if (typeof date === 'number') date = new Date(date)
    if (date === undefined) return ""

    const time = dateDifferenceInDays(date, new Date())
    const specialNames : { [name: number]: string } = {"-1": "Yesterday", "0": "Today", "1": "Tomorrow"}
    return (specialNames[time] || (time < 0 ? `${time} days ago` : (`In ${time} days`))) + " (" + (date.getDate()+"").padStart(2, "0") + "." + ((date.getMonth() + 1)+"").padStart(2, "0") + ")"

}