const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/myapp";
// const uri =
//   "mongodb://USER:PW@host1:port1,host2:port2/DBNAME?replicaSet=RSNAME";
let dbOptions = {};

if (uri.indexOf("replicaSet") > -1) {
  dbOptions = {
    db: { native_parser: true },
    replset: {
      auto_reconnect: false,
      poolSize: 10,
      socketOptions: {
        keepAlive: 1000,
        connectTimeoutMS: 30000,
      },
    },
    server: {
      poolSize: 5,
      socketOptions: {
        keepAlive: 1000,
        connectTimeoutMS: 30000,
      },
    },
  };
}

var db = mongoose
  .connect(uri, dbOptions)
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => console.log("Unable to connect: " + e));
