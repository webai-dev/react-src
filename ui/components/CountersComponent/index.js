import React     from 'react';
import PropTypes from 'prop-types';
import styles    from './styles.scss';

const CountersComponent = (props) => {
    const { counters } = props;
    return (
        <div className={ styles.countersBox }>
            { counters.map(({ label, value }) => (
                <div
                    className={ styles.counter }
                    key={ label }
                >
                    <span className={ styles.counterValue }>{ value }</span>
                    <span className={ styles.counterLabel }>{ label }</span>
                </div>
            )) }
        </div>
    );
};

CountersComponent.propTypes = {
    counters: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CountersComponent;
