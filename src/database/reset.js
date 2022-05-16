const db = require("./index");


(async () => {
    await db.connect_db()
    for (const col_name in db.collections) {
        console.log(`Deleting collection ${col_name} ...`)
        await db.collections[col_name].collection.drop()
    }
    console.log("Database reseted !")
})();
