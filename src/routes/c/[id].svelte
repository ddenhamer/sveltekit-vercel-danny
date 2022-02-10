<script context="module">

    export async function load({page}) {
		const id = page.params.id;
        const passed_parent_id = page.query.get('parent_id');
        if (passed_parent_id != null) {
            passed_parent_id.toString()
        }
        
        if (id.startsWith('create')) {
            const treenode = {
                id: null,
                parent_id:passed_parent_id,
                new: true,
                properties: {
                    label: null,
                    type:"BOOLEAN",
                    ask_to:"patient"                }
            }
            return {props:{treenode}}        
        } else {
            const response = await fetch(
                `https://enterprise-search-develop.mytomorrows.com/v01/library/get_node`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({node:{'id':id}})
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
    
    import { enabled } from '../../stores/stores.js';
    
    function toggleEnabled() {
        if ($enabled === '') {
            $enabled = 'cursor-not-allowed opacity-50'
		} else {
            $enabled = ''
		}
		
	}
    
    export let treenode;
    
    let ask_to_options = [
        'patient', 'physician', 'patient-nav'
    ]
    let type_options = [
         'BOOLEAN', 'FLOAT'
    ]

    async function setNode(treenode) {
        toggleEnabled()
        if (treenode.id) {
            const res = await fetch(
                `https://enterprise-search-develop.mytomorrows.com/v01/library/update_node`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({node:treenode})
                })
            const json = await res.json()
            setTimeout(() => {  window.location.href = "/"; }, 750);
        } else {
            toggleEnabled()
            const res = await fetch(
			`https://enterprise-search-develop.mytomorrows.com/v01/library/create_node`, {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify({node:treenode})
			})
            const json = await res.json()
            setTimeout(() => {  window.location.href = "/"; }, 750);
        }
    }

    async function deleteNode(treenode) {
        toggleEnabled()
        const res = await fetch(
            `https://enterprise-search-develop.mytomorrows.com/v01/library/delete_node`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({node:{
                    id:treenode.id
                }})
            })
        if (res.status === 400) {
            const json = await res.json();
            toggleEnabled();
            alert(json.message);
        } else {
            setTimeout(() => {  window.location.href = "/"; }, 250);
        }
    }

</script>
<main>    
    <div class="my-24 mx-8">
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
            <td><input bind:value={treenode.parent_id} class='px-2 py-1 placeholder-gray-400 text-gray-600 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full'></td>
            </tr>
            <tr>
            <td>Answer Type</td>
            {#if treenode.new !== true}
                <td>{treenode.properties.type}</td>
            {:else}
                <td>
                    <select bind:value={treenode.properties.type}>
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
            <td><input bind:value={treenode.properties.label} placeholder="label that will show up in library" class='px-2 py-1 placeholder-gray-400 text-gray-600 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring w-full'></td>
            </tr>
            <tr>
            <td>Ask to</td>
            <td>
                <select bind:value={treenode.properties.ask_to}>
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
        <button on:click={setNode(treenode)} class="bg-green-600 rounded px-2 py-1 my-2 mr-1 text-white {$enabled}" >Update</button>
        <button on:click={deleteNode(treenode)} class="bg-red-600 rounded px-2 py-1 my-2 text-white {$enabled}" >Delete</button>
    </div>
</main>

<style>

    td {
        @apply p-4;
    }

</style>