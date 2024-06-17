import { defineStore } from 'pinia';
import {component_info_key} from "../utils/constant";

export const useComponentStore = defineStore('component',{
    state: () => ({
        id: 0,
        is_update: false
    }),
    getters: {
        getID: (state) => state.id,

    },
    actions: {
        setID(id: number){
            this.id = id
            localStorage.setItem(component_info_key, id.toString())
        },
        update(){
            this.is_update = !this.is_update
        },

    },
});
