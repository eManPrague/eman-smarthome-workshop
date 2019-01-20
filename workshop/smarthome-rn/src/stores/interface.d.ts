declare module stores {
  interface IApp {
    // /**
    //  * Currently active device within the app.
    //  * 
    //  * @type {models.IDevice}
    //  * @memberof IApp
    //  */
    // readonly activeDevice: models.IDevice;
    /**
     * Display system dialog.
     * 
     * @param {string} content 
     * @param {string} [title] 
     * @param {Function} [onPress] 
     * @memberof IApp
     */
    showDialog(content: string, title?: string, onPress?: Function): void;
        /**
     * Display system dialog.
     * 
     * @param {string} content 
     * @param {string} [title] 
     * @param {string} [positive] 
     * @param {string} [negative] 
     * @param {Function} [onPositive] 
     * @param {Function} [onNegative] 
     * @memberof IApp
     */
    showDialogAdvanced(content: string, title?: string, positive?: string, negative?: string, onPositive?: Function, onNegative?: Function): void;
  }

  interface IAppStores {
    app: IApp,
  }
}