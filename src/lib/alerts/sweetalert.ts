import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const showSuccessAlert = (title: string) => {
  return Toast.fire({
    icon: "success",
    title: title
  });
};

export const showErrorAlert = (message: string) => {
  return Toast.fire({
    icon: "error",
    title: message
  });
};

export const showDeleteConfirmAlert = (title: string, text: string) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler"
  });
};

export const showInfoAlert = (title: string) => {
  return Toast.fire({
    icon: "info",
    title: title
  });
};

export const showWarningAlert = (title: string) => {
  return Toast.fire({
    icon: "warning",
    title: title
  });
};

export const showLoadingAlert = (title: string) => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const closeAlert = () => {
  Swal.close();
};


export const getErrorMessage = (error: any, defaultMessage: string = 'Une erreur est survenue'): string => {

  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  

  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const firstError = Object.values(errors)[0];
    return Array.isArray(firstError) ? firstError[0] : firstError as string;
  }
  

  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};
