import React, { Fragment }                           from 'react';
import PropTypes                                     from 'prop-types';
import { FormattedRelativeTime }                     from 'react-intl';
import { generatePath }                              from 'react-router-dom';
import { PARAM_SLUG, ROUTES }                        from '../../../../constants';
import getStringFromDate                             from '../../../../util/getStringFromDate';
import getDateObjectFromString                       from '../../../../util/getDateObjectFromString';
import getRelativeTimeUnit                           from '../../../../util/getRelativeTimeUnit';
import ActionsRowComponent                           from '../../../components/ActionsRowComponent';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../../../components/ButtonComponent';
import RowItemComponent                              from '../../../components/RowItemComponent';
import ButtonActionComponent                         from '../../../components/RowItemComponent/ButtonActionComponent';
import SelectComponent                               from '../../../components/SelectComponent';
import PaginationContainer                           from '../../../components/PaginationContainer';
import styles                                        from './styles.scss';

export const RATING_TYPE = {
    OVERALL_RATING: 'overallRating',
    EMPLOYER_RATING: 'employerRating',
    CANDIDATE_RATING: 'candidateRating',
    COMMUNICATION: 'communication',
    RESPONSIVENESS: 'responsiveness',
    CANDIDATE_QUALITY: 'candidateQuality',
    INDUSTRY_KNOWLEDGE: 'industryKnowledge',
};

export const REVIEWS_TOTAL_TYPE = {
    ANY: 'any',
    MOST: 'most',
    LEAST: 'least',
};

