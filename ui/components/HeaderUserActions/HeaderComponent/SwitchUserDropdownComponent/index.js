import React              from 'react';
import DropDownComponent  from '../../../../components/DropDownComponent';
import RequiresPermission from '../../../../components/User/RequiresPermission';
import TeamIcon           from '../../../../../assets/icons/TeamIcon';
import ButtonComponent, {
    BUTTON_TYPE,
    BUTTON_SIZE,
}                         from '../../../../components/ButtonComponent';
import {
    LoginManager,
    Storage,
}                         from '../../../../../api';
import { StorageKeys }    from '../../../../../constants';
import {
    inject,
    observer,
}                         from 'mobx-react';
import styles             from './styles.scss';

const SwitchUserDropdownComponent = inject('store')(
    observer((props) => {
        const { labelClassName, selectClassName } = props;
        const inputId = 'switchUserValue';

        const switchUser = (e) => {
            e.preventDefault();
            Storage.set(
                StorageKeys.switchUser,
                document.getElementById(inputId).value,
            );

            LoginManager.refreshUserToken()
                .then(() => {
                    location.reload();
                });
        };
        const switchUserBack = () => {
            Storage.remove(StorageKeys.switchUser);

            LoginManager.refreshUserToken()
                .then(() => {
                    location.reload();
                });
        };

        return (
            <RequiresPermission roles={ [ 'ROLE_SUPER_ADMIN' ] }>
                <DropDownComponent
                    notHideOnSelectClick
                    ariaLabel="switchUser"
                    labelClassName={ labelClassName }
                    label={
                        <TeamIcon />
                    }
                    selectClassName={ selectClassName }
                    select={ Storage.get(StorageKeys.switchUser) ?

                        <ButtonComponent
                            btnType={ BUTTON_TYPE.ACCENT }
                            size={ BUTTON_SIZE.SMALL }
                            className={ styles.buttonBack }
                            onClick={ switchUserBack }
                        >
                            Switch back
                        </ButtonComponent> :
                        <form
                            onSubmit={ switchUser }
                            className={ styles.form }
                        >
                            <label
                                htmlFor={ inputId }
                                className={ styles.label }
                            >Switch to</label>
                            <input
                                type="text"
                                id={ inputId }
                            />
                            <ButtonComponent
                                btnType={ BUTTON_TYPE.ACCENT }
                                size={ BUTTON_SIZE.SMALL }
                                type="submit"
                                className={ styles.button }
                            >
                                Switch
                            </ButtonComponent>
                        </form>
                    }

                />
            </RequiresPermission>
        );
    }),
);

export default SwitchUserDropdownComponent;
