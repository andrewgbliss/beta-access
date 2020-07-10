import { useSnackbar, OptionsObject } from 'notistack';

const defaultOptions = {
  variant: 'error',
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
} as OptionsObject;

const useSnackBar = (cb: Function) => {
  const snackbar = useSnackbar();
  return async () => {
    try {
      await cb(snackbar);
    } catch (e) {
      snackbar.enqueueSnackbar(e.message, defaultOptions);
    }
  };
};

export default useSnackBar;
