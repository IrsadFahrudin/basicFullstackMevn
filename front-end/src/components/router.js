import { createRouter, createWebHistory } from 'vue-router';
import Inventory from './InventoryPage.vue';
import Home from '../components/HomePage.vue';
import Peminjaman from './PeminjamanPage.vue';
import LoginPage from './LoginPage.vue'

const routes = [
    { path: '/', name: 'Login', component: LoginPage},
    { path: '/home', name: 'Home', component: Home },
    { path: '/inventory', name: 'Inventory', component: Inventory },
    { path: '/peminjaman', name: 'Peminjaman', component: Peminjaman }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;