import React                          from 'react';
import PropTypes                      from 'prop-types';
import getMonthYearDateFromDateString from '../../../util/getMonthYearDateFromDateString';
import CheckBoxComponent              from '../CheckBoxComponent';
import StatusComponent                from '../StatusComponent';
import ToggleComponent                from '../Form/ToggleComponent';
import AvatarComponent                from '../AvatarComponent';
import VideoComponent                 from '../VideoComponent';
import RatingComponent                from '../Form/RatingComponent';
import classNames                     from 'classnames';
import styles                         from './styles.scss';

export const STATUS = {
    NOT_ACTIVE: 'notActive',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    HIGHLIGHT: 'highlight',
};

const RowItemComponent = (props) => {
    const {
        onCheckBoxClick,
        avatarUrl,
        header,
        infoText,
        accentText,
        date,
        linksBox,
        status,
        statusText,
        actions,
        id,
        selected,
        jobType,
        messageType,
        rating,
        ratingType,
        videoUrl,
        smallActions,
        classNameStart,
        classNameMiddle,
        classNameEnd,
        alt,
        isNoAvatar,
        isSmall,
        onToggleClick,
        toggled,
        statusTextDataTest,
        label,
        reviewCount,
        checkBoxId,
        className,
    } = props;
    return (
        <div
            id={ id }
            className={ classNames(styles.box, className, {
                [ styles.boxSmallActions ]: smallActions,
                [ styles.boxSmall ]: isSmall
            }) }
        >
            { label &&
            <div className={ styles.labelBox }>
                <div className={ styles.label }>
                    { label }
                </div>
            </div> }
            { onCheckBoxClick &&
            <div className={ styles.checkBox }>
                <CheckBoxComponent
                    className={ styles.check }
                    onChange={ onCheckBoxClick }
                    name={ checkBoxId }
                    isInnerApp
                    value={ selected }
                />
            </div> }
            { onToggleClick &&
            <div className={ styles.toggleBox }>
                <ToggleComponent
                    onChange={ onToggleClick }
                    name={ id }
                    value={ toggled }
                    label="Reminder"
                    column
                />
            </div> }
            <div className={ styles.body }>
                <div className={ classNames(styles.main, classNameStart) }>
                    { videoUrl &&
                    <div className={ styles.video }>
                        <VideoComponent url={ videoUrl } />
                    </div> }
                    { !isNoAvatar && !videoUrl && <AvatarComponent
                        url={ avatarUrl }
                        jobType={ jobType }
                        messageType={ messageType }
                        className={ styles.avatar }
                        alt={ alt }
                    />
                    }
                    <div className={ styles.info }>
                        <h3 className={ styles.title }>
                            { header }
                        </h3>
                        { infoText && <span className={ styles.infoText }>
                        { infoText }
                        </span> }
                        { accentText && <span className={ styles.accentText }>
                            { accentText }
                        </span> }

                        { Number.isFinite(rating) && isSmall &&
                        <span className={ styles.rating }>
                            <RatingComponent
                                rating={ rating }
                                small
                                fixed
                            />
                        </span> }
                    </div>
                </div>
                { (date || rating || status || statusText || linksBox) &&
                <div className={ classNames(styles.supp, classNameMiddle) }>
                    { date &&
                    <span className={ styles.date }>
                        { getMonthYearDateFromDateString(date) }
                    </span> }
                    { Number.isFinite(rating) && !isSmall &&
                    <div className={ styles.ratingBox }>
                        { (!!reviewCount || ratingType) &&
                        <span className={ styles.overall }>{ ratingType || 'Overall' }</span> }
                        <RatingComponent
                            className={ styles.rating }
                            rating={ rating }
                            small
                            fixed
                        />
                        { !!reviewCount && <span>
                            { rating } Rating ({ reviewCount } { reviewCount === 1 ? 'review' : 'reviews' })
                        </span> }
                    </div> }
                    { linksBox }
                    <div
                        className={ styles.statusBox }
                        data-test={ statusTextDataTest }
                    >
                        { status && <StatusComponent status={ status } /> }
                        { statusText }
                    </div>
                </div> }
                { actions &&
                <div className={ classNames(styles.actions, classNameEnd) }>
                    { actions }
                </div> }
            </div>
        </div>
    );
};

RowItemComponent.propTypes = {
    onCheckBoxClick: PropTypes.func,
    onToggleClick: PropTypes.func,
    id: PropTypes.string,
    checkBoxId: PropTypes.string,
    label: PropTypes.string,
    selected: PropTypes.bool,
    toggled: PropTypes.bool,
    isNoAvatar: PropTypes.bool,
    isSmall: PropTypes.bool,
    jobType: PropTypes.bool,
    messageType: PropTypes.bool,
    avatarUrl: PropTypes.string,
    videoUrl: PropTypes.string,
    ratingType: PropTypes.string,
    header: PropTypes.node.isRequired,
    infoText: PropTypes.node,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    accentText: PropTypes.node,
    linksBox: PropTypes.node,
    date: PropTypes.string,
    status: PropTypes.string,
    statusText: PropTypes.node,
    actions: PropTypes.object,
    smallActions: PropTypes.bool,
    classNameStart: PropTypes.string,
    classNameMiddle: PropTypes.string,
    classNameEnd: PropTypes.string,
    alt: PropTypes.string,
    statusTextDataTest: PropTypes.string,
    className: PropTypes.string,
};

export default RowItemComponent;
