<template>
  <header>
      <nav>
      <span>Halo, {{ username }}.</span>
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/inventory">Inventory</RouterLink>
      <!-- <RouterLink v-if="isAdmin" to="/peminjaman">Peminjaman</RouterLink> -->
      <RouterLink to="/peminjaman">Peminjaman</RouterLink>
      <span @click="logout"><a href="#">Keluar</a></span>
  </nav>
  </header>
</template>
<script>
import axios from 'axios'
export default {
  data() {
      return {
        data: [],
        isAdmin: false,
      };
    },
    created() {
      // const role = localStorage.getItem('role');
      // if (role === '1') {
      //   this.isAdmin = true;
      //   // this.fetchData();
      // } else {
      //   this.isAdmin = false;
      // }
    },
computed: {
  username() {
    return localStorage.getItem('username'); // Ambil username dari localStorage
  }
},
methods: {
  // fetchData() {
  //     axios
  //       .get('http://localhost:3000/peminjaman/')
  //       .then((response) => {
  //         this.data = response.data;
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   },
  logout() {
    localStorage.clear(); // Hapus semua data
    window.location.href = '/'; // Arahkan ke halaman login
  },
},
};
</script>

<style scoped>
header {
background-color: black;
color: white;
padding: 1em;
text-align: center;
}
nav a {
color: white;
margin: 0 1em;
transition: color 0.3s;
}

nav a:hover {
color: blue;
}
</style>
