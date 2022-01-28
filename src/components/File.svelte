<script>
	export let label;
    export let id;
</script>

<span>{label} [{id}]</span>
<a href='/c/{id}'>
	<button class="btn text-sm text-gray-300 hover:text-gray-500">edit</button>
</a>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
	}
	.btn {
    	@apply px-1 rounded-sm;
  	}
</style>