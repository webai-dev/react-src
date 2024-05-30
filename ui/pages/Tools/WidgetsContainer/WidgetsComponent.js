import React                    from 'react';
import PropTypes                from 'prop-types';
import RequiresPermission       from '../../../components/User/RequiresPermission';
import WidgetConfigureComponent from './WidgetConfigureComponent';
import { WIDGET_TYPE }          from '../../../../constants';

const WidgetsComponent = (props) => {
    const { slug, hasReviews, isFreelancer } = props;

    return (
        <div>
            <WidgetConfigureComponent
                slug={ slug }
                isFreelancer={ isFreelancer }
                hasReviews={ hasReviews }
                type={ WIDGET_TYPE.SINGLE }
            />
            <RequiresPermission roles={ [ 'individual_subscription' ] }>
                <WidgetConfigureComponent
                    slug={ slug }
                    isFreelancer={ isFreelancer }
                    hasReviews={ hasReviews }
                    type={ WIDGET_TYPE.DOUBLE }
                />
                <WidgetConfigureComponent
                    slug={ slug }
                    isFreelancer={ isFreelancer }
                    hasReviews={ hasReviews }
                    type={ WIDGET_TYPE.ASIDE }
                />
                <WidgetConfigureComponent
                    slug={ slug }
                    isFreelancer={ isFreelancer }
                    hasReviews={ hasReviews }
                    type={ WIDGET_TYPE.FOOTER }
                />
            </RequiresPermission>
        </div>
    );
};

WidgetsComponent.propTypes = {
    slug: PropTypes.string.isRequired,
    hasReviews: PropTypes.bool,
    isFreelancer: PropTypes.bool,
};

export default WidgetsComponent;
