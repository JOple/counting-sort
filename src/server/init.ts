import app from "."
import config from "../../config.server"
import express from "express"
import { join } from "path"

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(join(config.rootDir, "public")))