<template>
  <div>
    <h1>Data Peminjaman</h1>

    <!-- Tombol Tambah Peminjaman -->
    <button @click="showTambahForm">Tambah Peminjaman</button>

    <div v-if="isAdding" class="tambah-form">
      <h3>Tambah Peminjaman</h3>
      <form @submit.prevent="tambahPeminjaman">
        <div>
          <label for="nama_barang">Nama Barang</label>
          <select v-model="newPeminjaman.id_inventory" required>
            <option
              v-for="item in inventoryData"
              :key="item.id_inventory"
              :value="item.id_inventory"
            >
              {{ item.nama_barang }}
            </option>
          </select>
        </div>

        <div>
          <label for="jumlah">Jumlah</label>
          <input type="number" v-model="newPeminjaman.jumlah" required />
        </div>

        <div>
          <label for="tanggal_pinjam">Tanggal Pinjam</label>
          <input type="date" v-model="newPeminjaman.tanggal_pinjam" required />
        </div>

        <div>
          <label for="tanggal_kembali">Tanggal Kembali</label>
          <input type="date" v-model="newPeminjaman.tanggal_kembali" required />
        </div>

        <div>
          <button type="submit">Simpan</button>
          <button type="button" @click="cancelTambah">Batal</button>
        </div>
      </form>
    </div>

    <!-- Tabel Data Peminjaman -->
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Nama Barang</th>
          <th>Username</th>
          <th>Jumlah</th>
          <th>Tanggal Pinjam</th>
          <th>Tanggal Kembali</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in peminjamanData" :key="item.id_peminjaman">
          <td>{{ index + 1 }}</td>
          <td>{{ item.nama_barang }}</td>
          <td>{{ item.username }}</td>
          <td>{{ item.jumlah }}</td>
          <td>{{ formatDate(item.tanggal_pinjam) }}</td>
          <td>{{ formatDate(item.tanggal_kembali) }}</td>
          <td>
            <div v-if="isAdmin">
              <a class="edit" href="#" @click="editItem(item)">Edit</a>
              <a class="danger" href="#" @click="hapusItem(item.id_peminjaman)"
                >Hapus</a
              >
            </div>
            <div v-else>
              <span>-</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      peminjamanData: [],
      isAdmin: false,
      inventoryData: [],
      isAdding: false,
      newPeminjaman: {
        id_inventory: null,
        jumlah: 0,
        tanggal_pinjam: "",
        tanggal_kembali: "",
      },
    };
  },
  created() {
    // Cek role dari localStorage
    const role = localStorage.getItem("role");
    this.isAdmin = role === "1";

    this.fetchPeminjamanData();
    this.fetchInventoryData();
  },
  methods: {
    fetchPeminjamanData: function () {
      axios
        .get("http://localhost:3000/peminjaman")
        .then((response) => {
          console.log("Data yang dikirim:", this.newPeminjaman);
          if (response.data.status === 200) {
            this.peminjamanData = response.data.data;
          } else {
            console.log("Data peminjaman tidak ditemukan atau error");
          }
        })
        .catch((error) => {
          console.error("Terjadi kesalahan:", error);
        });
    },

    fetchInventoryData: function () {
      axios
        .get("http://localhost:3000/inventory")
        .then((response) => {
          // menggunakan arrow function
          if (response.data.status === 200) {
            this.inventoryData = response.data.data;
          } else {
            console.log("Data inventory tidak ditemukan atau error");
          }
        })
        .catch((error) => {
          console.error("Terjadi kesalahan:", error);
        });
    },
    tambahPeminjaman: function () {
      // Debugging untuk melihat data peminjaman yang akan dikirim
      console.log("Data Peminjaman yang akan dikirim:", this.newPeminjaman);

      // Mengirim data peminjaman ke server
      axios
        .post("http://localhost:3000/peminjaman", this.newPeminjaman)
        .then((response) => {
          console.log("Data Peminjaman yang akan dikirim:", this.newPeminjaman);
          alert("Peminjaman berhasil ditambahkan!");
          this.fetchPeminjamanData(); // Refresh data peminjaman
          this.cancelTambah(); // Reset form
        })
        .catch((error) => {
          console.log("Data Peminjaman yang akan dikirim:", this.newPeminjaman);

          console.error(
            "Terjadi kesalahan saat menambahkan peminjaman:",
            error
          );
        });
    },

    formatDate: function (date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("id-ID", options);
    },

    showTambahForm: function () {
      this.isAdding = true;
    },

    cancelTambah: function () {
      this.isAdding = false;
      this.newPeminjaman = {
        id_inventory: null,
        jumlah: 0,
        tanggal_pinjam: "",
        tanggal_kembali: "",
      };
    },

    editItem: function (item) {
      alert(
        `Fitur edit belum diimplementasikan untuk item: ${item.id_peminjaman}`
      );
    },

    hapusItem: function (id) {
      if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        axios
          .delete(`http://localhost:3000/peminjaman/${id}`)
          .then((response) => {
            // menggunakan arrow function
            alert("Data berhasil dihapus!");
            this.fetchPeminjamanData(); // Refresh data peminjaman
          })
          .catch((error) => {
            console.error("Terjadi kesalahan saat menghapus data:", error);
          });
      }
    },
  },
};
</script>

