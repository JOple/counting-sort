import { performance as perfLoc } from "perf_hooks"

export async function execTime(fn: Function, ...args: any[]) {
    var perf = perfLoc ? perfLoc : performance
    var start = perf.now()
    await fn(...args)
    return perf.now() - start
}
export function* range(start: number, end: number, delta = 1) {
    var change = Math.abs(delta)
    if (start < end) {
        for (var i = start; i <= end; i += change)
            yield i
    } else {
        for (var i = start; i >= end; i -= change)
            yield i
    }
}
export function* subarray(arr: number[], s: number, e: number) {
    for (var i = s; i < e; i++)
        yield arr[i]
}
