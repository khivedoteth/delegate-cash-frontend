const Snackbar = require('node-snackbar');

export function displayMessage(message) {
    Snackbar.show({text: message, pos: 'top-center', backgroundColor : '#00ff721f',actionTextColor: '#28c76f', duration: 6000});
}

export function displayErrorMessage(message) {
    Snackbar.show({text: message, pos: 'top-center', backgroundColor : '#f910111f', actionTextColor: '#ea5455', duration: 6000});
}
