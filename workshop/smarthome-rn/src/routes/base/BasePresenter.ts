abstract class BaseMobXPresenter implements mvp.IPresenter {
  private disposers: Function[] = [];

  constructor(protected services: services.IServices, protected stores: stores.IAppStores) {
    this.init = this.init.bind(this);
    this.init();
  }

  protected addDisposer(disposer: Function) {
    this.disposers.push(disposer);
  }

  // mvp.IPresenter implementation

  protected init() {}

  public deinit() {
    if (this.disposers.length) {
      this.disposers.forEach(d => d());
      this.disposers.length = 0;
    }
  }
}

export default BaseMobXPresenter;