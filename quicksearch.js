import React                from 'react';
import ReactDOM             from 'react-dom';
import QuickSearchContainer from './ui/components/QuickSearchContainer';
import { Provider }         from 'mobx-react';
import { store }            from './stores';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

const el = document.getElementById('quick-search-container');
const QuickSearch = () => (
    <Provider store={ store }>
        <Router>
            <Switch>
                <Route render={ () => <QuickSearchContainer
                    resultBoxClassName="wordpress-search-result"
                    isEmbeded={ true }
                />
                } />
            </Switch>
        </Router>
    </Provider>
);

if (el) {
    ReactDOM.render(<QuickSearch />, el);
}
