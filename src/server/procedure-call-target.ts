import app from ".";
import config from "../../config.server";
import * as osm from "../client/index"

app.get("/rpc", (req, res) => {
    const defaults: RpcOpts = {
        sort: "vanilla",
        arr: "desc",
        n: 1000,
        show: false,
    }
    var cfg = JSON.parse(req.query.q || "{}")

    var cmd = { ...config, ...osm.config, ...defaults, ...cfg }
    for (var key in cmd)
        osm.config[key] = cmd[key]

    console.log("RpcOpts:", cmd)
    var out = []
    var fn = osm.sort[cmd.sort]
    var arr = [...osm.arr[cmd.arr](cmd.n)]

    osm.execTime(async function (arr: number[]) {
        out = await fn(arr)
    }, arr).then(time => {
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.json({
            opts: cmd,
            execTime: time,
            output: cfg.show ? out : undefined
        })
    })
})