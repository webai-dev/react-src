import React          from 'react';
import PropTypes      from 'prop-types';
import styles         from './styles.scss';

const PlacementsComponent = (props) => {
    const { placements } = props;

    return (
        <div>
            { !placements.length && <div>There are currently no placements available</div> }
            { placements.map((placement) => {
                const { id, jobType, industry, city, state, jobTitle, salaryRange } = placement;
                return (
                    <div
                        key={ id }
                        className={ styles.placement }
                    >
                        <h3>
                            { jobTitle }
                        </h3>
                        <div className={ styles.infoBox }>
                            <div className={ styles.info }>
                                <span>
                                    <span className={ styles.label }>
                                        Industry:{ ' ' }
                                    </span>
                                    <span>
                                        { industry && industry.name }
                                    </span>
                                </span>
                                <span>
                                    <span className={ styles.label }>
                                        Job type:{ ' ' }
                                    </span>
                                    <span className={ styles.jobType }>
                                        { jobType === 'temp' ? 'Temp/Contractor' : jobType }
                                    </span>
                                </span>
                            </div>

                            <div className={ styles.info }>
                                <span>
                                    <span className={ styles.label }>
                                        Location:{ ' ' }
                                    </span>
                                    <span>
                                        { city }, { state }
                                    </span>
                                </span>
                                <span>
                                    <span className={ styles.label }>
                                        Salary:{ ' ' }
                                    </span>
                                    <span>
                                        { salaryRange }
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            }) }
        </div>
    );
};

PlacementsComponent.propTypes = {
    placements: PropTypes.array.isRequired,
};

export default PlacementsComponent;
