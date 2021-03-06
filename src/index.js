import React from 'react';
import ReactDom from 'react-dom';

import MainContainer from './components/MainContainer';

import './main.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import log from 'electron-log';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');

root.id = 'root';
document.body.appendChild(root);

Object.assign(console, log.functions);

// Now we can render our application into it
ReactDom.render(<MainContainer />, document.getElementById('root'));
