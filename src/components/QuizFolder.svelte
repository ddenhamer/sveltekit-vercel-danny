<script>
	import QuizFile from '../components/QuizFile.svelte';
	import QuizDropdown from './QuizDropdown.svelte';
	import { slide } from 'svelte/transition'
	import { quiz, enabled } from '../stores/stores.js';

	export let name;
	export let id;
	export let children;
	export let answered = false;
	$: answer = ''

	$quiz = $quiz

	function determineVisibility ($quiz) {
		if ($quiz.show.includes(id)) {
			return "visible px-4 py-1"
		} else if ($quiz.preview.includes(id)) {
			return "preview px-4 py-1"
		} else {
			return "hidden"
		}
	}

	$: visibility = determineVisibility($quiz);

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

	

	function processAnswer (value) {
		answer = value
		$quiz.answered_question = {
			"criterium":id,
			"answer":value,
			"type":"BOOLEAN"
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

	let nonfloat_children = children.filter(obj => {
		return obj.qtype !== "FLOAT"
	})

</script>
<div class={visibility}>
	{#if (visibility === 'visible px-4 py-1')}
	<span class="text-black">{name}</span>
		{#if (!disabled) && !(answered)}
			<button on:click={() => processAnswer(true)} on:click={toggleDisabled} class='btn bg-[#00a56a] {$enabled}'>Y</button>
			<button on:click={() => processAnswer(false)} on:click={toggleDisabled} class='btn bg-red-500 {$enabled}' >N</button>
			<button on:click={() => processAnswer("SKIP")} on:click={toggleDisabled} class='btn bg-gray-300 {$enabled}' >Skip</button>
		{:else}
			<span class='{color} capitalize opacity-50'>{text}</span>
		{/if}
	{:else if (visibility === 'preview px-4 py-1')}
		<span class="text-gray-300">{name}</span>
	{/if}

	<ul>
		{#if ['0.5.0', '0.0'].includes(id)}
			<li>	
				<QuizDropdown children={nonfloat_children}/>
			</li>
			{#each children as child}
			<li>
				{#if (child.qtype === "FLOAT")}
					<QuizFile {...child}/>
				{/if}
			</li>
			{/each}

		{:else}
			{#each children as child}
			<li>
				{#if child.type === 'Category'}
					<svelte:self {...child}/>
				{:else}
					<QuizFile {...child}/>
				{/if}
			</li>
			{/each}
		{/if}
	</ul>
</div>
<style>
	span {
		padding: 0 0 0 0.2em;
		background: url(tutorial/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}

	.btn {
    	@apply px-2 text-white;
  	}

</style>
