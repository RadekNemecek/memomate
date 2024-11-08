// api.js


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

// odeslani login formulare
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
    
    