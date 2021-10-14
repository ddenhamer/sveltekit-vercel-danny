<script>
	export let name;
    export let id;
</script>

<a href='/c/{id}' class='hover:underline text-black hover:text-blue-800'><span>{name} [{id}]</span></a>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
	}
</style>