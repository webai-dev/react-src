import React, { Fragment }              from 'react';
import PropTypes                        from 'prop-types';
import ToggleComponent                  from '../../../components/Form/ToggleComponent';
import HeaderRowComponent               from '../../../components/HeaderRowComponent';
import HeaderRowButtonComponent         from '../../../components/HeaderRowButtonComponent';
import ActionsRowComponent              from '../../../components/ActionsRowComponent';
import SearchContainer                  from '../../../components/Form/SearchContainer';
import { PARAM_PLACEMENT_TYPE, ROUTES } from '../../../../constants';
import TEST_IDS                         from '../../../../tests/testIds';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                       from '../../../components/ButtonComponent';
import HelpComponent                    from '../../../components/HelpComponent';
import SelectRecruiterFromAgencyId      from '../../../components/SelectRecruiterFromAgencyId';
import SelectPlacementTypeContainer     from '../SelectPlacementTypeContainer';
import JobAdderContainer                from '../JobAdderContainer';
import ReviewButtonComponent            from '../ReviewButtonComponent';
import RowItemComponent, { STATUS }     from '../../../components/RowItemComponent';
import DeleteActionComponent            from '../../../components/RowItemComponent/DeleteActionComponent';
import ButtonActionComponent            from '../../../components/RowItemComponent/ButtonActionComponent';
import styles                           from './styles.scss';

