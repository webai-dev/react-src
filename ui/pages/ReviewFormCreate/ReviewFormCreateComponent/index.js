import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import { generatePath, Redirect }         from 'react-router-dom';
import { PARAM_SLUG, ROUTES }             from '../../../../constants';
import TEST_IDS                           from '../../../../tests/testIds';
import ButtonComponent                    from '../../../components/ButtonComponent';
import FormsyComponent                    from '../../../components/formsy/FormsyComponent';
import FormsyNumberInputComponent         from '../../../components/formsy/FormsyNumberInputComponent';
import FormsySubmitComponent              from '../../../components/formsy/FormsySubmitComponent';
import FormsyTextAreaComponent            from '../../../components/formsy/FormsyTextAreaComponent';
import FormsyInputComponent               from '../../../components/formsy/FormsyInputComponent';
import FormsyRatingComponent              from '../../../components/formsy/FormsyRatingComponent';
import FormsyHiddenInputComponent         from '../../../components/formsy/FormsyHiddenInputComponent';
import FormsyCheckboxComponent            from '../../../components/formsy/FormsyCheckboxComponent';
import SelectComponent                    from '../../../components/SelectComponent';
import {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                         from '../../../components/ButtonComponent';
import getSalaryRange                     from '../../../../util/getSalaryRange';
import getQueryString                     from '../../../../util/getQueryString';
import classNames                         from 'classnames';
import styles                             from './styles.scss';

class ReviewFormCreateComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            reviewType: props.reviewType,
        };
    }

    handleChangeReviewType = (reviewType) => {
        this.setState({ reviewType });
    };

    render() {
        const {
            handleSubmit,
            isLoading,
            reviewToShow,
            hash,
            isPending,
            errorMessage,
            slug
        } = this.props;
        const { reviewType } = this.state;
        const { handleChangeReviewType } = this;
        const formId = 'reviewPlacementId';

        if (!reviewToShow) {
            return (
                <div className={ styles.box }>
                    <h2 className={ classNames(styles.title, styles.textCenter) }>
                        This placement has been removed by the recruiter
                    </h2>
                </div>
            );
        }

        if (reviewToShow.isAlreadyPosted) {
            return (
                <Redirect
                    to={
                        generatePath(
                            ROUTES.REVIEW_SUCCESS,
                            {
                                [ PARAM_SLUG ]: slug,
                            },
                        ) + getQueryString({ redirected: true })
                    }
                />
            );
        }


        return (
            <div className={ styles.box }>
                <h2 className={ styles.title }>
                    How was your experience?
                </h2>
                <div>
                    {
                        /* eslint-disable max-len */
                        isPending ? `Hi!\n\nA recruiter you have worked with, ${ reviewToShow.name }, has requested a review based on your experience working together.\n\nReviews are a great way for recruiters to showcase their client experiences and placement history – so your feedback is really appreciated!` :
                            reviewType !== ReviewFormCreateComponent.REVIEW_TYPE.CANDIDATE ?
                                `Hi ${ reviewToShow.firstName },\n\nCongratulations on your new hire, ${ reviewToShow.candidate }! Your recruiter, ${ reviewToShow.name }, has invited you to leave a review on your experience.` :
                                `Hi ${ reviewToShow.firstName },\n\nCongratulations on your role as a ${ reviewToShow.jobTitle }. Your recruiter, ${ reviewToShow.name }, has invited you to leave a review on your experience.`
                        /* eslint-enable max-len */
                    }
                </div>
                { !isPending && <div className={ styles.card }>
                    <h3>
                        { reviewToShow.jobTitle }
                    </h3>
                    <div className={ styles.cardInner }>
                        <div className={ styles.cardInfo }>
                            <span>
                                <span className={ styles.label }>Industry: </span>
                                <span>{ reviewToShow.industry }</span>
                            </span>
                            <span>
                                <span className={ styles.label }>location: </span>
                                <span>{ (reviewToShow.state || reviewToShow.city) &&
                                `${ reviewToShow.city }, ${ reviewToShow.state }` }</span>
                            </span>
                        </div>
                        <div className={ styles.cardInfo }>
                            <span>
                                <span className={ styles.label }>Job type: </span>
                                <span>{ reviewToShow.jobType }</span>
                            </span>
                            <span>
                                <span className={ styles.label }>Salary: </span>
                                <span>{ getSalaryRange(reviewToShow.salary) }</span>
                            </span>
                        </div>
                    </div>
                </div> }
                { isPending && <SelectComponent
                    className={ styles.selectComponent }
                    setValue={ handleChangeReviewType }
                    value={ reviewType }
                    values={ [
                        {
                            key: ReviewFormCreateComponent.REVIEW_TYPE.CANDIDATE,
                            label: 'Candidate',
                        },
                        {
                            key: ReviewFormCreateComponent.REVIEW_TYPE.EMPLOYER,
                            label: 'Employer',
                        },
                    ] }
                    dataTest={ TEST_IDS.REVIEW_TYPE_SELECT }
                /> }
                { reviewType && <Fragment>
                    <FormsyComponent
                        className={ styles.form }
                        onValidSubmit={ handleSubmit }
                        formId={ formId }
                        errorMessage={ errorMessage }
                    >
                        { !isPending && <FormsyHiddenInputComponent
                            name="placementId"
                            value={ reviewToShow.id }
                            required
                        /> }
                        { !isPending && <FormsyHiddenInputComponent
                            name="hash"
                            value={ hash }
                            required
                        /> }
                        <FormsyHiddenInputComponent
                            name="slug"
                            value={ slug }
                            required
                        />
                        <FormsyHiddenInputComponent
                            name="reviewType"
                            value={ reviewType }
                            required
                        />
                        { isPending && <div className={ styles.inputBox }>
                            <FormsyInputComponent
                                className={ styles.input }
                                name="firstName"
                                placeholder="Enter your first name"
                                label="First name"
                                required
                            />
                            <FormsyInputComponent
                                className={ styles.input }
                                name="lastName"
                                placeholder="Enter your last name"
                                label="Last name"
                            />
                        </div> }
                        <div className={ styles.npsBox }>
                            <h3 className={ styles.semiTitle }>
                                How likely is it you would recommend { reviewToShow.name } to a friend or colleague?
                            </h3>
                            <div className={ styles.nps }>
                                <FormsyNumberInputComponent
                                    labelMax="Extremely likely"
                                    labelMin="Not at all likely"
                                    name="npsScore"
                                    required
                                    dataTest={ TEST_IDS.NPS_SCORE_NUMBER }
                                />
                            </div>
                        </div>
                        { reviewType === ReviewFormCreateComponent.REVIEW_TYPE.EMPLOYER ?
                            <Fragment>
                                <h3 className={ styles.semiTitle }>
                                    How would you rate { reviewToShow.name } on the following?
                                </h3>
                                <FormsyRatingComponent
                                    className={ styles.ratingBox }
                                    name="candidateQuality"
                                    label="Candidate quality?"
                                    required
                                    dataTest={ TEST_IDS.RATING_CANDIDATE_QUALITY_NUMBER }
                                />
                                <FormsyRatingComponent
                                    className={ styles.ratingBox }
                                    name="industryKnowledge"
                                    label="Industry knowledge?"
                                    required
                                    dataTest={ TEST_IDS.RATING_INDUSTRY_NUMBER }
                                />
                                <FormsyRatingComponent
                                    className={ styles.ratingBox }
                                    name="communication"
                                    label="Communication?"
                                    required
                                    dataTest={ TEST_IDS.RATING_COMMUNICATION_NUMBER }
                                />
                                <FormsyRatingComponent
                                    className={ styles.ratingBox }
                                    name="responsiveness"
                                    label="Responsiveness?"
                                    required
                                    dataTest={ TEST_IDS.RATING_RESPONSIVENESS_NUMBER }
                                />
                            </Fragment> :
                            <Fragment>
                                <h3 className={ styles.semiTitle }>
                                    How would you rate { reviewToShow.name } overall?
                                </h3>
                                <FormsyRatingComponent
                                    className={ styles.ratingBox }
                                    label="Overall rating?"
                                    name="candidateRating"
                                    required
                                    dataTest={ TEST_IDS.RATING_CANDIDATE_NUMBER }
                                />
                            </Fragment>
                        }
                        { reviewType === ReviewFormCreateComponent.REVIEW_TYPE.EMPLOYER &&
                        <div className={ styles.inputBox }>
                            <FormsyCheckboxComponent
                                value={ true }
                                name="employerAuthShowName"
                                label="Show company name on review"
                            />
                        </div> }
                        {
                            isPending &&
                            <FormsyInputComponent
                                name="email"
                                validations="isEmail"
                                validationError="This is not a valid email"
                                placeholder="Email"
                                modifyValueOnChange={ value => value ? value.trim() : value }
                                label="Email"
                                required
                            />
                        }
                        {
                            isPending &&
                            <div>
                                This email is solely used for verification purposes and will not be used for
                                marketing or solicitation.
                            </div>
                        }
                        <h3 className={ styles.semiTitle }>
                            Testimonial
                        </h3>
                        <FormsyTextAreaComponent
                            required
                            label="Title"
                            placeholder="In 8 words or less summarise your experience"
                            name="title"
                            validations={ {
                                constrainWordsCount: (values, value) => value && value.trim()
                                    .split(/\s+/).length <= 8
                            } }
                            validationErrors={ {
                                constrainWordsCount: 'Please use 8 words or less'
                            } }
                            className={ styles.formTitle }
                        />
                        <FormsyTextAreaComponent
                            required
                            label="Review"
                            placeholder={ 'By sharing your experience, you’re helping other candidates and clients' +
                            ' make better hiring choices. Thank you!' }
                            name={ ReviewFormCreateComponent.IDS.REVIEW }
                            className={ styles.formComment }
                        />
                    </FormsyComponent>
                    <FormsySubmitComponent
                        formId={ formId }
                        btnType={ BUTTON_TYPE.ACCENT_BORDER }
                        size={ BUTTON_SIZE.BIG }
                        disabled={ isLoading }
                        dataTest={ TEST_IDS.REVIEW }
                        className={ styles.submit }
                    >
                        Submit
                    </FormsySubmitComponent>
                    <div className={ styles.terms }>
                        By submitting this review, I am accepting <ButtonComponent
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        to={ ROUTES.EXTERNAL_TERMS_AND_CONDITIONS }
                        target="_blank"
                        rel="noopener noreferrer"
                    >terms and conditions</ButtonComponent> and agreeing that this feedback
                        is
                        based on my own experience with this recruiter. This feedback is my independent view and is in
                        no
                        way biased or influenced by the recruiter. I understand that fake reviews are in breach of
                        Sourcr’s <ButtonComponent
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        to={ ROUTES.EXTERNAL_TERMS_AND_CONDITIONS }
                        target="_blank"
                        rel="noopener noreferrer"
                    >terms and conditions</ButtonComponent>.
                    </div>
                </Fragment>
                }
            </div>
        );
    }
}

ReviewFormCreateComponent.IDS = {
    REVIEW: 'review'
};
ReviewFormCreateComponent.REVIEW_TYPE = {
    CANDIDATE: 'Candidate',
    EMPLOYER: 'Employer'
};

ReviewFormCreateComponent.propTypes = {
    isLoading: PropTypes.bool,
    reviewToShow: PropTypes.object,
    isPending: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    hash: PropTypes.string,
    errorMessage: PropTypes.string,
    slug: PropTypes.string,
    reviewType: PropTypes.oneOf([
        ReviewFormCreateComponent.REVIEW_TYPE.CANDIDATE,
        ReviewFormCreateComponent.REVIEW_TYPE.EMPLOYER,
    ]),
};

export default ReviewFormCreateComponent;
