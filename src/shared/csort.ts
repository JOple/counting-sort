import request from "request"
import { subarray } from "./utils";

export function count(arr: number[], start: number, end: number) {
    var len = arr.length
    var counts: number[] = []
    for (var i = 0; i < len; i++) {
        var num = arr[i]
        counts[num] = counts[num] ? counts[num] + 1 : 1
    }
    return counts
}
export function output(counts: number[], asc: boolean) {
    var output: number[] = []
    var update = asc ? num => output.push(num) : num => output.unshift(num)

    var len = counts.length
    for (var num = 0; num < len; num++) {
        var count = counts[num]
        if (count) {
            for (var i = 0; i < count; i++)
                update(num)
        }
    }

    return output
}
export function joinCounts(a: number[], b: number[]) {
    var end = Math.max(a.length, b.length)
    for (var i = 0; i < end; i++) {
        var c1 = a[i] || 0
        var c2 = b[i] || 0
        a[i] = c1 + c2
    }
}

/***************************************************************************/

export const CTA_B_SEQ: (asc: boolean) => CountToArray = asc => cb => (counts, _) => cb(output(counts, asc))

export const CTA_SEQ_ASC = CTA_B_SEQ(true)

export const CTA_B_SIMPLE: (asc: boolean) => (nthreads: number) => CountToArray = asc => nthreads => cb => {
    var accum = []
    var done = 0
    return (counts, _) => {
        done++
        joinCounts(accum, counts)
        if (done >= nthreads)
            cb(output(accum, asc))
    }
}
export const CTA_SIMPLE_ASC_1 = CTA_B_SIMPLE(true)(1)
export const CTA_SIMPLE_ASC_2 = CTA_B_SIMPLE(true)(2)

export const CTA_B_GENERAL: (asc: boolean) => CountToArray = asc => cb => {
    var accum = []
    var status = []
    var done = 0
    var finalReached = false

    return (counts, isDone) => {
        finalReached = isDone
        var d = done++

        status[d] = false
        joinCounts(accum, counts)
        status[d] = true

        if (finalReached) {
            var oneIsNotDone = false
            for (var i = 0; i < status.length; i++) {
                if (!status[i]) {
                    oneIsNotDone = true
                    break
                }
            }
            if (!oneIsNotDone)
                cb(output(accum, asc))
        }
    }
}
export const CTA_GENERAL_ASC = CTA_B_GENERAL(true)

/***************************************************************************/

export const ATC_SEQ: ArrayToCount = (arr, cb) => cb(count(arr, 0, arr.length), true)

export const ATC_B_PARALLEL: (nthreads: number) => ArrayToCount = nt => {
    async function asyncCount(arr: number[], s: number, e: number) {
        return count(arr, s, e)
    }

    return (arr, cb) => {
        var len = arr.length
        var threads = Math.min(nt, len)
        var size = Math.ceil(len / threads)
        var countDone = 0

        for (var i = 0; i < threads; i++) {
            var start = i * size
            var end = Math.min(start + size, len) - 1
            asyncCount(arr, start, end).then(c => {
                countDone++
                cb(c, countDone == threads)
            })
        }
    }
}
export const ATC_PARALLEL_2 = ATC_B_PARALLEL(2)

export const ATC_B_HTTP: (uri: string) => (chunkSize: number) => ArrayToCount = uri => {

    async function asyncCount(arr: number[], s: number, e: number) {
        return new Promise<number[]>(resolve => {
            console.log("ATC_HTTP Contacting", uri)
            request.post(uri, {
                body: JSON.stringify([...subarray(arr, s, e)]),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }, (err, resp, body) => {
                resolve(JSON.parse(body))
            })
        })
    }

    return chunkSize => (arr, cb) => {
        var len = arr.length
        var threads = Math.floor(len / Math.min(chunkSize, len))
        var size = Math.ceil(len / threads)
        var countDone = 0

        for (var i = 0; i < threads; i++) {
            var start = i * size
            var end = Math.min(start + size, len)
            asyncCount(arr, start, end).then(c => {
                countDone++
                cb(c, countDone == threads)
            })
        }
    }
}

export const ATC_B_HTTPALLSERVER: (uri: string) => (chunkSize: number) => ArrayToCount = uri => {

    async function asyncCount(arr: number[], s: number, e: number) {
        return new Promise<void>(resolve => {
            console.log("ATC_HTTPALLSERVER Contacting", uri)
            request.post(uri, {
                body: JSON.stringify([...subarray(arr, s, e)]),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }, (err, resp, body) => {
                resolve()
            })
        })
    }
    async function getCounts() {
        return new Promise<number[]>(resolve => {
            request.get(uri, {
                headers: {
                    "Accept": "application/json"
                }
            }, (err, resp, body) => {
                resolve(JSON.parse(body))
            })
        })
    }

    return chunkSize => (arr, cb) => {
        var len = arr.length
        var threads = Math.floor(len / Math.min(chunkSize, len))
        var size = Math.ceil(len / threads)
        var countDone = 0

        for (var i = 0; i < threads; i++) {
            var start = i * size
            var end = Math.min(start + size, len)
            asyncCount(arr, start, end).then(() => {
                countDone++
                if (countDone == threads) {
                    getCounts().then(counts => {
                        cb(counts, true)
                    })
                }
            })
        }
    }
}
