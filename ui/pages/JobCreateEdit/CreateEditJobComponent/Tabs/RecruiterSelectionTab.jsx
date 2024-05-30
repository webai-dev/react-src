import React             from 'react';
import TabPanel          from '../../../../components/Tabs/TabPanel';
import classNames        from 'classnames';
import { Select }        from '../../../../components/Form';
import CheckBoxComponent from '../../../../components/CheckBoxComponent';
import RecruiterTable    from '../../../../components/Recruiter/RecruiterTable';
import { Row, Col }      from 'reactstrap';

const RecruiterSelectionTab = (props) => {
    const {
        recruiters = [],
        invitedRecruiters = [],
        toggleNetworkSelection,
        onRecruiterSelected,
        onViewClick,
        publishToMarketplace = true,
        onChangeRecruiterFilter = () => {},
        filter = 'all'
    } = props;
    return (
        <TabPanel
            withBg={ false }
            tabId="recruiters"
        >
            <Row
                className={ classNames('no-gutters mb-4 publish-to-marketplace', {
                    'publish-to-marketplace__selected': publishToMarketplace
                }) }
                onClick={ toggleNetworkSelection }
            >
                <Col
                    className="publish-to-marketplace--tick"
                    xs={ 1 }
                >
                    <CheckBoxComponent
                        isInnerApp
                        name="publishToMarketPlaceId"
                        onChange={ toggleNetworkSelection }
                        value={ publishToMarketplace }
                    />
                </Col>
                <Col
                    className="publish-to-marketplace--info"
                    xs={ 11 }
                >
                    <h3>Publish to the marketplace</h3>
                    <p>
                        Post your job to our network of pre-vetted, specialist recruiters. They'll
                        review the job details and apply to work on the role if they can help. Don't
                        worry - your details are kept anonymous until you accept a recruiters
                        application.
                    </p>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col style={ { display: 'flex', justifyContent: 'flex-end' } }>
                    <div>
                        <Select
                            value={ filter }
                            onChange={ e => onChangeRecruiterFilter(e.target.value) }
                        >
                            <option value="all">View All</option>
                            { Object.entries(
                                recruiters.reduce((statuses, it) => {
                                    let theStatus = null;
                                    if (
                                        it.agency &&
                                        it.agency.agencyRelationship &&
                                        it.agency.agencyRelationship.isPsa
                                    ) {
                                        theStatus = 'PSA';
                                    } else if (
                                        it.recruiterRelationship &&
                                        it.recruiterRelationship.isFavourite
                                    ) {
                                        theStatus = 'Favourite';
                                    } else {
                                        status = 'recent';
                                    }

                                    if (theStatus) {
                                        if (typeof statuses[ theStatus ] === 'undefined') {
                                            statuses[ theStatus ] = 0;
                                        }
                                        statuses[ theStatus ]++;
                                    }
                                    return statuses;
                                }, {})
                            )
                                .map(([ status, count ]) => (
                                    <option
                                        value={ status }
                                        key={ status }
                                    >
                                        { status } ({ count })
                                    </option>
                                )) }
                        </Select>
                    </div>
                </Col>
            </Row>
            <RecruiterTable
                showCheckbox={ true }
                type="list"
                recruiters={ recruiters.filter(it => {
                    const lowerFilter = filter.toLowerCase();
                    const isPsa =
                        it.agency && it.agency.agencyRelationship && it.agency.agencyRelationship.isPsa;
                    const isFavourite =
                        it.recruiterRelationship && it.recruiterRelationship.isFavourite;
                    if (lowerFilter === 'psa') {
                        return isPsa;
                    }
                    if (lowerFilter === 'favourite') {
                        return isFavourite;
                    }

                    if (lowerFilter === 'recent') {
                        return !isPsa && !isFavourite;
                    }

                    return true;
                }) }
                selected={ invitedRecruiters }
                onRecruiterSelected={ onRecruiterSelected }
                onViewClick={ onViewClick }
            />
        </TabPanel>
    );
};

export default RecruiterSelectionTab;
