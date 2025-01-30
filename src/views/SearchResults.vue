<template>
	<div class="p-6">
		<h2 class="text-2xl font-semibold mb-4">Search Results for "{{ searchQuery }}"</h2>

		<!-- Error Message -->
		<div v-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>

		<!-- Display Results in Table -->
		<HorsesTable v-if="horses.length"
			:horses="horses"
			:currentPage="currentPage"
			:totalPages="totalPages"
			:totalItems="totalItems"
			:startItem="startItem"
			:endItem="endItem"
			@prevPage="prevPage"
			@nextPage="nextPage"
			@goToPage="goToPage"
		/>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import HorsesTable from "../components/HorsesTable.vue";

const route = useRoute();
const searchQuery = ref(route.query.q || "");
const horses = ref([]);
const errorMessage = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const startItem = ref(0);
const endItem = ref(0);

const fetchResults = async () => {
	try {
		const token = localStorage.getItem("access_token");
		const response = await axios.get(`/horses/search?q=${searchQuery.value}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		horses.value = response.data.data;
		totalPages.value = response.data.meta.last_page;
		totalItems.value = response.data.meta.total;
		startItem.value = response.data.meta.from;
		endItem.value = response.data.meta.to;
	} catch (error) {
		errorMessage.value = "Failed to fetch results.";
	}
};

// Fetch when mounted
onMounted(fetchResults);

// Fetch when query changes
watch(() => route.query.q, (newQuery) => {
	searchQuery.value = newQuery;
	fetchResults();
});
</script>