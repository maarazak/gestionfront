import Swal from 'sweetalert2';

const defaultConfig = {
  customClass: {
    popup: 'rounded-2xl shadow-2xl',
    title: 'text-2xl font-bold',
    htmlContainer: 'text-gray-600',
    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg',
    cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 ml-3',
    denyButton: 'bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ml-3',
  },
  buttonsStyling: false,
  showClass: {
    popup: 'animate__animated animate__fadeInDown animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutUp animate__faster'
  }
};

export const showSuccessAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'OK',
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showErrorAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
};

export const showWarningAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
};

export const showInfoAlert = (title: string, message?: string) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
};

export const showConfirmAlert = (
  title: string, 
  message?: string,
  confirmText: string = 'Confirmer',
  cancelText: string = 'Annuler'
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

export const showDeleteConfirmAlert = (
  title: string = 'Êtes-vous sûr ?',
  message: string = 'Cette action est irréversible !'
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    customClass: {
      ...defaultConfig.customClass,
      confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg',
    }
  });
};

export const showLoadingAlert = (title: string = 'Chargement...') => {
  return Swal.fire({
    ...defaultConfig,
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const closeAlert = () => {
  Swal.close();
};

export const showToast = (
  icon: 'success' | 'error' | 'warning' | 'info',
  title: string
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: 'rounded-xl shadow-lg',
    }
  });

  return Toast.fire({
    icon,
    title
  });
};

export const showValidationErrorAlert = (errors: Record<string, string[]>) => {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `<strong>${field}:</strong> ${messages.join(', ')}`)
    .join('<br>');

  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title: 'Erreur de validation',
    html: errorMessages,
    confirmButtonText: 'OK',
  });
};
