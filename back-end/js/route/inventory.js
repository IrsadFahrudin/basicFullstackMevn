import express from 'express'
import db from '../db.js'

import response from '../response.js'
const router = express.Router()

// GET All Data
router.get("/inventory", (req, res) => {
    let sql = "SELECT * FROM inventory"
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database inventory error", details: err.message });
        }
        else {
            response(200, result, "get all data from inventory", res)
        }
    })
})

// GET Data by id
router.get('/inventory/:id', (req, res) => {
    let id = req.params.id
    let sql = `SELECT * FROM inventory WHERE id_inventory = ${id}`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database inventory error", details: err.message });
        }
        else {
            response(200, result, "get detail Inventory", res)
        }
    })
})

// POST Data
router.post("/inventory", (req, res) => {

    const { nama_barang, gambar, deskripsi, kategori, stok } = req.body

    let sql = `INSERT INTO inventory (nama_barang, gambar, deskripsi, kategori, stok) VALUES ('${nama_barang}', '${gambar}', '${deskripsi}', '${kategori}', '${stok}')`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Database Add inventory error", details: err.message });
        }
        else {
            console.log("barang berhasil ditambahkan")
            res.json(result)
        }
    })
})

// PUT Data
router.put("/inventory", (req, res) => {
    const { id_inventory, nama_barang, gambar, deskripsi, kategori, stok } = req.body

    // mengecek id_inventory tidak boleh kosong
    if (!id_inventory) {
        return res.status(400).json({ error: "id_inventory is required" });
    }

    const sql = ` UPDATE inventory SET nama_barang = '${nama_barang}', gambar = '${gambar}', deskripsi = '${deskripsi}', kategori = '${kategori}', stok = '${stok}' WHERE id_inventory = ${id_inventory}`

    db.query(sql, (err, result) => {
        if (err) { 
            console.log(err)
            return res.status(500).json({ error: "Database Add inventory error", details: err.message });
         }
        else {
            console.log("inventory telah diupdate")
            res.json(result)
        }
    })
})


// DELETE Data
router.delete("/inventory/:id", (req, res) => {
    let id = req.params.id

    const sql = `DELETE FROM inventory WHERE id_inventory = ${id}`

    db.query(sql, (err, result) => {
        if (err) { 
            console.log(err)
            return res.status(500).json({ error: "Database Add inventory error", details: err.message });
         }
        else {
            console.log("barang telah dihapus")
            res.json(result)
        }
    })
})


export default router