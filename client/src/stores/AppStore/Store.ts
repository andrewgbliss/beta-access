import Api from 'services/Api';
import { removeJwtToken, getJwtToken } from 'services/Jwt';
import 'mobx-react-lite/batchingForReactDom';

export function createStore() {
  return {
    user: null,
    openLoginDialog: false,
    openRegisterDialog: false,
    openForgotPasswordDialog: false,
    async load() {
      const token = getJwtToken();
      if (token) {
        const response = await Api.get('/api/v1/me');
        this.user = response;
      }
    },
    async login(email: string, password: string) {
      await Api.post('/api/v1/login', {
        email,
        password,
      });
      this.load();
    },
    async logout() {
      await Api.post('/api/v1/logout');
      removeJwtToken();
      this.user = null;
      window.location.href = '/';
    },
    async register(email: string, password: string) {
      const response = await Api.post('/api/v1/register', {
        email,
        password,
      });
      console.log(response);
    },
    async sendForgotPasswordEmail(email: string) {
      const response = await Api.post('/api/v1/forgot-password', { email });
      console.log(response);
    },
    setOpenLoginDialog(open: boolean) {
      this.openLoginDialog = open;
    },
    setOpenRegisterDialog(open: boolean) {
      this.openRegisterDialog = open;
    },
    setOpenForgotPasswordDialog(open: boolean) {
      this.openForgotPasswordDialog = open;
    },
  };
}
