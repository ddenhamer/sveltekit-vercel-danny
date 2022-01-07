<script>
	import QuizFile from '../components/QuizFile.svelte';
	import { slide } from 'svelte/transition'
	import { quiz, enabled } from '../stores/stores.js';
    import QuizFolder from './QuizFolder.svelte';
    import File from './File.svelte';

    let disabled = false;

    function toggleEnabled() {
		disabled = !disabled
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

    function processAnswer (value, child_id) {
		$quiz.answered_question = {
			"criterium":child_id,
			"answer":value,
			"type":"BOOLEAN"
		}
		updateQuiz();
	}

    let selected = ''; 

	export let children;

    let selected_options = [''];

</script>

<div class="mx-4">
	{#if children.map(a => a.id).some(r=> $quiz.show.includes(r))}
        <select disabled={disabled} class='p-1 bg-white border border-gray-300 shadow-md my-2 w-1/3' bind:value={selected} on:change={() => selected_options = [...selected_options, selected]} on:change={() => processAnswer(true, selected)} on:change={() => selected = ''}>
            {#each children as child}
                {#if $quiz.preview.includes(child.id) && !(selected_options.includes(child.id))}
                    <option value={child.id}>
                        {child.name}
                    </option>
                {/if}
            {/each}
	    </select>
	{:else}
        <select disabled={true} class='p-1 bg-white border border-gray-300 shadow-md my-2 w-1/3 cursor-not-allowed opacity-50' bind:value={selected} on:change={() => selected_options = [...selected_options, selected]} on:change={() => processAnswer(true, selected)}>
        </select>
    {/if}
    <ul>
		{#each children as child}
            {#if selected_options.includes(child.id)}
                <li>
                    {#if child.type === 'Category'}
                        <QuizFolder name={child.name} id={child.id} children={child.children} answered={true}/>
                    {:else}
                        <QuizFile {...child} answered={true}/>
                    {/if}
                </li>
            {/if}
		{/each}
	</ul>
</div>