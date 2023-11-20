<script>
	import App from './App.svelte';
	export let data;
</script>

<svelte:head>
	<title>URLinkCat</title>
	<meta
		name="description"
		content="a fully customizable, multi-user, cloud-synced bookmark web app"
	/>
</svelte:head>

<main class="app">
<App {data} />
</main>

<style>
/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
    main.app {
        padding: 0 16px;
    }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
    main.app {
        max-width: 960px; /* Adjust this value based on your design preference */
        margin: auto; /* This centers the content */
        /* padding: 24px; */
    }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
    main.app {
        max-width: 1140px; /* Adjust this value based on your design preference */
        /* padding: 32px; */
    }
}
</style>