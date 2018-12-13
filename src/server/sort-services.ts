import app from ".";
import { joinCounts, count } from "../shared/csort";

app.post("/ss/http", (req, res) => {
    var counts: number[] = []
    for (var num of <number[]>req.body)
        counts[num] = counts[num] ? counts[num] + 1 : 1
    res.json(counts)
})

export const httpAllServerStatus: { [id: string]: number } = {}
export const httpAllServerRecords: { [id: string]: number[] } = {}
app.get("/ss/http-all-server/", (req, res) => {
    res.json({
        records: httpAllServerRecords,
        status: httpAllServerStatus
    })
})
app.post("/ss/http-all-server/:id", (req, res) => {
    var id = req.params.id
    var arr = <number[]>req.body

    var counts = httpAllServerRecords[id]
    if (!counts) httpAllServerRecords[id] = counts = []

    httpAllServerStatus[id] = (httpAllServerStatus[id] || 0) + 1
    var newCounts = count(arr, 0, arr.length)
    joinCounts(counts, newCounts)
    httpAllServerStatus[id] = httpAllServerStatus[id] - 1

    res.sendStatus(200)
})
app.get("/ss/http-all-server/:id", (req, res) => {
    res.json(httpAllServerRecords[req.params.id] || [])
    delete httpAllServerRecords[req.params.id]
    delete httpAllServerStatus[req.params.id]
})