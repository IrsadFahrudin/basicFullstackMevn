import express from 'express'
import db from '../db.js'

const router = express.Router()
import response from '../response.js'

import { isAdmin, isUser } from "../middleware.js";

// GET All Data
// router.get("/peminjaman", (req, res) => {
//     let sql = "SELECT * FROM peminjaman"
//     db.query(sql, (err, result) => {
//         if (err) { 
//             console.log(err)
//             return res.status(500).json({ error: "Database peminjaman error", details: err.message });
//          }
//         else {
//             response(200, result, "get all data from peminjaman", res)
//         }
//     })
// })

// Get data peminjaman + nama barang  dan user
router.get("/peminjaman", (req, res) => {
    let sql = `
        SELECT 
            p.id_peminjaman,
            p.id_inventory,
            i.nama_barang,
            u.username,
            p.jumlah,
            p.tanggal_pinjam,
            p.tanggal_kembali
        FROM peminjaman p
        JOIN inventory i ON p.id_inventory = i.id_inventory
        JOIN users u ON p.id_user = u.id_user
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        response(200, result, "Successfully retrieved all peminjaman data", res);
    });
});

// GET Data Peminjaman Berdasarkan ID
router.get("/peminjaman/:id", (req, res) => {
    let id = req.params.id; // Mendapatkan id_peminjaman dari URL parameter
    let sql = `
        SELECT 
            p.id_peminjaman,
            p.id_inventory,
            i.nama_barang,
            u.username,
            p.jumlah,
            p.tanggal_pinjam,
            p.tanggal_kembali
        FROM peminjaman p
        JOIN inventory i ON p.id_inventory = i.id_inventory
        JOIN users u ON p.id_user = u.id_user
        WHERE p.id_peminjaman = ?`;  // Menggunakan parameterized query untuk mencegah SQL injection

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Peminjaman not found" });
        }
        response(200, result[0], "Successfully retrieved peminjaman details", res);
    });
});


// POST endpoint untuk menambah peminjaman
router.post("/peminjaman", (req, res) => {
    const { id_inventory, id_user, jumlah, tanggal_pinjam, tanggal_kembali } = req.body;
  
    // Validasi input
    if (!id_inventory || !id_user || !jumlah || !tanggal_pinjam || !tanggal_kembali) {
        return res.status(400).json({ error: "Semua field harus diisi" });
      }
    
    // Query untuk mendapatkan stok barang yang tersedia
    const sqlGetStok = `SELECT stok FROM inventory WHERE id_inventory = ?`;
    
    db.query(sqlGetStok, [id_inventory], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Terjadi kesalahan saat memeriksa stok", details: err.message });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ error: "Barang tidak ditemukan" });
      }
  
      const stokTersedia = result[0].stok;
  
      // Mengecek apakah jumlah peminjaman melebihi stok
      if (jumlah > stokTersedia) {
        return res.status(400).json({ error: "Stok tidak mencukupi untuk peminjaman ini" });
      }
  
      // SQL query untuk menambah peminjaman ke dalam database
      const sqlInsertPeminjaman = `
        INSERT INTO peminjaman (id_inventory, id_user, jumlah, tanggal_pinjam, tanggal_kembali)
        VALUES (?, ?, ?, ?, ?)
      `;
  
      db.query(sqlInsertPeminjaman, [id_inventory, id_user, jumlah, tanggal_pinjam, tanggal_kembali], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Terjadi kesalahan saat menambahkan peminjaman", details: err.message });
        }
  
        // Update stok pada inventory
        const newStok = stokTersedia - jumlah; // Mengurangi stok yang dipinjam
  
        const sqlUpdateStok = `
          UPDATE inventory SET stok = ? WHERE id_inventory = ?
        `;
  
        db.query(sqlUpdateStok, [newStok, id_inventory], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Terjadi kesalahan saat mengupdate stok", details: err.message });
          }
  
          return res.status(200).json({ success: true, message: "Peminjaman berhasil ditambahkan dan stok berhasil diperbarui!" });
        });
      });
    });
  });
  

// POST endpoint untuk menambah peminjaman
// router.post("/peminjaman", (req, res) => {
//     const { id_inventory, id_user, jumlah } = req.body;

//     // Validasi input
//     if (!id_inventory || !id_user || !jumlah) {
//         return res.status(400).json({ error: "Semua field harus diisi" });
//     }

//     // Mengambil tanggal saat ini dari sistem
//     const tanggal_pinjam = formatDate(new Date()); // Menggunakan helper function untuk format tanggal

//     // SQL query untuk menambah peminjaman ke dalam database
//     const sql = `
//       INSERT INTO peminjaman ( id_inventory, id_user, jumlah, tanggal_pinjam)
//       VALUES (?, ?, ?, ?)
//     `;

//     db.query(sql, [id_inventory, id_user, jumlah, tanggal_pinjam], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: "Terjadi kesalahan saat menambahkan peminjaman", details: err.message });
//         }

//         return res.status(200).json({ success: true, message: "Peminjaman berhasil ditambahkan!" });
//     });
// });

// GET Data by id
// router.get('/peminjaman/:id', (req, res) => {
//     let id = req.params.id
//     let sql = `SELECT * FROM peminjaman WHERE id_peminjaman = ${id}`
//     db.query(sql, (err, result) => {
//         if (err) { 
//             console.log(err)
//             return res.status(500).json({ error: "Database peminjaman error", details: err.message });
//          }
//         else {
//             response(200, result, "get detail peminjaman", res)
//         }
//     })
// })

// POST Data
// router.post("/peminjaman", (req, res) => {
//     let { tanggal, nama, barang, jumlah_barang, kategori } = req.body

//     let unionAllQuery = barang.map((id, index) => `SELECT ${id} AS id, ${jumlah_barang[index]} AS jumlah_barang`).join(" UNION ALL ");

//     let sql = `INSERT INTO transaksi (tanggal, nama_transaksi, nominal, kategori) VALUES ('${tanggal}', '${nama}', (SELECT SUM(b.harga * tmp.jumlah_barang) FROM barang b JOIN ( ${unionAllQuery} ) AS tmp ON b.id = tmp.id), ${kategori})`
//     db.query(sql, (err, result) => {
//         if (err) { console.log(err) }
//         else {
//             let i = 0;
//             req.body.barang.forEach(e => {
//                 let sql_2 = `INSERT INTO detail_transaksi (id_transaksi, id_barang, jumlah_barang) VALUES (${result.insertId}, ${e}, ${jumlah_barang[i]})`
//                 db.query(sql_2)
//                 let sql_3 = `UPDATE barang SET stok = stok - ${jumlah_barang[i]} WHERE id = ${e}`
//                 db.query(sql_3)
//                 i++
//             });

//             let sql = "SELECT * FROM transaksi"
//             db.query(sql, (err, result) => {
//                 if (err) { console.log(err) }
//                 else {
//                     res.json(result)
//                 }
//             })
//         }
//     })
// })


// POST Menambahkan Data Peminjaman


// router.post("/peminjaman", (req, res) => {
//     const { id_inventory, id_user, jumlah, tanggal_pinjam, tanggal_kembali } = req.body;

//     // Validasi input
//     if (!id_inventory || !id_user || !jumlah || !tanggal_pinjam || !tanggal_kembali) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     // Cek apakah stok barang cukup
//     let checkStockQuery = `SELECT stok FROM inventory WHERE id_inventory = ?`;
//     db.query(checkStockQuery, [id_inventory], (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: "Database error", details: err.message });
//         }

//         if (result.length === 0) {
//             return res.status(404).json({ message: "Barang tidak ditemukan" });
//         }

//         const stok = result[0].stok;
//         if (stok < jumlah) {
//             return res.status(400).json({ message: "Stok tidak cukup untuk peminjaman" });
//         }

//         // Menambahkan data peminjaman
//         let insertQuery = `
//             INSERT INTO peminjaman (id_inventory, id_user, jumlah, tanggal_pinjam, tanggal_kembali)
//             VALUES (?, ?, ?, ?, ?)`;

//         db.query(insertQuery, [id_inventory, id_user, jumlah, tanggal_pinjam, tanggal_kembali], (err, result) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ error: "Failed to add peminjaman", details: err.message });
//             }

//             // Mengurangi stok barang setelah peminjaman berhasil
//             let updateStockQuery = `UPDATE inventory SET stok = stok - ? WHERE id_inventory = ?`;
//             db.query(updateStockQuery, [jumlah, id_inventory], (err, result) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).json({ error: "Failed to update stock", details: err.message });
//                 }

//                 return res.status(201).json({
//                     message: "Peminjaman successfully added",
//                     peminjaman: {
//                         id_inventory,
//                         id_user,
//                         jumlah,
//                         tanggal_pinjam,
//                         tanggal_kembali
//                     }
//                 });
//             });
//         });
//     });
// });


// PUT Data

router.put("/transaksi/:id", isAdmin, (req, res) => {
    let id = req.params.id
    let { tanggal, nama_transaksi, kategori } = req.body
    let sql = `UPDATE transaksi SET tanggal = '${tanggal}', nama_transaksi = '${nama_transaksi}', kategori = ${kategori} WHERE id = ${id}`
    db.query(sql, (err, result) => {
        if (err) { console.log(err) }
        else {
            console.log(`1 record updated`)
            let sql = "SELECT * FROM transaksi"
            db.query(sql, (err, result) => {
                if (err) { console.log(err) }
                else {
                    res.json(result)
                }
            })
        }
    })
})

// DELETE Data
router.delete("/transaksi/:id", isAdmin, (req, res) => {
    let id = req.params.id
    let sql = `DELETE FROM transaksi WHERE id = ${id}`
    db.query(sql, (err, result) => {
        if (err) { console.log(err) }
        else {
            console.log(`1 record deleted`)
            let sql = "SELECT * FROM transaksi"
            db.query(sql, (err, result) => {
                if (err) { console.log(err) }
                else {
                    res.json(result)
                }
            })
        }
    })
})

// GET Detail Transaksi
router.get('/transaksi/detail/:id', isAdmin, (req, res) => {
    let id = req.params.id
    let sql = `SELECT barang.nama FROM detail_transaksi INNER JOIN barang ON barang.id = detail_transaksi.id_barang WHERE id_transaksi = ${id}`
    db.query(sql, (err, result) => {
        if (err) { console.log(err) }
        else {
            res.json(result)
        }
    })
})

export default router