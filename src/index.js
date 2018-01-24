import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import {createStore} from 'redux'
import {Provider} from 'react-redux'

import todoAppReducer from './reducers/todoAppReducer'
import calculatorReducers from './reducers/calculatorReducers'
import Layout from "./components/Layout";
const store = createStore(todoAppReducer)

ReactDOM.render(<Provider store={store}>
		<Layout/>
	</Provider>, document.getElementById('root'));
registerServiceWorker();
