import React, { PureComponent, Fragment } from 'react';
import PropTypes                          from 'prop-types';
import { toast }                          from 'react-toastify';
import CopyIcon                           from '../../../assets/icons/CopyIcon';
import classNames                         from 'classnames';
import styles                             from './styles.scss';

class CopyInputComponent extends PureComponent {
    handleCopyTextToClipBoard = () => {
        this.copyInput.focus();
        this.copyInput.select();
        document.execCommand('copy');
        this.copyInput.blur();
        toast.success('Text was copied');
    };

    render() {
        const { copyElement, actionElement, hidden } = this.props;
        const { handleCopyTextToClipBoard } = this;

        return <Fragment>
            <div
                className={ styles.copyText }
            >
                { !hidden && copyElement }
                <input
                    className={ styles.input }
                    readOnly
                    ref={ (ref) => {this.copyInput = ref;} }
                    type="text"
                    value={ copyElement }
                />
            </div>
            { ' ' }
            <button
                type="button"
                className={ classNames(styles.copyButton, {
                    [ styles.copyButtonWithIcon ]: !actionElement
                }) }
                onClick={ handleCopyTextToClipBoard }
            >
                { actionElement && actionElement }
                { !actionElement && <CopyIcon /> }
            </button>
        </Fragment>;
    }
}

CopyInputComponent.propTypes = {
    copyElement: PropTypes.string.isRequired,
    actionElement: PropTypes.node,
    hidden: PropTypes.bool,
};

export default CopyInputComponent;
