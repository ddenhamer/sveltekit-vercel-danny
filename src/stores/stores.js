import { writable } from 'svelte/store';

export const quiz = writable({
    trial_ids:[], 
    mode:"library",
    show:[],
    preview:[],
    answered_question:{},
    ineligible:[],
    questions:[]
});

export const enabled = writable('')