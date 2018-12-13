import config from "../../config.client";
import { ATC_SEQ, CTA_SIMPLE_ASC_1, ATC_PARALLEL_2, CTA_SIMPLE_ASC_2, CTA_GENERAL_ASC, ATC_B_HTTP, ATC_B_HTTPALLSERVER, CTA_SEQ_ASC, ATC_B_HTTP_HALFCLIENT_HALFSERVER } from "../shared/csort";

export const sort: NumberSorters = {
    vanilla: (arr: number[]) => Promise.resolve(arr.sort((a, b) => a - b)),
    csortSeq: (arr: number[]) => new Promise<number[]>(resolve => {
        ATC_SEQ(arr, CTA_SEQ_ASC(resolve))
    }),
    csortP2: (arr: number[]) => new Promise<number[]>(resolve => {
        ATC_PARALLEL_2(arr, CTA_SIMPLE_ASC_2(resolve))
    }),
    csortHttp: (arr: number[]) => new Promise<number[]>(resolve => {
        ATC_B_HTTP(config.baseUrl + config.csortHttpPath)(config.csortHttpChunkSize)(arr, CTA_GENERAL_ASC(resolve))
    }),
    csortHttpHalfServerHalfClient: (arr: number[], serverDist: number = 0.5, id = 2) => new Promise<number[]>(resolve => {
        ATC_B_HTTP_HALFCLIENT_HALFSERVER(config.baseUrl + config.csortHttpAllServerPath + "/" + id)(config.csortHttpChunkSize)(serverDist)(arr, CTA_GENERAL_ASC(resolve))
    }),
    csortHttpAllServer: (arr: number[], id = 1) => new Promise<number[]>(resolve => {
        ATC_B_HTTPALLSERVER(config.baseUrl + config.csortHttpAllServerPath + "/" + id)(config.csortHttpChunkSize)(arr, CTA_SEQ_ASC(resolve))
    }),
}