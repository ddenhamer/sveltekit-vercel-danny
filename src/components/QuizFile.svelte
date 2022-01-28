<script>
	import { quiz, enabled } from '../stores/stores.js';
	export let label;
    export let id;
	export let qtype;
	export let answered = false;

	
	$quiz = $quiz

	function determineVisibility ($quiz) {
		if ($quiz.show.includes(id)) {
			return "visible px-5 py-1"
		} else if ($quiz.preview.includes(id)) {
			return "preview px-5 py-1"
		} else {
			return "hidden"
		}
	}

	$: visibility = determineVisibility($quiz);

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

	function processAnswer (value) {
		answer = value
		$quiz.answered_question = {
			"id":id,
			"answer":value,
			"type":qtype
		}
		updateQuiz();
	}

	let disabled = false;

	function toggleDisabled () {
		disabled = !disabled;
	}

	function toggleEnabled() {
		if ($enabled === '') {
			$enabled = 'cursor-not-allowed opacity-50'
		} else {
			$enabled = ''
		}
		
	}

	let answer = 0;

	let input = "appearance-none border w-20 py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

	$: color = getColor(answer)
	let text;
	function getColor (answer) {
		if (answer === true || answered === true) {
			text = "Yes"
			return 'text-[#00a56a]'
		} else if (answer === "SKIP") {
			text = "Skipped"
			return 'text-gray-500'
		} else if (answer) {
			text = answer
			return 'text-gray-500'
		} else {
			text = "No"
			return 'text-red-500'
		}
	}

</script>

<div class={visibility}>
	{#if (visibility === 'visible px-5 py-1')}
		<span class="text-black">{label}</span>
		{#if (!disabled) && !(answered)}
			{#if (qtype === 'BOOLEAN')}
			<button on:click={() => processAnswer(true)} on:click={toggleDisabled} class='btn bg-[#00a56a] {$enabled}'>Y</button>
			<button on:click={() => processAnswer(false)} on:click={toggleDisabled} class='btn bg-red-500 {$enabled}' >N</button>
			<button on:click={() => processAnswer("SKIP")} on:click={toggleDisabled} class='btn bg-gray-300 row {$enabled}' >Skip</button>
			{:else if (qtype === 'FLOAT')}
				<input class={input} bind:value={answer}>
				<button on:click={() => processAnswer(answer)} on:click={toggleDisabled} class='btn bg-[#00a56a]'>Submit</button>
				<button on:click={() => processAnswer("SKIP")} on:click={toggleDisabled} class='btn bg-gray-300 row' >Skip</button>
			{/if}
		{:else}
			<span class='{color} opacity-50 font-bold'>{text}</span>
		{/if}
	{:else if (visibility === 'preview px-5 py-1')}
		<span class="text-gray-300">{label}</span>
	{/if}
</div>
<style>
	.btn {
    	@apply px-2 text-white;
  	}
</style>