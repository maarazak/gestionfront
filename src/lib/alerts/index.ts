export * from './sweetalert';

export const toast = {
  success: (message: string) => {
    const { showSuccessAlert } = require('./sweetalert');
    return showSuccessAlert(message);
  },
  error: (message: string) => {
    const { showErrorAlert } = require('./sweetalert');
    return showErrorAlert(message);
  },
  info: (message: string) => {
    const { showInfoAlert } = require('./sweetalert');
    return showInfoAlert(message);
  },
  warning: (message: string) => {
    const { showWarningAlert } = require('./sweetalert');
    return showWarningAlert(message);
  }
};
