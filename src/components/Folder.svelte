<script>
	import File from '../components/File.svelte';
	import {slide} from 'svelte/transition'
	
	export let expanded = false;
	export let name;
	export let id;
	export let children;

	let sorted_children = children.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }))

	function toggle() {
		expanded = !expanded;
	}
</script>

<span class:expanded on:click={toggle}>{name} [{id}]</span>

{#if expanded}
	<ul transition:slide={{duration:300}}>
		{#each sorted_children as child}
			<li>
				{#if child.type === 'Category'}
					<svelte:self {...child}/>
				{:else}
					<File {...child}/>
				{/if}
			</li>
		{/each}
		<li class="mx-6">
			<a href='/c/create?parent_id={id}'>
				<button class="btn btn-green text-sm">Add new</button>
			</a>
		</li>
		
	</ul>
	
{/if}


<style>
	span {
		padding: 0 0 0 1.5em;
		background: url(tutorial/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}

	.expanded {
		background-image: url(tutorial/icons/folder-open.svg);
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}

	li {
		padding: 0.2em 0;
	}

	.btn {
    	@apply px-4 rounded-sm text-white;
  	}
	.btn-green {
		@apply bg-green-600;
	}
	.btn-green:hover {
		@apply bg-green-700;
	}
</style>
