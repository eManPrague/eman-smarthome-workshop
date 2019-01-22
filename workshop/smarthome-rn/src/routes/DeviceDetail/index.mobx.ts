import MVPFactory from '../../mvp/mobx';
import Presenter from './DeviceDetail.presenter.mobx';
import View from './DeviceDetail';

export default MVPFactory<components.IDeviceDetailProps, null>(View, Presenter);