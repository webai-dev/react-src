import React                      from 'react';
import PropTypes                  from 'prop-types';
import ProgressBarRadialComponent from '../../../components/ProgressBarRadialComponent';
import styles                     from './styles.scss';

const StarsDistributionComponent = (props) => {
    const { ratings } = props;
    const totalRating = ratings.reduce((sum, ratingAmount) => sum + ratingAmount, 0);

    return (
        <div className={ styles.box }>
            { ratings.map((ratingAmount, index) => (
                <div
                    key={ index }
                    className={ styles.rating }
                >
                    <ProgressBarRadialComponent
                        progress={ totalRating ? Math.round(1000*(ratingAmount/totalRating))/10 : 0 }
                    />
                    <span className={ styles.label }>
                        { index + 1 }{ ' ' }Star{ ' ' }
                        <span className={ styles.labelCount }>({ ratingAmount })</span>
                    </span>
                </div>
            )) }

        </div>
    );
};

StarsDistributionComponent.propTypes = {
    ratings: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default StarsDistributionComponent;
