const Information = require("../models/information");
var osu = require('node-os-utils')
var process = require('process')
var cpu = osu.cpu;
var mem = osu.mem;
const si = require('systeminformation');
const sysInfoDBService = require("../services/sysInfoDbService");

//get the system data 
async function sysInformations() {

    let curDate;
    let cpUsage;
    let memoryUsage;
    let networkStat;
    try {
        // console.log(await si.processes());  
        //curDate = new Date();
        curDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        cpUsage = await cpu.usage();
        //Memory usage by rss:the portion of memory occupied by a process that is held in main memory (RAM) MB
       // memoryUsage = process.memoryUsage().rss;
       memoryUsage = await mem.info();
      //  console.log(memoryUsage);
        networkStat = await si.networkStats();
        //console.log(JSON.stringify(memoryUsage));
       
       
      
    } catch (error) {
        console.log(error);
    }
    let curSysInfo = new Information(curDate, cpUsage, JSON.stringify(memoryUsage) , networkStat[0].rx_bytes,networkStat[0].tx_bytes);
    //console.log(curSysInfo);
    return curSysInfo;
}
let currentInformation = {};

// get the current informations 
async function CurrentInformation() {
    console.log("Collection information");
    currentInformation = await sysInformations();
    //SaveToDatabase
    sysInfoDBService.saveInfo(currentInformation);
    setTimeout( CurrentInformation, 20000);
}

CurrentInformation();

function currentInfo() {
    return currentInformation;
}


module.exports.sysInformations = sysInformations;
module.exports.currentInfo = currentInfo;
