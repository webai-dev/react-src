import React     from 'react';
import logo      from '../../../../images/logo-negative.svg';
import ButtonComponent, {
    BUTTON_TYPE,
} from '../../../components/ButtonComponent';
import { ROUTES }            from '../../../../constants';
import FooterButtonComponent from './FooterButtonComponent';
import styles                from './styles.scss';

const FooterComponent = () => {
    return (
        <footer className={ styles.footer }>
            <div className={ styles.box }>
                <ButtonComponent btnType={ BUTTON_TYPE.LINK } to={ ROUTES.ROOT }>
                    <img className={ styles.logo } src={ logo } alt="Sourcr logo" />
                </ButtonComponent>
                <div className={ styles.links }>
                    <FooterButtonComponent to={ 'https://www.sourcr.com/resources' }>
                        Help Centre
                    </FooterButtonComponent>
                    <FooterButtonComponent to={ 'https://www.sourcr.com/terms-and-conditions' }>
                        Terms &amp; Conditions
                    </FooterButtonComponent>
                    <FooterButtonComponent to={ 'https://www.sourcr.com/privacy-policy' }>
                        Privacy Policy
                    </FooterButtonComponent>
                </div>
                <span className={ styles.copyRight }>© 2019-2020</span>
            </div>
        </footer>
    );
};

export default FooterComponent;
