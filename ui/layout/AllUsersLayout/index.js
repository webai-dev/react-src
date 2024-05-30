import React, { Component, Fragment } from 'react';
import PropTypes                      from 'prop-types';
import { Helmet }                     from 'react-helmet';
import HeaderComponent                from '../HeaderComponent';
import BodyComponent                  from './BodyComponent';
import { IDS, ROUTES }                from '../../../constants';
import ToastComponent                 from '../../components/ToastComponent';
import classNames                     from 'classnames';
import styles                         from './styles.scss';

class AllUsersLayout extends Component {
    render() {
        const { title, description, children } = this.props;
        const isHeaderHidden = this.props.match.path === ROUTES.CAMPAIGNS_RESPONSE ||
            this.props.match.path === ROUTES.CANDIDATE_REVIEW ||
            this.props.match.path === ROUTES.EMPLOYER_REVIEW ||
            this.props.match.path === ROUTES.REVIEW_PENDING;

        const backgroundElement = window.document.getElementById(IDS.BACKGROUND_IMAGE);
        if (backgroundElement) {
            backgroundElement.style.cssText = `background-color: ${ styles.backgroundColor }`;
        }

        return (
            <Fragment>
                <Helmet>
                    <body className={ classNames(styles.layout) } />
                    { title && <title>{ title }</title> }
                    { description && <meta
                        name="Description"
                        content={ description }
                    /> }
                </Helmet>
                { !isHeaderHidden && <HeaderComponent /> }
                <ToastComponent className={ styles.toastifyContainer } />
                <BodyComponent isHeaderHidden={ isHeaderHidden }>
                    { children }
                </BodyComponent>
            </Fragment>
        );
    }
}

AllUsersLayout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    match: PropTypes.object.isRequired,
};

export default AllUsersLayout;
