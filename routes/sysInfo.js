"use strict";
const express = require("express");
const sysInfoService = require("../services/sysInfoService");
const sysInfoDBService = require("../services/sysInfoDbService");
let router = express.Router();

sysInfoDBService.connectionDB();

router
    .route('/informations')
    .get(async (req, res) => {
        if (typeof req.query.startDate !== "undefined" && req.query.startDate != null && typeof req.query.endDate !== "undefined" && req.query.endDate != null) {
            const startDate = req.query.startDate;//string
            const endDate = req.query.endDate;//string
            const result = await sysInfoDBService.informationsByPeriod(startDate,endDate);
            res.statusCode = 200;
            res.send(result);
        }
        else {
            const result = sysInfoService.currentInfo();
            res.statusCode = 200;
            res.send(result);
        }
    });

router
    .route('/logs/appNames')
    .get(async (req, res) => {
        const result = await sysInfoDBService.allAppNames();
        res.statusCode = 200;
        res.send(result);
    });

router
    .route('/logs')
    .get(async (req, res) => {
       
        if (typeof req.query.startDate !== "undefined" && req.query.startDate != null
            && typeof req.query.endDate !== "undefined" && req.query.endDate != null) {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const logLevel = req.query.logLevel;
            const appName = req.query.appName;
            const keyword = req.query.keyword;
            const result = await sysInfoDBService.logsByFilters(startDate, endDate, logLevel, appName, keyword);
            res.statusCode = 200;
            res.send(result);
        }
        else {
            //res.statusCode = 204; //no content :if uncommented will always return 1 in postman 
            res.statusCode = 200;
            res.json([]);

        }

    })
    .post(async (req, res) => {
        //console.log("posting" + req.body.datetime)
        const result = sysInfoDBService.saveLog(req.body);
        res.statusCode = 200;
        res.send(result);
    });

module.exports = router;