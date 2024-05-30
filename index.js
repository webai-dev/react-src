import React      from 'react';
import { render } from 'react-dom';
import App        from './App.js';

const el = document.getElementById('app');
if (el) {
    render(<App />, el);
}
