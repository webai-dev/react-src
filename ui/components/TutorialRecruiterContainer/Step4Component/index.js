import React, { PureComponent }                      from 'react';
import PropTypes                                     from 'prop-types';
import Cross2Icon                                    from '../../../../assets/icons/Cross2Icon';
import PlusIcon                                      from '../../../../assets/icons/PlusIcon';
import ButtonComponent, { BUTTON_TYPE }              from '../../ButtonComponent';
import QuickInviteContainer                          from './QuickInviteContainer';
import styles                                        from '../styles.scss';

class Step1Component extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            team: (props.users && !!props.users.length && props.users) || [ {} ]
        };
    }

    handleAddTeamMember = () => {
        this.setState({
            team: [ ...this.state.team, {} ]
        });
    };

    render() {
        const { handleAddTeamMember } = this;
        const { team } = this.state;
        const { handleClose } = this.props;

        return (
            <div className={ styles.box }>
                <ButtonComponent
                    ariaLabel="close modal"
                    btnType={ BUTTON_TYPE.LINK }
                    className={ styles.close }
                    onClick={ handleClose }
                >
                    <Cross2Icon />
                </ButtonComponent>
                <h2 className={ styles.title }>
                    Invite team
                </h2>
                { team.map((teamMember, index) => <QuickInviteContainer
                    id={ '' + index }
                    teamMember={ teamMember }
                    key={ index }
                />) }

                <div>
                    <ButtonComponent
                        ariaLabel="add team member"
                        btnType={ BUTTON_TYPE.LINK }
                        className={ styles.addTeamMember }
                        onClick={ handleAddTeamMember }
                    >
                        <span>
                            ADD ANOTHER TEAM MEMBER
                        </span>
                        { ' ' }
                        <PlusIcon />
                    </ButtonComponent>
                </div>
            </div>
        );
    }
}

Step1Component.propTypes = {
    handleClose: PropTypes.func.isRequired,
    users: PropTypes.array,
};

export default Step1Component;
