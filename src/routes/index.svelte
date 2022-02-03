<script>
	import Folder from '../components/Folder.svelte';

	const fetchChildren = (async () => {
		const response = await fetch(
			`https://enterprise-search-develop.mytomorrows.com/v01/library/get_full_tree`, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({node:{id:'C'}})
			}
		)
		let list = await response.json()
		list.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }))
		return list
	})()
</script>
<main>
	<div>
		<div class='mx-8'>
			<div class='h-24'></div>
			<div class="bg-blue-100 dark:bg-slate-800 rounded-md w-full px-8 py-8 mb-8">
				<span class="font-bold dark:text-slate-400">Link to instructions:</span>
				<ul>
					<li>
				<a href='https://mytomorrows.sharepoint.com/sites/Engineering/_layouts/15/guestaccess.aspx?guestaccesstoken=zvM1eNJrW7vnjQ4RFaHkJ3aSNR4Lkk7Eme%2FICTng5CE%3D&docid=2_175783af9a5a249028f2325be9e2c5c24&rev=1&e=OuJZPi'><span class='hover:underline dark:text-slate-400'>- Annotation Instructions</span></a>
					</li>
					<li>
						<a href='https://mytomorrows-my.sharepoint.com/personal/danny_den_hamer_mytomorrows_com/_layouts/15/guestaccess.aspx?guestaccesstoken=ysydjyPPGMyC2BZ9VVCO4TagjrY3344WyyjfnUIl7t4%3D&docid=2_01cd29d7f3249410a8e464977a1450f02&rev=1&e=iACeU0'><span class='hover:underline dark:text-slate-400'>- Criteria Tree Format</span></a>
					</li>
				</ul>
			</div>

			<div>
			{#await fetchChildren}
				<p>...waiting</p>
			{:then data}
				<Folder label="All Criteria" id='C' children={data} expanded/>
			{:catch error}
				<p>An error occurred!</p>
			{/await}
			</div>
			<div class="dark:bg-slate-900 h-screen"></div>
		</div>
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