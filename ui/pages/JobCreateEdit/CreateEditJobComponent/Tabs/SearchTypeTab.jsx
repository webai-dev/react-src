import React                    from 'react';
import classNames               from 'classnames';
import { SearchTypes }          from '../../../../../constants';
import { FormFeedback }         from 'reactstrap';
import TEST_IDS                 from '../../../../../tests/testIds';
import HeaderRowButtonComponent from '../../../../components/HeaderRowButtonComponent';
import styles                   from './styles.scss';

const SearchTypeTab = (props) => {
    const { searchType, errors = [], onChangeSearchType } = props;
    return (
        <div className={ styles.form }>
            <div
                id="searchType"
                className={ styles.searchTypeContainer }
            >
                <div
                    className={ classNames(styles.searchTypeBox, {
                        [ styles.searchTypeBoxActive ]: searchType === SearchTypes.EXCLUSIVE,
                    }) }
                    onClick={ () => onChangeSearchType(SearchTypes.EXCLUSIVE) }
                >
                    <h2>Exclusive</h2>
                    <ul className="list-unstyled">
                        <li>
                            Partner with one agency exclusively and only pay the fee on successful
                            placement.
                        </li>
                        <li>
                            Your recruitment partner will invest time to learn about your business and
                            conduct a thorough search of the market.
                        </li>
                        <li>
                            We recommend exclusive search for most mid to senior white collar roles.
                        </li>
                    </ul>
                </div>
                <div
                    className={ classNames(styles.searchTypeBox, {
                        [ styles.searchTypeBoxActive ]: searchType === SearchTypes.NETWORK,
                    }) }
                    onClick={ () => onChangeSearchType(SearchTypes.NETWORK) }
                    data-test={ TEST_IDS.JOB_NETWORK_TYPE }
                >
                    <h2>Network</h2>
                    <ul className="list-unstyled">
                        <li>
                            Work with multiple agencies and only pay the fee on successful placement.
                        </li>
                        <li>
                            Your recruitment consultants will discuss your vacancy over the phone and
                            brief candidates within their network.
                        </li>
                        <li>
                            We recommend this search for more junior roles where you require candidates
                            quickly.
                        </li>
                    </ul>
                </div>
            </div>
            { errors && (
                <FormFeedback style={ { display: 'block' } }>
                    { errors.map(error => <span key={ error }>{ error }</span>) }
                </FormFeedback>
            ) }
        </div>
    );
};

export default SearchTypeTab;
