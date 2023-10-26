// 常用套件
require("dotenv").config();
// 三方套件
const mysql2 = require("mysql2"); // 有 mysql, mysql2, mysqlx, 其中 2 較為流行


let pool = mysql2.createPool({
    user: process.env.DB_ADMIN,
    password: process.env.DB_PW,
    host: process.env.DB_HOST,
    port: 3306, // mysql 預設，不寫也可以
    database: "bot_schema",
    waitForConnections: true,
    connectionLimit: 10,
})


async function getConnectionAndData(query, values){
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('Database connected successfully');
                console.log("query", query);
                console.log("values", values);

                connection.query(query, values, (err, res) => {
                    connection.release();

                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        console.log(res);
                        resolve(res);
                    }
                });
            }
        });
    });
}


module.exports.getConnectionAndData = getConnectionAndData;