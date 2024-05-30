import React                                         from 'react';
import PropTypes                                     from 'prop-types';
import { generatePath }                              from 'react-router-dom';
import { BaseAPiPath, PARAM_SLUG, ROUTES }           from '../../../constants';
import InfoIcon                                      from '../../../assets/icons/InfoIcon';
import TEST_IDS                                      from '../../../tests/testIds';
import AlertComponent                                from '../AlertComponent';
import ButtonComponent, { BUTTON_SIZE, BUTTON_TYPE } from '../ButtonComponent';
import CopyInputComponent                            from '../CopyInputComponent';
import styles                                        from './styles.scss';


const AlertReviewComponent = (props) => {
    const {
        slug
    } = props;
    const path = BaseAPiPath + generatePath(ROUTES.REVIEW_PENDING, { [ PARAM_SLUG ]: slug });
    return (
        <AlertComponent className={ styles.box }>
            <b><InfoIcon />Improve your rating!{ ' ' }</b>
            Invite your customers and candidates to leave a review by sending them this link:
            <b>
                <ButtonComponent
                    className={ styles.link }
                    size={ BUTTON_SIZE.SMALL }
                    btnType={ BUTTON_TYPE.LINK_ACCENT }
                    to={ path }
                    target="_blank"
                    rel="noopener noreferrer"
                    dataTest={ TEST_IDS.REVIEW_URL }
                >
                    { path }
                </ButtonComponent>
            </b>
            &nbsp;
            <CopyInputComponent
                copyElement={ path }
                hidden
            />
        </AlertComponent>
    );
};


AlertReviewComponent.propTypes = {
    slug: PropTypes.string.isRequired,
};

export default AlertReviewComponent;
