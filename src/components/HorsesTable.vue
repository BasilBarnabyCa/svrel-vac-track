<template>
	<div>
		<!-- Light Mode Tailwind Styled Table -->
		<div v-if="horses.length" class="relative overflow-x-auto bg-white shadow-md rounded-lg">
			<table class="w-full text-sm text-left text-gray-500">
				<thead class="text-xs uppercase" :class="[tableHeaderBg, tableHeaderTextColor]">
					<tr>
						<th v-for="header in headers" :key="header.value" scope="col" class="px-6 py-4 cursor-pointer"
							@click="sortTable(header.value)">
							{{ header.text }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="horse in sortedHorses" :key="horse.id"
						class="bg-white border-b border-slate-200 hover:bg-gray-50">
						<td class="px-6 py-3">{{ horse.id }}</td>
						<td class="px-6 py-3 font-semibold text-gray-900 whitespace-nowrap">{{ horse.name }}</td>
						<td class="px-6 py-3">{{ formatDate(horse.lastVaccinationDate) }}</td>
						<td class="px-6 py-3">{{ horse.owner }}</td>
						<td class="px-6 py-3">{{ horse.trainer }}</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Tailwind Pagination -->
		<div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
			<!-- Mobile Navigation -->
			<div class="flex flex-1 justify-between sm:hidden">
				<button @click="$emit('prevPage')" :disabled="currentPage === 1"
					class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
					Previous
				</button>
				<button @click="$emit('nextPage')" :disabled="currentPage >= totalPages"
					class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
					Next
				</button>
			</div>

			<!-- Desktop Pagination -->
			<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				<div>
					<p class="text-sm text-gray-700">
						Showing
						<span class="font-medium">{{ startItem }}</span>
						to
						<span class="font-medium">{{ endItem }}</span>
						of
						<span class="font-medium">{{ totalItems }}</span>
						results
					</p>
				</div>
				<div>
					<nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
						<!-- Previous Button -->
						<button @click="$emit('prevPage')" :disabled="currentPage === 1"
							class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
							&laquo;
						</button>

						<!-- Dynamic Pagination with Ellipsis -->
						<template v-for="page in displayedPages" :key="page">
							<button v-if="page === '...'" disabled
								class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500">
								...
							</button>
							<button v-else @click="$emit('goToPage', page)"
								:class="currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-900 hover:bg-gray-50'"
								class="relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0">
								{{ page }}
							</button>
						</template>

						<!-- Next Button -->
						<button @click="$emit('nextPage')" :disabled="currentPage >= totalPages"
							class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
							&raquo;
						</button>
					</nav>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";

// Props received from the parent component
const props = defineProps({
	horses: Array,
	currentPage: Number,
	totalPages: Number,
	totalItems: Number,
	startItem: Number,
	endItem: Number,
	tableHeaderBg: String,
	tableHeaderTextColor: String
});

// Sorting Logic
const sortKey = defineModel("sortKey", { type: String, default: "" });
const sortOrder = defineModel("sortOrder", { type: String, default: "asc" });

const sortTable = (key) => {
	if (sortKey.value === key) {
		sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
	} else {
		sortKey.value = key;
		sortOrder.value = "asc";
	}
};

const sortedHorses = computed(() => {
	if (!sortKey.value) return props.horses;
	return [...props.horses].sort((a, b) => {
		let result = a[sortKey.value] > b[sortKey.value] ? 1 : -1;
		return sortOrder.value === "asc" ? result : -result;
	});
});

// Compute displayed pagination pages with ellipsis
const displayedPages = computed(() => {
	const maxVisiblePages = 7; // Maximum number of pages to show before adding ellipsis
	const pages = [];

	if (props.totalPages <= maxVisiblePages) {
		// If total pages is small, show all
		for (let i = 1; i <= props.totalPages; i++) {
			pages.push(i);
		}
	} else {
		// Always show first page
		pages.push(1);

		if (props.currentPage > 4) {
			pages.push("...");
		}

		// Show 2 pages before and after the current page
		for (let i = Math.max(2, props.currentPage - 2); i <= Math.min(props.totalPages - 1, props.currentPage + 2); i++) {
			pages.push(i);
		}

		if (props.currentPage < props.totalPages - 3) {
			pages.push("...");
		}

		// Always show last page
		pages.push(props.totalPages);
	}

	return pages;
});

// Table Headers
const headers = [
	{ text: "ID", value: "id" },
	{ text: "Horse Name", value: "name" },
	{ text: "Last Vaccination Date", value: "last_vaccinated" },
	{ text: "Owner", value: "owner" },
	{ text: "Trainer", value: "trainer" }
];

// Date Formatting for DD/MM/YYYY
const formatDate = (date) => {
	if (!date) return "N/A"; // Handle empty values
	return new Date(date).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

</script>