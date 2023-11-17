<script>
	import App from './App.svelte';
	export let data;
</script>

<svelte:head>
	<title>URLinkCat</title>
	<meta name="description" content="a fully customizable, multi-user, cloud-synced bookmark web app" />
</svelte:head>

<App {data} />
