import * as React from 'react';
import { observer } from 'mobx-react';
import services from '../../services';
import stores from '../../stores';

function MVPFactory<Props, ParentProps>(
  View: (React.ComponentClass<Props & ParentProps> | React.SFC<Props & ParentProps>),
  Presenter: new (services: services.IServices, stores: stores.IAppStores) => Props & mvp.IPresenter
) {
  const ObserverView = observer(View); // make view mobx-observable otherwise render won't work properly

  class MVPComponent extends React.Component<ParentProps> {
    static navigationOptions = (View as any).navigationOptions || {};

    private presenter: Props & mvp.IPresenter;

    constructor(props: ParentProps) {
      super(props);
      this.presenter = new Presenter(services, stores);
    }

    render() {
      const { props: parentProps, presenter: props } = this;
      return <ObserverView {...parentProps} {...props} />;
    }

    componentWillUnmount() {
      this.presenter.deinit();
      this.presenter = null;
    }
  }

  return observer(MVPComponent);
}

export default MVPFactory;