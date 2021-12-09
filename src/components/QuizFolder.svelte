<script>
	import QuizFile from '../components/QuizFile.svelte';
	import { slide } from 'svelte/transition'
	import { quiz } from '../stores/stores.js';

	export let name;
	export let id;
	export let children;

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

</script>
<div class={visibility}>
	{#if (visibility === 'visible px-4 py-1')}
	<span class="text-black row">{name} [{id}]</span>
	{#if (!disabled)}
	<button on:click={() => processAnswer(true)} on:click={toggleDisabled} class='btn bg-green-500 row'>Y</button>
	<button on:click={() => processAnswer(false)} on:click={toggleDisabled} class='btn bg-red-500 row' >N</button>
	{:else}
	<span class='text-gray-500'>Answered</span>
	{/if}
	{:else if (visibility === 'preview px-4 py-1')}
	<span class="text-gray-300 row">{name} [{id}]</span>
	{/if}

	<ul>
		{#each children as child}
			<li>
				{#if child.type === 'Category'}
					<svelte:self {...child}/>
					<!-- <svelte:self name={child.name} id={child.id} children={child.children}/> -->
				{:else}
					<QuizFile {...child}/>
				{/if}
			</li>
		{/each}
	</ul>
</div>
<style>
	span {
		padding: 0 0 0 1.5em;
		background: url(tutorial/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}

	/* ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}

	li {
		padding: 0.2em 0;
	} */

	.btn {
    	@apply px-2 rounded-sm text-white;
  	}

</style>
