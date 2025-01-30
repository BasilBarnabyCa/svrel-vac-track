<template>
	<div class="p-6">
		<h2 class="text-2xl font-semibold mb-4">Vaccinated Horses</h2>

		<!-- Loading State -->
		<div v-if="loading" class="text-center text-gray-500">Loading horses...</div>

		<!-- Error Message -->
		<div v-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>

		<!-- Table Component -->
		<HorsesTable v-if="horses.length" 
			:horses="horses" 
			:currentPage="currentPage" 
			:totalPages="totalPages" 
			:totalItems="totalItems" 
			:startItem="startItem" 
			:endItem="endItem" 
			:tableHeaderBg="'bg-emerald-300'"
			:tableHeaderTextColor="'text-white'"
			@prevPage="prevPage" 
			@nextPage="nextPage" 
			@goToPage="goToPage" 
		/>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import HorsesTable from "../components/HorsesTable.vue"; // Import the table component

// Data States
const horses = ref([]);
const loading = ref(false);
const errorMessage = ref("");

// Pagination States
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const startItem = ref(0);
const endItem = ref(0);
const perPage = ref(0);

// Fetch Data
const fetchHorses = async () => {
	loading.value = true;
	try {
		const token = localStorage.getItem("access_token");
		if (!token) return (errorMessage.value = "Unauthorized. Please log in.");

		const response = await axios.get(`/horses/vaccinated?page=${currentPage.value}`, {
			headers: { Authorization: `Bearer ${token}` },
		});

		horses.value = response.data.data;
		totalPages.value = response.data.meta.last_page;
		totalItems.value = response.data.meta.total;
		startItem.value = response.data.meta.from;
		endItem.value = response.data.meta.to;
		perPage.value = response.data.meta.per_page;
	} catch {
		errorMessage.value = "Failed to fetch data.";
	} finally {
		loading.value = false;
	}
};

// Pagination Handlers
const prevPage = () => currentPage.value > 1 && fetchHorses(--currentPage.value);
const nextPage = () => currentPage.value < totalPages.value && fetchHorses(++currentPage.value);
const goToPage = (page) => (currentPage.value = page) && fetchHorses();

onMounted(fetchHorses);
</script>