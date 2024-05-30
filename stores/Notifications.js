import { action, observable }          from 'mobx';
import { toast }                       from 'react-toastify';
// import Storage                         from '../api/Storage';
// import jwtDecode                       from 'jwt-decode';
// import { StorageKeys }                 from '../constants';

export class NotificationsStore {
    openSaves = [];
    @observable overlayVisible = false;

    constructor(store) {
        this.store = store;
    }

    notify = toast;

    startSaveNotification = (message = 'Please wait...') => {
        return message;
        // const notifyId = this.notify(message, {
        //     autoClose: false,
        //     position: toast.POSITION.TOP_CENTER
        // });
        // this.openSaves.push(notifyId);
        // return notifyId;
    };

    stopSaveNotification = (notifyId = undefined, message = 'Operation completed') => {
        return message + notifyId;
        // if (notifyId === undefined) {
        //     notifyId = this.openSaves.shift();
        // }
        //
        // toast.update(notifyId, {
        //     type: toast.TYPE.info,
        //     render: message,
        //     autoClose: 5000
        // });
    };

    @action
    startSaveNotificationOverlay() {
        this.startSaveNotification('Saving');
    }

    @action
    stopSaveNotificationOverlay() {
        this.stopSaveNotification();
    }
}
