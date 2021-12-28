<script>
	import QuizFolder from '../components/QuizFolder.svelte';
	import { quiz, enabled } from '../stores/stores.js';
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
		let list = await response.json()
		list.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }))
		return list
	})()

	let patient_id = ""
	
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
	
	let input = "shadow appearance-none border-2 border-white w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[#00a56a]"
	
	function toggleEnabled() {
		if ($enabled === '') {
			$enabled = 'cursor-not-allowed opacity-50'
		} else {
			$enabled = ''
		}
		
	}

	async function updateQuiz() {
		toggleEnabled()
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
				toggleEnabled()
		} else {
			throw Error();
		}
	}
		
</script>
<main>
	<div class="bg-gray-100 w-3/5 p-8 mt-24 mb-8 rounded-lg shadow-md">
		<div class="grid grid-cols-2 gap-8">
			<div>
				<p class="font-bold my-2">Patient ID</p>
				<input class={input} bind:value={patient_id} placeholder="e.g. P1234">
			</div>
			<div>
				<p class="font-bold my-2">Preset Conditions:</p>
				<button class='bg-purple-300 text-white py-2 px-2 mb-1' on:click={loadDMD}>DMD</button>
				<button class='bg-purple-300 text-white py-2 px-2 mb-1' on:click={loadPyramid1}>PYRAMID-1</button>
				<br>
			</div>
		</div>
		<div class="mt-8">
			{#if ($quiz.trial_ids.length === 0)}
				<button class="btn bg-gray-400 p-2 cursor-not-allowed" on:click={updateQuiz}>Start Patient Screening</button>
			{:else}
				<button class="btn bg-[#00a56a] p-2" on:click={updateQuiz}>Start Patient Screening</button>
			{/if}
		</div>
	<div>
	</div>
	</div>

	<div class="z-5 bg-white w-1/3 fixed top-24 right-16 rounded-lg shadow-md">
		<div class='p-4'>
		<span class='font-bold text-[#00a56a]'>Eligible</span><br>
		<!-- {#each $quiz.trial_ids as trial_id}
		<a href="https://www.mytomorrows.com/search/en/study-details?studyId={trial_id}" target="_blank">	
			<span class='hover:underline'>{trial_id}, </span>
		</a>
		{/each} -->
		<h2>{$quiz.trial_ids.join(', ')}</h2>
		<br>
		<span class='font-bold text-red-600'>Ineligible</span><br>
		<!-- {#each $quiz.ineligible as trial_id}
			<a href="https://www.mytomorrows.com/search/en/study-details?studyId={trial_id}" target="_blank">	
				<span class='hover:underline'>{trial_id}, </span>
			</a>
		{/each} -->
		<h2>{$quiz.ineligible.join(', ')}</h2>
		</div>
		<GenerateTsr trial_ids={$quiz.trial_ids} patient_id={patient_id} questions={$quiz.questions}/>
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
</main>
<style>
	.btn {
    	@apply shadow px-2 text-white;
  	}
</style>