import React           from 'react';
import PropTypes       from 'prop-types';
import { withRouter }  from 'react-router-dom';
import WidgetContainer from '../../components/WidgetContainer';
import getQueryParams  from '../../../util/getQueryParams';

const WidgetView = (props) => {
    const { location } = props;
    const { theme, slug, type, ids, isFreelancer } = getQueryParams(location.search);
    return (
        <WidgetContainer
            theme={ theme }
            slug={ slug }
            type={ type }
            ids={ ids }
            isFreelancer={ isFreelancer === 'true' }
        />
    );
};

WidgetView.propTypes = {
    location: PropTypes.object.isRequired,
};

export default withRouter(WidgetView);
