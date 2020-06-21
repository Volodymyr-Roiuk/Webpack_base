import './styles/style.css'
import './styles/main.less'
import './styles/main.scss'
import * as $ from 'jquery';
import Post from '@models/post';
import './babel';
import icon from './assets/webpack-logo.png';
import xml from './assets/data.xml';
import csv from './assets/data.csv';
import React from 'react';
import {render} from 'react-dom';

const post = new Post('Webpack test', 'Vova');
//$('pre').html(post.toJSON())

const App = () => (
    <div className="container">
        <h1>Webpack course</h1>

        <hr />

        <div className="logo" />

        <hr />

        <pre />

        <hr />

        <div className="box">
            <h2>Less</h2>
        </div>

        <hr />

        <div class="card">
            <h2>Scss</h2>
        </div>
    </div>
);

render(<App />, document.getElementById('app'))



console.log(post.toJSON());
console.log('xml', xml)
console.log('csv', csv);