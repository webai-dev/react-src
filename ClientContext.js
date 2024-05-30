import React, { Component }   from 'react';
import PropTypes              from 'prop-types';

// This context will be use to store simple flags
const ClientContext = React.createContext({
    openedModals: 0,
});

export class ClientContextWrapper extends Component {
    state = {
        openedModals: 0
    };

    /**
     * increment or decrement openedModals number
     *
     * @param {number} value - 1 or -1
     */
    handleChangeModalsOpened = (value) => {
        this.setState({ openedModals: this.state.openedModals + value });
    };

    render() {
        const { children } = this.props;
        return (
            <ClientContext.Provider
                value={ {
                    openedModals: this.state.openedModals,
                    handleChangeModalsOpened: this.handleChangeModalsOpened
                } }
            >
                { children }
            </ClientContext.Provider>
        );
    }
}

ClientContextWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ClientContext;
