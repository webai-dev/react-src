import React, { PureComponent, Fragment }   from 'react';
import classNames                           from 'classnames';
import { Button }                           from '../Button';
import TableCell                            from '../Table/TableCell';
import Table                                from '../Table/Table';
import TableRow                             from '../Table/TableRow';
import CheckBoxComponent                    from '../CheckBoxComponent';
import RecruiterModalComponent              from '../../components/RecruiterModalComponent';
import ProfileSnippet                       from '../User/ProfileSnippet';
import { graphql, createFragmentContainer } from 'react-relay';
import './RecruiterTable.scss';

class RecruiterTableRow extends PureComponent {
    state = {
        showModal: false,
    };

    /**
     * Will open modal to display recruiter
     */
    handleOpenModal = () => {
        this.setState({ showModal: true });
    };
    /**
     * Will close modal to display recruiter
     */
    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        const {
            recruiter = {},
            className,
            rowTag: RowTag = TableRow,
            cellTag: CellTag = TableCell,
            selected = false,
            onClick,
            showCheckbox = false,
            onViewClick,
            ...otherProps
        } = this.props;
        const { showModal } = this.state;
        const { handleOpenModal, handleCloseModal } = this;

        return (
            <Fragment>
                { showModal && (
                    <RecruiterModalComponent
                        recruiterId={ recruiter.id }
                        toggle={ handleCloseModal }
                    />
                ) }
                <RowTag
                    { ...otherProps }
                    className={ classNames(
                        className,
                        selected ? 'recruiter-table--row__active' : null,
                        recruiter.recruiterRelationship && recruiter.recruiterRelationship.isFavourite
                            ? 'recruiter-table--row__favourite'
                            : '',
                        recruiter.agency.agencyRelationship && recruiter.agency.agencyRelationship.isPsa
                            ? 'recruiter-table--row__psa'
                            : ''
                    ) }
                >
                    { showCheckbox && (
                        <CellTag
                            valign="center"
                            name="is-selected"
                        >
                            <CheckBoxComponent
                                isInnerApp
                                name={ recruiter.id }
                                onChange={ () => onClick(recruiter) }
                                value={ selected }
                            />
                        </CellTag>
                    ) }
                    <CellTag
                        valign="center"
                        name="recruiter"
                    >
                        <ProfileSnippet
                            onClick={ handleOpenModal }
                            type="recruiter"
                            profile={ recruiter }
                        />
                    </CellTag>
                    <CellTag
                        valign="center"
                        name="specialisations"
                        width="50%"
                    >
                        <label htmlFor="Specialisations">Specialisations:{' '}</label>
                        { recruiter.specialisations.map(it => it.name)
                            .join(', ') }
                    </CellTag>
                    <CellTag
                        valign="center"
                        align="right"
                        name="actions"
                    >
                        <Button
                            onClick={ handleOpenModal }
                            color="blue"
                            className="soft"
                            size="sm"
                            style={ {
                                fontWeight: 400,
                                width: 63
                            } }
                        >
                            View
                        </Button>
                    </CellTag>
                </RowTag>
            </Fragment>
        );
    }
}

export const RecruiterTable = (props) => {
    const {
        recruiters = [],
        selected = [],
        onRecruiterSelected,
        relay,
        filter = () => true,
        filterText = '',
        isPsa,
        ...otherProps
    } = props;
    const filteredRecruiters = recruiters.filter(filter);
    return (
        <Table type="recruiter">
            { filteredRecruiters.map(it => (
                <RecruiterTableRow
                    onClick={ onRecruiterSelected }
                    key={ it.id }
                    recruiter={ it }
                    selected={ selected.indexOf(it.id) >= 0 }
                    { ...otherProps }
                />
            )) }
            { filteredRecruiters.length === 0 && (
                <tr className="card no-items-row">
                    <td>
                        <span>{ isPsa ? 'You currently have no PSA in place' : 'You currently have no preferred recruiters' }</span>
                    </td>
                </tr>
            ) }
        </Table>
    );
};

export const RecruiterTableFragment = createFragmentContainer(
    ({ data: { recruiters = [] }, ...props }) => (
        <RecruiterTable recruiters={ recruiters || [] } { ...props } />
    ),
    {
        data: graphql`
            fragment RecruiterTable_data on Viewer
            @argumentDefinitions(
                relationshipType: { type: RecruiterRelationshipType, defaultValue: Recent }
            ) {
                recruiters(type: $relationshipType) {
                    id
                    profilePhoto {
                        url
                        id
                        name
                        path
                    }
                    firstName
                    lastName
                    specialisations {
                        id
                        name
                    }
                    agency {
                        id
                        name
                        logo
                    }
                    recruiterRelationship {
                        id
                        isFavourite
                    }
                    agency {
                        agencyRelationship {
                            id
                            isPsa
                            psaDocument {
                                id
                                name
                                url
                            }
                        }
                    }
                }
            }
        `
    }
);

export default RecruiterTable;
