import React                            from 'react';
import logo                             from '../../../../images/logo-negative.svg';
import ButtonComponent, { BUTTON_TYPE } from '../../../components/ButtonComponent';
import HeaderUserActions                from '../../../components/HeaderUserActions';
import { ROUTES }                       from '../../../../constants';
import styles                           from './styles.scss';

const HeaderComponent = () => {
    return (
        <header className={ styles.header }>
            <div className={ styles.container }>
                <ButtonComponent
                    btnType={ BUTTON_TYPE.LINK }
                    to={ ROUTES.ROOT }
                    className={ styles.logoButton }
                >
                    <img
                        className={ styles.logo }
                        src={ logo }
                        alt="Sourcr logo"
                    />
                </ButtonComponent>
                <div className={ styles.actions }>
                    <HeaderUserActions />
                </div>
            </div>
        </header>
    );
};


export default HeaderComponent;
