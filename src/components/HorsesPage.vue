<template>
	<div class="p-6">
		<h2 class="text-2xl font-semibold mb-4">{{ title }}</h2>

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
			:displayedPages="displayedPages"
			:tableHeaderBg="tableHeaderBg"
			:tableHeaderTextColor="tableHeaderTextColor"
			:sortKey="sortKey"
			:sortOrder="sortOrder"
			@sortTable="sortTable"
			@prevPage="prevPage"
			@nextPage="nextPage"
			@goToPage="goToPage"
		/>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import HorsesTable from "../components/HorsesTable.vue";

const props = defineProps({
	title: String,
	category: String,
	tableHeaderBg: String,
	tableHeaderTextColor: String,
});

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
const perPage = ref(50); // Default per page

// Sorting States
const sortKey = ref("vaccinated_at"); // Default sorting column
const sortOrder = ref("desc"); // Default sorting order

// Fetch Data with Pagination & Sorting
const fetchHorses = async () => {
	loading.value = true;
	try {
		const token = localStorage.getItem("access_token");
		if (!token) {
			errorMessage.value = "Unauthorized. Please log in.";
			return;
		}

		const response = await axios.get(`/horses/${props.category}`, {
			params: {
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
		console.error("API Fetch Error:", error);
		errorMessage.value = "Failed to fetch data.";
	} finally {
		loading.value = false;
	}
};

// **Recompute pagination numbers**
const displayedPages = computed(() => {
	const maxVisiblePages = 7; // Maximum number of pages to show before adding ellipsis
	const pages = [];

	if (totalPages.value <= maxVisiblePages) {
		for (let i = 1; i <= totalPages.value; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);

		if (currentPage.value > 4) {
			pages.push("...");
		}

		// Show 2 pages before and after the current page
		for (let i = Math.max(2, currentPage.value - 2); i <= Math.min(totalPages.value - 1, currentPage.value + 2); i++) {
			pages.push(i);
		}

		if (currentPage.value < totalPages.value - 3) {
			pages.push("...");
		}

		// Always show last page
		pages.push(totalPages.value);
	}

	return pages;
});

// **Ensure pagination updates correctly**
watch([currentPage, totalPages], () => {
	displayedPages.value = displayedPages.value; // Recalculate displayed pages when pagination changes
});

// **Sorting Handler (Calls API Instead of Sorting Client-Side)**
const sortTable = (key) => {
	if (sortKey.value === key) {
		sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
	} else {
		sortKey.value = key;
		sortOrder.value = "asc"; // Reset to ascending when switching columns
	}
	fetchHorses(); // Fetch new sorted data from API
};

// **Pagination Handlers (Preserve Sorting)**
const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
		fetchHorses();
	}
};
const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
		fetchHorses();
	}
};
const goToPage = (page) => {
	currentPage.value = page;
	fetchHorses();
};

// Fetch Data on Mount
onMounted(fetchHorses);
</script>