// https://reactnavigation.org/docs/navigating-without-navigation-prop.html

import { NavigationActions } from 'react-navigation';

let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function navigate(routeName: string, params?: any) {
  _navigator.dispatch(
    (NavigationActions as any).navigate({
      type: NavigationActions.NAVIGATE,
      routeName,
      params,
    })
  );
}

function goBack() {
  _navigator.dispatch(
    (NavigationActions as any).back()
  );
}


export default {
  navigate,
  setTopLevelNavigator,
  goBack,
};