const PlacementsComponent = (props) => {
    const {
        placements,
        pathToVisiblePlacements,
        pathToIncompletePlacements,
        pathToInviteNeededPlacements,
        visiblePlacementsCount,
        incompletePlacementsCount,
        inviteNeededPlacementsCount,
        placementType,
        handleEditPlacement,
        handleDelete,
        isLoading,
        recruiterId,
        handleTogglePlacements,
        autoSendReminders,
        isJobadderIntegrated,
        isAgencyAdmin,
        isFreelancer,
        handleSelectRecruiter,
        selectedRecruiterId,
        agencyRecruiters,
    } = props;

    return (
        <Fragment>
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent
                            url={ pathToVisiblePlacements }
                            label="Visible"
                            badgeText={ visiblePlacementsCount }
                            isActive={ placementType === PARAM_PLACEMENT_TYPE.VISIBLE }
                        />
                        <HeaderRowButtonComponent
                            url={ pathToIncompletePlacements }
                            label="Incomplete"
                            badgeText={ incompletePlacementsCount }
                            isActive={ placementType === PARAM_PLACEMENT_TYPE.INCOMPLETE }
                            helpText="Incomplete placements have missing information required before being displayed publicly"
                        />
                        <HeaderRowButtonComponent
                            url={ pathToInviteNeededPlacements }
                            label="Invite needed"
                            badgeText={ inviteNeededPlacementsCount }
                            isActive={ placementType === PARAM_PLACEMENT_TYPE.INVITE_NEEDED }
                            helpText="Invite needed are placements imported from your ATS that you haven’t yet requested reviews for"
                        />
                    </Fragment>
                }
                search={
                    <SearchContainer
                        label="Find a Placement..."
                        name="search"
                        innerSearchStyle
                    />
                }
            />

            <ActionsRowComponent
                itemActions={
                    (isAgencyAdmin || isFreelancer) && <Fragment>
                        <ToggleComponent
                            disabled={ isLoading }
                            name="reminder"
                            onChange={ handleTogglePlacements }
                            value={ autoSendReminders }
                            big
                            label={ `Auto review requests ${ autoSendReminders ? 'on' : 'off' }` }
                        />
                        <HelpComponent text="Automatic review requests can be set for all placements imported from JobAdder" />
                    </Fragment>
                }
                pageActions={
                    <Fragment>
                        { agencyRecruiters && <SelectRecruiterFromAgencyId
                            agencyRecruiters={ agencyRecruiters }
                            className={ styles.dropDown }
                            selectedRecruiterId={ selectedRecruiterId }
                            handleSelectRecruiter={ handleSelectRecruiter }
                            recruiterId={ recruiterId }
                        /> }
                        {
                            placementType !== PARAM_PLACEMENT_TYPE.VISIBLE &&
                            <SelectPlacementTypeContainer className={ styles.dropDown } />
                        }
                        <ButtonComponent
                            to={ ROUTES.PLACEMENTS_NEW }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            dataTest={ TEST_IDS.PLACEMENT_NEW_ROUTE }
                        >
                            Add a new placement
                        </ButtonComponent>
                        {
                            (isAgencyAdmin || isFreelancer) &&
                            <JobAdderContainer isJobadderIntegrated={ isJobadderIntegrated } />
                        }
                    </Fragment>
                }
            />
            {
                (placementType !== PARAM_PLACEMENT_TYPE.VISIBLE && incompletePlacementsCount + inviteNeededPlacementsCount === 0) &&
                <div className={ styles.card }>
                    You currently have no imported placements. To import{ ' ' }
                    <ButtonComponent
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        forceHref
                        to={ ROUTES.JOBADDER_LOGIN }
                    >
                        click here
                    </ButtonComponent>.
                </div>
            }
            {
                (placementType === PARAM_PLACEMENT_TYPE.VISIBLE && visiblePlacementsCount === 0) &&
                <div className={ styles.card }>
                    You currently have no placements. To get started{ ' ' }
                    <ButtonComponent
                        size={ BUTTON_SIZE.SMALL }
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        to={ ROUTES.PLACEMENTS_NEW }
                    >
                        click here
                    </ButtonComponent>.
                </div>
            }

            { placements.map(
                (placement, index) => {
                    const { id, jobTitle, companyName, placementDate, status, candidateReviewId, employerReviewId } = placement;
                    return (
                        <RowItemComponent
                            classNameMiddle={ styles.rowMiddle }
                            classNameStart={ styles.rowStart }
                            key={ id }
                            id={ id }
                            header={ jobTitle }
                            infoText={ <div>
                                <div>
                                    { placement.suburb }
                                </div>
                                <div>
                                    { `${
                                        placement.recruiter.firstName } ${
                                        placement.recruiter.lastName }` }
                                    { placement.recruiter.id === recruiterId ? ' (Me)' : '' }
                                </div>
                            </div> }
                            accentText={ companyName }
                            date={ placementDate }
                            status={ placementType !== PARAM_PLACEMENT_TYPE.VISIBLE ? null :
                                (status === PlacementsComponent.STATUS.REVIEWED && STATUS.SUCCESS) ||
                                (status === PlacementsComponent.STATUS.UN_REVIEWED && STATUS.DANGER) ||
                                (status === PlacementsComponent.STATUS.AWAIT_EMPLOYER && STATUS.WARNING) ||
                                (status === PlacementsComponent.STATUS.AWAIT_CANDIDATE && STATUS.WARNING)
                            }
                            statusText={ placementType !== PARAM_PLACEMENT_TYPE.VISIBLE ? null : status }
                            jobType
                            actions={
                                <Fragment>
                                    <div className={ styles.reviewButtons }>
                                        { employerReviewId && <ReviewButtonComponent
                                            reviewId={ employerReviewId }
                                        /> }
                                        { candidateReviewId && <ReviewButtonComponent
                                            reviewId={ candidateReviewId }
                                            isCandidate
                                        /> }
                                    </div>
                                    { (status === PlacementsComponent.STATUS.UN_REVIEWED ||
                                        placementType !== PARAM_PLACEMENT_TYPE.VISIBLE) &&
                                    <div className={ styles.actionButtons }>
                                        <ButtonActionComponent
                                            dataTest={ `${ TEST_IDS.PLACEMENT_EDIT_ROUTE }-${ index }` }
                                            onClick={ () => {handleEditPlacement(id);} }
                                            text="Edit"
                                        />
                                        <DeleteActionComponent
                                            onClick={ () => {handleDelete(id);} }
                                            isLoading={ isLoading }
                                        />
                                    </div> }
                                </Fragment>
                            }
                        />
                    );
                })
            }
        </Fragment>
    );
};

PlacementsComponent.STATUS = {
    REVIEWED: 'Reviewed',
    UN_REVIEWED: 'UnReviewed',
    AWAIT_EMPLOYER: 'Await employer review',
    AWAIT_CANDIDATE: 'Await candidate review',
};

PlacementsComponent.propTypes = {
    placements: PropTypes.array.isRequired,
    agencyRecruiters: PropTypes.array.isRequired,
    pathToVisiblePlacements: PropTypes.string.isRequired,
    pathToIncompletePlacements: PropTypes.string.isRequired,
    pathToInviteNeededPlacements: PropTypes.string.isRequired,
    visiblePlacementsCount: PropTypes.number.isRequired,
    incompletePlacementsCount: PropTypes.number.isRequired,
    inviteNeededPlacementsCount: PropTypes.number.isRequired,
    placementType: PropTypes.string.isRequired,
    handleEditPlacement: PropTypes.func.isRequired,
    handleSelectRecruiter: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    recruiterId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    isJobadderIntegrated: PropTypes.bool,
    isAgencyAdmin: PropTypes.bool,
    isFreelancer: PropTypes.bool,
    handleTogglePlacements: PropTypes.func.isRequired,
    autoSendReminders: PropTypes.bool,
    selectedRecruiterId: PropTypes.string,
};

export default PlacementsComponent;
