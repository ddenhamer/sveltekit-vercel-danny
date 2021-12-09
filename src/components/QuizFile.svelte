<script>
	export let name;
    export let id;
	export let qtype;
	import { quiz } from '../stores/stores.js';
	
	$quiz = $quiz

	function determineVisibility ($quiz) {
		if ($quiz.show.includes(id)) {
			return "visible px-10 py-1"
		} else if ($quiz.preview.includes(id)) {
			return "preview px-10 py-1"
		} else {
			return "hidden"
		}
	}

	$: visibility = determineVisibility($quiz);

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

	function processAnswer (value) {
		$quiz.answered_question = {
			"criterium":id,
			"answer":value
		}
		updateQuiz();
	}

	let disabled = false;

	function toggleDisabled () {
		disabled = !disabled;
	}

	let answer = 0;

	let input = "appearance-none border rounded w-20 py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

</script>

<div class={visibility}>
	{#if (visibility === 'visible px-10 py-1')}
		<a class="text-black" href='/c/{id}'><span>{name} [{id}]</span></a>
		{#if (!disabled)}
			{#if (qtype === 'BOOLEAN')}
				<button on:click={() => processAnswer(true)} on:click={toggleDisabled} class='btn bg-green-500'>Y</button>
				<button on:click={() => processAnswer(false)} on:click={toggleDisabled} class='btn bg-red-500' >N</button>
			{:else if (qtype === 'FLOAT')}
				<input class={input} bind:value={answer}>
				<button on:click={() => processAnswer(answer)} on:click={toggleDisabled} class='btn bg-blue-500'>Submit</button>
			{/if}
		{:else}
			<span class='text-gray-500'>Answered</span>
		{/if}
	{:else if (visibility === 'preview px-10 py-1')}
		<a class="text-gray-300" href='/c/{id}'><span>{name} [{id}]</span></a>
	{/if}
</div>
<style>
	.btn {
    	@apply px-2 rounded-sm text-white;
  	}
</style>