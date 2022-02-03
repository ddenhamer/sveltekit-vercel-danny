<script>
	export let label;
    export let id;

	function copy(library_id) {
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(library_id);
    }
</script>

<span on:click={() => copy(id)} class="dark:text-slate-400">{label} [{id}]</span>
<a href='/c/{id}'>
	<button class="btn text-sm text-gray-300 hover:text-gray-500 dark:text-slate-400">edit</button>
</a>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
		cursor: pointer;
	}
	.btn {
    	@apply px-1 rounded-sm;
  	}
</style>