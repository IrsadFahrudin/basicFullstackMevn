import mysql2 from 'mysql2'

// Database
const db = mysql2.createConnection(
    {
        host: "localhost",
        user: "root",
        password: '',
        database: 'db_webbackendinventory'
    }
)

// Connect DB
db.connect(err => {
    if (err) console.log(err)
    else console.log("DB Running")
})

export default db