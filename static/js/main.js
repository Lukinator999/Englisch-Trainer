// Funktion zum Entfernen aller Texte aus dem falschen Verzeichnis
window.onload = function() {
    let posts = document.getElementsByClassName('post');
    posts = Array.from(posts);
    let posts1 = posts.slice(0, Math.ceil(posts.length / 2));
    let posts2 = posts.slice(Math.ceil(posts.length / 2));
    deleteWrongPosts('new', posts1);
    deleteWrongPosts('read', posts2);
};
function deleteWrongPosts(sample, posts) {
    posts.forEach(function(post) {
        let element = document.getElementById(post.id);
        if (!element) return;
        let readAttribute = element.getAttribute('data-read');
        let read = (readAttribute === 'True');
        if ((sample === 'new' && read) || (sample === 'read' && !read)) {
            element.style.display = 'none';
        }
    });
}
// Funktion zum Schließen von allen Texten wenn ein neuer Tab geöffnet wird
function closeAllTexts() {
    let contents = document.getElementsByClassName("content");
    for (i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }
}
// Funktion zum Öffnen eines Tabs
function openTab(evt, tabName) {
    closeAllTexts();
    let i, tabContent, tabLinks;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabLinks = document.getElementsByClassName("tab");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    if (evt === "x") {
        tabContent[1].style.display = "block";
        tabLinks[1].className += " active";
    } 
    else if (evt === "v") {
        tabContent[2].style.display = "block";
        tabLinks[2].className += " active";
    } else {
        evt.currentTarget.className += " active";
        document.getElementById(tabName).style.display = "block";
    }
}
// Funktion zum Öffnen eines Textes
function openText(id) {
    let content = document.getElementById(id);
    content.style.display = "block";
    let tabContent = document.getElementsByClassName("tab-content");
    tabContent[1].style.display = "none";
    let textElement = content.querySelector('.english');
    let text = textElement.textContent.trim();
    let words = text.split(/\s+/);
    let spannedText = '';
    let counter = 0;
    words.forEach(word => {
        let span = document.createElement('span');
        span.textContent = word;
        span.id = counter;
        counter ++;
        spannedText += span.outerHTML + ' ';
    });
    textElement.innerHTML = spannedText;
}
// Funktion zum Schließen eines Textes
function closeText(id) {
    document.getElementById(id).style.display = "none";
    openTab("x","libary");
    location.reload();
}
// Funktion zum Öffnen des Bearbeiten-Fensters für einen Text
function editPost(event, english, german, id) {
    event.stopPropagation();
    document.getElementById('overlay1').style.display = 'block';
    document.getElementById('editPost').style.display = 'block';
    document.getElementById('edit_english_text').textContent = english;
    document.getElementById('edit_german_text').textContent = german;
    document.getElementById('idPost').value = id;
}
// Funktion zum Schließen des Bearbeiten-Fensters für einen Text
function close_editPost() {
    document.getElementById('editPost').style.display = 'none';
    document.getElementById('overlay1').style.display = 'none';
}
// Funktion zum Öffnen des Löschen-Fensters für einen Text
function delPost(event, id) {
    event.stopPropagation();
    document.getElementById('overlay2').style.display = 'block';
    document.getElementById('deletePost').style.display = 'block';
    document.getElementById('idePost').value = id;
}
// Funktion zum Schließen des Löschen-Fensters für einen Text
function close_deletePost() {
    document.getElementById('deletePost').style.display = 'none';
    document.getElementById('overlay2').style.display = 'none';
}
// Funktion zum Herausfindes des Cookies für das Senden an den Server
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// Funktion zum Makiern eines Textes als gelesen
function finishedPost(event, sample, idp) {
    event.stopPropagation();
    let csrftoken = getCookie('csrftoken');
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: 'sample=' + encodeURIComponent(sample) + '&idp=' + encodeURIComponent(idp) + '&is_finished_request=true'
    })
    .then(data => {
        location.reload();
    })
    .catch(error => {
        reject(error);
    })
}
// Funktion zum Übersetzen eines Wortes in Python
function translateToGerman(word) {
    return new Promise((resolve, reject) => {
        let csrftoken = getCookie('csrftoken');
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken
            },
            body: 'word=' + encodeURIComponent(word.replace(/[^\w\s\-]|_/g, "").replace(/^['"]|['"]$/g, '')) + '&is_translation_request=true'
        })
        .then(response => response.json())
        .then(data => {
            let translation = data.translation;
            resolve(translation);
        })
        .catch(error => {
            reject(error);
        })
    });
}
// Funktion zum Verarbeiten der Übersetzung
function translateWord(event) {
    let target = event.target; 
    if (target.tagName === 'SPAN') {
        let translationDisplay = target.parentElement.parentElement.querySelector('.translation');
        let addButton = target.parentElement.parentElement.querySelector('.saveVocabulary');
        let wordClicked = target.textContent.trim(' ');
        translateToGerman(wordClicked)
            .then(translation => {
                if (translation) {
                    translationDisplay.innerHTML = translation;
                    let targetRect = target.getBoundingClientRect();
                    let scrollTop = window.scrollY || document.documentElement.scrollTop;
                    translationDisplay.style.top = `${targetRect.top + scrollTop - 30}px`;
                    translationDisplay.style.left = `${targetRect.left}px`;
                    translationDisplay.style.display = 'block';
                    try {
                        if (document.getElementById(target.id-1).textContent.charAt(document.getElementById(target.id-1).textContent.length - 1) === ".") {
                            addButton.innerHTML = `Add "${translation}" / "${target.textContent.charAt(0).toLowerCase() + target.textContent.slice(1).replace(/[^\w\s\-]|_/g, "").replace(/^['"]|['"]$/g, '')}"`;
                        }
                        else {
                            addButton.innerHTML = `Add "${translation}" / "${target.textContent.replace(/[^\w\s\-]|_/g, "").replace(/^['"]|['"]$/g, '')}"`;
                        }
                    } catch (x){
                        addButton.innerHTML = `Add "${translation}" / "${target.textContent.replace(/[^\w\s\-]|_/g, "").replace(/^['"]|['"]$/g, '')}"`;
                    }
                    addButton.style.top = `${targetRect.top + scrollTop - 50}px`;
                    addButton.style.left = `${targetRect.left}px`;
                    addButton.style.display = 'block';
                } else {
                    addButton.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                translationDisplay.style.display = 'none';
                addButton.style.display = 'none';
            });
            if (!target.matches('.text *')) {
                translationDisplay.style.display = 'none';
                addButton.style.display = 'none';
            }
    }
}
// Funktion zum Speichern eines Wortes als Vokabel
function saveVocabulary(event) {
    let target = event.target; 
    let germanWord = target.innerHTML.split('"')[1].trim();
    let englishWord = target.innerHTML.split('"')[3].trim();
    let csrftoken = getCookie('csrftoken');
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: 'germanWord=' + encodeURIComponent(germanWord)
        + '&englishWord=' + encodeURIComponent(englishWord)
        + '&is_vocabulary_request=true'})
    .catch(error => {
        console.error('Error:', error);
    });
    target.style.display = 'none';
}
// Funktion zum Öffnen des Fensters zum Hinzufügen von eigenen Vokabeln
function ownVocab() {
    document.getElementById('overlay5').style.display = 'block';
    document.getElementById('newVocab').style.display = 'block';
}
// Funktion zum Schließen des Fensters zum Hinzufügen von eigenen Vokabeln
function close_ownVocab() {
    document.getElementById('newVocab').style.display = 'none';
    document.getElementById('overlay5').style.display = 'none';
    location.reload();
}
// Funktion zum Hinzufügen von eigenen Vokabeln
function submitVocab() {
    let englishInput = document.getElementById('english_word');
    let germanInput = document.getElementById('german_word');
    let csrftoken = getCookie('csrftoken');
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: 'english=' + encodeURIComponent(englishInput.value)
        + '&german=' + encodeURIComponent(germanInput.value)
        + '&is_new_vocab=true'})
    .then(data => {
        englishInput.value = '';
        germanInput.value = '';
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return false;
}
// Funktion zum Schließen des Lern-Fensters
function close_studyArea() {
    document.getElementById('studyArea').style.display = 'none'; 
}
// Funktion zum Laden von Vokabeln
let vocabList = [];
function loadVocab(vocabList) {
    try {
        let vocab = vocabList[Math.floor(Math.random() * vocabList.length)];
        document.getElementById('englishVocab').style.color = '#7f8fa6';
        document.getElementById('germanVocab').textContent = vocab[1];
        document.getElementById('englishVocab').textContent = vocab[0];
    } catch {
        close_studyArea();
    }     
}
// Funktion zum Abrufen von Vokabeln
let i;
function studyVocabulary() {
    i = 0;
    document.getElementById('studyArea').style.display = 'block';
    let csrftoken = getCookie('csrftoken');
    let englishVocab;
    let germanVocab;
    return new Promise((resolve, reject) => {
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken 
            },
            body: '&is_vocab_get=true'
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(vocab => {
                englishVocab = vocab[0];
                germanVocab = vocab[1];
                vocabList.push([englishVocab, germanVocab]);
            })
            loadVocab(vocabList);
            resolve();
        })
        .catch(error => {
            reject(error);
        })
    })
}
// Funktion bei richigem Vokabel
function correctVocab() {
    let english = document.getElementById('englishVocab').textContent;
    var index = vocabList.findIndex(function(element) {
        return element[0] === english;
    });
    if (index !== -1) {
        vocabList.splice(index, 1);
    }
    loadVocab(vocabList);
} 
// Funktion bei falschem Vokabel
function falseVocab() {
    loadVocab(vocabList);
}
// Funktion zum Umdrehen von Vokabeln
function turnVocab() {
    if (i % 2 === 0) {
        document.getElementById("flip-inner").style.transform = 'rotateY(180deg)';
        document.getElementById('englishVocab').style.color = 'white';
        i++;
    } else {
        document.getElementById("flip-inner").style.transform = 'rotateY(360deg)';
        i++;
    }
}
// Funktion zum Öffnen des Bearbeiten-Fensters für Vokabeln
function edit(english, german, id) {
    document.getElementById('overlay3').style.display = 'block';
    document.getElementById('edit').style.display = 'block';
    document.getElementById('edit_english_word').value = english;
    document.getElementById('edit_german_word').value = german;
    document.getElementById('id').value = id;
}
// Funktion zum Schließen des Bearbeiten-Fensters für Vokabeln
function close_edit() {
    document.getElementById('edit').style.display = 'none';
    document.getElementById('overlay3').style.display = 'none';
}
// Funktion zum Öffnen des Löschen-Fensters für Vokabeln
function del(id) {
    document.getElementById('overlay4').style.display = 'block';
    document.getElementById('delete').style.display = 'block';
    document.getElementById('ide').value = id;
}
// Funktion zum Schließen des Löschen-Fensters für Vokabeln
function close_delete() {
    document.getElementById('delete').style.display = 'none';
    document.getElementById('overlay4').style.display = 'none';
}