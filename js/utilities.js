// utilities.js

// validace registracniho formulare
function validateRegForm(event) {

    const email = document.querySelector('.reg-email').value;
    const password = document.querySelector('.reg-pass').value;
    const terms = document.querySelector('.reg-check');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const infoBox = document.querySelector('.wrapper.info-box');
    const registerBox = document.querySelector('.wrapper.register-box');
    const infoBoxButton = document.querySelector('.btn.info-btn');
    const infoText = document.querySelector('.info-text');

    let tipInfo = '';

    infoText.textContent = tipInfo;

    infoBoxButton.addEventListener('click', function () {
        registerBox.style.visibility = 'visible';
        infoBox.style.visibility = 'hidden';
        document.querySelector('.reg-email').focus();
    })

    if (email === '' || !emailPattern.test(email)) {
        tipInfo = 'Zkontrolujte emailovou adresu';
        infoText.textContent = tipInfo;
        infoBox.style.visibility = 'visible';
        registerBox.style.visibility = 'hidden';
        infoBoxButton.focus();

        return false;
    }

    if (password === '' || password.length < 6 || password.length > 20) {
        tipInfo = 'Heslo musí mít 6 až 20 znaků';
        infoText.textContent = tipInfo;
        infoBox.style.visibility = 'visible';
        registerBox.style.visibility = 'hidden';
        infoBoxButton.focus();

        return false;
    }

    if (!terms.checked) {
        tipInfo = 'Musíte souhlasit s podmínkami';
        infoText.textContent = tipInfo;
        infoBox.style.visibility = 'visible';
        registerBox.style.visibility = 'hidden';
        infoBoxButton.focus();

        return false;
    }

    return true;

}

// validace login formulare
function validateLoginForm(event) {

    const email = document.querySelector('.login-email').value;
    const password = document.querySelector('.login-pass').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const loginBox = document.querySelector('.wrapper.login-box');
    const infoBox = document.querySelector('.wrapper.info-box');
    const infoBoxButton = document.querySelector('.btn.info-btn');
    const infoText = document.querySelector('.info-text');

    let tipInfo = '';

    infoText.textContent = tipInfo;

    infoBoxButton.addEventListener('click', function () {
        loginBox.style.visibility = 'visible';
        infoBox.style.visibility = 'hidden';
        document.querySelector('.login-email').focus();
    })

    if (email === '' || !emailPattern.test(email)) {
        console.log('zkontroluj email');
        tipInfo = 'Zkontrolujte emailovou adresu';
        infoText.textContent = tipInfo;
        infoBox.style.visibility = 'visible';
        loginBox.style.visibility = 'hidden';
        infoBoxButton.focus();

        return false;
    }

    if (password === '' || password.length < 6 || password.length > 20) {
        tipInfo = 'Heslo musí mít 6 až 20 znaků';
        infoText.textContent = tipInfo;
        infoBox.style.visibility = 'visible';
        loginBox.style.visibility = 'hidden';
        infoBoxButton.focus();

        return false;
    }

    return true;
}