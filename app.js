// 常用套件
const express = require("express"); // server 框架
const bp = require("body-parser"); // request body 解析套件，可不用
const multer = require('multer'); // 檔案上傳套件(必備)
// 三方套件
const Snowflake = require("snowflake-id").default; // uuid 產生套件，可用 uuidv4 替代
// 自訂義套件
const db_connector = require("./model/db_connector");
const s3_connector = require("./model/s3_connector")
// instance
const app = express();
const apiRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // 暫存
// 創建一個 Snowflake ID 生成器
const generator = new Snowflake({mid: 1,});
// 生成 Snowflake ID
const snowflakeId = generator.generate();


// middleware
app.use(express.static("public")); // 啟用靜態檔案路徑
app.set('view engine', 'ejs'); // 啟用 render template 方法
app.use(bp.json()); // 處理 json
app.use(bp.urlencoded({ extended: true })); // 處理 POST Body，extended 為擴展功能，容許 String 以外的資料
app.use("/api", apiRoutes); // 匯入blueprint and 該 routes 的 prefix

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    if (err){
        console.log(err)
        return 
    }
    next()
}) // 完全沒用


// routes
app.get("/", (req, res) => {
    // console.log(`${req.url}`)
    // res.sendFile(`${__dirname}/index.html`)
    res.render("index")
    return 
})


app.post('/newPost', upload.single('imgFile'), (req, res) => {
    // 透過 Multer middleware 將 file 轉存在 req.file
    console.log("req.file: ", req.file)
    console.log("req.body: ", req.body)
    if (req.file) {
        const newFileName = `${snowflakeId}.jpeg`;
        s3_connector.sendToS3(newFileName, req.file.buffer);
    
        const query = 'INSERT INTO log_table(msg, img_url) VALUES (?, ?)';
        const values = [req.body.imgDesc, newFileName];
    
        db_connector.getConnectionAndData(query, values, (err) => {
            if (err) {
                console.error('fail to insert into sql', err);
                return res.status(500).send('fail to insert into sql');
            }
        });
        console.log('success to insert into sql');
        return res.redirect('/');
    } else {
        console.error('file upload fail');
        return res.status(500).send('file upload fail');
    }
});


// api routes
apiRoutes.get("/getMsg/:num_msg", async (req, res) => {
    try {
        let values = (Number(req.params.num_msg) + 1) * 20
        let query = `SELECT * FROM log_table ORDER BY id DESC LIMIT ?`
        const data = await db_connector.getConnectionAndData(query, values);
        return res.status(200).json({"data": data})
    } catch (err) {
        console.error("處理資料庫查詢時發生錯誤:", err);
        return res.status(500).json({ error: "伺服器內部錯誤" });
    }
})



app.listen(port = 3000, () =>{
    console.log(`Server is running on http://localhost:${port}`)
})