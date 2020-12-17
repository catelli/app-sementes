import SQLite from 'react-native-sqlite-storage';
export const VERSION = "petrovina_sementes_v2.20";

export const initDB = () => {
  let db;
  SQLite.enablePromise(true);
  return new Promise((resolve) => {
    console.log("Plugin integrity check ...");
    SQLite.echoTest()
      .then(() => {
        console.log("Opening database ...");
        SQLite.openDatabase({
          name: VERSION, 
          createFromLocation: '~www/petrovina.sqlite3', 
          location: "Library"
        }).then(DB => {
            db = DB;
            console.log("Database OPEN");
            resolve(db);
        }).catch(error => {
            console.log(error);
        });
      }).catch(error => {
        console.log("echoTest failed - plugin not functional");
      });
    });
};

export const initDbPromise = async () => {
  SQLite.enablePromise(true);
  SQLite.DEBUG(true);
  const db = await SQLite.openDatabase({
        name: VERSION, 
        createFromLocation: '~www/petrovina.sqlite3', 
        location:"Library"
  });
  return db;
}

export const closeDatabase = (db) => {
  if (db) {
    console.log("Closing DB");
    db.close()
      .then(status => {
        console.log("Database CLOSED");
      })
      .catch(error => {
        this.errorCB(error);
      });
  } else {
    console.log("Database was not OPENED");
  }
};