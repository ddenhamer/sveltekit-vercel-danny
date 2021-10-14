<script>
	import Folder from '../components/Folder.svelte';

	const fetchChildren = (async () => {
		const response = await fetch(
			`https://enterprise-search-develop.mytomorrows.com/v01/library/get_children`, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({node_id:'0'})
			}
		)
		return await response.json()
	})()
	
</script>
<main>
    {#await fetchChildren}
	    <p>...waiting</p>
    {:then data}
        <Folder name="All Criteria" id='0' children={data} expanded/>
    {:catch error}
        <p>An error occurred!</p>
    {/await}
</main>
