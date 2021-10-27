let Information = class {

    constructor(time,cpUsage,memoryUsage,received_network_bytes,transferred_network_bytes) {
        this.time =time;
        this.cpUsage = cpUsage; 
        this.memoryUsage = memoryUsage ;
        this.received_network_bytes = received_network_bytes;
        this.transferred_network_bytes = transferred_network_bytes;
    }

}
module.exports = Information;