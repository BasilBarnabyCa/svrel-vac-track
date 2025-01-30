<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
		<div class="bg-white p-6 rounded-lg shadow-lg w-96">
			<h2 class="text-2xl font-semibold text-center mb-4">Login</h2>
			<!-- Error Feedback -->
			<div v-if="errorMessage" class="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded relative mb-5">
				{{ errorMessage }}
			</div>
			<form @submit.prevent="login" class="space-y-4">

				<!-- Email Field -->
				<div>
					<label class="block text-gray-700 font-medium mb-1">Email</label>
					<input type="email" v-model="email" placeholder="Enter your email"
						class="w-full rounded-md border-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
						required />
				</div>

				<!-- Password Field -->
				<div>
					<label class="block text-gray-700 font-medium mb-1">Password</label>
					<input type="password" v-model="password" placeholder="Enter your password"
						class="w-full rounded-md border-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
						required />
				</div>

				<!-- Submit Button -->
				<button type="submit"
					class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
					Login
				</button>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");

const login = async () => {
	errorMessage.value = ""; // Clear any previous error messages
	try {
		// Send login request
		const response = await axios.post(
			"/login",
			{
				email: email.value,
				password: password.value,
			}
		);

		// Store access token & redirect
		localStorage.setItem("access_token", response.data.access_token);
		axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
		router.push("/");
	} catch (error) {
		// Handle errors
		if (error.response && error.response.status === 401) {
			errorMessage.value = "Invalid credentials.";
		} else {
			errorMessage.value = "An unexpected error occurred. Please try again later.";
		}
	}
};
</script>