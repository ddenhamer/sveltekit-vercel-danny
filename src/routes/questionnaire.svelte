<script>
	import QuizFolder from '../components/QuizFolder.svelte';
	import { quiz, enabled } from '../stores/stores.js';
	import GenerateTsr from '../components/GenerateTSR.svelte';
	import QuizDropdown from '../components/QuizDropdown.svelte';

	const fetchChildren = (async () => {
		const response = await fetch(
			`https://enterprise-search-develop.mytomorrows.com/v01/library/get_full_tree`, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({node:{id:'0'}})
			}
		)
		let list = await response.json()
		list.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }))
		return list
	})()

	let patient_id = ""
	
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
			`https://enterprise-search-develop.mytomorrows.com/v01/search/questionnaire`, {
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

	const getUserQuery = (condition) => `query {
		aliases(where:{alias:"${condition}"}) {
			aliasStudiedIn {
				id
			}
		}
	}`;

	// let condition = 'Duchenne Muscular Dystrophy'
	async function getTrialsForTerm(condition) {
		toggleEnabled()
		const res = await fetch(
			`https://enterprise-search-develop.mytomorrows.com/gql/graphql`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					query: getUserQuery(condition)
				})
			}
			)
			if (res.ok) {
				let response = await res.json()
				let data = response.data.aliases[0].aliasStudiedIn
				let ids = data.map(a => a.id)
				$quiz.trial_ids = ids
				toggleEnabled()
				return ids
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
				<button class='bg-purple-300 text-white py-2 px-2 mb-1' on:click={() => getTrialsForTerm('Glioblastoma')}>GBM</button>
				<button class='bg-purple-300 text-white py-2 px-2 mb-1' on:click={() => getTrialsForTerm('Duchenne Muscular Dystrophy')}>DMD</button>
				<button class='bg-purple-300 text-white py-2 px-2 mb-1' on:click={() => getTrialsForTerm('myT_Jiangsu_Pyramid-1')}>PYRAMID-1</button>
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
		<!-- <h2>{$quiz.trial_ids.join(', ')}</h2> -->
		<h2>{$quiz.trial_ids.length}</h2>
		<br>
		<span class='font-bold text-red-600'>Ineligible</span><br>
		<!-- <h2>{$quiz.ineligible.join(', ')}</h2> -->
		<h2>{$quiz.ineligible.length}</h2>
		</div>
		<GenerateTsr trial_ids={$quiz.trial_ids} patient_id={patient_id} questions={$quiz.questions}/>
	</div>

	<div>
		{#await fetchChildren}
			<p>...retrieving all criteria</p>
		{:then data}
			{#each data as rootNode}
				<div>
					<QuizFolder label={rootNode.properties.label} id={rootNode.id} children={rootNode.children}/>
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