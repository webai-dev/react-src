import React                    from 'react';
import PropTypes                from 'prop-types';
import getMonthFromDateString   from '../../../../util/getMonthFromDateString';
import getYearFromDateString    from '../../../../util/getYearFromDateString';
import { ROUTES }               from '../../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
} from '../../../components/ButtonComponent';
import styles                 from './styles.scss';

const PlacementsComponent = (props) => {
    const { placements } = props;
    return (
        <div>
            { (!placements || !placements.length) &&
            <div className={ styles.box }>
                <div>
                    You currently have no placements. To get started{ ' ' }
                    <ButtonComponent
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        to={ ROUTES.PLACEMENTS_NEW }
                    >click here</ButtonComponent>.
                </div>
            </div> }

            { placements.map((placement) => {
                const { id, jobType, salary, industry, city, state, jobTitle, placementDate, category } = placement;
                return (
                    <div className={ styles.box } key={ id }>
                        <div>
                            <h2>
                                { jobTitle }
                            </h2>
                            <div className={ styles.info }>
                                { category ? category.name + ', ' : '' }
                                { city }, { state },{ ' ' }
                                { getMonthFromDateString(placementDate) }{ ' ' }
                                { getYearFromDateString(placementDate) }
                            </div>
                            <div className={ styles.info }>
                                { jobType }{ industry ? ` in the ${industry.name} industry` : '' } { salary ? `, Salary ${salary}` : '' }
                            </div>
                        </div>
                    </div>
                );
            }) }
        </div>
    );
};

PlacementsComponent.propTypes = {
    placements: PropTypes.array.isRequired
};

export default PlacementsComponent;