<!-- <script>
import axios from "axios";

export default {
  data() {
    return {
      data: [],
    };
  },
  created() {

  },
  methods: {
    fetchTransaksiData() {
      axios
        .get("http://localhost:3000/inventory", {
          headers: {
            role: localStorage.getItem("role"),
          },
        })
        .then((response) => {
          this.data = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    tambah() {
      const tanggal = prompt("Masukkan Tanggal Transaksi (YYYY-MM-DD):");
      const nama = prompt("Masukkan Nama Transaksi:");
      const barang = prompt("Masukkan ID Barang (pisahkan dengan koma):").split(
        ","
      );
      const jumlah_barang = prompt(
        "Masukkan Jumlah Barang (sesuai urutan ID barang, pisahkan dengan koma):"
      ).split(",");
      const kategori = prompt(
        "Masukkan Kategori Transaksi (1 untuk Penjualan, 2 untuk Pemasukan):"
      );

      if (!tanggal || !nama || !barang || !jumlah_barang || !kategori) {
        alert("Semua input harus diisi!");
        return;
      }

      if (barang.length !== jumlah_barang.length) {
        alert("Jumlah ID barang dan jumlah barang tidak sesuai!");
        return;
      }

      if (
        !barang.every((id) => !isNaN(parseInt(id))) ||
        !jumlah_barang.every((qty) => !isNaN(parseInt(qty)))
      ) {
        alert("ID barang dan jumlah barang harus berupa angka!");
        return;
      }

      const newItem = {
        tanggal: tanggal,
        nama: nama,
        barang: barang.map((id) => parseInt(id)),
        jumlah_barang: jumlah_barang.map((qty) => parseInt(qty)),
        kategori: parseInt(kategori),
      };

      axios
        .post("http://localhost:3000/transaksi", newItem, {
          headers: {
            role: localStorage.getItem("role"),
          },
        })
        .then((response) => {
          console.log(response);
          this.data = response.data; // Update data transaksi setelah menambahkan
        })
        .catch((error) => console.error(error));
    },
    hapus(id) {
      if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        axios
          .delete(`http://localhost:3000/transaksi/${id}`, {
            headers: {
              role: localStorage.getItem("role"),
            },
          })
          .then((response) => {
            console.log(response);
            this.data = response.data;
          });
      }
    },
    edit(id) {
      const tanggal = prompt("Masukkan tanggal baru (YYYY-MM-DD):", id.tanggal);
      const nama = prompt("Masukkan nama baru:", id.nama_transaksi);
      const kategori = prompt(
        "Masukkan kategori baru (1 untuk Penjualan, 2 untuk Pemasukan):",
        id.kategori
      );

      if (!tanggal || !nama || !kategori) {
        alert("Semua input harus diisi!");
        return;
      }

      const updatedData = {
        tanggal: tanggal,
        nama_transaksi: nama,
        kategori: parseInt(kategori),
      };

      axios
        .put(`http://localhost:3000/transaksi/${id}`, updatedData, {
          headers: {
            role: localStorage.getItem("role"),
          },
        })
        .then((response) => {
          console.log(response);
          axios
            .get("http://localhost:3000/transaksi/", {
              headers: {
                role: localStorage.getItem("role"),
              },
            })
            .then((response) => {
              this.data = response.data;
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => {
          console.error(error);
          alert("Gagal memperbarui data transaksi.");
        });
    },
  },
};
</script> -->

<style>
th,
td {
  padding: 1em;
  border: 1px solid #ddd;
}
</style>

<style scoped>
/* Styling untuk tabel dan tombol */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
table th,
table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
a.edit,
a.danger {
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 0 5px;
}
a.edit {
  background-color: #4caf50;
  color: white;
}
a.edit:hover {
  background-color: #45a049;
}
a.danger {
  background-color: red;
  color: white;
}
a.danger:hover {
  background-color: darkred;
}
</style>
