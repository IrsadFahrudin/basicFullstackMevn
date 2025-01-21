<template>
  <h1>Daftar Barang</h1>
  <div v-if="isAdmin">
    <button @click="tambah">Tambah Barang</button>
    <br />
  </div>
  <br />
  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama Barang</th>
        <th>Deskripsi</th>
        <th>Kategori</th>
        <th>Stok</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(i, index) in data" :key="i.nama_barang">
        <td>{{ index + 1 }}</td>
        <td>{{ i.nama_barang }}</td>
        <td>{{ i.deskripsi }}</td>
        <td>{{ i.kategori }}</td>
        <td>{{ i.stok }}</td>
        <td>
          <div v-if="isAdmin">
            <a class="edit" href="#" @click="editItem(i)">Edit</a>
            <a class="danger" href="#" @click="hapus(i.id_inventory)">Hapus</a>
          </div>
          <div v-else>
            <span>-</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-if="isEditing">
    <h3>Edit Barang</h3>
    <form @submit.prevent="updateItem">
      <div>
        <label for="nama_barang">Nama Barang</label>
        <input type="text" v-model="editedItem.nama_barang" id="nama_barang" />
      </div>
      <div>
        <label for="deskripsi">Deskripsi</label>
        <input type="text" v-model="editedItem.deskripsi" id="deskripsi" />
      </div>
      <div>
        <label for="kategori">Kategori</label>
        <input type="text" v-model="editedItem.kategori" id="kategori" />
      </div>
      <div>
        <label for="stok">Stok</label>
        <input type="number" v-model="editedItem.stok" id="stok" />
      </div>
      <div>
        <button type="submit">Simpan Perubahan</button>
        <button type="button" @click="cancelEdit">Batal</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      data: [], // Untuk menyimpan data barang
      isAdmin: false,
      isEditing: false, // Flag untuk mengatur mode edit
      editedItem: {
        // Data item yang akan diedit
        nama_barang: "",
        deskripsi: "",
        kategori: "",
        stok: 0,
      },
    };
  },
  created() {
    // Cek role dari localStorage
    const role = localStorage.getItem("role");
    this.isAdmin = role === "1";

    // Ambil data dari server
    axios
      .get("http://localhost:3000/inventory")
      .then((response) => {
        if (response.data.status === 200) {
          this.data = response.data.data;
        } else {
          console.log("Data tidak ditemukan atau error");
        }
      })
      .catch((error) => {
        console.error("Terjadi kesalahan:", error);
      });
  },

  methods: {
    hapus: function (id) {
      if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        axios
          .delete(`http://localhost:3000/inventory/${id}`)
          .then((response) => {
            console.log(response);
            // Misalnya, jika respons berisi pesan sukses
            if (response.status === 200) {
              // Menghapus item yang sudah dihapus dari array
              this.data = this.data.filter((item) => item.id_inventory !== id);
              alert("Data berhasil dihapus.");
            }
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
            alert("Terjadi kesalahan saat menghapus data.");
          });
      }
    },

    tambah: function () {
      const nama_barang = prompt("Masukkan Nama Barang:");
      const deskripsi = prompt("Masukkan Deskripsi Barang:");
      const kategori = prompt("Masukkan Kategori Barang:");
      const stok = prompt("Masukkan Stok Barang:");

      if (!nama_barang || !deskripsi || !kategori || !stok) {
        alert("Semua input harus diisi!");
        return;
      }
      if (isNaN(stok)) {
        alert("Stok harus berupa angka!");
        return;
      }

      const newItem = {
        nama_barang: nama_barang,
        deskripsi: deskripsi,
        kategori: kategori,
        stok: parseInt(stok), // Stok harus berupa angka
      };

      axios
        .post("http://localhost:3000/inventory", newItem)
        .then((response) => {
          console.log(response);
          // Jika respons berhasil, tambahkan item ke dalam data
          if (response.status === 200) {
            this.data.push(newItem); // Menambahkan item baru ke dalam data yang ada
          }
        })
        .catch((error) => {
          console.error("Terjadi kesalahan:", error);
          alert("Gagal menambahkan data!");
        });
    },

    // Fungsi untuk menginisialisasi data barang yang akan diedit
    editItem(item) {
      this.isEditing = true; // Masuk ke mode edit
      this.editedItem = { ...item }; // Salin data yang ingin diedit ke editedItem
    },
    // Fungsi untuk memperbarui item setelah edit
    updateItem() {
      // Validasi input sebelum mengirimkan data ke API
      if (
        !this.editedItem.id_inventory ||
        !this.editedItem.nama_barang ||
        !this.editedItem.deskripsi ||
        !this.editedItem.kategori ||
        !this.editedItem.stok
      ) {
        alert("Semua input harus diisi!");
        return;
      }

      // Kirimkan data yang sudah diperbarui ke API menggunakan PUT
      axios
        .put("http://localhost:3000/inventory", this.editedItem)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            // Perbarui data di frontend setelah berhasil
            const index = this.data.findIndex(
              (item) => item.id_inventory === this.editedItem.id_inventory
            );
            if (index !== -1) {
              this.data[index] = { ...this.editedItem }; // Update item di data
            }
            this.isEditing = false; // Keluar dari mode edit setelah berhasil
            alert("Data barang berhasil diperbarui!");
          }
        })
        .catch((err) => {
          console.error("Terjadi kesalahan:", err);
          alert("Gagal memperbarui data!");
        });
    },
    // Fungsi untuk membatalkan edit
    cancelEdit() {
      this.isEditing = false; // Keluar dari mode edit tanpa menyimpan perubahan
    },
  },
};
</script>

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

/* Styling untuk form edit */
form {
  margin: 20px auto;
  padding: 15px;
  max-width: 400px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}
form div {
  margin-bottom: 10px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
input[type="text"],
input[type="number"] {
  width: 80%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
input[type="text"]:focus,
input[type="number"]:focus {
  border-color: #4caf50;
  outline: none;
}
button[type="submit"] {
  margin-right: 10px;
}
button[type="button"] {
  background-color: red;
}
button[type="button"]:hover {
  background-color: darkred;
}
</style>
