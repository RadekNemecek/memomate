



// --------------------------------------------
//                  HLAVNI KOD
// --------------------------------------------

fetchData(); // Nacist data do globalni promenne databaseData

let databaseData = []; // Globalni promena pro ulozeni formatovanych dat z databaze

const editContainer = document.querySelector('.editWindow'); //najit rodice pro editacni okno


//---------------------------------------------
// -----------vytvoreni nove karty-------------
//---------------------------------------------

const cardContainer = document.querySelector('.cards ul'); // najit rodice pro <li> elementy
const openWindowBtn = document.getElementById('openMyOnTopWindow'); //okno pro novou card
const openWindowSidebarBtn = document.getElementById('sidebarNewCard'); //okno pro novou card ze sidebaru
const onTopWindow = document.getElementById('myOnTopWindow');
const submitTextBtn = document.getElementById('submitText');

let content = ''; //pozdeji bude obsahovat zadany text uzivatele
let title = '';  //pozdeji bude obsahovat zadany text uzivatele


// Otevrit okno pro novy card po kliknuti na button
openWindowBtn.onclick = function () {
    onTopWindow.style.display = 'block';

    document.getElementById('userTitle').focus(); //prenese kurzor do Title
}

// Otevrit okno pro novy card po kliknuti na button v sidebaru
openWindowSidebarBtn.onclick = function () {
    onTopWindow.style.display = 'block';

    closeSidebar();

    document.getElementById('userTitle').focus(); //prenese kurzor do Title
}

// Zavreni okna pri kliknuti mimo obsah
window.onclick = function (event) {
    if (event.target == onTopWindow) {
        onTopWindow.style.display = 'none';
    }
}

// zpracovani textu po stisknuti buttonu
submitTextBtn.onclick = function () {

    // ziskani textu z nadpisu (title)
    const userTitle = document.getElementById('userTitle').value;
    title = userTitle;

    // ziskani textu z textoveho pole (content)
    const userText = document.getElementById('userText').value;
    content = userText.replace(/\n/g, "<br>"); //zachova formatovani textu s enterem

    // kontrola, jestli je zadan nadpis, pokud ne, dopln text
    if (!title) {
        title = 'Poznámka'
    };

    document.getElementById("userTitle").value = ""; //promaze pole title
    document.getElementById("userText").value = ""; //promaze pole content
    onTopWindow.style.display = 'none'; //skryje onTopWindow

    sendDataToDatabase(title, content);
}


//------------------------------------------------------------
// -------------uprava css pomoci prepinace-------------------
//------------------------------------------------------------

const switcher = document.getElementById('themeSwitcher');

// Nacteni stavu z localStorage pri nacteni stranky
if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
    switcher.checked = true; // Nastaví přepínač jako zaškrtnutý
}

// Pridani event listeneru pro zmenu prepinace
switcher.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'enabled'); // Ulozi stav do localStorage
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', 'disabled'); // Ulozi stav do localStorage
    }
});

//------------zavreni sidebar pri kliknuti mimo sidebar-----------------
const sidebar = document.querySelector('.sidebar');
const nav = document.querySelector('nav');

document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !event.target.closest('nav')) {
        closeSidebar();
    }
})

//--------------------------------------------------------
//--------------register/login formular-------------------
//--------------------------------------------------------

const loginSidebar = document.querySelector('.login-sidebar');
const iconClose = document.querySelectorAll('.icon-close');
const cancelButton = document.querySelector('.cancel');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

// otevre login okno a zavre sidebar
loginSidebar.addEventListener('click', () => {
    document.querySelector('.wrapper.login-box').style.visibility = 'visible';
    closeSidebar();
});

// zavre loogin okno pri kliknuti na krizek
iconClose.forEach((icon) => {
    icon.addEventListener('click', () => {
        document.querySelector('.wrapper.login-box').style.visibility = 'hidden';
        document.querySelector('.wrapper.register-box').style.visibility = 'hidden';

        // promaze hodnoty v inputech
        document.querySelectorAll('.input-box input').forEach((input) => {
            input.value = '';
        });
    });
});

// zavre okno pro novou kartu pri kliknuti na zrusit
cancelButton.addEventListener('click', () => {
    document.querySelector('.onTopWindow').style.display = 'none'
    document.getElementById("userTitle").value = ""; //promaze pole title
    document.getElementById("userText").value = ""; //promaze pole content
});

// prepne login na register form pri kliknuti na "zazeregistrujte se"
registerLink.addEventListener('click', () => {
    document.querySelector('.wrapper.login-box').style.visibility = 'hidden';
    document.querySelector('.wrapper.register-box').style.visibility = 'visible';
});

// prepne register na login form pri kliknuti na "prihlaste se"
loginLink.addEventListener('click', () => {
    document.querySelector('.wrapper.login-box').style.visibility = 'visible';
    document.querySelector('.wrapper.register-box').style.visibility = 'hidden';
});

// validace registračního formulare a zavolani funkce na odeslani
const regForm = document.getElementById('registerForm');
regForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateRegForm(event)) {
        console.log('odeslání selhalo na validaci');

    }
    else {
        console.log('validace byla úspěšná');
        submitRegistration();
    }

})

// validace a odeslání login formulare
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateLoginForm(event)) {
        console.log('odeslání selhalo na validaci');
    }
    else {
        (submitLogin());
        console.log('validace byla úspěšná');
    }
})

// --------------------------------------------
//               Prostor pro testy
// --------------------------------------------













// --------------------------------------------
//        waiting to delete :)
// --------------------------------------------
