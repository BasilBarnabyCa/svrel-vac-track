<template>
	<div class="p-6">
		<h2 class="text-2xl font-semibold mb-4">Search Results for "{{ searchQuery }}"</h2>

		<!-- Error Message -->
		<div v-if="errorMessage" class="text-left text-red-500">{{ errorMessage }}</div>

		<!-- No Results Message -->
		<div v-if="!horses.length && !errorMessage" class="text-left text-gray-500">No Results Found.</div>

		<!-- Display Results in Table -->
		<HorsesTable v-if="horses.length" :horses="horses" :currentPage="currentPage" :totalPages="totalPages"
			:totalItems="totalItems" :startItem="startItem" :endItem="endItem" :displayedPages="displayedPages"
			:tableHeaderBg="'bg-slate-800'" :tableHeaderTextColor="'text-white'" :sortKey="sortKey"
			:sortOrder="sortOrder" @sortTable="sortTable" @prevPage="prevPage" @nextPage="nextPage"
			@goToPage="goToPage" />
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
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
const perPage = ref(50); // Default items per page

// Sorting States
const sortKey = ref("vaccinated_at"); // Default sorting column
const sortOrder = ref("desc"); // Default sorting order

// Fetch Search Results
const fetchResults = async () => {
	try {
		const token = localStorage.getItem("access_token");
		const response = await axios.get(`/horses/search`, {
			params: {
				q: searchQuery.value,
				page: currentPage.value,
				perPage: perPage.value,
				sortBy: sortKey.value,
				sortOrder: sortOrder.value,
			},
			headers: { Authorization: `Bearer ${token}` },
		});
		horses.value = response.data.data;
		totalPages.value = response.data.meta.last_page;
		totalItems.value = response.data.meta.total;
		startItem.value = response.data.meta.from;
		endItem.value = response.data.meta.to;
	} catch (error) {
		errorMessage.value = error.response?.data?.message || "Failed to fetch results.";
	}
};

const displayedPages = computed(() => {
	const maxVisiblePages = 7;
	const pages = [];

	if (totalPages.value <= maxVisiblePages) {
		for (let i = 1; i <= totalPages.value; i++) {
			pages.push(i);
		}
	} else {
		pages.push(1);
		if (currentPage.value > 4) pages.push("...");
		for (let i = Math.max(2, currentPage.value - 2); i <= Math.min(totalPages.value - 1, currentPage.value + 2); i++) {
			pages.push(i);
		}
		if (currentPage.value < totalPages.value - 3) pages.push("...");
		pages.push(totalPages.value);
	}
	return pages;
});

const sortTable = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
        sortKey.value = key;
        sortOrder.value = "asc";
    }
    currentPage.value = 1;
    fetchResults();
};

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
		fetchResults();
	}
};
const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
		fetchResults();
	}
};
const goToPage = (page) => {
	currentPage.value = page;
	fetchResults();
};

// Fetch when mounted
onMounted(fetchResults);

// Fetch when query changes
watch(() => route.query.q, (newQuery) => {
	searchQuery.value = newQuery;
	errorMessage.value = "";
	currentPage.value = 1;
	horses.value = [];
	fetchResults();
});
</script>