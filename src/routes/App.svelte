<script>
	export let data;
	let dataSnapshot;
	let pageReadme;
	let uploadingIconConfig = { color: 'green', icon: 'backup' };
	const dataSizeLimit = Number(12345);
	const cf_workers = 'urlinkcat.t6.workers.dev';
	const isInstanceDemo = true;

	// import utils
	import { DB } from '$lib/db.js';
	import { newRandomID } from '$lib/utils.js';

	// import external dependency
	import * as markdown from '@logue/markdown-wasm';

	// init username
	let username = window.location.hash.split('#')[1];
	if (!username) {
		username = newRandomID();
		window.location.replace(window.location.pathname + '#' + newRandomID());
	}
	let db = new DB(cf_workers, username);

	// Init data
	async function initData() {
		data = await db.getData(username); //.then((result) => data = result);
		data.token = ''; // fron-end-only key
		data = data; // TODO: refactor in Svelte 5
		dataSnapshot = JSON.stringify(data);
		updatePageReadMe();
	}

	async function updatePageReadMe() {
		data = data;
		pageReadme = markdown.parse(data.readme.content, {
			parseFlags: markdown.ParseFlags.DEFAULT | markdown.ParseFlags.NO_HTML // NO_HTML for safety reason (xss)
		});
	}

	// async init
	import { onMount } from 'svelte';
	onMount(async () => {
		// await initData();
		await markdown.ready();
		await initData();
	});

	// init components
	import Lock from './Lock.svelte';
	let unlocked = false;
	import CardsEditable from './CardsEditable.svelte';

	// page data updators + CardsEditable.svelte
	function addItem(sites) {
		sites.push(
			JSON.parse(`{
				"icon":"link",
				"url":"${document.URL}",
				"name":"My New Bookmark"
				}`)
		);
		data = data;
	}
	function addCat(categories) {
		categories.push(
			JSON.parse(`{
				"name":"My New Category",
				"color":"brown",
				"sites":[]
				}`)
		);
		data = data;
	}
	function delCat(cats, cat_i) {
		cats[cat_i].undo = true;
		data = data;
		setTimeout(() => {
			if (cats[cat_i].undo) {
				cats.splice(cat_i, 1);
				data = data;
			}
		}, 4000);
	}
	function delCat_undo(cats, cat_i) {
		cats[cat_i].undo = false;
		data = data;
	}

	// page data handlers
	window.onhashchange = async function () {
		username = window.location.hash.split('#')[1];
		db = new DB(cf_workers, username);
		data = await db.getData(username);
		updatePageReadMe();
	};

	function data_validate(currentDataStr, dataSizeLimit) {
		if (currentDataStr.length > dataSizeLimit) {
			alert(
				'You are trying to upload oversized data to the cloud! Please diminish your content in order to sync to cloud.'
			);
			return false;
		}

		if (currentDataStr == dataSnapshot) {
			alert('Nothing changed. No need to save.');
			return false;
		}

		return true;
	}

	function tryUploadData() {
		const currentDataStr = JSON.stringify(data);
		if (!data_validate(currentDataStr, dataSizeLimit)) {
			const uploadingState = 'bad';
			changeIcon(uploadingState);
			return false;
		}
		db.uploadData(currentDataStr).then(({ uploadingState }) => {
			changeIcon(uploadingState);
			if (uploadingState == 'ok') {
				dataSnapshot = JSON.stringify(data);
			}
		});
	}

	// Icon as upload indicator
	function chooseIcon(uploadingState) {
		switch (uploadingState) {
			case 'ok':
				return { color: 'lime', icon: 'done' };
				break;
			case 'bad':
				return { color: 'maroon', icon: 'dangerous' };
				break;
			default:
				return { color: 'green', icon: 'backup' };
				break;
		}
	}
	function changeIcon(uploadingState) {
		uploadingIconConfig = chooseIcon(uploadingState);
		setTimeout(() => {
			uploadingState = ''; //closure
			changeIcon(uploadingState);
		}, 5000);
	}

	// Password / Token related functions
	function checkToken() {
		data = data;
		if (['\\', '"'].some((el) => data.token.includes(el))) alert('disallowed characters');
	}

	// color-code auto correction, from "Light Blue" to "light-blue"
	const fixColorCode = (val) => val.toLowerCase().replace(' ', '-');
</script>

<svelte:head>
	<title>{data.title.name}</title>
</svelte:head>

