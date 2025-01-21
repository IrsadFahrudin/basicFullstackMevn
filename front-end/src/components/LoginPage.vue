<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="username">Username : </label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
          placeholder="username"
        />
      </div>
      <div class="form-group">
        <label for="password">Password : </label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="password"
        />
      </div>
      <br />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        // Validasi input
        if (!this.username || !this.password) {
          this.errorMessage = "Username dan password harus diisi.";
          return;
        }

        const response = await axios.post("http://localhost:3000/login", {
          username: this.username,
          password: this.password,
        });

        if (response.status === 200 && response.data.success) {
          alert("Login berhasil!");
          localStorage.setItem("username", response.data.username);
          localStorage.setItem("role", response.data.role);
          window.location.href = "/home";
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        this.errorMessage = "Terjadi kesalahan, silakan coba lagi.";
        console.error(error);
      }
    },
  },
};
</script>
