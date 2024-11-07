
// vytvoreni nove karty a pripnuti na stranku
function createNewCardByButton(title, content, dateCreated, cardId) {

    // vytvorit novy HTML element (li)
    let newCard = document.createElement('li');
    newCard.id = `card-${cardId}`;


    //vytvor obsah do karty
    newCard.innerHTML = `
    <header class="controls">
    <div class="cont-left">
    ${dateCreated}
    </div>
    <div class="cont-center">
    
    </div>
    <div class="cont-right">
    <button onclick= "editCard(${cardId})" class="edit" id="${cardId}" title="Editovat"></button>
    <button class="done" title="Dokončeno"></button>
    </div>
    </header>                                                   
        <h3>${title}</h3>
        <p>
            ${content}
        </p>
    `;

    // Přidání události kliknutí na tlačítko "Done" pro aktualizaci hodnoty v databázi
    newCard.querySelector('.done').addEventListener('click', () => updateIsCompleted(cardId));

    // vlozit novy element do rodice
    cardContainer.appendChild(newCard);
}

//odeslani dat do databaze
function sendDataToDatabase(title, content, dateCreated) {

    fetch("sendToDatabase.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title, content: content })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Data byla úspěšně odeslána:", data);
            fetchData();
        })

        .catch(error => console.error("Chyba:", error));
}

// nacteni dat z databaze a zavolani loadData()
function fetchData() {
    return fetch('./fetchFromDatabase.php')
        .then(response => response.json())
        .then(cards => {
            databaseData = cards.map(item => {
                const date = new Date(item.date_created);
                const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

                return {
                    cardId: item.id,
                    title: item.title,
                    content: item.content,
                    dateCreated: formattedDate
                };
            });
            console.log("Data načtena:", databaseData);
            loadData();
        })
        .catch(error => console.error("Chyba při načítání dat:", error));
}

// nacte data, promaze <ul>, vytvori nove karty
function loadData() {
    // promaze obsah, aby nevznikly duplicity
    const cardContainer = document.querySelector('.cards ul');
    cardContainer.innerHTML = '';

    databaseData.forEach(card => {
        createNewCardByButton(card.title, card.content, card.dateCreated, card.cardId);
    });
}

// oznaci poznamku jako splnenou
function updateIsCompleted(cardId) {
    console.log("Odesílám data:", { id: cardId, is_completed: 1 }); //po debugu smazat
    fetch("updateIsCompleted.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cardId, is_completed: 1 })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Karta byla úspěšně označena jako dokončená v databázi.");
                fetchData();
            } else {
                console.error("Chyba při aktualizaci:", data.error);
            }
        })
        .catch(error => console.error("Chyba:", error));
}

// editace poznamky
function editCard(cardId) {
    //vytvoreni elementu
    let editWindow = document.createElement('div');
    editWindow.className = 'animate__animated animate__fadeIn';

    //najdi kartu s odpovidajicim ID
    const card = databaseData.find(item => item.cardId === String(cardId));

    //ukonceni funkce, pokud karta nenalezena
    if (!card) {
        console.log(`Karta s id ${cardId} nebyla nalezena.`);
        return;
    }

    // Formatovani obsahu karty, aby se nahradily <br> znaky novym radkem
    const formattedContent = card.content.replace(/<br\s*\/?>/gi, '\n');

    //naplneni elementu vcetne puvodniho textu
    editWindow.innerHTML = `
            <h3>Editace poznámky id: ${cardId}</h3>
            <input type="text" id="editTitle" value="${card.title}" />
            <textarea id="editContent">${formattedContent}</textarea>
            <div class="button-group">
                <button class="cancel">Zrušit</button>
                <button class="updateCard">Aktualizovat</button>
            </div>
    `

    // pridani elementu na stranku
    editContainer.appendChild(editWindow);

    //Cancel - zavreni a odebrani okna z DOM
    const cancelButton = editWindow.querySelector('.cancel');
    cancelButton.addEventListener('click', () => {
        editContainer.removeChild(editWindow);
    });


    // Funkce pro uložení změn
    function saveChanges() {
        const updatedTitle = document.getElementById('editTitle').value;
        const updatedContent = document.getElementById('editContent').value;

        // Převod nových řádků na <br>
        const formattedContent = updatedContent.replace(/\n/g, '<br>');

        fetch('editCard.php', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cardId, title: updatedTitle, content: formattedContent })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Zavrit okno a aktualizovat karty na strance
                    editContainer.removeChild(editWindow);
                    fetchData();
                } else {
                    console.error("Chyba při aktualizaci:", data.error);
                }
            })
            .catch(error => console.error("Chyba:", error));
    }

    // Přidání event listeneru pro tlačítko Aktualizovat
    const updateButton = editWindow.querySelector('.updateCard');
    updateButton.addEventListener('click', saveChanges);
}

// zobrazi menu
function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
}

// skryje menu
function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}

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

