export const config = {
    baseUrl: "http://localhost:" + (process.env.PORT || 3000),
    rpcAccessPoint: "/rpc",
    csortHttpPath: "/ss/http",
    csortHttpAllServerPath: "/ss/http-all-server",
    csortHttpChunkSize: 10000
}
export default config