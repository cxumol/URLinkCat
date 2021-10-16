<script>
	let data;
	let uploadingState;
	let uploadingIconConfig = {"color":"green","icon":"backup"};
	const dataSizeLimit = Number(12345);
	const cf_workers = "urlinkcat.t6.workers.dev";
	
	import { data_store } from './data.js';
	import { onDestroy } from 'svelte';
	function getDemoData(){
		let unsubscribe = data_store.subscribe(value => data = value);
  		onDestroy(unsubscribe);
	}
	getDemoData(); // Don't remove
	let savedData = JSON.stringify(data);

	import Lock from './Lock.svelte';
	let unlocked = false;
	
	function delItem(sites, site_i){
		sites[site_i].undo=true;
		data = data;
		setTimeout(()=>{
			if (sites[site_i].undo){
			sites.splice(site_i, 1);
			data = data;}
		},2500)
	}
	function delItem_undo(sites, site_i){
		sites[site_i].undo=false;
		data = data;
	}
	function addItem(sites){
		sites.push(
			JSON.parse(`{
				"icon":"link",
				"url":"${document.URL}",
				"name":"Your New Bookmark"
				}`)
		);
		data = data;
	}

	function addCat(categories){
		categories.push(
			JSON.parse(`{
				"name":"Your New Category",
				"color":"brown",
				"sites":[]
				}`)
		);
		data = data;
	}
	function delCat(cats, cat_i){
		cats[cat_i].undo=true;
		data = data;
		setTimeout(()=>{
			if (cats[cat_i].undo){
			cats.splice(cat_i, 1);
			data = data;}
		},4000)
	}
	function delCat_undo(cats, cat_i){
		cats[cat_i].undo=false;
		data = data;
	}

	// db
	const myheaders = {
		"Origin":window.location.origin,
		"Content-Type": "text/plain"
	};
	
	function data_validate(myDataStr, dataSizeLimit){
		if (myDataStr.length > dataSizeLimit) {
			alert("Data size exceeds limit.")
			return false
		}

		if (myDataStr == savedData) {
			alert("Nothing changed. No need to save.")
			return false
		}
		// else{
		// 	console.log{myDataStr == savedData, myDataStr , savedData}
		// }

		return true
	}

	const randStr = function(){
		let result = Math.random().toString(36).slice(-8);
		while (result.length < 8) {
			result = Math.random().toString(36).slice(-8);
		}
		return result;
	}

	let username = window.location.hash.split("#")[1];
	if (!username){
		username = randStr();
 		window.location.replace(window.location.pathname + '#' + randStr());
	}

	function getData(username){
		fetch(`https://${cf_workers}/get/${username}`, { headers:myheaders })
			.then(response => {
				if (!response.ok) {
				throw new Error(response);
				}
				return response.json();
			})
			.then(result => {
				data = result;
				savedData = JSON.stringify(data);
			})
			.catch(error => {
				console.log(error)
				getDemoData();
				savedData = JSON.stringify(data);
			});
	}

	getData(username);
	window.onhashchange = function() {
		username = window.location.hash.split("#")[1];
		getData(username);
	}

	function uploadData(myData){
		let myDataStr = JSON.stringify(myData);
		if (!data_validate(myDataStr, dataSizeLimit)){
			uploadingState = 'bad';
			changeIcon();
			return false;
		}
		
		fetch(`https://${cf_workers}/set/${username}`, {
				headers: myheaders,
				method: 'POST',
				body: myDataStr,
				})
			.then(response => {
				if (!response.ok) {
				throw new Error('cannot upload data');
				}
			})
			.then(() => {
				uploadingState = 'ok';
				changeIcon()
				savedData = myDataStr;
			})
			.catch(error => {
				uploadingState = 'bad';
				changeIcon()
				alert('unsuccessful data uploading');
			});
	}

	function chooseIcon(uploadingState){
		switch (uploadingState) {
			case 'ok':
				return {"color":"lime","icon":"done"}
				break;
			case 'bad':
				return {"color":"maroon","icon":"dangerous"}
				break;
			default:
				return {"color":"green","icon":"backup"}
				break;
		}
	}
	function changeIcon(){
		uploadingIconConfig = chooseIcon(uploadingState) 
		setTimeout(()=>{
			uploadingState = '';
			changeIcon('');
		},5000)
	}
	
</script>

<div style="--icon-color: {uploadingIconConfig.color}">

<!-- USER	VIEW MODE -->

