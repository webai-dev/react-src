import React, { Fragment }       from 'react';
import PropTypes                 from 'prop-types';
import { generatePath }          from 'react-router-dom';
import HeaderRowComponent        from '../../../components/HeaderRowComponent';
import HeaderRowButtonComponent  from '../../../components/HeaderRowButtonComponent';
import ActionsRowComponent       from '../../../components/ActionsRowComponent';
import InviteTeamMemberContainer from '../InviteTeamMemberContainer';
import ActiveTeamMemberContainer from '../ActiveTeamMemberContainer';
import MemberContainer           from '../MemberContainer';
import {
    ROUTES,
    TEAM_TAB,
    TEAM_TAB_INVITE,
}                                from '../../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                                from '../../../components/ButtonComponent';

const TeamComponent = (props) => {
    const {
        myId,
        members,
        currentTab,
        isCompany,
        isInvite,
        memberId,
        handleCloseModal,
        verifiedMembersLength,
        pendingMembersLength,
        subscriptionEstimate,
    } = props;

    return (
        <Fragment>
            { isInvite && <InviteTeamMemberContainer
                handleCloseModal={ handleCloseModal }
                isCompany={ isCompany }
                subscriptionEstimate={ subscriptionEstimate }
            /> }
            { memberId && <ActiveTeamMemberContainer
                id={ memberId }
                handleCloseModal={ handleCloseModal }
            /> }
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent
                            badgeText={ verifiedMembersLength }
                            url={ isCompany ?
                                generatePath(
                                    ROUTES.COMPANY_USERS,
                                    { [ TEAM_TAB._NAME ]: TEAM_TAB.ACTIVE },
                                ) :
                                generatePath(
                                    ROUTES.AGENCY_RECRUITERS,
                                    { [ TEAM_TAB._NAME ]: TEAM_TAB.ACTIVE },
                                )
                            }
                            label="Active"
                            isActive={ currentTab === TEAM_TAB.ACTIVE }
                        />
                        <HeaderRowButtonComponent
                            badgeText={ pendingMembersLength }
                            url={ isCompany ?
                                generatePath(
                                    ROUTES.COMPANY_USERS,
                                    { [ TEAM_TAB._NAME ]: TEAM_TAB.REQUEST },
                                ) :
                                generatePath(
                                    ROUTES.AGENCY_RECRUITERS,
                                    { [ TEAM_TAB._NAME ]: TEAM_TAB.REQUEST },
                                )
                            }
                            label="Account request"
                            isActive={ currentTab === TEAM_TAB.REQUEST }
                        />
                    </Fragment>
                }
            />
            <ActionsRowComponent
                pageActions={
                    <ButtonComponent
                        to={
                            generatePath(
                                isCompany ? ROUTES.COMPANY_USERS : ROUTES.AGENCY_RECRUITERS,
                                {
                                    [ TEAM_TAB._NAME ]: currentTab,
                                    id: TEAM_TAB_INVITE,
                                },
                            )
                        }
                        btnType={ BUTTON_TYPE.ACCENT }
                        size={ BUTTON_SIZE.BIG }
                    >
                        { isCompany ? 'Add company user' : 'Add agency user' }
                    </ButtonComponent>
                }
            />
            { members.map(member => <MemberContainer
                key={ member.id }
                isCompany={ isCompany }
                member={ member }
                currentTab={ currentTab }
                myId={ myId }
                subscriptionEstimate={ subscriptionEstimate }
            />) }
        </Fragment>
    );
};

TeamComponent.propTypes = {
    isCompany: PropTypes.bool,
    currentTab: PropTypes.string.isRequired,
    isInvite: PropTypes.bool,
    memberId: PropTypes.string,
    handleCloseModal: PropTypes.func.isRequired,
    myId: PropTypes.string.isRequired,
    members: PropTypes.array,
    pendingMembersLength: PropTypes.number,
    verifiedMembersLength: PropTypes.number,
    subscriptionEstimate: PropTypes.number,
};

export default TeamComponent;
