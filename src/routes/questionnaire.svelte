<script>
	import QuizFolder from '../components/QuizFolder.svelte';
	import { quiz } from '../stores/stores.js';
	import GenerateTsr from '../components/GenerateTSR.svelte';

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
	function loadPyramid1() {
		$quiz.trial_ids = [
			"NCT04447118"
		];
	}
	
	let input = "shadow appearance-none border-2 border-white rounded w-36 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
	
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
	<div class="shadow bg-gray-200 w-3/5 p-8 mt-24 mb-8 rounded-md grid grid-cols-2 gap-8">
		<div>
			<p class="font-bold my-2">Add Trial IDs:</p>
			<input class={input} bind:value={trial_id}>
			<button class='btn bg-green-500 py-1 my-2' on:click={addToArray}>Add Trial ID</button>
			<br>
		</div>
		<div>
			<p class="font-bold my-2">Preset Conditions:</p>
			<button class='bg-purple-300 rounded-sm text-white p-1 mb-1' on:click={loadDMD}>DMD</button>
			<button class='bg-purple-300 rounded-sm text-white p-1 mb-1' on:click={loadPyramid1}>PYRAMID-1</button>
			<br>
		</div>
			<div>
				{#if ($quiz.trial_ids.length === 0)}
					<button class="btn bg-gray-400 p-2 cursor-not-allowed" on:click={updateQuiz}>Start Patient Screening</button>
				{:else}
					<button class="btn bg-green-500 p-2" on:click={updateQuiz}>Start Patient Screening</button>
				{/if}
			</div>
		<div>

		</div>
	</div>

	<div class="z-5 shadow bg-white rounded-md p-4 w-1/3 fixed top-24 right-16">
		<span class='font-bold text-green-500'>Eligible</span>
		<h2>{$quiz.trial_ids.join(', ')}</h2>
		<br>
		<span class='font-bold text-red-600'>Ineligible</span>
		<h2>{$quiz.ineligible.join(', ')}</h2>
		<GenerateTsr trial_ids={$quiz.trial_ids}/>
	</div>

	<div>
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
    	@apply shadow px-2 rounded-sm text-white;
  	}
</style>