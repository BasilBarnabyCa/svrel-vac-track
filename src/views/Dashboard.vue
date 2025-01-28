<template>
	<h1 class="text-3xl font-semibold mt-5 mb-3">Dashboard</h1>
	<hr class="border-b-1 border-gray-200 mb-5"/>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		<div v-for="(card, index) in dashboardData" :key="index"
			class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full">
			<h5 class="mb-1 text-2xl font-bold tracking-tight">{{ formatNumber(card.count) }}</h5>
			<p class="font-normal text-gray-400 text-sm">{{ card.title }}</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const dashboardData = ref([]);

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

onMounted(async () => {
	try {
		// Retrieve the token from local storage
		const token = localStorage.getItem("access_token");

		if (!token) {
			console.error("No access token found");
			return;
		}

		// Set the Authorization header for the request
		const response = await axios.get("http://sm.svrel.test/api/external/jrc/horses/dashboard", {
			headers: {
				Authorization: `Bearer ${token}`, // Send the token in the Authorization header
			},
		});

		const data = response.data;

		// Map data to cards
		dashboardData.value = [
			{ title: "Total Horses", count: data.totalHorses },
			{ title: "Vaccinated Horses", count: data.vaccinatedHorses },
			{ title: "Overdue Horses", count: data.overdueHorses },
			{ title: "Needs Vaccination Soon", count: data.needsVaccination },
			{ title: "Requires Double Boosters", count: data.requiresDoubleBoosters },
			{ title: "Missing Routine Vaccination", count: data.missingRoutineVaccination },

		];
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error("Unauthorized: Invalid or expired access token.");
			// Redirect to login or handle re-authentication
		} else {
			console.error("An error occurred:", error.message);
		}
	}
});

</script>