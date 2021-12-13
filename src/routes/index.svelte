<script>
	import Folder from '../components/Folder.svelte';

	const fetchChildren = (async () => {
		const response = await fetch(
			`https://enterprise-search.mytomorrows.com/v01/library/get_children`, {
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
	<div class="bg-blue-100 rounded-md w-full mt-24 mb-8 px-8 py-4">
		<span class="font-bold">Link to instructions:</span>
		<ul>
			<li>
		<a href='https://mytomorrows-my.sharepoint.com/personal/danny_den_hamer_mytomorrows_com/_layouts/15/guestaccess.aspx?guestaccesstoken=ysydjyPPGMyC2BZ9VVCO4TagjrY3344WyyjfnUIl7t4%3D&docid=2_01cd29d7f3249410a8e464977a1450f02&rev=1&e=iACeU0'><span class='hover:underline'>- Criteria Tree</span></a>
			</li>
		</ul>
	</div>

	<div>
    {#await fetchChildren}
	    <p>...waiting</p>
    {:then data}
        <Folder name="All Criteria" id='0' children={data} expanded/>
    {:catch error}
        <p>An error occurred!</p>
    {/await}
	</div>
</main>
<style>
	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
	}

	li {
		padding: 0.2em 0;
	}
</style>