let mysql = require('mysql2');
const sysInfoService = require("../services/sysInfoService");
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'systemInformations',
});



//connect to DB
function connectionDB() {
    console.log("trying to connect ");
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected!');
      });
}

// Save system Information in DB
function saveInfo(sysInfo) {
    //console.log("heyyyy"+sysInfo.memoryUsage);
    var query = "INSERT INTO sysinfo (date_time,cpu_usage,memory_usage,received_network_bytes,transferred_network_bytes) VALUES ('"+sysInfo.time+"','"+sysInfo.cpUsage+"','"+sysInfo.memoryUsage+"','"+sysInfo.received_network_bytes+"','"+sysInfo.trasnsferred_network_bytes+"')";
    connection.query(query, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
}

// clear DB from data old than 10 days 
function clearDataBase() {
    var today = new Date();
    var tenDaysAgo = new Date(today.setDate(today.getDate() - 10)).toISOString().slice(0, 19).replace('T', ' ');
    var query = "DELETE FROM sysinfo WHERE date_time<= '"+tenDaysAgo+"'";
    connection.query(query, function (err, result) {
      if (err) throw err;
     // console.log("deleted successfully");
    });
    
}

//clear the database every 2 seconds
setInterval(clearDataBase, 2000);

//get the informations of a specific period 
async function informationsByPeriod(startDate, endDate) {
    var query = "SELECT * FROM sysinfo where date_time between'"+startDate+"'and'"+endDate+"'" ;
    return new Promise(data => { connection.query(query, function (err, result) {
        if (err) throw err;
       try {
        data(result);

    } catch (error) {
        data({});
        throw error;
    }
        })
    });
     
   
}

//add log informations to db 
function saveLog(reqBody) {
    let sysInfo = sysInfoService.currentInfo();
    var query = "INSERT INTO loginfo (date_time,app_name,log_level,log_string,sys_info_date,cpu_usage,memory_usage,received_network_bytes,transferred_network_bytes) VALUES ('"+reqBody.datetime+"','"+reqBody.appName+"','"+reqBody.logLevel+"','"+reqBody.logString+"','"+sysInfo.time+"','"+sysInfo.cpUsage+"','"+sysInfo.memoryUsage+"','"+sysInfo.received_network_bytes+"','"+sysInfo.transferred_network_bytes+"')";
    connection.query(query, function (err, result) {
      if (err) throw err;
     // console.log(" record inserted sucessfully");
    });
}

//get the logs of a specific period 
async function logsByPeriod(startDate, endDate) {
    var query = "SELECT * FROM loginfo where date_time between'"+startDate+"'and'"+endDate+"'" ;
    return new Promise(data => { connection.query(query, function (err, result) {
        if (err) throw err;
       try {
        data(result);

    } catch (error) {
        data({});
        throw error;
    }
        })
    });
}

//get the logs by date ,appName ,logLevel ,keyword
async function logsByFilters(startDate, endDate, logLevel, appName, keyword) {
    var whereClauseArray = [];

    if (startDate && endDate)
        whereClauseArray.push("date_time BETWEEN " + '"' + startDate + '" and "' + endDate+ '"');
    if (logLevel)
      whereClauseArray.push('log_level = "' +  logLevel + '"');
    if (appName)
      whereClauseArray.push('app_name = "' +  appName + '"');
    if (keyword)
      //whereClauseArray.push('log_string like "%' +  keyword + '%"');
      whereClauseArray.push('MATCH(log_string) AGAINST ("' +  keyword + '")');
      
    
    let whereClause = "WHERE ";
    for (let i =0 ; i<whereClauseArray.length;i++)  {
        whereClause = whereClause + whereClauseArray[i];
        if (i < whereClauseArray.length - 1)
            whereClause = whereClause + " AND ";

    }
    //console.log("SELECT * FROM loginfo "  + whereClause);
    

   // var query = "SELECT * FROM loginfo WHERE date_time BETWEEN ? and ?  OR (LOWER(app_name) = ? ) OR (LOWER(log_level) = ? ) OR (LOWER(log_string) LIKE ? )";


    var query = "SELECT * FROM loginfo "+ whereClause;
    console.log(query);
    return new Promise(data => { connection.query(query,[startDate,endDate,appName,logLevel,keyword], function (err, result) {
        if (err) throw err;
        console.log("data found");
       try {
        data(result);

    } catch (error) {
        data({});
        throw error;
    }
        })
    });
}
//get all the app names existing in DB
async function allAppNames (){
    var query = "SELECT DISTINCT(app_name) FROM loginfo";
    return new Promise(data => { connection.query(query, function (err, result) {
        if (err) throw err;
       try {
        data(result);

    } catch (error) {
        data({});
        throw error;
    }
        })
    });
} 

module.exports.connectionDB = connectionDB;
module.exports.saveInfo = saveInfo;
module.exports.informationsByPeriod = informationsByPeriod;
module.exports.saveLog = saveLog;
module.exports.logsByPeriod = logsByPeriod;
module.exports.logsByFilters = logsByFilters;
module.exports.allAppNames = allAppNames;