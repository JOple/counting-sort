import express from "express"
import * as osm from "../client/index"
import config from "../../config.server"

export const app = express()
export default app

import "./init"

import "./main-page"
import "./procedure-call-target"
import "./sort-services"

app.listen(config.serverPort, () => console.log("Server started at " + config.serverPort))
