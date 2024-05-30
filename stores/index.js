export { default as store } from './Root';
import { configure } from 'mobx';

configure({
    enforceActions: 'always'
});
