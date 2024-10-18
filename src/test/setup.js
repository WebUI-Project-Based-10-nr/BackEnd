const express = require('express')
const request = require('supertest')
require('~/initialization/envSetup')

const dbHandler = require("~/test/dbHandler");
const initialization = require("~/initialization/initialization");

const serverInit = async () => {
  await dbHandler.connect()
  let app = express()
  initialization(app)
  return { app: request(app) }
}

const serverCleanup = async () => {
  await dbHandler.clearDatabase()
}

const stopServer = async () => {
  await dbHandler.closeDatabase()
}

module.exports = { serverInit, serverCleanup, stopServer }
