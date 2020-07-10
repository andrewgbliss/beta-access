import React, { useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { useAppStore } from 'stores/AppStore/Context';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import useSnackbar from 'hooks/useSnackbar';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ForgotPassword: React.FC = () => {
  const store: any = useAppStore();
  const [email, setEmail] = useState('');
  const handleBack = () => {
    store.setOpenLoginDialog(true);
    store.setOpenForgotPasswordDialog(false);
  };
  const handleClose = () => {
    store.setOpenForgotPasswordDialog(false);
  };
  const handleSubmit = useSnackbar(async () => {
    await store.sendForgotPasswordEmail(email);
  });
  return useObserver(() => {
    return (
      <Dialog
        open={store.openForgotPasswordDialog}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="forgot-password"
      >
        <DialogTitle id="forgot-password">Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address. We will send you an email so you
            can reset your password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBack} color="primary">
            Back to Login
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={!email}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  });
};

export default ForgotPassword;