const LeaderBoardComponent = (props) => {
    const {
        recruiterId,
        recruiters,
        reviewsFrom,
        reviewsTotal,
        ratingType,
        handleSelect,
        totalPages,
        indexShift,
    } = props;

    const date = new Date();
    let monthBefore = new Date(date.getTime());
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    monthBefore = getStringFromDate(monthBefore);
    let quarterBefore = new Date(date.getTime());
    quarterBefore.setMonth(quarterBefore.getMonth() - 4);
    quarterBefore = getStringFromDate(quarterBefore);
    let yearBefore = new Date(date.getTime());
    yearBefore.setFullYear(yearBefore.getFullYear() - 1);
    yearBefore = getStringFromDate(yearBefore);

    return (
        <Fragment>
            <ActionsRowComponent
                className={ styles.actionsRow }
                pageActions={
                    <Fragment>
                        <SelectComponent
                            isWhite
                            className={ styles.select }
                            value={ reviewsFrom || '' }
                            setValue={ (value) => {handleSelect({ name: 'reviewsFrom', value });} }
                            values={ [
                                { label: 'All time', key: '' },
                                { label: 'Last month', key: monthBefore },
                                { label: 'Last quarter', key: quarterBefore },
                                { label: 'Last year', key: yearBefore },
                            ] }
                        />
                        <SelectComponent
                            isWhite
                            className={ styles.select }
                            value={ reviewsTotal }
                            setValue={ (value) => {handleSelect({ name: 'reviewsTotal', value });} }
                            values={ [
                                { label: 'Any review #', key: REVIEWS_TOTAL_TYPE.ANY },
                                { label: 'Most reviews', key: REVIEWS_TOTAL_TYPE.MOST },
                                { label: 'Least reviews', key: REVIEWS_TOTAL_TYPE.LEAST },
                            ] }
                        />
                        <SelectComponent
                            isWhite
                            className={ styles.select }
                            value={ ratingType }
                            setValue={ (value) => { handleSelect({ name: 'ratingType', value }); } }
                            values={ [
                                { label: 'Overall rating', key: RATING_TYPE.OVERALL_RATING },
                                { label: 'Employer rating', key: RATING_TYPE.EMPLOYER_RATING },
                                { label: 'Candidate rating', key: RATING_TYPE.CANDIDATE_RATING },
                                { label: 'Communication', key: RATING_TYPE.COMMUNICATION },
                                { label: 'Responsiveness', key: RATING_TYPE.RESPONSIVENESS },
                                { label: 'Candidate quality', key: RATING_TYPE.CANDIDATE_QUALITY },
                                { label: 'Industry knowledge', key: RATING_TYPE.INDUSTRY_KNOWLEDGE },
                            ] }
                        />
                    </Fragment>
                }
            />

            { recruiters.map((recruiter, index) => {

                const header = (
                    <ButtonComponent
                        onClick={ () => {
                            window.open(
                                generatePath(
                                    ROUTES.RECRUITER_PROFILE,
                                    {
                                        [ PARAM_SLUG ]: recruiter.slug,
                                    },
                                ),
                                `page-name-${ recruiter.slug }`,
                            );
                        } }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                    >
                        { recruiter.firstName } { recruiter.lastName }{ recruiter.id === recruiterId && ' (Me)' }
                    </ButtonComponent>
                );
                const relativeDateParams = !!recruiter.lastReview && getRelativeTimeUnit(getDateObjectFromString(recruiter.lastReview));
                return (
                    <RowItemComponent
                        key={ index }
                        smallActions
                        statusText={
                            <span>
                                { relativeDateParams && (
                                    <Fragment>
                                        LAST REVIEW:{ ' ' }
                                        <FormattedRelativeTime
                                            value={ relativeDateParams.value }
                                            unit={ relativeDateParams.unit }
                                        />
                                    </Fragment>
                                ) }
                                { ' ' }
                                { !!recruiter.pendingReviewsCount && `(${ recruiter.pendingReviewsCount } PENDING)` }
                            </span>
                        }
                        ratingType={ {
                            [ RATING_TYPE.OVERALL_RATING ]: 'Overall',
                            [ RATING_TYPE.EMPLOYER_RATING ]: 'Employer',
                            [ RATING_TYPE.CANDIDATE_RATING ]: 'Candidate',
                            [ RATING_TYPE.COMMUNICATION ]: 'Communication',
                            [ RATING_TYPE.RESPONSIVENESS ]: 'Responsiveness',
                            [ RATING_TYPE.CANDIDATE_QUALITY ]: 'Candidate quality',
                            [ RATING_TYPE.INDUSTRY_KNOWLEDGE ]: 'Industry knowledge',
                        }[ ratingType ] }
                        rating={ +recruiter.rating[ ratingType ].toFixed(1) }
                        reviewCount={
                            ratingType === RATING_TYPE.OVERALL_RATING ? recruiter.rating.reviewsCount :
                                ratingType === RATING_TYPE.CANDIDATE_RATING ? recruiter.rating.reviewsCandidateCount :
                                    recruiter.rating.reviewsEmployerCount
                        }
                        header={ header }
                        infoText={ recruiter.agency.name + (recruiter.state ? ` (${ recruiter.state })` : '') }
                        label={ `#${ index + 1 + indexShift }` }
                        classNameStart={ styles.start }
                        classNameMiddle={ styles.middle }
                        avatarUrl={ recruiter.profilePhoto && recruiter.profilePhoto.url }
                        actions={
                            <ButtonActionComponent
                                onClick={ () => {
                                    window.open(
                                        generatePath(
                                            ROUTES.RECRUITER_PROFILE,
                                            {
                                                [ PARAM_SLUG ]: recruiter.slug,
                                            },
                                        ),
                                        `page-name-${ recruiter.slug }`,
                                    );
                                } }
                                text="View"
                            />
                        }
                    />
                );
            }) }
            { !!totalPages && <PaginationContainer totalPages={ totalPages } /> }
        </Fragment>
    );
};

LeaderBoardComponent.propTypes = {
    recruiterId: PropTypes.string.isRequired,
    recruiters: PropTypes.array.isRequired,
    modalRecruiterId: PropTypes.string,
    reviewsFrom: PropTypes.string,
    reviewsTotal: PropTypes.string,
    ratingType: PropTypes.string,
    handleSelect: PropTypes.func.isRequired,
    totalPages: PropTypes.number.isRequired,
    indexShift: PropTypes.number.isRequired,
};

export default LeaderBoardComponent;