{#if !unlocked}

<h1 class="bg-{data.title.color} center">{data.title.name}</h1>

<p>
	Demo website. No guarantee on reliability. Please consider self-hosting for your own security.
</p>

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
<hr/>
{/each}

<button id="btn-upload" class="col-md-12 s-margin add-new" on:click={() => {uploadData(data)}}>
	<div id="container-upload">
		<span class="material-icons-outlined">{uploadingIconConfig.icon}</span>
	</div>
</button>

<!-- USER	EDITOR MODE -->

{:else if unlocked}

<h1 class="bg-{data.title.color} center">
	<input class='color-edit' bind:value={data.title.color}>
	<input class='text-edit' bind:value={data.title.name}>
</h1>

{#each data.categories as cat, cat_i}

<div>
<h2 class="bg-{cat.color} center">
<input class='color-edit' bind:value={cat.color}>
	<input class='text-edit' bind:value={cat.name}>
	{#if !cat.undo}
	<button class="right s-padding m-margin del-icon bg-white" on:click={() => delCat(data.categories, cat_i)}>
		<span class="material-icons-outlined preview">
		auto_delete
		</span>
	</button>
	{:else}
	<button class="right m-margin del-icon bg-white" on:click={() => delCat_undo(data.categories, cat_i)}>
		<span class="material-icons-outlined preview">
		undo
		</span>
	</button>
	{/if}
</h2>
{#each cat.sites as site, site_i}
<button class="col-md-2 m-margin m-padding">
		<span class="material-icons-outlined preview">
		{site.icon}
		</span>
	{#if !site.undo}
	<button class="right inner-seamless outer-seamless del-icon bg-no" on:click={() => delItem(cat.sites, site_i)}>
		<span class="material-icons-outlined preview">
		auto_delete
		</span>
	</button>
	{:else}
	<button class="right inner-seamless outer-seamless del-icon bg-no" on:click={() => delItem_undo(cat.sites, site_i)}>
		<span class="material-icons-outlined preview">
		undo
		</span>
	</button>
	{/if}
	
		<input class='text-edit inside' bind:value={site.icon}>
		<input class='text-edit inside' bind:value={site.url}>
		<input class='text-edit inside' bind:value={site.name}>
</button>
{/each}
	<button class="col-md-2 s-margin add-new" on:click={() => addItem(cat.sites)}>
		<span class="material-icons-outlined">
		add_circle_outline
		</span>
		<p>
			Add new item
		</p>
</button>
	</div>
<hr/>
{/each}
<div>
	<button class="col-md-12 s-margin add-new" on:click={() => {addCat(data.categories)}}>
		<span class="material-icons-outlined">add_circle_outline</span>
		<br>
		Add new category
</button>
</div>
{/if}

<Lock bind:unlocked={unlocked}/>



<footer> <div class="footer">All contents and the related copyrights/responsibilities are belong to anonymous users, so that the website providers are unrelated to any legal affairs.</div> </footer>


</div>
<!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/material-icons/css/material-icons.min.css"> -->
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined">
<link rel="stylesheet" href="https://cdn.rawgit.com/alexanderGugel/papier/master/dist/papier.min.css">
<style>
.material-icons-outlined {
  font-size: 5em; 
	text-align:center;
}
	.material-icons-outlined.preview {
  font-size: 1em; 
}
	.del-icon{
		float:right;
		color:red;
	}
	
button a p{
	font-weight: bold;
  word-break: break-word;
}
	
button {
    float:none;
}
button.add-new {
    opacity:50%;
}
button.add-new:focus, button.add-new:hover {
    opacity:100%;
}
	

input{
	color: #000;
	}
input:focus {
    color: #000;
}
*::value { /* Most modern browsers support this now. */
   color:    #909;
}
	input.color-edit{
		float:left;
		width:7%;
		text-align:center;
	}
	input.text-edit{
text-align:center;
	}
		input.text-edit.inside{
text-align:center;
			width:100%;
	}
	

#btn-upload{
		/*   border: 0.1em solid #ddd; */
  border-radius: 50%;
  background-color: Transparent;
  max-height : 80px;
  max-width : 80px;
/*   display: flex; */
  position: fixed;
  bottom: 10px;
  right: 110px;
	padding:0;
	color: var(--icon-color);;
	}
	#container-upload{
		display: flex;
  align-items: center;
  justify-content: center;
	}
	
	.footer{
		text-align:center;
		font-size:0.7em;
	}

</style>