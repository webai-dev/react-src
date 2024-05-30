import { AuthenticationStore } from './Authentication';
import { DevStore }            from './Dev';
import { NotificationsStore }  from './Notifications';

export class RootStore {
    auth = new AuthenticationStore(this);
    dev = new DevStore(this);
    notifications = new NotificationsStore(this);
}

const rootStore = new RootStore();

export default rootStore;
