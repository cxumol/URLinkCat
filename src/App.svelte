<script>
	let data;
	let uploadingState;
	let uploadingIconConfig = {"color":"green","icon":"backup"};
	const dataSizeLimit = Number(12345);
	const cf_workers = "urlinkcat.t6.workers.dev";
	let needToken;
	const isInstanceDemo = true;
	
	import { data_store } from './data.js';
	import { onDestroy } from 'svelte';
	function getDemoData(){
		let unsubscribe = data_store.subscribe(value => data = value);
  		onDestroy(unsubscribe);
	}
	getDemoData(); // Don't remove
	let jsonedData;
	// let jsonedData = JSON.stringify(data); // dupe, implemented when get kv db failure

	export let markdown;

	let pageReadme;
	pageReadme = markdown.parse(data.readme.content, {
    parseFlags: markdown.ParseFlags.DEFAULT | markdown.ParseFlags.NO_HTML, // NO_HTML for safety reason (xss)
  });
	

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
				"name":"My New Bookmark"
				}`)
		);
		data = data;
	}

	function addCat(categories){
		categories.push(
			JSON.parse(`{
				"name":"My New Category",
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
			alert("You are trying to upload oversized data to the cloud! Please diminish your content in order to sync to cloud.")
			return false
		}

		if (myDataStr == jsonedData) {
			alert("Nothing changed. No need to save.")
			return false
		}
		// else{
		// 	console.log{myDataStr == jsonedData, myDataStr , jsonedData}
		// }

		return true
	}

	const newRandomID = function(){
		let result = Math.random().toString(36).slice(-8);
		while (result.length < 8) {
			result = Math.random().toString(36).slice(-8);
		}
		return result;
	}

	let username = window.location.hash.split("#")[1];
	if (!username){
		username = newRandomID();
 		window.location.replace(window.location.pathname + '#' + newRandomID());
	}

	function getData(username){
		fetch(`https://${cf_workers}/get/${username}`, { headers:myheaders })
			.then(response => {
				// response.headers.forEach(console.log);
				if (response.headers.get('x-need-token')){
					needToken = true;
					console.log('needToken');
				}else{
					needToken = false;
				}
				if (!response.ok) {
				throw new Error(response);
				}
				return response.json();
			})
			.then(result => {
				// update cloud data structure implicitly
				cloudData = result;
				data.keys().forEach(k=>{
					if(!cloudData.hasOwnProperty(k)){
						cloudData[k]=data[k];
					}
				})
				data = cloudData;
				jsonedData = JSON.stringify(data);
			})
			.catch(error => {
				console.log(error)
				getDemoData();
				jsonedData = JSON.stringify(data);
			});
	}

	// Init data
	getData(username);
	data.token='';
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
				if (!response.ok) { // https://gist.github.com/odewahn/5a5eeb23279eed6a80d7798fdb47fe91
				throw response
				}
			})
			.then(() => {
				uploadingState = 'ok';
				changeIcon()
				jsonedData = myDataStr;
			})
			.catch(error => {
				uploadingState = 'bad';
				changeIcon()
				error.text().then((msg) => alert(`unsuccessful data uploading \nReason: ${msg}`));
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

	// Password / Token related functions
	function checkToken(){
		data=data;
		if (['\\', '"'].some(el => data.token.includes(el))) alert('disallowed characters')
		// console.log(data.token)
	}
	
	
	// color-code auto correction, from "Light Blue" to "light-blue"
	const fixColorCode = (val)=> val.toLowerCase().replace(' ', '-');
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

<div>{@html pageReadme}</div>

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

<button id="btn-upload" title="Save to cloud" class="col-md-12 s-margin add-new" on:click={() => {uploadData(data)}}>
	<div id="container-upload">
		<span class="material-icons-outlined">{uploadingIconConfig.icon}</span>
	</div>
</button>

<!-- USER	EDITOR MODE -->

{:else if unlocked}

<h1 class="bg-{data.title.color} center">
	<input class='color-edit' bind:value={data.title.color} on:input={data.title.color=fixColorCode(this.value)}>
	<input class='text-edit' bind:value={data.title.name}>
</h1>
 <!-- Readme editor -->
<button class="bg-white full-width">
<textarea name="readme" id="readme-editor" class="full-width" rows="10" bind:value={data.readme.content}></textarea>
</button>

{#each data.categories as cat, cat_i}

<div>
<h2 class="bg-{cat.color} center">
<input class='color-edit' bind:value={cat.color} on:input={cat.color=fixColorCode(this.value)}>
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


{#if needToken}
<div class="auth container">This page requires admin token to save data. Token: <input id="token" bind:value={data.token} on:input={checkToken} ></div>
{/if}

<footer> <div class="footer">All contents and related copyrights/responsibilities belong to anonymous users. Therefore, the web application and/or website providers are not responsible for any legal affairs regarding the contents.</div> </footer>


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

.auth{
	font-style: italic;
}

</style>
