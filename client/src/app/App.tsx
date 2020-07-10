import React, { useEffect } from 'react';
import Theme from 'theme/Theme';
import Router from 'routes/Router';
import { withProvider, useAppStore } from 'stores/AppStore/Context';
import { SnackbarProvider } from 'notistack';
import { useObserver } from 'mobx-react-lite';

const App = () => {
  const store: any = useAppStore();
  useEffect(() => {
    store.load();
  }, [store]);
  return useObserver(() => {
    return (
      <Theme>
        <SnackbarProvider maxSnack={1}>
          <Router />
        </SnackbarProvider>
      </Theme>
    );
  });
};

export default withProvider(App);
