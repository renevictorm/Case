const express = require('express')

module.exports = function (server) 
{

    const router = express.Router()
    server.use('/api', router)


    const caseService = require('../api/case/caseService')
    caseService.register(router, '/case')
}