const express = require("express")
const PORT = 8000
const app = express()



const db = require("./index");
const Product = db.Product;

(async () => {
    await db.connect_db()
    // Add
    console.log("Add 1 record")
    await Product.add_product("School bag", "11/01/2022", "Lambor")
    // Retrieve
    let res = await Product.get_product()
    console.log(res)
})()



app.listen(PORT, () => console.log(`Listening on port ${PORT} ...`))