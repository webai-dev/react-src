import React, { Fragment }         from 'react';
import PropTypes                   from 'prop-types';
import { ROUTES }                  from '../../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                  from '../../../components/ButtonComponent';
import Cross2Icon                  from '../../../../assets/icons/Cross2Icon';
import FormsyHiddenInputComponent  from '../../../components/formsy/FormsyHiddenInputComponent';
import ModalComponent              from '../../../components/ModalComponent';
import RowItemComponent            from '../../../components/RowItemComponent';
import SelectComponent             from '../../../components/SelectComponent';
import SelectRecruiterFromAgencyId from '../../../components/SelectRecruiterFromAgencyId';
import classNames                  from 'classnames';
import styles                      from './styles.scss';

export const NODE_TYPES = {
    REVIEWS_AGENCY: 'reviewsAgency',
    REVIEWS_RECRUITER: 'reviewsRecruiter',
    PLACEMENTS: 'placements'
};

const SelectNodesComponent = (props) => {
    const {
        selectedNodes,
        handleSelectNodes,
        isRandomReviewSelection,
        handleSelectionType,
        handleOpenModal,
        showModal,
        handleCloseModal,
        nodes,
        isRemoveSelect,
        type,
        className,
        required,
        name,
        latestCount,
        agencyRecruiters,
        selectedRecruiterId,
        handleSelectRecruiter,
        recruiterId,
        isItemsToDisplay,
    } = props;

    const firstItems = [];
    const itemsForDisplay = (nodes || []).map((item, index) => {
        if (latestCount && index < latestCount) {
            firstItems.push(item.id);
        }
        if (type === NODE_TYPES.REVIEWS_RECRUITER || type === NODE_TYPES.REVIEWS_AGENCY) {
            const review = {
                isCandidate: !item.isEmployer,
                reviewId: item.id,
                companyName: item.placement.companyName,
                firstName: item.firstName ? item.firstName : !item.isEmployer ?
                    item.placement.candidateFirstName : item.placement.employerFirstName,
                lastName: item.lastName ? item.lastName : !item.isEmployer ?
                    item.placement.candidateLastName : item.placement.employerLastName,
                jobTitle: item.placement.jobTitle,
                placementDate: item.placement.placementDate,
                rating: item.overallRating,
                title: item.title,
                candidate: `${ item.placement.candidateFirstName } ${ item.placement.candidateLastName
                    }`, createdAt: item.createdAt,
            };

            return (
                <RowItemComponent
                    className={ styles.item }
                    classNameStart={ styles.start }
                    classNameMiddle={ styles.middle }
                    selected={ selectedNodes.includes(review.reviewId) }
                    onCheckBoxClick={ () => {handleSelectNodes(review.reviewId);} }
                    header={ review.title }
                    infoText={
                        [ review.firstName, review.lastName ].filter(Boolean)
                            .join(' ') +
                        (review.isCandidate ?
                                ' (Candidate)' :
                                ` (Employer${ review.companyName ? ` @ ${ review.companyName }` : '' })`
                        )
                    }
                    key={ review.reviewId }
                    id={ review.reviewId }
                    checkBoxId={ `${ index }_${ review.reviewId }` }
                    rating={ review.rating }
                    statusText={ review.jobTitle }
                />
            );
        }
        if (type === NODE_TYPES.PLACEMENTS) {
            const placement = {
                id: item.id,
                title: item.jobTitle,
                suburb: item.suburb,
                salaryRange: item.salaryRange,
                jobType: item.jobType,
                industry: item.industry && item.industry.name,
            };

            return (
                <RowItemComponent
                    className={ styles.item }
                    jobType={ true }
                    classNameStart={ styles.start }
                    classNameMiddle={ styles.middle }
                    selected={ selectedNodes.includes(placement.id) }
                    onCheckBoxClick={ () => {handleSelectNodes(placement.id);} }
                    header={ placement.title }
                    key={ placement.id }
                    id={ placement.id }
                    checkBoxId={ `${ index }_${ placement.id }` }
                    statusText={
                        <Fragment>
                            <div className={ styles.placementInfo }>
                                <div className={ styles.placementItem }>
                                    <span className={ styles.label }>
                                        Industry:{ ' ' }
                                    </span>
                                    <span>
                                        { placement.industry }
                                    </span>
                                </div>
                                <div className={ styles.placementItem }>
                                    <span className={ styles.label }>
                                        Job type:{ ' ' }
                                    </span>
                                    <span className={ styles.jobType }>
                                        { placement.jobType === 'temp' ? 'Temp/Contractor' : placement.jobType }
                                    </span>
                                </div>
                            </div>

                            <div className={ styles.placementInfo }>
                                { placement.suburb && <div className={ styles.placementItem }>
                                    <span className={ styles.label }>
                                        Location:{ ' ' }
                                    </span>
                                    <span>
                                        { placement.suburb }
                                    </span>
                                </div> }
                                <div className={ styles.placementItem }>
                                    <span className={ styles.label }>
                                        Salary:{ ' ' }
                                    </span>
                                    <span>
                                        { placement.salaryRange }
                                    </span>
                                </div>
                            </div>
                        </Fragment>
                    }
                />
            );
        }
    });


    return (
        <Fragment>
            <div className={ className }>
                { name &&
                <FormsyHiddenInputComponent
                    name={ name }
                    value={ selectedNodes?.length ? selectedNodes : latestCount ? firstItems : null }
                /> }
                <div className={ styles.selectBox }>
                    { !isRemoveSelect && <SelectComponent
                        className={ styles.select }
                        value={ isRandomReviewSelection }
                        setValue={ handleSelectionType }
                        values={ [
                            {
                                label: `Show latest ${ type !== NODE_TYPES.PLACEMENTS ? 'reviews' : 'placements' }`,
                                key: true
                            },
                            {
                                label: `Choose your ${ type !== NODE_TYPES.PLACEMENTS ? 'reviews' : 'placements' }`,
                                key: false
                            },
                        ] }
                    /> }
                    { (!isRandomReviewSelection || isRemoveSelect) && <ButtonComponent
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                        onClick={ handleOpenModal }
                    >
                        Choose { isRemoveSelect && (type !== NODE_TYPES.PLACEMENTS ? 'Reviews' : 'Placements') }
                    </ButtonComponent> }
                </div>
                { (!isRandomReviewSelection || isRemoveSelect) &&
                <div className={ styles.info }>
                    <b>{ selectedNodes.length }</b>
                    { (type !== NODE_TYPES.PLACEMENTS ? ' review' : ' placement') }
                    { selectedNodes.length === 1 ? '' : 's' } selected.{ ' ' }
                    <ButtonComponent
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                        onClick={ handleOpenModal }
                    >
                        edit
                    </ButtonComponent>
                    { required &&
                    <span className={ styles.required }>*</span>
                    }
                </div> }
            </div>

            { // MODAL
                showModal &&
                <ModalComponent
                    handleClose={ handleCloseModal }
                    classNameOuter={ styles.modal }
                    classNameInner={ styles.modalInner }
                >
                    <ButtonComponent
                        ariaLabel="close modal"
                        btnType={ BUTTON_TYPE.LINK }
                        className={ styles.close }
                        onClick={ handleCloseModal }
                    >
                        <Cross2Icon />
                    </ButtonComponent>
                    <div className={ styles.box }>
                        <h2 className={ styles.title }>
                            Select{ type !== NODE_TYPES.PLACEMENTS ? ' reviews' : ' placements' }
                        </h2>
                        { !!agencyRecruiters?.length &&
                        <div className={ styles.filterBox }>
                            <SelectRecruiterFromAgencyId
                                agencyRecruiters={ agencyRecruiters }
                                className={ styles.filterSelect }
                                selectClassName={ classNames({ [ styles.filterHeightSmall ]: !itemsForDisplay.length }) }
                                selectedRecruiterId={ selectedRecruiterId }
                                handleSelectRecruiter={ handleSelectRecruiter }
                                recruiterId={ recruiterId }
                            />
                        </div> }
                        <div className={ styles.items }>
                            { isItemsToDisplay && itemsForDisplay }
                            { !isItemsToDisplay &&
                            <div className={ styles.noItems }>
                                You currently have no { type !== NODE_TYPES.PLACEMENTS ? 'reviews' : 'placements' },
                                click
                                { ' ' }
                                <ButtonComponent
                                    className={ styles.button }
                                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                                    size={ BUTTON_SIZE.SMALL }
                                    to={ ROUTES.PLACEMENTS_NEW }
                                >
                                    here
                                </ButtonComponent>
                                { ' ' }
                                to start collecting
                            </div>
                            }
                        </div>
                        { isItemsToDisplay && <div className={ classNames(styles.saveBox, styles.marginTop) }>
                            <ButtonComponent
                                btnType={ BUTTON_TYPE.ACCENT }
                                size={ BUTTON_SIZE.BIG }
                                onClick={ handleCloseModal }
                            >
                                Save & continue
                            </ButtonComponent>
                        </div> }
                    </div>
                </ModalComponent>
            }
        </Fragment>
    );
};

SelectNodesComponent.propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    showModal: PropTypes.bool,
    selectedNodes: PropTypes.array,
    handleSelectNodes: PropTypes.func.isRequired,
    handleSelectionType: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    isRandomReviewSelection: PropTypes.bool,
    isRemoveSelect: PropTypes.bool,
    isItemsToDisplay: PropTypes.bool,
    required: PropTypes.bool,
    nodes: PropTypes.array,
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    name: PropTypes.string,
    latestCount: PropTypes.number,
    agencyRecruiters: PropTypes.arrayOf(PropTypes.object),
    selectedRecruiterId: PropTypes.string,
    handleSelectRecruiter: PropTypes.func.isRequired,
    recruiterId: PropTypes.string,
};

export default SelectNodesComponent;