// odeslani registracniho formulare
function submitRegistration() {
    const email = document.querySelector('.reg-email').value.trim();
    const password = document.querySelector('.reg-pass').value.trim();

    const emailInput = document.querySelector('.reg-email');
    const passwordInput = document.querySelector('.reg-pass');

    const infoBox = document.querySelector('.wrapper.info-box');
    const registerBox = document.querySelector('.wrapper.register-box');
    const infoBoxButton = document.querySelector('.btn.info-btn');
    const infoText = document.querySelector('.info-text');
    const emojiImage = document.querySelector('.form-box.info img');

    let tipInfo = '';

    infoText.textContent = tipInfo;


    fetch('register.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
    })
        .then(response => response.json())
        .then(data => {
            tipInfo = 'registrace byla úspěšná';
            infoText.textContent = tipInfo;
            emojiImage.src = './img/loveemoji.png'
            infoBox.style.background = 'darkseagreen';
            infoBox.style.visibility = 'visible';

            infoBoxButton.onclick = function () {
                infoBox.style.visibility = 'hidden';
                registerBox.style.visibility = 'hidden';
                emailInput.value = '';
                passwordInput.value = '';
            };
        })

        .catch(error => console.error('chyba:', error));
}

// --------------------------------------------
//                  HLAVNI KOD
// --------------------------------------------

let databaseData = []; // Globalni promena pro ulozeni formatovanych dat z databaze

fetchData(); // Nacist data do globalni promenne databaseData

// -----------vytvoreni nove karty-------------
// najit rodice, do ktereho budu pridavat HTML
const cardContainer = document.querySelector('.cards ul');

// Ziskani prvku z HTML
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

// ------------vytvoreni okna pro editaci---------------------
//najit rodice pro editacni okno
const editContainer = document.querySelector('.editWindow');

// -------------uprava css pomoci prepinace-------------------
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

//-------------------register/login formular-------------------
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



// --------------------------------------------
//               Prostor pro testy
// --------------------------------------------




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

function submitLogin() {

    const email = document.querySelector('.login-email').value.trim();
    const password = document.querySelector('.login-pass').value.trim();

    fetch('login.php', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(response => response.json()) // Převedení odpovědi na JSON

        .then(data => {
            if (data.success) {
                // Úspěšné přihlášení
                console.log(data.message); // Můžeš zde provést přesměrování nebo jinou akci
                // Např. přesměrování na domovskou stránku
                // window.location.href = 'homepage.php';
            } else {
                // Zobrazení chybové zprávy
                console.error(data.message);
                // Můžeš zobrazit chybu uživateli, například v alertu
                alert(data.message);
            }
        })
        .catch(error => console.error('chyba:', error));

}





// --------------------------------------------
//        waiting to delete :)
// --------------------------------------------


/*  const emailInput = document.querySelector('.login-email');
    const passwordInput = document.querySelector('.login-pass');
    const infoBox = document.querySelector('.wrapper.info-box');
    const loginBox = document.querySelector('.wrapper.login-box');
    const infoBoxButton = document.querySelector('.btn.info-btn');
    const infoText = document.querySelector('.info-text');
    const emojiImage = document.querySelector('.form-box.info img');

    let tipInfo = '';

    infoText.textContent = tipInfo; */

/* tipInfo = 'přihlášení bylo úspěšné';
       infoText.textContent = tipInfo;
       emojiImage.src = './img/loveemoji.png'
       infoBox.style.background = 'darkseagreen';
       infoBox.style.visibility = 'visible';

       infoBoxButton.onclick = function () {
           infoBox.style.visibility = 'hidden';
           loginBox.style.visibility = 'hidden';
           emailInput.value = '';
           passwordInput.value = '';
       }; */





/* // zavola funkci submitRegistration pri potvrzeni formulare
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', function(event){
    if (!validateRegForm(event)) {
        event.preventDefault(); // Zabráníme odeslání formuláře
    }

    else {
        // Pokud je validace úspěšná, zavolejte submitRegistration
        submitRegistration(event);
    }
}); */



/* function submitRegistration(event) {
    // event.preventDefault();

    // hodnoty z formuláře
    const email = document.querySelector('.reg-email').value;
    const password = document.querySelector('.reg-pass').value;

    // vytvoreni objektu pro odeslani
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);

    fetch('./register.php',{
        method: 'POST',
        body: data
    })

    .then(response => response.json())
    .then(data => {
        // tady pridat popup o stavu napr
        alert(data.message);
    })

    .catch(error => {
        console.error("Chyba:", error);
    });


} */



// vytvoreni nove karty
/* function createNewCard(){
    // vyptej si nadpis a text
    let title = String(prompt('Zadej nadpis'));
    let content = String(prompt('Zadej text'));

    // kontrola, jestli je zadan nadpis, pokud ne, dopln text
    if (!title){
       title = 'Poznámka'
    };

    // vytvorit novy HTML element (li)
    let newCard = document.createElement('li');

    //vytvor obsah do karty
    newCard.innerHTML = `
    <header class="controls">
        <div class="cont-left">
            18.10.2024
        </div>
        <div class="cont-center">

        </div>
        <div class="cont-right">
            <button class="done"></button>
        </div>
    </header>
        <h3>${title}</h3>
        <p>
            ${content}
        </p>
    `;

    // vlozit novy element do rodice
    cardContainer.appendChild(newCard);

} */



// barevne zvyrezneni textu dle validace
/* const emailInput = document.querySelector('.reg-email');

emailInput.addEventListener('input', function () {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regulární výraz pro email
    if (emailPattern.test(emailInput.value)) {
      //  emailInput.classList.add('valid'); // Přidá třídu 'valid' pro zelenou barvu
        emailInput.style.color = 'green'; // Změní barvu textu na zelenou
    }
    else {
      //  emailInput.classList.remove('valid'); // Odstraní třídu 'valid'
        emailInput.style.color = 'rgb(155, 0, 0)'; // Změní barvu textu na červenou, pokud je email neplatný
    }
}); */

