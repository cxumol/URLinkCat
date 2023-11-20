<!-- https://svelte.dev/repl/f2397020cba34f5e9cb96336005f3435 -->
<script>
	import { flip } from 'svelte/animate'

	const dragDuration = 300
	export let cards
	let draggingCard
	let animatingCards = new Set()

	function handleDragStart(event, card) {
		console.log(event.target)
        // prevent blocking <input> text selection
        if (event.target.tagName !== 'INPUT') {
            draggingCard = card;
        }
    }
	// function toggleDraggable(event, enable) {
    //     const cardElement = event.currentTarget.closest('.card');
	// 	console.log(cardElement,enable)
    //     if (cardElement) {
    //         cardElement.draggable = enable;
    //     }
    // }
	function eventDebug(e){
		console.log(e.target)
	}

	function swapWith(card) {
		if (draggingCard === card || animatingCards.has(card)) return
		animatingCards.add(card)
		setTimeout(() => animatingCards.delete(card), dragDuration)
		const cardAIndex = cards.indexOf(draggingCard)
		const cardBIndex = cards.indexOf(card)
		cards[cardAIndex] = card
		cards[cardBIndex] = draggingCard
	}

	function delItem(sites, site_i) {
		sites[site_i].undo = true;
		// data = data;
		cards = cards;
		setTimeout(() => {
			if (sites[site_i].undo) {
				sites.splice(site_i, 1);
				// data = data;
				cards = cards;
			}
		}, 2500);
	}
	function delItem_undo(sites, site_i) {
		sites[site_i].undo = false;
		// data = data;
		cards = cards;
	}
</script>


<div class="row">
	{#each cards as card, card_i (card)}
		<button
			animate:flip={{ duration: dragDuration }}
			class="card panel col-md-4"
			on:dragover|preventDefault={(event) => {
					event.dataTransfer.effectAllowed = 'move'
					// event.dataTransfer.dropEffect = 'move'
					// event.target.style.cursor='move';
					}}
		>
			<!-- <button class="col-md-2 m-margin m-padding"> -->
			<!-- <section class="panel"> -->
			<div  
				class="header bg-subtle l-padding center"
				draggable="true"
				on:dragstart={(event)=>{
					// event.target.closest('.row').style.cursor = "move" ;
					event.target.closest('.row').classList.add("dragging");
					draggingCard = card;
				}}
				on:dragend={(event) => {
					event.target.closest('.row').classList.remove("dragging");
					draggingCard = undefined
					}}
				on:dragenter={() => swapWith(card)}
				on:dragover|preventDefault>
			<span class="material-icons-outlined edit-mode">
				{card.icon}
			</span>
			{#if !card.undo}
				<button
					class="right inner-seamless outer-seamless del-icon bg-no"
					on:click={() => delItem(cards, card_i)}
				>
					<span class="material-icons-outlined edit-mode"> delete </span>
				</button>
			{:else}
				<button
					class="right inner-seamless outer-seamless del-icon bg-no"
					on:click={() => delItem_undo(cards, card_i)}
				>
					<span class="material-icons-outlined edit-mode"> undo </span>
				</button>
			{/if}
			</div>
			<div class="form-fields l-padding">
			<!-- on:mousedown|stopPropagation
				on:dragstart|stopPropagation
				on:dragend|stopPropagation -->
				<div class="form-group" >
				<label>Icon</label><input class="text-edit inside" bind:value={card.icon}/>
				</div><div class="form-group" >
				<label>URL</label><input class="text-edit inside" bind:value={card.url}/>
				</div><div class="form-group" >
				<label>Name</label><input class="text-edit inside" bind:value={card.name}/>
				</div>
			</div>
		</button>
		<!-- </section> -->
		<!-- </button> -->
	{/each}
</div>

<style>
	label {
		font-size: 0.8em;
		width: 4em;
	}
	.form-group {
		display: flex;
		align-items: center;
	}

	/* section.panel{
		margin-right: 0.1em;
		margin-left: 0.1em;
	} */
	.card{
		cursor:default;
	}
	.card .header{
		cursor:move;
		/* cursor:grab; */
		font-weight: 700;
  		border-bottom: 1px solid #eee;
	}
	.dragging{
		cursor:move;
		/* cursor:grab; */
	}

	.material-icons-outlined.edit-mode {
		font-size: 1em;
	}
	input.text-edit {
		text-align: center;
		user-select: text;
	}
	input.text-edit.inside {
		text-align: center;
		width: 100%;
	}

	.del-icon {
		float: right;
		color: red;
	}
</style>