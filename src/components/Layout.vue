<template>
	<div class="flex h-screen bg-gray-100">
		<!-- Sidebar (Main Nav) -->
		<aside
			class="bg-slate-800 text-white w-16 md:w-64 flex flex-col items-center md:items-start transition-all duration-300">
			<!-- Logo -->
			<div class="p-4 text-lg font-bold hidden md:flex items-center space-x-3 bg-slate-900 w-full">
				<img src="/logo.png" alt="Logo" class="w-10 h-10" />
				<span>VacTrack</span>
			</div>

			<!-- Navigation -->
			<nav class="space-y-2 py-4 px-2 w-full mt-5 flex-1">
				<router-link v-for="item in menuItems" :key="item.name" :to="'/' + item.name"
					class="group flex flex-col items-center md:flex-row md:items-center md:space-x-3 px-3 py-2 hover:bg-gray-700 rounded cursor-pointer transition">
					<FeatherIcon :type="item.icon" size="15" strokeWidth="1" class="text-white" />
					<span class="hidden md:block text-sm font-medium transition-all duration-200">
						{{ item.label }}
					</span>
				</router-link>
			</nav>

			<!-- Copyright with Separator Line -->
			<div class="w-full border-t border-gray-600 py-3">
				<p class="text-xs text-gray-400 text-center">&copy; 2025 SVREL VacTrack</p>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 flex flex-col">
			<!-- Header with Breadcrumbs, Search, and User Dropdown -->
			<header class="bg-white shadow p-4 flex justify-between items-center">
				<!-- Breadcrumbs -->
				<nav class="text-gray-600 text-sm">
					<!-- <router-link to="/" class="text-gray-500 hover:underline">Dashboard</router-link> >
					<router-link to="/products" class="text-gray-500 hover:underline">Products</router-link> >
					<span class="text-gray-800 font-semibold">All Products</span> -->
				</nav>

				<!-- Search & User Dropdown -->
				<div class="flex items-center space-x-4">
					<input v-model="searchQuery" @keyup.enter="search" type="text" placeholder="Search..."
						class="rounded-md border-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2" />

					<!-- User Icon Dropdown -->
					<div class="relative">
						<button @click="toggleDropdown"
							class="focus:outline-none w-10 h-10 flex items-center justify-center rounded-full border border-gray-500 hover:border-gray-700">
							<FeatherIcon type="user" size="20" stroke-width="2" class="text-gray-700" />
						</button>
						<!-- Dropdown Menu -->
						<div v-if="dropdownOpen"
							class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-50 text-sm">
							<a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">My Account</a>
							<a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-200">Settings</a>
							<button @click="logout" class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200">
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			<!-- Page Content -->
			<section class="p-4 overflow-auto">
				<router-view />
			</section>
		</main>
	</div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FeatherIcon from "vue-feather";
import axios from 'axios';

export default {
	components: {
		FeatherIcon,
	},
	setup() {
		const router = useRouter();
		const hoveredItem = ref(null);
		const dropdownOpen = ref(false);
		const searchQuery = ref("");

		const toggleDropdown = () => {
			dropdownOpen.value = !dropdownOpen.value;
		};

		const logout = async () => {
			try {
				// Retrieve the access token from local storage
				const token = localStorage.getItem("access_token");

				if (token) {
					// Call the logout endpoint
					await axios.post(
						"/logout",
						{}, // No request body needed
						{
							headers: {
								Authorization: `Bearer ${token}`, // Include the token in the request
							},
						}
					);
				}

				// Clear local storage and axios headers
				localStorage.removeItem("access_token");
				delete axios.defaults.headers.common["Authorization"];

				// Redirect to the login page
				router.push("/login");
			} catch (error) {
				console.error("Logout failed:", error);
				// Optionally show an error message or force redirect to login
				localStorage.removeItem("access_token");
				router.push("/login");
			}
		};

		const menuItems = ref([
			{ name: "", label: "Dashboard", icon: "home" },
			{ name: "vaccinated", label: "Vaccinated Horses", icon: "check-circle" },
			{ name: "overdue", label: "Overdue Horses", icon: "alert-triangle" },
			{ name: "needs-vaccination", label: "Needs Vaccination", icon: "bell" },
			{ name: "requires-double-boosters", label: "Requires Double Boosters", icon: "refresh-cw" },
			{ name: "missing-routine-vaccination", label: "Missing Routine Vaccination", icon: "x-circle" },
		]);

		const search = () => {
			if (searchQuery.value.trim() !== "") {
				router.push({ name: "searchResults", query: { q: searchQuery.value.trim() } });
			}
		};

		return { logout, hoveredItem, menuItems, dropdownOpen, toggleDropdown, searchQuery, search };
	},
};
</script>

<style>
/* Optional: Smooth Hover Effect */
.group:hover span {
	opacity: 1;
}
</style>