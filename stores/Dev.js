import { action, observable, autorun } from 'mobx';
import Storage                         from '../api/Storage';
import { StorageKeys }                 from '../constants';

export class DevStore {
    features = observable.array(['highlight-permissions', 'ignore-permissions']);
    featuresEnabled = observable.array([]);
    _actualUser = observable.box(undefined);

    constructor(store) {
        this.store = store;

        const storageActiveFeatures = Storage.get(StorageKeys.devFeatures);
        if (storageActiveFeatures) {
            this.featuresEnabled = Array.from(storageActiveFeatures);
        }

        autorun(() => {
            Storage.set(StorageKeys.devFeatures, this.featuresEnabled);
        });
    }

    isFeatureEnabled = name => this.featuresEnabled.indexOf(name) >= 0;

    @action
    toggleFeature(feature) {
        if (this.isFeatureEnabled(feature)) {
            this.featuresEnabled.splice(this.featuresEnabled.indexOf(feature), 1);
        } else {
            this.featuresEnabled.push(feature);
        }
    }
}
