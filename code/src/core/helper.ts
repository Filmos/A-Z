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
    return "#" + (Math.abs(hashString(input)) % (256 ** 3)).toString(16)
}