<div id="icon-color-css-overlay" style="--icon-color: {uploadingIconConfig.color}">
	<!-- USER	VIEW MODE -->

	{#if !unlocked}
		<h1 class="bg-{data.title.color} center">{data.title.name}</h1>

		{#if isInstanceDemo}
			<!-- <p>
	Demo website. 
	Please consider <a href="https://github.com/cxumol/URLinkCat#build-your-own-instance">self-hosting</a> for your own security.
</p> -->
		{/if}

		<div class="card depth-1">{@html pageReadme}</div>

		{#each data.categories as cat, cat_i}
			<div>
				<h2 class="bg-{cat.color} center">{cat.name}</h2>
				{#each cat.sites as site}
					<button class="col-md-2 s-margin">
						<a href={site.url}>
							<span class="material-icons-outlined">
								{site.icon}
							</span>
							<p>
								{site.name}
							</p>
						</a>
					</button>
				{/each}
			</div>
			<hr />
		{/each}

		<button
			id="btn-upload"
			title="Save to cloud"
			class="col-md-12 s-margin add-new"
			on:click={() => {
				tryUploadData(data);
			}}
		>
			<div id="container-upload">
				<span class="material-icons-outlined">{uploadingIconConfig.icon}</span>
			</div>
		</button>

		<!-- USER	EDITOR MODE -->
	{:else if unlocked}
		<h1 class="bg-{data.title.color} center">
			<input
				class="color-edit"
				bind:value={data.title.color}
				on:input={(data.title.color = fixColorCode(this.value))}
			/>
			<input class="text-edit" bind:value={data.title.name} />
		</h1>
		<!-- Readme editor -->
		<button class="bg-white full-width">
			<textarea
				name="readme"
				id="readme-editor"
				class="full-width"
				rows="10"
				on:change={() => updatePageReadMe()}
				on:input={() => updatePageReadMe()}
				bind:value={data.readme.content}
			></textarea>
		</button>

		{#each data.categories as cat, cat_i}
			<div>
				<h2 class="bg-{cat.color} center">
					<input
						class="color-edit"
						bind:value={cat.color}
						on:input={(cat.color = fixColorCode(this.value))}
					/>
					<input class="text-edit" bind:value={cat.name} />
					{#if !cat.undo}
						<button
							class="right s-padding m-margin del-icon bg-white"
							on:click={() => delCat(data.categories, cat_i)}
						>
							<span class="material-icons-outlined edit-mode"> auto_delete </span>
						</button>
					{:else}
						<button
							class="right m-margin del-icon bg-white"
							on:click={() => delCat_undo(data.categories, cat_i)}
						>
							<span class="material-icons-outlined edit-mode"> undo </span>
						</button>
					{/if}
				</h2>
				<CardsEditable bind:cards={cat.sites} />
				<button class="col-md-2 s-margin add-new" on:click={() => addItem(cat.sites)}>
					<span class="material-icons-outlined"> add_circle_outline </span>
					<p>Add new item</p>
				</button>
			</div>
			<hr />
		{/each}
		<div>
			<button
				class="col-md-12 s-margin add-new"
				on:click={() => {
					addCat(data.categories);
				}}
			>
				<span class="material-icons-outlined">add_circle_outline</span>
				<br />
				Add new category
			</button>
		</div>
	{/if}

	<Lock bind:unlocked />

	{#if db.needToken}
		<div class="auth container">
			This page requires admin authentication to save data. Auth Token: <input
				id="token"
				bind:value={data.token}
				on:input={checkToken}
			/>
		</div>
	{/if}

	<footer>
		<div class="footer">
			All contents and related copyrights/responsibilities belong to anonymous users. Therefore, the
			web application and/or website providers are not responsible for any legal affairs regarding
			the contents.
		</div>
	</footer>
</div>
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/material-icons/css/material-icons.min.css"> -->
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" />
<link
	rel="stylesheet"
	href="https://cdn.rawgit.com/alexanderGugel/papier/master/dist/papier.min.css"
/>

<style>
	.material-icons-outlined {
		font-size: 5em;
		text-align: center;
	}
	
	.material-icons-outlined.edit-mode {
		font-size: 1em;
	}

	.del-icon {
		float: right;
		color: red;
	}

	button a p {
		font-weight: bold;
		word-break: break-word;
	}

	button {
		float: none;
	}
	button.add-new {
		opacity: 50%;
	}
	button.add-new:focus,
	button.add-new:hover {
		opacity: 100%;
	}

	input {
		color: #000;
	}
	input:focus {
		color: #000;
	}
	*::value {
		/* Most modern browsers support this now. */
		color: #909;
	}
	input.color-edit {
		float: left;
		width: 7%;
		text-align: center;
	}

	#btn-upload {
		/*   border: 0.1em solid #ddd; */
		border-radius: 50%;
		background-color: Transparent;
		max-height: 80px;
		max-width: 80px;
		/*   display: flex; */
		position: fixed;
		bottom: 10px;
		right: 110px;
		padding: 0;
		color: var(--icon-color);
	}
	#container-upload {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.footer {
		text-align: center;
		font-size: 0.7em;
	}

	.auth {
		font-style: italic;
	}
</style>
