import React, {
    Fragment,
} from 'react';
import DropDownComponent                             from '../../../../components/DropDownComponent';
import SettingsIcon                                  from '../../../../../assets/icons/SettingsIcon';
import ButtonComponent, { BUTTON_TYPE, BUTTON_SIZE } from '../../../../components/ButtonComponent';
import {
    inject,
    observer,
} from 'mobx-react';

const DevDropdownComponent = inject('store')(
    observer((props) => {
        const { store, labelClassName, selectClassName } = props;
        return (
            <DropDownComponent
                ariaLabel="dev"
                labelClassName={ labelClassName }
                label={
                    <SettingsIcon/>
                }
                selectClassName={ selectClassName }
                select={ <Fragment>
                    { store.dev.features.map(item => (
                        <ButtonComponent
                            btnType={ store.dev.isFeatureEnabled(item) ? BUTTON_TYPE.ACCENT : BUTTON_TYPE.WHITE }
                            size={ BUTTON_SIZE.SMALL }
                            onClick={ () => store.dev.toggleFeature(item) }
                            key={ item }
                        >
                            { item }
                        </ButtonComponent>
                    )) }
                </Fragment> }

            />
        );
    }),
);

export default DevDropdownComponent;
