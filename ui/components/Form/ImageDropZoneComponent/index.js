import React, {
    PureComponent,
    Fragment,
}                                                    from 'react';
import PropTypes                                     from 'prop-types';
import Dropzone                                      from 'react-dropzone';
import { STAGE_URL }                                 from '../../../../constants';
import classNames                                    from 'classnames';
import AvatarEditor                                  from 'react-avatar-editor';
import TEST_IDS                                      from '../../../../tests/testIds';
import ModalComponent                                from '../../ModalComponent';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../../ButtonComponent';
import RangeInputComponent                           from '../../Form/RangeInputComponent';
import styles                                        from './styles.scss';

class ImageDropZoneComponent extends PureComponent {
    state = {
        isFocused: false,
        rawFile: null,
        base64Url: null,
        scale: 1.5,
        error: null,
    };

    static MAX_FILE_SIZE = 2200000;
    static VALID_EXTENSIONS = [
        'png',
        'jpeg',
        'jpg',
        'svg',
    ];

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
     * @param {File|Blob} rawFileInput
     */
    handleSetRawFile = (rawFileInput) => {
        let rawFile = rawFileInput;
        if (rawFile instanceof Blob) {
            rawFile = new File([ rawFile ], rawFile.fileName || 'avatar.png');
        }
        if (!rawFile) {
            this.setState({ rawFile });
            this.handleError();
            return;
        }

        const nameArray = rawFile.name.split('.');
        const extension = nameArray[ nameArray.length - 1 ];
        if (ImageDropZoneComponent.VALID_EXTENSIONS.includes(extension)) {
            this.setState({ rawFile });
            this.handleError(null);
        } else {
            this.setState(
                {
                    error: `We cannot upload this file format. Please try again with ${
                        ImageDropZoneComponent.VALID_EXTENSIONS.join(', ') } formats.`,
                },
            );
        }
    };
    /**
     * Handle focus state
     *
     * @param {number} scale
     */
    handleScale = (scale) => {
        this.setState({ scale: Math.floor(scale * 10) / 10 });
    };

    /**
     * Get avatarEditor ref and using html api receive canvas image and save it via setState, also preserve base64Url
     * to display preview
     */
    handleSaveFile = () => {
        if (this.avatarEditor) {
            // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
            // drawn on another canvas, or added to the DOM.
            const canvas = this.avatarEditor.getImage();
            // base-64 url string - will be used as preview
            const base64Url = canvas.toDataURL();
            // The atob() method decodes a base-64 encoded string.
            const blob = atob(base64Url.split(',')[ 1 ]);

            const blobArray = [];
            for (let i = 0; i < blob.length; i++) {
                blobArray.push(blob.charCodeAt(i));
            }
            const fileRaw = new Blob(
                [ new Uint8Array(blobArray) ],
                { type: '' },
            );
            const formToGetFile = new FormData();
            formToGetFile.set(
                'blobToFile',
                fileRaw,
                this.state.rawFile.name,
            );
            const file = formToGetFile.get('blobToFile');

            this.props.setValue(file);
            this.setState({ base64Url });
            this.handleSetRawFile(null);
        }
    };
    /**
     * Remove file
     */
    handleRemoveFile = () => {
        this.props.setValue(null);
        this.setState({ base64Url: null });
    };

    render() {
        const { handleFocus, handleSetRawFile, handleSaveFile, handleScale, handleError, handleRemoveFile } = this;
        const { isFocused, error, rawFile, base64Url, scale } = this.state;
        const {
            value,
            className,
            children,
            cropperProps = {},
            tip,
            name,
            onClick,
            isRemovable,
            dropZoneClassName,
            borderRadius,
        } = this.props;


        const { width = 165, widthToHeightRatio = 1, border } = cropperProps;
        const height = Math.floor(width / widthToHeightRatio);
        const borderFinal = border ? border : Math.floor(height / 10);
        let url;
        if (value instanceof Blob) { // If image not from server then it from canvas cropper
            url = base64Url;
        } else {
            url = (process.env.NODE_ENV !== 'development') ? value : (value && `${ STAGE_URL }${ value }`);
        }

        return (
            <Fragment>
                { rawFile &&
                <ModalComponent handleClose={ () => {handleSetRawFile(null);} }>
                    <div className={ styles.modalBox }>
                        <div
                            className={ styles.cropper }
                            style={ {
                                width: width + 2 * borderFinal,
                                height: height + 2 * borderFinal,
                            } }
                        >
                            <AvatarEditor
                                ref={ (avatarEditor) => this.avatarEditor = avatarEditor }
                                image={ rawFile }
                                border={ borderFinal }
                                width={ width }
                                height={ height }
                                color={ [
                                    116,
                                    179,
                                    206,
                                    0.65,
                                ] }
                                scale={ scale }
                                rotate={ 0 }
                                borderRadius={ borderRadius }
                            />
                        </div>
                        <div className={ styles.rangeInput }>
                            <RangeInputComponent
                                value={ scale }
                                setValue={ handleScale }
                                min={ 0.7 }
                                max={ 2.5 }
                                step={ 0.05 }
                            />
                        </div>
                        <div className={ styles.buttonBox }>
                            <ButtonComponent
                                dataTest={ TEST_IDS.SAVE_IMAGE }
                                onClick={ handleSaveFile }
                                btnType={ BUTTON_TYPE.ACCENT }
                                className={ styles.button }
                            >
                                save
                            </ButtonComponent>
                            <ButtonComponent
                                onClick={ () => {handleSetRawFile(null);} }
                                btnType={ BUTTON_TYPE.DEFAULT }
                                className={ styles.button }
                            >
                                cancel
                            </ButtonComponent>
                        </div>
                    </div>
                </ModalComponent> }
                <div className={ classNames(className) }>
                    <Dropzone
                        id={ name }
                        style={ {
                            backgroundImage: `url(${ url })`,
                        } }
                        className={ classNames(
                            dropZoneClassName,
                            styles.dropZone,
                            {
                                [ styles.dropZoneFocused ]: isFocused,
                                [ styles.dropZoneHideText ]: url,
                            },
                        ) }
                        activeClassName={ styles.dropZoneActive }
                        onDropAccepted={ (files) => {
                            handleSetRawFile(files[ 0 ]);
                        } }
                        onDropRejected={ () => {
                            handleError(`< ${ Math.floor(ImageDropZoneComponent.MAX_FILE_SIZE / 1000000) }MB`);
                        } }
                        onClickCapture={ onClick }
                        onFocus={ () => {handleFocus(true);} }
                        onBlur={ () => {handleFocus(false);} }
                        maxSize={ ImageDropZoneComponent.MAX_FILE_SIZE }
                        multiple={ false }
                    >
                        { tip && <div className={ styles.tip }>{ tip }</div> }
                        { children }
                    </Dropzone>
                    { isRemovable && url && <ButtonComponent
                        onClick={ handleRemoveFile }
                        className={ styles.remove }
                        type="button"
                        btnType={ BUTTON_TYPE.LINK_ACCENT }
                        size={ BUTTON_SIZE.SMALL }
                    >Remove</ButtonComponent> }
                </div>
                { error && <span className={ styles.error }>
                    { error }
                </span> }
            </Fragment>
        );
    }
}

ImageDropZoneComponent.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
    ]),
    setValue: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    tip: PropTypes.string,
    dropZoneClassName: PropTypes.string,
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    cropperProps: PropTypes.object,
    isRemovable: PropTypes.bool,
    borderRadius: PropTypes.number,
};

export default ImageDropZoneComponent;
