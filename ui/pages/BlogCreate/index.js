import React, { Fragment }          from 'react';
import PropTypes                    from 'prop-types';
import HeaderRowComponent           from '../../components/HeaderRowComponent';
import HeaderRowButtonComponent     from '../../components/HeaderRowButtonComponent';
import ActionsRowComponent          from '../../components/ActionsRowComponent';
import FormsySubmitComponent        from '../../components/formsy/FormsySubmitComponent';
import FormsyComponent              from '../../components/formsy/FormsyComponent';
import FormsyInputComponent         from '../../components/formsy/FormsyInputComponent';
import FormsyImageDropZoneComponent from '../../components/formsy/FormsyImageDropZoneComponent';
import FormsyTextAreaComponent      from '../../components/formsy/FormsyTextAreaComponent';
import RadioComponent               from '../../components/RadioComponent';
import { ROUTES }                   from '../../../constants';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
} from '../../components/ButtonComponent';
import styles from './styles.scss';

const BlogView = (props) => {
    const { errors, handleSubmit = () => {} } = props;
    const formId = 'asdfefa';
    const isLoading = false;
    return (
        <Fragment>
            <HeaderRowComponent
                tabs={
                    <Fragment>
                        <HeaderRowButtonComponent url={ ROUTES.BLOG_NEW } label="Create Content" isActive />
                    </Fragment>
                }
            />
            <ActionsRowComponent
                itemActions={
                    <Fragment>
                        <ButtonComponent btnType={ BUTTON_TYPE.LINK } size={ BUTTON_SIZE.BIG }>
                            Cancel
                        </ButtonComponent>
                    </Fragment>
                }
                pageActions={
                    <Fragment>
                        <ButtonComponent btnType={ BUTTON_TYPE.LINK } size={ BUTTON_SIZE.BIG } className={ styles.saveDraft }>
                            Save as draft
                        </ButtonComponent>
                        <FormsySubmitComponent
                            formId={ formId }
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.BIG }
                            main
                            disabled={ isLoading }
                        >
                            Publish
                        </FormsySubmitComponent>
                    </Fragment>
                }
            />
            <FormsyComponent
                onValidSubmit={ handleSubmit }
                formId={ formId }
                className={ styles.form }
                errors={ errors }
            >
                <FormsyInputComponent
                    placeholder="Enter content title"
                    name="title"
                    big
                />
                <div className={ styles.formMain }>
                    <div className={ styles.formImage }>
                        <FormsyImageDropZoneComponent
                            className={ styles.backgroundImage }
                            name="background"
                        >
                            Upload thumbnail image
                        </FormsyImageDropZoneComponent>
                        <div className={ styles.backgroundImageLabel }>
                            Thumbnail image (PNG, JPG OR GIF)
                        </div>
                    </div>
                    <div className={ styles.formBody }>
                        <div className={ styles.toggleBox }>
                            <RadioComponent
                                name="blogType"
                                label="Article"
                                value={ true }
                                onChange={ () => {} }
                                big
                            />
                            <RadioComponent
                                name="blogType"
                                label="Link"
                                value={ false }
                                onChange={ () => {} }
                                big
                            />
                            <RadioComponent
                                name="blogType"
                                label="Video"
                                value={ false }
                                onChange={ () => {} }
                                big
                            />
                        </div>
                        <div>
                            Body
                        </div>
                        <FormsyTextAreaComponent
                            name="body"
                        />
                    </div>
                </div>
            </FormsyComponent>
        </Fragment>
    );
};

BlogView.propTypes = {
    errors: PropTypes.object,
    handleSubmit: PropTypes.func,
};

export default BlogView;
