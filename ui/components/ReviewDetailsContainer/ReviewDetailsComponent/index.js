import React, { Fragment }                           from 'react';
import PropTypes                                     from 'prop-types';
import { generatePath }                              from 'react-router-dom';
import { PARAM_SLUG, ROUTES }                        from '../../../../constants';
import getMonthYearDateFromDateString                from '../../../../util/getMonthYearDateFromDateString';
import CrossIcon                                     from '../../../../assets/icons/CrossIcon';
import Cross2Icon                                    from '../../../../assets/icons/Cross2Icon';
import RatingComponent                               from '../../Form/RatingComponent';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../../ButtonComponent';
import ModalComponent                                from '../../ModalComponent';
import LoaderComponent                               from '../../LoaderComponent';
import classNames                                    from 'classnames';
import styles                                        from './styles.scss';

const ReviewDetailsComponent = (props) => {
    const { handleClose, review, isLoading, isInnerApp, recruiterRoute } = props;
    const buttonProps = handleClose ? { onClick: handleClose } : { to: recruiterRoute };
    const modalProps = handleClose ? { handleClose: handleClose } : { linkToClose: recruiterRoute };
    return (
        <ModalComponent { ...modalProps }>
            <div
                className={ classNames(
                    {
                        [ styles.reviewInnerApp ]: isInnerApp,
                        [ styles.reviewOuterApp ]: !isInnerApp
                    }
                ) }
            >
                <ButtonComponent
                    ariaLabel="close modal"
                    btnType={ BUTTON_TYPE.LINK }
                    className={ styles.close }
                    { ...buttonProps }
                >
                    { isInnerApp ? <Cross2Icon /> : <CrossIcon /> }
                </ButtonComponent>
                { isLoading ? <LoaderComponent row /> :
                    <Fragment>
                        <div className={ styles.header }>
                            <h2 className={ styles.title }>
                                { review.title }
                            </h2>
                            <span className={ styles.date }>
                                { getMonthYearDateFromDateString(review.createdAt) }
                            </span>
                        </div>
                        <div>
                            <RatingComponent
                                rating={ review.rating }
                                small
                                fixed
                            />
                        </div>
                        <div className={ styles.text }>
                            { review.text }
                        </div>
                        <div className={ styles.reviewer }>
                            { review.firstName ? `${ review.firstName }, ` : '' }
                            {
                                review.isCandidate ? 'Candidate' : review.placement ? review.placement.companyName : 'Employer'
                            }
                        </div>
                        { !review.isCandidate && <div className={ styles.row }>
                            <div className={ styles.column }>
                                <div className={ styles.item }>
                                    Candidate quality{ ' ' }<RatingComponent
                                    rating={ review.candidateQuality }
                                    small
                                    fixed
                                />
                                </div>
                                <div className={ styles.item }>
                                    Communication{ ' ' }<RatingComponent
                                    rating={ review.communication }
                                    small
                                    fixed
                                />
                                </div>
                            </div>
                            <div className={ styles.column }>
                                <div className={ styles.item }>
                                    Industry knowledge{ ' ' }<RatingComponent
                                    rating={ review.industryKnowledge }
                                    small
                                    fixed
                                />
                                </div>
                                <div className={ styles.item }>
                                    Responsiveness{ ' ' }<RatingComponent
                                    rating={ review.responsiveness }
                                    small
                                    fixed
                                />
                                </div>
                            </div>
                        </div> }
                        { review.placement && <div>
                            <h4 className={ styles.subTitle }>
                                Job details
                            </h4>
                            <div className={ styles.row }>
                                <div className={ styles.column }>
                                    <span className={ classNames(styles.highlight) }>
                                        { review.placement.jobTitle }
                                    </span>
                                    <span>
                                        <span className={ styles.label }>
                                            Industry:{ ' ' }
                                        </span>
                                        { review.placement.industry && review.placement.industry.name }
                                    </span>
                                    <span>
                                        <span className={ styles.label }>
                                            Job Type:{ ' ' }
                                        </span>
                                        { review.placement.jobType }
                                    </span>
                                </div>
                                <div className={ styles.column }>
                                    <span>
                                        <span className={ styles.label }>
                                            Recruiter:{ ' ' }
                                        </span>
                                        <ButtonComponent
                                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                                            size={ BUTTON_SIZE.SMALL }
                                            to={ generatePath(
                                                ROUTES.RECRUITER_PROFILE,
                                                {
                                                    [ PARAM_SLUG ]: review.recruiterSlug,
                                                },
                                            ) }
                                        >
                                            { review.name }
                                        </ButtonComponent>
                                    </span>
                                    <span>
                                        <span className={ styles.label }>
                                            Location:{ ' ' }
                                        </span>
                                        {
                                            review.placement.state && review.placement.city &&
                                            `${ review.placement.state }, ${ review.placement.city }`
                                        }
                                    </span>
                                    <span>
                                        <span className={ styles.label }>
                                            Salary:{ ' ' }
                                        </span>
                                        { review.placement.salaryRange }
                                    </span>
                                </div>
                            </div>
                        </div> }
                    </Fragment> }
            </div>
        </ModalComponent>
    );
};

ReviewDetailsComponent.propTypes = {
    handleClose: PropTypes.func, //handleCloseModal or recruiterRoute required
    recruiterRoute: PropTypes.string, //handleCloseModal or recruiterRoute required
    isLoading: PropTypes.bool,
    isInnerApp: PropTypes.bool,
    review: PropTypes.object,
};

export default ReviewDetailsComponent;
