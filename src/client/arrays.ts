import { range } from "../shared/utils";

export const arr: ArrayMakers = {
    asc: n => [...range(1, n)],
    desc: n => [...range(n, 1)],
    rand: n => [...range(1, n)].sort((a, b) => Math.random() - 0.5)
}