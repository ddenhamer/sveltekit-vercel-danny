<script>
    export let trial_ids;
    export let patient_id;
    
    async function GenerateTsr() {
		const res = await fetch(
			`https://enterprise-search-develop.mytomorrows.com/v01/search/request_tsr`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
                    trial_ids:trial_ids,
                    email:email,
                    tsr_details:{
                        condition:"Duchenne Muscular Dystrophy",
                        patient_id:patient_id
                    }
                })
			}
			)
			
			if (res.ok) {
				let response = await res.json()
                console.log(response)
			} else {
				throw Error();
			}
		}

	let input = "shadow appearance-none border-2 border-white rounded w-2/3 py-2 my-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"

    let email = '';
</script>
<main>
    <div class="my-4 p-4 bg-gray-200 rounded-md">
        <p><span class="font-bold">Patient ID: </span><span>{patient_id}</span></p>
        <input class={input} bind:value={email} placeholder="your@email.com">
        {#if email}
            <button on:click={GenerateTsr} class='btn bg-green-500 py-1 my-2'>Generate TSR</button>
        {:else}
            <button class='btn bg-gray-400 py-1 my-2 cursor-not-allowed'>Generate TSR</button>
        {/if}
    </div>
</main>
<style>
	.btn {
    	@apply shadow px-2 rounded-sm text-white;
  	}
</style>