import config from "../../config.client";

export async function rpc(obj: RpcOpts) {
    return new Promise<any>((resolve, reject) => {
        var url = config.baseUrl + config.rpcAccessPoint + "?q=" + encodeURI(JSON.stringify({ ...config, ...obj }))
        console.log("Contacting " + url)
        $.get(url).done(a => {
            resolve(a)
        }).fail((e, err) => {
            reject(err)
        })
    })
}