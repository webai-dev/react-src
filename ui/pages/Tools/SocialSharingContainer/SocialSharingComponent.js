import React                        from 'react';
import PropTypes                    from 'prop-types';
import { BUTTON_SIZE }              from '../../../components/ButtonComponent';
import FormsyComponent              from '../../../components/formsy/FormsyComponent';
import FormsyImageDropZoneComponent from '../../../components/formsy/FormsyImageDropZoneComponent';
import FormsySubmitComponent        from '../../../components/formsy/FormsySubmitComponent';
import FormsyColorInputComponent    from '../../../components/formsy/FormsyColorInputComponent';
import FormsySelectComponent        from '../../../components/formsy/FormsySelectComponent';
import ShareReviewImageComponent    from '../../../components/ShareReviewImageComponent';
import LockMarkerComponent          from '../../../components/RequiresBillingContainer/LockMarkerComponent';
import classNames                   from 'classnames';
import styles                       from './styles.scss';

const SocialSharingComponent = (props) => {
    const {
        handleSave,
        isLoading,
        errors,
        handleSaveForm,
        form,
        recruiter,
        reviewTemplate,
    } = props;
    const formId = 'updateEmployerTemplate';
    return (
        <div className={ styles.box }>
            <div
                className={ styles.column }
            >
                <h2>Linkedin Share Template</h2>
                <ShareReviewImageComponent
                    rating={ 4.5 }
                    review={
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aspernatur assumenda at, ' +
                        'consequuntur dignissimos dolor facilis impedit labore magni maxime molestiae nostrum odit ' +
                        'porro quas quasi qui rem totam voluptatum?'
                    }
                    overAllRating={ recruiter.rating.overallRating }
                    reviewsCount={ recruiter.rating.reviewsCount }
                    postedBy={ 'Harry, Smith' }
                    backgroundImage={ form.backgroundImage === null ? null :
                        form.backgroundImage || reviewTemplate.backgroundImage?.url
                    }
                    backgroundColor={ form.backgroundColor || reviewTemplate.backgroundColor || recruiter.backgroundColor }
                    color={ form.textColor || reviewTemplate.textColor }
                    textAlign={ form.textAlign || reviewTemplate.textAlign }
                />
            </div>
            <FormsyComponent
                className={ styles.column }
                formId={ formId }
                onValidSubmit={ handleSave }
                errorMessage={ errors }
                onChange={ handleSaveForm }
            >
                <h2>Configuration</h2>
                <b>
                    Background settings
                </b>
                <div className={ classNames(styles.inputsBox, styles.marginBottom, styles.backgroundBox) }>
                    <FormsyImageDropZoneComponent
                        value={ reviewTemplate.backgroundImage?.url }
                        className={ classNames(styles.backgroundImage, styles.input) }
                        dropZoneClassName={ classNames(styles.dropZone) }
                        name="backgroundImage"
                        cropperProps={ {
                            width: +styles.backgroundImageWidth,
                            widthToHeightRatio: +styles.backgroundImageWidthToHeightRatio,
                            border: +styles.cropperBorder,
                        } }
                        tip="700 x 580px recommended"
                        isRemovable
                    >
                        <span><LockMarkerComponent /> Upload background image</span>
                    </FormsyImageDropZoneComponent>
                    <FormsyColorInputComponent
                        className={ styles.input }
                        value={ reviewTemplate.backgroundColor || recruiter.backgroundColor || '#999999' }
                        name="backgroundColor"
                        label="Select a Background colour"

                    />
                </div>
                <b>
                    Review text settings
                </b>
                <div className={ styles.inputsBox }>
                    <FormsySelectComponent
                        className={ styles.input }
                        value={ reviewTemplate.textAlign || 'left' }
                        name="textAlign"
                        values={ [
                            {
                                key: 'left',
                                label: 'Left Aligned',
                            },
                            {
                                key: 'center',
                                label: 'Center Aligned',
                            },
                            {
                                key: 'right',
                                label: 'Right Aligned',
                            },
                        ] }
                        required
                    />
                    <FormsyColorInputComponent
                        className={ styles.input }
                        value={ reviewTemplate.textColor || '#FFFFFF' }
                        name="textColor"
                        label="Select a text colour"
                        required
                    />
                </div>

                <div className={ classNames(styles.itemsBox, styles.submitButtons) }>
                    <FormsySubmitComponent
                        main
                        size={ BUTTON_SIZE.BIG }
                        disabled={ isLoading }
                        formId={ formId }
                    >
                        Save template
                    </FormsySubmitComponent>
                </div>
            </FormsyComponent>
        </div>
    );
};

SocialSharingComponent.propTypes = {
    handleReset: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleSaveForm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    errors: PropTypes.string,
    form: PropTypes.object.isRequired,
    recruiter: PropTypes.object.isRequired,
    reviewTemplate: PropTypes.object.isRequired,
};

export default SocialSharingComponent;
