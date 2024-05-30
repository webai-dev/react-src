import React, { PureComponent }         from 'react';
import logo                             from '../../../images/logo-negative.svg';
import QuickSearchContainer             from '../../components/QuickSearchContainer';
import ButtonComponent, { BUTTON_TYPE } from '../../components/ButtonComponent';
import { KEYS, ROUTES }                 from '../../../constants';
import SearchIcon                       from '../../../assets/icons/SearchIcon';
import classNames                       from 'classnames';
import styles                           from './styles.scss';

class HeaderComponent extends PureComponent {
    state = {
        isMenuOpen: false,
    };

    /**
     * Open or close mobile menu
     */
    handleOpenMenu = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    };

    /**
     * Handle form submit on enter
     *
     * @param event
     */
    handleCloseMenuOnEsc = (event) => {
        if (event.key === KEYS.ESC) {
            this.setState({ isMenuOpen: false });
        }
    };

    componentDidMount() {
        document.addEventListener(
            'keydown',
            this.handleCloseMenuOnEsc,
            false,
        );
    }

    componentWillUnmount() {
        document.removeEventListener(
            'keydown',
            this.handleCloseMenuOnEsc,
            false,
        );
    }

    render() {
        const { isMenuOpen } = this.state;
        const { handleOpenMenu } = this;
        return (
            <header className={ styles.header }>
                <div className={ styles.headerBox }>
                    <ButtonComponent
                        className={ styles.logoButton }
                        btnType={ BUTTON_TYPE.LINK }
                        to={ ROUTES.EXTERNAL }
                    >
                        <img
                            className={ styles.logo }
                            src={ logo }
                            alt="Sourcr logo"
                        />
                    </ButtonComponent>
                    <ButtonComponent
                        btnType={ BUTTON_TYPE.ICON }
                        className={ classNames(styles.toggleMenu, { [ styles.toggleMenuActive ]: isMenuOpen }) }
                        onClick={ handleOpenMenu }
                        ariaLabel="Toggle menu"
                    >
                        <span className={ styles.hamburger } />
                    </ButtonComponent>
                    { false && <QuickSearchContainer /> }
                    <nav className={ classNames(styles.linkBox, { [ styles.linkBoxActive ]: isMenuOpen }) }>
                        <ButtonComponent
                            className={ styles.headerLink }
                            ariaLabel="go to search page"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/"
                        >
                            <SearchIcon /> Find a recruiter
                        </ButtonComponent>
                        <ButtonComponent
                            className={ styles.headerLink }
                            ariaLabel="go to market place"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/for-recruiters/"
                        >
                            For Recruiters
                        </ButtonComponent>
                        <ButtonComponent
                            className={ styles.headerLink }
                            ariaLabel="go to market place"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/pricing/"
                        >
                            Pricing
                        </ButtonComponent>
                        <ButtonComponent
                            className={ classNames(styles.headerLink, styles.headerLinkHideDesktop) }
                            ariaLabel="go to market place"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/about-us/"
                        >
                            About us
                        </ButtonComponent>
                        <ButtonComponent
                            className={ classNames(styles.headerLink, styles.headerLinkHideDesktop) }
                            ariaLabel="go to market place"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/blog/"
                        >
                            Blog
                        </ButtonComponent>
                        <ButtonComponent
                            className={ classNames(styles.headerLink, styles.headerLinkHideDesktop) }
                            ariaLabel="go to market place"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/resources/"
                        >
                            Resources
                        </ButtonComponent>
                        <ButtonComponent
                            className={ styles.headerLink }
                            ariaLabel="go to market place"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/faq/"
                        >
                            FAQ
                        </ButtonComponent>
                        <ButtonComponent
                            className={ classNames(styles.headerLink, styles.headerLinkHideDesktop) }
                            ariaLabel="go to market place"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/terms-and-conditions/"
                        >
                            Terms and Conditions
                        </ButtonComponent>
                        <ButtonComponent
                            className={ classNames(styles.headerLink, styles.headerLinkHideDesktop) }
                            ariaLabel="go to market place"
                            btnType={ BUTTON_TYPE.LINK }
                            to="https://sourcr.com/privacy-policy/"
                        >
                            Privacy Policy
                        </ButtonComponent>
                        <ButtonComponent
                            className={ styles.signIn }
                            btnType={ BUTTON_TYPE.ACCENT }
                            to={ ROUTES.ROOT }
                        >
                            Login / Sign up
                        </ButtonComponent>
                    </nav>
                </div>
            </header>
        );
    }
}

export default HeaderComponent;
