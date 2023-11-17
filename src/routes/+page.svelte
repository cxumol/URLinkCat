<script>
	import App from './App.svelte';
	export let data;
</script>

<svelte:head>
	<title>URLinkCat</title>
	<meta name="description" content="remind me change it later" />
</svelte:head>

<App {data} />
