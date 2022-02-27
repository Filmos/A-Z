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