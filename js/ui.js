// ui.js

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

// nacte data, promaze <ul>, vytvori nove karty
function loadData() {
    // promaze obsah, aby nevznikly duplicity
    const cardContainer = document.querySelector('.cards ul');
    cardContainer.innerHTML = '';

    databaseData.forEach(card => {
        createNewCardByButton(card.title, card.content, card.dateCreated, card.cardId);
    });
}