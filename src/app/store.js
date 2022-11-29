import { configureStore } from '@reduxjs/toolkit'
import sourceReducer from '../popup/SourceSlice'

const store = configureStore({
	reducer: {
    source: sourceReducer,
	},
});

export default store;
