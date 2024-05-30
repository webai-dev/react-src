import React, { Component }                                        from 'react';
import PropTypes                                                   from 'prop-types';
import Cross2Icon                                                  from '../../../assets/icons/Cross2Icon';
import { Modal as BaseModal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './Modal.scss';

export default class Modal extends Component {
    static propTypes = {
        toggle: PropTypes.func,
        footer: PropTypes.array,
        isOpen: PropTypes.bool,
        title: PropTypes.string
    };

    static defaultProps = {
        isOpen: false,
        footer: []
    };

    render() {
        const { isOpen, toggle, children, footer, title = '', ...otherProps } = this.props;
        const closeBtn = <button
            className="close"
            onClick={ toggle }
        ><Cross2Icon /></button>;
        return (
            <div>
                <BaseModal
                    isOpen={ isOpen }
                    toggle={ toggle } { ...otherProps }>
                    <ModalHeader
                        toggle={ toggle }
                        tag="h2"
                        close={ closeBtn }
                    >{ title }</ModalHeader>
                    <ModalBody>{ children }</ModalBody>
                    { footer.length > 0 && <ModalFooter>{ footer }</ModalFooter> }
                </BaseModal>
            </div>
        );
    }
}
