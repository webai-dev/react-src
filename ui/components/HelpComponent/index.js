import React        from 'react';
import PropTypes    from 'prop-types';
import QuestionIcon from '../../../assets/icons/QuestionIcon';
import classNames   from 'classnames';
import styles       from './styles.scss';

const HelpComponent = (props) => {
    const { children, className, text, helpClassName, bottom, right, center } = props;
    return (
        <div
            className={ classNames(className, styles.box, {
                [ styles.boxBottom ]: bottom,
                [ styles.boxRight ]: right,
                [ styles.boxCenter ]: center,
                [ styles.boxWithIcon ]: !children,
            }) }
            tabIndex="0"
        >
            { children && children }
            { !children && <div className={ styles.iconBox }>
                <QuestionIcon />
            </div> }
            <div className={ classNames(styles.helpText, helpClassName) }>
                { text }
            </div>
        </div>
    );
};

HelpComponent.propTypes = {
    children: PropTypes.node,
    text: PropTypes.node.isRequired,
    className: PropTypes.string,
    helpClassName: PropTypes.string,
    bottom: PropTypes.bool,
    right: PropTypes.bool,
    center: PropTypes.bool,
};

export default HelpComponent;
