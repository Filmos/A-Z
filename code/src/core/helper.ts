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

export function multiClick(maxDelay: number, func: (clicks: number, ...args: any[])=>void) {
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