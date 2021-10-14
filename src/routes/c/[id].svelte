<script context="module">
    export async function load({page}) {
		const id = page.params.id;
        const passed_parent_id = page.query.get('parent_id');
        if (passed_parent_id != null) {
            passed_parent_id.toString()
        }
        
        if (id.startsWith('create')) {
            const treenode = {
                parent_id:passed_parent_id,
                id: null,
                new: true
            }
            console.log(treenode.criterium)
            return {props:{treenode}}
            
        
        } else {

            const response = await fetch(
                `https://enterprise-search-develop.mytomorrows.com/v01/library/get_node`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({node_id:id})
                }
            )
            if (response.ok) {
                const treenode = await response.json();
                return {props:{treenode}}
            } else {
                throw new Error(id);
            }
        }
	}
</script>

<script>
    export let treenode;
    let result = null;
    let ask_to_options = [
        'patient', 'patient-nav', null
    ]
    let type_options = [
         'BOOLEAN', 'FLOAT', null
    ]
    let criterium_options = [
       true, false
    ]
   
    async function setNode(treenode) {
        console.log(treenode)
		const res = await fetch(
			`https://enterprise-search-develop.mytomorrows.com/v01/library/set_node`, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({node:treenode})
			})
        const json = await res.json()
		result = JSON.stringify(json)
        setTimeout(() => {  window.location.href = "/"; }, 500);
        
    }

</script>
<main>    
    <div class="my-8 mx-8">
        <table class="table-auto min-w-full shadow-md rounded">
        <thead class="bg-gray-50">
            <tr>
            <th class='p-4 text-left font-bold'>Type</th>
            <th class='p-4 text-left font-bold'>Value</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
            <tr>
            <td>ID</td>
            <td>{treenode.id}</td>
            </tr>
            <tr>
            <td>Parent ID</td>
            <td>{treenode.parent_id}</td>
            </tr>
            <tr>
            <td>Criterium</td>
            {#if treenode.new !== true}
                <td>{treenode.criterium}</td>
            {:else}
                <td>
                <select bind:value={treenode.criterium}>
                    {#each criterium_options as option}
                        <option value={option}>
                            {option}
                        </option>
                    {/each}
                </select>
                </td>
            {/if}
            </tr>
            <tr>
            <td>Type</td>
            {#if treenode.new !== true}
                <td>{treenode.criterium}</td>
            {:else}
                <td>
                <select bind:value={treenode.type}>
                    {#each type_options as option}
                        <option value={option}>
                            {option}
                        </option>
                    {/each}
                </select>
                </td>
            {/if}
            </tr>
            <tr>
            <td>Label</td>
            <td><input bind:value={treenode.name} placeholder="placeholder question" class='px-2 py-1 placeholder-gray-400 text-gray-600 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full'></td>
            </tr>
            <tr>
            <td>Ask to</td>
            <td>
                <select bind:value={treenode.ask_to}>
                    {#each ask_to_options as option}
                        <option value={option}>
                            {option}
                        </option>
                    {/each}
                </select>
            </td>
            </tr>
        </tbody>
        </table>
        <button on:click={setNode(treenode)} class="btn btn-blue my-2 text-white" >Update</button>
    </div>
</main>

<style>

    td {
        @apply p-4;
    }

    .btn {
    	@apply px-4 py-2 my-4 rounded;
  	}
	.btn-blue {
		@apply bg-green-600;
	}
	.btn-blue:hover {
		@apply bg-green-700;
	}
</style>