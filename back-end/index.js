import express from 'express'
import cors from 'cors'
import router_transaksi from './js/route/peminjaman.js'
import router_inventory from './js/route/inventory.js'
import auth from './js/auth.js'

const app = express()
const hostname = 'localhost'
const port = '3000'

app.use(cors())
app.use(express.json())
app.use(auth)
app.use(router_transaksi)
app.use(router_inventory)

app.listen(port, () => {
    console.log(`http://${hostname}:${port}`)
})