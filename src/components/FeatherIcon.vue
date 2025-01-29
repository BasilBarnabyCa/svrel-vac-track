<template>
	<i v-html="iconSvg" class="inline-block align-middle"></i>
  </template>
  
  <script setup>
  import { ref, watchEffect } from 'vue';
  import feather from 'feather-icons';
  
  const props = defineProps({
	name: String, // Icon name (e.g., 'home', 'settings')
	size: {
	  type: [Number, String],
	  default: 24,
	},
	strokeWidth: {
	  type: [Number, String],
	  default: 2,
	},
  });
  
  const iconSvg = ref('');
  
  watchEffect(() => {
	iconSvg.value = feather.icons[props.name]?.toSvg({
	  width: props.size,
	  height: props.size,
	  strokeWidth: props.strokeWidth,
	}) || '';
  });
  </script>