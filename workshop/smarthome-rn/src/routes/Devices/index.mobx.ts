import MVPFactory from '../../mvp/mobx';
import Presenter from './Devices.presenter.mobx';
import View from './Devices';

export default MVPFactory<components.IDevicesProps, null>(View, Presenter);