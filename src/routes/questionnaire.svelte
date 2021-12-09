<script>
	import QuizFolder from '../components/QuizFolder.svelte';
	import { quiz } from '../stores/stores.js';

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

	let trial_id = ""
	
	function loadDMD() {
		$quiz.trial_ids = [
			"NCT05126758","myT00003","myT00202101","NCT05096221","myT04275861","NCT03936894","NCT03340675","NCT03368742","NCT04585464","NCT04281485","NCT04060199","NCT04906460","NCT03067831","NCT02500381","NCT04184882","NCT04632940","NCT02196467","NCT04371666","NCT04956289","NCT04587908","NCT04336826"
		];
	}

	
	let input = "shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
	
	async function updateQuiz() {
		const res = await fetch(
			`https://enterprise-search-develop.mytomorrows.com/v01/search/gatekeeper_questionnaire`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify($quiz)
			}
			)
			
			if (res.ok) {
				let response = await res.json()
				$quiz = response;
			} else {
				throw Error();
			}
		}
		
		$quiz = $quiz
		
	function addToArray() {
		$quiz.trial_ids = [...$quiz.trial_ids, trial_id];
		trial_id = '';
	};
	
</script>
<main>
	<div class="bg-gray-200 p-8 my-8 rounded-md grid grid-cols-2 gap-4">
		<div>
			<p class="font-bold my-2">Add Trial IDs:</p>
			<input class={input} bind:value={trial_id}>
			<button class='btn bg-green-500 py-1' on:click={addToArray}>Add Trial ID</button>
			<button class='bg-purple-300 rounded-sm text-white p-1' on:click={loadDMD}>DMD</button>
			<br>
			<!-- <p>{$quiz.trial_ids}</p> -->
			<button class="btn bg-green-500 p-2" on:click={updateQuiz}>Initialize Questionnaire</button>
		</div>
		<div class="bg-white rounded-md p-8">
			<span class='font-bold text-green-500'>Eligible for:</span>
			<h2>{$quiz.trial_ids.join(', ')}</h2>
		</div>
	</div>
	<div>
		<span class="text-xl font-bold">Questionnaire</span>
		{#await fetchChildren}
			<p>...retrieving all criteria</p>
		{:then data}
			{#each data as rootNode}
				<div>
					<QuizFolder name={rootNode.name} id={rootNode.id} children={rootNode.children}/>
				</div>
			{/each}
		{:catch error}
			<p>An error occurred!</p>
		{/await}
	</div>
<!-- 
	<p>whitelist: {JSON.stringify($quiz.whitelist)}</p>
	<p>preview: {JSON.stringify($quiz.preview)}</p>
	<p>show: {JSON.stringify($quiz.show)}</p> -->
</main>

<style>
	.btn {
    	@apply px-2 my-2 rounded-sm text-white;
  	}
</style>
