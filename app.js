const express = require("express");
const app = express();
const bp = express("body-parser")

const addition_function = require("./addition_function")


// middleware
app.use(bp.static("public"))
app.use(bp.json())
app.use(bp.urlencoded({ extended: true })) // 處理 POST Body，extended 為擴展功能，容許 String 以外的資料

app.use((err, req, res, next) => {
    if (err){
        console.log(err)
        return 
    }
    next()
})


// routes
app.get("/", (req, res) => {
    console.log(`${req.url} ${req.body}`)
    return 
})

app.get("/newPost", (req, res) => {
    console.log(`${req.url}/index.html`)
    res.sendFile(`${__dirname}/index.html`)
    return 
})



app.listen(3000, () =>{
    console.log("server start")
})