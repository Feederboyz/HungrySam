const toast = document.getElementById('authErrorToast');

if (toast) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)
    window.addEventListener('DOMContentLoaded', (event) => {
        toastBootstrap.show();
    });
}