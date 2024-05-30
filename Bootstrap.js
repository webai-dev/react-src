import * as Yup        from 'yup';
import { StorageKeys } from './constants';

function equalTo(ref, msg) {
    return Yup.mixed().test({
        name: 'equalTo',
        exclusive: false,
        message: msg || '${path} must be the same as ${reference}',
        params: {
            reference: ref.path,
        },
        test: function(value) {
            return value === this.resolve(ref);
        },
    });
}

const checkStorage = () => {
    let buildHash;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        buildHash = 'develop';
    } else {
        buildHash = process.env.BUILD_HASH;
    }
    if (!buildHash) {
        return;
    }

    try {
        const version = window.localStorage.getItem('sourcr:version');
        if (version !== buildHash) {
            Object.values(StorageKeys).forEach(it => {
                localStorage.removeItem(it);
            });
        }
        window.localStorage.setItem('sourcr:version', buildHash);
    } catch (e) {
        return e;
    }
};
export const Bootstrap = () => {
    Yup.addMethod(Yup.string, 'equalTo', equalTo);
    checkStorage();
};

export default Bootstrap;
