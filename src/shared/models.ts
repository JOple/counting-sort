declare interface ArrayMaker {
    (size: number): number[]
}
declare interface ArrayMakers {
    [arrName: string]: ArrayMaker
}

declare interface NumberSorter {
    (array: number[]): PromiseLike<number[]>
}
declare interface NumberSorters {
    [sortName: string]: NumberSorter
}

declare interface CountIsDone {
    (counts: number[], isLast: boolean): void
}
declare interface ArrayToCount {
    (array: number[], done: CountIsDone): void
}
declare interface ArrayIsDone {
    (array: number[]): void
}
declare interface CountToArray {
    (done: ArrayIsDone): CountIsDone
}

declare interface RpcOpts {
    sort?: string,
    arr?: "desc" | "asc" | "rand"
    n?: number,
    show?: boolean
}
