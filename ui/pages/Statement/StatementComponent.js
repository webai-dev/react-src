import React, { PureComponent, Fragment }   from 'react';
import PropTypes                            from 'prop-types';
import { Helmet }                           from 'react-helmet';
import { BaseApiHost, BaseAPiPath, ROUTES } from '../../../constants';
import getFullDateFromDateString            from '../../../util/getFullDateFromDateString';
import logo                                 from '../../../images/logo-negative.svg';
import ButtonComponent, { BUTTON_TYPE }     from '../../components/ButtonComponent';
import MarkdownComponent                    from '../../components/MarkdownComponent';
import AvatarComponent                      from '../../components/AvatarComponent';
import ProgressBarHorComponent              from '../../components/ProgressBarHorComponent';
import RatingComponent                      from '../../components/Form/RatingComponent';
import classNames                           from 'classnames';
import styles                               from './styles.scss';

// !!! NOTE this component and styles are optimized for Print
// BE very careful changing something here!!! Some elements may seem like unnecessary but actually they fix some issues
class StatementComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isImageLoading: props.recruiter.backgroundImage && props.recruiter.backgroundImage.url,
            isAvatarLoading: props.recruiter.profilePhoto && props.recruiter.profilePhoto.url
        };
    }

    handleLoadImage = (img, type) => {
        if (!img) { return; }
        img.onload = () => {
            this.setState({ [ type ]: false });
        };
    };

    render() {
        const { handleLoadImage } = this;
        const { isImageLoading, isAvatarLoading } = this.state;
        const { recruiter, statement, pathToRecruiter } = this.props;
        const recruiterName = [ recruiter.firstName, recruiter.lastName ].filter(Boolean)
            .join(' ');

        const jobCategoryReviewsOverall = (recruiter.jobCategoryReviewsOverall.rows || [])
            .filter(jobCategory => jobCategory.rating.overallRating)
            .map(jobCategory => ({
                name: jobCategory.jobCategory.name,
                rating: jobCategory.rating.overallRating.toFixed(1),
                reviewsCount: jobCategory.rating.reviewsCount
            }));

        const employerRating = (
            recruiter.rating.candidateQuality +
            recruiter.rating.industryKnowledge +
            recruiter.rating.communication +
            recruiter.rating.responsiveness
        ) / 4;

        return (<Fragment>
            <Helmet>
                <title>Read { recruiterName }‘s capability statement</title>
                { pathToRecruiter && <link
                    rel="canonical"
                    href={ BaseApiHost + pathToRecruiter }
                /> }
            </Helmet>
            <div className={ styles.mainBox }>
                <table className={ styles.table }>
                    <tfoot className={ styles.tableFooter }>
                    <tr>
                        <td>
                            <div className={ styles.footerPlaceholder } />
                            <div className={ styles.footer }>
                                <ButtonComponent
                                    className={ styles.logButton }
                                    btnType={ BUTTON_TYPE.LINK }
                                    to={ ROUTES.EXTERNAL }
                                >
                                    <img
                                        className={ styles.logo }
                                        src={ logo }
                                        alt="Sourcr logo"
                                    />
                                </ButtonComponent>
                                <div className={ styles.verStatement }>
                                    <div className={ styles.verText }>
                                        Verified by sourcr.com. Report
                                        created { statement.createdAt && getFullDateFromDateString(statement.createdAt) }
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tfoot>
                    <tbody>
                    <tr>
                        <td>
                            <div
                                className={ styles.bannerBox }
                                style={ {
                                    backgroundColor: statement.backgroundColor
                                } }
                            >
                                { recruiter.backgroundImage &&
                                recruiter.backgroundImage.url && <img
                                    className={ styles.banner }
                                    src={ `${ BaseAPiPath }${ recruiter.backgroundImage &&
                                    recruiter.backgroundImage.url }` }
                                    alt="Cover image"
                                    ref={ (img) => {handleLoadImage(img, 'isImageLoading');} }
                                /> }
                            </div>
                            { (isImageLoading || isAvatarLoading) && <div id="imageLoading" /> }
                            <div className={ styles.infoBlock }>
                                <div className={ styles.container }>
                                    <div className={ styles.profileBlock }>
                                        <div className={ styles.left }>
                                            <AvatarComponent
                                                className={ styles.avatar }
                                                url={ recruiter.profilePhoto && recruiter.profilePhoto.url }
                                                alt="Avatar"
                                                refToImg={ (img) => {handleLoadImage(img, 'isAvatarLoading');} }
                                            />
                                        </div>
                                        <div className={ styles.right }>
                                            <h2
                                                className={ styles.mainTitle }
                                                style={ { color: statement.textColor } }
                                            >
                                                {
                                                    [ recruiter.firstName, recruiter.lastName ].filter(Boolean)
                                                        .join(' ')
                                                }
                                            </h2>
                                            <div className={ styles.mainRating }>
                                                <RatingComponent
                                                    rating={ recruiter.rating.overallRating }
                                                    fixed
                                                />
                                                <span className={ styles.mainRatingInfo }>
                                                ({ recruiter.rating.overallRating.toFixed(1) }{ ' ' }
                                                    rating based on{ ' ' }
                                                    { recruiter.rating.reviewsCount }{ ' ' }
                                                    { recruiter.rating.reviewsCount === 1 ? 'review' : 'reviews' })
                                            </span>
                                            </div>
                                            { recruiter.jobTitle && <div>
                                                { [ recruiter.jobTitle, recruiter.agency && recruiter.agency.name ].filter(Boolean)
                                                    .join(', ') }
                                            </div> }
                                            { recruiter.contactNumber && <div>
                                                { recruiter.contactNumber }
                                            </div> }
                                            { recruiter.email && <div>
                                                { recruiter.email }
                                            </div> }
                                        </div>
                                    </div>
                                    <MarkdownComponent
                                        source={ statement.statement }
                                        className={ styles.markDown }
                                    />
                                    <div className={ classNames(styles.marginTop, styles.noWrap) }>
                                        <div>
                                            <div className={ classNames(styles.left, styles.subtitle) }>
                                                <b>Candidate Rating</b>
                                            </div>
                                            <div className={ classNames(styles.right, styles.row) }>
                                                <RatingComponent
                                                    rating={ recruiter.rating.candidateRating }
                                                    fixed
                                                />
                                                <span className={ styles.mainRatingInfo }>
                                                ({ recruiter.rating.candidateRating.toFixed(1) }{ ' ' }
                                                    rating based on{ ' ' }
                                                    { recruiter.rating.reviewsCandidateCount }{ ' ' }
                                                    { recruiter.rating.reviewsCandidateCount === 1 ? 'review' : 'reviews' })
                                            </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className={ classNames(styles.left, styles.subtitle) }>
                                                <b>Employer Rating</b>
                                            </div>
                                            <div className={ classNames(styles.right, styles.row) }>
                                                <RatingComponent
                                                    rating={ employerRating }
                                                    fixed
                                                />
                                                <span className={ styles.mainRatingInfo }>
                                                ({ employerRating.toFixed(1) }{ ' ' }
                                                    rating based on{ ' ' }
                                                    { recruiter.rating.reviewsEmployerCount }{ ' ' }
                                                    { recruiter.rating.reviewsEmployerCount === 1 ? 'review' : 'reviews' })
                                            </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className={ classNames(styles.left, styles.subtitle) }>
                                                Candidate quality
                                            </div>
                                            <div className={ classNames(styles.right, styles.row) }>
                                                <RatingComponent
                                                    rating={ recruiter.rating.candidateQuality }
                                                    fixed
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className={ classNames(styles.left, styles.subtitle) }>
                                                Industry knowledge
                                            </div>
                                            <div className={ classNames(styles.right, styles.row) }>
                                                <RatingComponent
                                                    rating={ recruiter.rating.industryKnowledge }
                                                    fixed
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className={ classNames(styles.left, styles.subtitle) }>
                                                Communication
                                            </div>
                                            <div className={ classNames(styles.right, styles.row) }>
                                                <RatingComponent
                                                    rating={ recruiter.rating.communication }
                                                    fixed
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className={ classNames(styles.left, styles.subtitle) }>
                                                Responsiveness
                                            </div>
                                            <div className={ classNames(styles.right, styles.row) }>
                                                <RatingComponent
                                                    rating={ recruiter.rating.responsiveness }
                                                    fixed
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={ classNames(styles.marginTop, styles.noWrap) }>
                                        <div>
                                            <div className={ classNames(styles.left, styles.subtitle) }>
                                                Average salary range
                                            </div>
                                            <div className={ classNames(styles.right, styles.row, styles.subtitle) }>
                                                <b>{ recruiter.averageSalaryRange }</b>
                                            </div>
                                        </div>
                                        <div>
                                            <div className={ classNames(styles.left, styles.subtitle) }>
                                                Total placements
                                            </div>
                                            <div className={ classNames(styles.right, styles.row, styles.subtitle) }>
                                                <b>{ recruiter.placementCount }</b>
                                            </div>
                                        </div>
                                    </div>
                                    { jobCategoryReviewsOverall.length > 0 &&
                                    <div className={ classNames(styles.marginTop, styles.noWrap, styles.progressBox) }>
                                        <div className={ styles.progressContainer }>
                                            <h2
                                                className={ styles.mainTitle }
                                                style={ { color: statement.textColor } }
                                            >
                                                Specialisation Ratings
                                            </h2>
                                            <div className={ styles.marginTop }>
                                                { (jobCategoryReviewsOverall).map(jobCategory => (
                                                    !!jobCategory.reviewsCount && <ProgressBarHorComponent
                                                        backgroundColor={ statement.backgroundColor }
                                                        key={ jobCategory.name }
                                                        label={ jobCategory.name }
                                                        progressText={ `${ jobCategory.rating } Stars (${ jobCategory.reviewsCount })` }
                                                        progress={ jobCategory.rating / 5 }
                                                    />
                                                )) }
                                            </div>
                                        </div>
                                    </div> }
                                </div>
                            </div>

                            <div className={ styles.break }>
                                -
                            </div>
                            <div className={ classNames(styles.infoBlock, styles.gray) }>
                                <div className={ styles.container }>
                                    <div />
                                    <h2
                                        style={ { color: statement.textColor } }
                                    >
                                        Reviews
                                    </h2>
                                    { statement.reviews.map((review, index) => (
                                        <div
                                            className={ classNames(styles.itemBox, styles.noWrap) }
                                            key={ index }
                                        >
                                            <div className={ styles.item }>
                                                <div className={ styles.itemTitle }>
                                                    { review.title }
                                                </div>
                                                <RatingComponent
                                                    rating={ review.overallRating }
                                                    fixed
                                                    small
                                                />
                                                <div className={ styles.itemText }>
                                                    { review.review }
                                                </div>
                                                <div className={ styles.itemName }>
                                                    { review.firstName ? `${ review.firstName }, ` : '' }
                                                    { !review.isEmployer ? 'Candidate' : review.placement.companyName }
                                                </div>
                                            </div>
                                        </div>
                                    )) }
                                </div>
                            </div>
                            <div className={ classNames(styles.infoBlock, styles.white) }>
                                <div className={ styles.container }>
                                    <div />
                                    <h2
                                        style={ { color: statement.textColor } }
                                    >
                                        Placements
                                    </h2>
                                    { statement.placements.map((placement) => {
                                        const { id, jobType, industry, suburb, jobTitle, salaryRange } = placement;
                                        return (
                                            <div
                                                className={ classNames(styles.itemBox, styles.noWrap) }
                                                key={ id }
                                            >
                                                <div
                                                    className={ styles.placement }
                                                >
                                                    <div className={ styles.itemTitle }>
                                                        { jobTitle }
                                                    </div>
                                                    <div className={ styles.infoBox }>
                                                        <div className={ styles.info }>
                                                            <div>
                                                        <span className={ styles.label }>
                                                            Industry:{ ' ' }
                                                        </span>
                                                                <span>
                                                            { industry && industry.name }
                                                        </span>
                                                            </div>
                                                            <div>
                                                        <span className={ styles.label }>
                                                            Job type:{ ' ' }
                                                        </span>
                                                                <span className={ styles.jobType }>
                                                            { jobType === 'temp' ? 'Temp/Contractor' : jobType }
                                                        </span>
                                                            </div>
                                                        </div>

                                                        <div className={ styles.info }>
                                                            { suburb && <div>
                                                        <span className={ styles.label }>
                                                            Location:{ ' ' }
                                                        </span>
                                                                <span>
                                                            { suburb }
                                                        </span>
                                                            </div> }
                                                            <div>
                                                        <span className={ styles.label }>
                                                            Salary:{ ' ' }
                                                        </span>
                                                                <span>
                                                            { salaryRange }
                                                        </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }) }
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </Fragment>);
    }
}

StatementComponent.propTypes = {
    pathToRecruiter: PropTypes.string,
    recruiter: PropTypes.object.isRequired,
    statement: PropTypes.object.isRequired
};

export default StatementComponent;
