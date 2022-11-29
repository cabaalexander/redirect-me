import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid'

const initialState = {};

export const sourceSlice = createSlice({
	name: 'source',
	initialState,
    reducers: {
        addSource(state) {
            state[uuid()] = {
                active: false,
                from: '',
                to: '',
                created: +new Date(),
            }
        },
        editSource(state, {payload}) {
            state[payload.id][payload.key] = payload.value
        },
    }
});

export const { addSource, editSource } = sourceSlice.actions

export const selectSources = (state) => state.source;

export default sourceSlice.reducer;
