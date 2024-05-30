import React, { PureComponent }                      from 'react';
import PropTypes                                     from 'prop-types';
import Dropzone                                      from 'react-dropzone';
import classNames                                    from 'classnames';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../../ButtonComponent';
import styles                                        from './styles.scss';

class FileDropZoneComponent extends PureComponent {
    state = {
        isFocused: false,
        rawFile: null,
        error: null,
    };

    static MAX_FILE_SIZE = 2200000;

    /**
     * Handle focus state
     *
     * @param {boolean} isFocused
     */
    handleFocus = (isFocused) => {
        this.setState({ isFocused });
    };
    /**
     * Will set error
     *
     * @param {string} [error]
     */
    handleError = (error) => {
        this.setState({ error });
    };

    /**
     * Save raw file so it can be processed by image cropper
     *
     * @param {File|Blob} rawFile
     */
    handleSetRawFile = (rawFile) => {
        if (!rawFile) {
            this.props.setValue({ rawFile });
            this.handleError();
            return;
        }

        const nameArray = rawFile.name.split('.');
        const extension = nameArray[ nameArray.length - 1 ];
        if (this.props.validExtensions && !this.props.validExtensions.includes(extension)) {
            this.setState(
                {
                    error: `We cannot upload this file format. Please try again with ${
                        this.props.validExtensions.join(', ') } formats.`,
                },
            );
            return;
        }

        this.props.setValue(rawFile);
        this.handleError(null);
    };

    /**
     * Remove file
     */
    handleRemoveFile = () => {
        this.props.setValue(null);
    };

    render() {
        const { handleFocus, handleSetRawFile, handleError, handleRemoveFile } = this;
        const { isFocused, error } = this.state;
        const { value } = this.props;
        const {
            className,
            children,
            name,
            onClick,
            dropZoneClassName,
            label,
            required,
            processError,
            accept,
            maxFileSize,
        } = this.props;

        const max = maxFileSize || FileDropZoneComponent.MAX_FILE_SIZE;

        return (
            <div className={ styles.container }>
                <div className={ classNames(styles.box, className) }>
                    <div>
                        <Dropzone
                            id={ name }
                            className={ classNames(
                                dropZoneClassName,
                                styles.dropZone,
                                {
                                    [ styles.dropZoneFocused ]: isFocused,
                                },
                            ) }
                            activeClassName={ styles.dropZoneActive }
                            onDropAccepted={ (files) => {
                                handleSetRawFile(files[ 0 ]);
                            } }
                            onDropRejected={ () => {
                                handleError(`< ${ Math.floor(max / 1000000) }MB`);
                            } }
                            onClickCapture={ onClick }
                            onFocus={ () => {handleFocus(true);} }
                            onBlur={ () => {handleFocus(false);} }
                            maxSize={ max }
                            multiple={ false }
                            accept={ accept }
                        >
                            { children }
                        </Dropzone>
                        { label && <span className={ styles.label }>{ label }
                            { required &&
                            <span className={ styles.required }>*</span>
                            }
                        </span> }
                    </div>

                    { value && <span className={ styles.file }>
                        { value.name }{ ' ' }
                        <ButtonComponent
                            onClick={ handleRemoveFile }
                            className={ styles.remove }
                            type="button"
                            btnType={ BUTTON_TYPE.LINK_ACCENT }
                            size={ BUTTON_SIZE.SMALL }
                        >(remove)</ButtonComponent>
                    </span>
                    }
                </div>
                { (error || processError) &&
                <span className={ styles.error }>
                    { error || processError }
                </span> }
            </div>
        );
    }
}

FileDropZoneComponent.propTypes = {
    value: PropTypes.object,
    setValue: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    dropZoneClassName: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    accept: PropTypes.string,
    children: PropTypes.node.isRequired,
    isRemovable: PropTypes.bool,
    borderRadius: PropTypes.number,
    validExtensions: PropTypes.array,
    required: PropTypes.bool,
    processError: PropTypes.string,
    maxFileSize: PropTypes.number,
};

export default FileDropZoneComponent;
