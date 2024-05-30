import React        from 'react';
import PropTypes    from 'prop-types';
import classNames   from 'classnames';
import { IDS }      from '../../../../constants';
import styles       from './styles.scss';

const BodyComponent = props => {
    const { isHeaderHidden, children } = props;
    return (
        <div className={ styles.main }>
            <div className={ styles.background }>
                <div
                    className={ styles.image }
                    id={ IDS.BACKGROUND_IMAGE }
                />
                <div className={ styles.backgroundCover }>
                    {
                        /* eslint-disable max-len */
                        <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 405 60">
                            <path d="M-1.3752,9.44899C60.76031,39.54905 144.41345,56.39394 201.92254,56.90909C259.43163,57.42424 341.4974,40.89722 407.1835,9.36206L407.2745,61.19046C274.09268,61.03894 131.79226,61.55836 -1.38956,61.40684L-1.3752,9.44899z" />
                        </svg>
                        /* eslint-enable max-len */
                    }
                </div>
            </div>
            <div
                className={ classNames(
                    styles.mainContent,
                    {
                        [styles.mainContentIndent]: isHeaderHidden,
                    },
                ) }
            >
                { children }
            </div>
        </div>
    );
};

BodyComponent.propTypes = {
    isHeaderHidden: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

export default BodyComponent;
