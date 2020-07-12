import  { createWrapper } from 'next-redux-wrapper'
import { createStore } from 'redux'

import reducer from '../reducers'

const configureStore = () => {
    const store = createStore(reducer);
    store.dispacth({
        type: CHANGE_NICKNAME,
        data: 'boogicho'
    })
    return store;
}

// 개발할 때 debug: 'development'
const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV === 'development', })

export default wrapper;