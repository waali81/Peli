let pelaajaLkm = 0; // Pelaajien määrä
let nimet = []; // Pelaajien nimet
let pisteet = []; // Kokonaispisteet
let vuoroPisteet = 0; // Vuoropisteet
let nykyinenPelaaja = 0; // Vuorossa oleva pelaaja
const pisteetVoittoon = 100; // Voittoon tarvittavat pisteet
let tuplatperakkain = 0; // Peräkkäisten tuplien laskuri

// --- Haetaan elementit ---
const pelaajaMaaraBox = document.getElementById("p-maara");
const pelaajaNimet = document.getElementById("nimet");
const nimiLomake = document.getElementById("nimiForm");
const peliOsio = document.getElementById("peli");
const clickAani = document.getElementById("click-sound");
const aloitaPeliNappi = document.getElementById("startGame");
const noppa1 = document.getElementById("dice1");
const noppa2 = document.getElementById("dice2");
const teksti = document.getElementById("viesti");
const heitaNappi = document.getElementById("heita-nappi");
const talletaNappi = document.getElementById("pida-nappi");
const vasenPuoli = document.getElementById("vasen-puoli");
const oikeaPuoli = document.getElementById("oikea-puoli");
const pelaajakortit = document.querySelectorAll(".pelaajakortti");
const voittoAani = document.getElementById("voitto-sound");
const uusiPeliNappi = document.getElementById("uusi-peli");
const taustaMusa = document.getElementById("taustamusa");
const noppaAani = document.getElementById("noppa-sound");
const talteenAani = document.getElementById("talletus-sound");
const infoNappi = document.getElementById("info-nappi");
const ikkuna = document.getElementById("saannot");
const suljeIkkuna = document.getElementById("sulje-ikkuna");
const etusivuNappi = document.querySelector(".koti-nappi");

// --- Pelaajien määrän valinta ---
pelaajakortit.forEach(card => {
    card.addEventListener("click", () => {
        clickViive(() => {
            // Poistetaan aiemmat valinnat ja korostetaan valittu
            pelaajakortit.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            // Tallennetaan määrä
            pelaajaLkm = parseInt(card.dataset.num);

            // Siirrytään nimien syöttövaiheeseen
            pelaajaMaaraBox.classList.add("piilo");
            pelaajaNimet.classList.remove("piilo");

            // Luodaan pelaajakohtaiset nimi-inputit
            nimiLomake.innerHTML = "";
            for (let i = 0; i < pelaajaLkm; i++) {
                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = `Pelaaja ${i + 1} nimi`;
                input.id = `name-${i}`;
                input.required = true;
                nimiLomake.appendChild(input);
                nimiLomake.appendChild(document.createElement("br"));
            }
        });
    });
});

// Syötetään nimet ja aloitetaan peli
aloitaPeliNappi.addEventListener("click", () => {
    clickViive(() => {
        // Nimet arrayhin
        nimet = [];
        for (let i = 0; i < pelaajaLkm; i++) {
            const name = document.getElementById(`name-${i}`).value.trim();
            nimet.push(name || `Pelaaja ${i + 1}`); // Oletusnimi, jos ei annettu
        }
        // Siirrytään pelinäkymään
        pelaajaNimet.classList.add("piilo");
        peliOsio.classList.remove("piilo");

        // Käynnistetään taustamusiikki
        taustaMusa.play().catch((error) => {
            console.log("Musiikkia ei voitu toistaa automaattisesti:", error);
        });
        aloitaPeli();
    });
});

// --- Peli alkaa ---
function aloitaPeli() {
    // Nollataan pisteet ja laskuri
    pisteet = new Array(pelaajaLkm).fill(0);
    vuoroPisteet = 0;
    nykyinenPelaaja = 0;
    tuplatperakkain = 0;

    // Tyhjennetään vanhat pelaajaelementit
    vasenPuoli.innerHTML = "";
    oikeaPuoli.innerHTML = "";

    // Luodaan pelaajataulukot
    for (let i = 0; i < pelaajaLkm; i++) {
        const pelaajakortti = document.createElement("div");
        pelaajakortti.classList.add("player");
        if (i === 0) pelaajakortti.classList.add("active");
        pelaajakortti.id = `player-${i}`;

        // Pelaajan nimi
        const nimiElem = document.createElement("h3");
        nimiElem.textContent = nimet[i];
        pelaajakortti.appendChild(nimiElem);

        // Pelaajan pistemäärä
        const pisteElem = document.createElement("p");
        pisteElem.innerHTML = `Pisteet: <span id="score-${i}">0</span>`;
        pelaajakortti.appendChild(pisteElem);

        // Asetetaan pelaajakortit vuorotellen vasemmalle ja oikealle
        if (i % 2 === 0) {
            vasenPuoli.appendChild(pelaajakortti);
        } else {
            oikeaPuoli.appendChild(pelaajakortti);
        }
    }

    // Napit käyttöön
    heitaNappi.disabled = false;
    talletaNappi.disabled = false;

    // Aloitusteksti
    teksti.textContent = `Aloitetaan! Ensimmäisenä heittää ${nimet[0]}.`;
}

// --- Vuoron vaihto ---
function vuoronVaihto() {
    document.getElementById(`player-${nykyinenPelaaja}`).classList.remove("active");
    nykyinenPelaaja = (nykyinenPelaaja + 1) % pelaajaLkm;
    document.getElementById(`player-${nykyinenPelaaja}`).classList.add("active");
    vuoroPisteet = 0;
    tuplatperakkain = 0; // Nollataan tuplat, kun vuoro vaihtuu
    teksti.textContent = `Nyt on pelaajan ${nimet[nykyinenPelaaja]} vuoro.`;
}

// Funktio palauttaa noppasymbolin
function noppaEmoji(value) {
    const symbolit = ["⚀","⚁","⚂","⚃","⚄","⚅"];
    return symbolit[value - 1];
}

// --- Kahden nopan heitto ---
heitaNappi.addEventListener("click", () => {
    noppaAani.currentTime = 0; // Aloita alusta
    noppaAani.play().catch((error) => {
        console.log("Noppaääntä ei voitu toistaa:", error);
    });
    // Estetään napit (heiton ajaksi)
    heitaNappi.disabled = true;
    talletaNappi.disabled = true;

    // Noppien animaatiot
    noppa1.classList.add("rolling");
    noppa2.classList.add("rolling");

    // Animaatio: nopat vaihtavat kuvioita
    const animation = setInterval(() => {
        const temp1 = Math.floor(Math.random() * 6) + 1;
        const temp2 = Math.floor(Math.random() * 6) + 1;
        noppa1.textContent = noppaEmoji(temp1);
        noppa2.textContent = noppaEmoji(temp2);
    }, 100);

    // Pysäytetään animaatio ja silmälukujen arvonta
    setTimeout(() => {
        clearInterval(animation);
        noppa1.classList.remove("rolling");
        noppa2.classList.remove("rolling");

        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;

        noppa1.textContent = noppaEmoji(roll1);
        noppa2.textContent = noppaEmoji(roll2);
        
        // --- Heittotapaukset ---
        if (roll1 === 1 && roll2 === 1) {
            // Kaksi ykköstä
            tuplatperakkain++;
            vuoroPisteet += 25;
            teksti.textContent = `${nimet[nykyinenPelaaja]} heitti kaksi ykköstä ja sai 25 pistettä! Vuoropisteet nyt: ${vuoroPisteet}.`;

            // 3 tuplaa peräkkäin
            if (tuplatperakkain === 3) {
                teksti.textContent = `${nimet[nykyinenPelaaja]} heitti kolmet tuplat peräkkäin! Vuoro päättyy ilman pisteitä.`;
                vuoronVaihto();
            }
        } 
        else if (roll1 === 1 || roll2 === 1) {
            // Vain yksi ykkönen
            teksti.textContent = `${nimet[nykyinenPelaaja]} heitti ykkösen! Vuoro päättyy ilman pisteitä.`;
            vuoronVaihto();
        } 
        else if (roll1 === roll2) {
            // Muut tuplat
            tuplatperakkain++;
            if (tuplatperakkain === 3) {
                teksti.textContent = `${nimet[nykyinenPelaaja]} heitti kolmet tuplat peräkkäin! Vuoro päättyy ilman pisteitä.`;
                vuoronVaihto();
            } else {
                const gained = (roll1 + roll2) * 2;
                vuoroPisteet += gained;
                teksti.textContent = `${nimet[nykyinenPelaaja]} heitti tuplat ja sai ${gained} pistettä! Vuoropisteet nyt: ${vuoroPisteet}.`;
            }
        } 
        else {
            // Tavallinen heitto
            vuoroPisteet += roll1 + roll2;
            tuplatperakkain = 0;
            teksti.textContent = `${nimet[nykyinenPelaaja]} sai ${roll1 + roll2} pistettä. Vuoropisteet nyt: ${vuoroPisteet}.`;
        }

        // Napit takaisin käyttöön
        heitaNappi.disabled = false;
        talletaNappi.disabled = false;
    }, 1000);
});

// --- Pisteiden tallentaminen ---
talletaNappi.addEventListener("click", () => {
    talteenAani.currentTime = 0; // Soitetaan ääni alusta
    talteenAani.play().catch((error) => {
        console.log("Talletusääntä ei voitu toistaa:", error);
    });
    // Lisätään vuoropisteet kokonaispisteisiin
    pisteet[nykyinenPelaaja] += vuoroPisteet;
    document.getElementById(`score-${nykyinenPelaaja}`).textContent = pisteet[nykyinenPelaaja];

    // Voiton tarkistus
    if (pisteet[nykyinenPelaaja] >= pisteetVoittoon) {
        voittoAani.currentTime = 0;
        voittoAani.play().catch((error) => {
            console.log("Voittomusiikkia ei voitu toistaa:", error);
    });
        teksti.textContent = `🎉 ${nimet[nykyinenPelaaja]} voitti pelin!`;
        heitaNappi.disabled = true;
        talletaNappi.disabled = true;
        uusiPeliNappiNakyy(); // Näytetään "Uusi peli" -nappi
    } else {
        // Vuoron vaihto
        teksti.textContent = `${nimet[nykyinenPelaaja]} pankitti pisteet. Vuoro siirtyy.`;
        vuoronVaihto();
    }
});

// --- Kun peli loppuu, näytetään nappi uuden pelin aloittamiseen ---
function uusiPeliNappiNakyy() {
    uusiPeliNappi.classList.remove("piilo");
}

uusiPeliNappi.addEventListener("click", () => {
    clickViive(() => {
        // Piilotetaan nappi ja viestit
        uusiPeliNappi.classList.add("piilo");
        teksti.textContent = "";

        // Nollataan pisteet ja vuorot
        pisteet = new Array(pelaajaLkm).fill(0);
        vuoroPisteet = 0;
        nykyinenPelaaja = 0;
        tuplatperakkain = 0;

        // Päivitetään pelinäkymä ja aloitetaan peli
        aloitaPeli();
        peliOsio.classList.remove("piilo"); // varmistaa, että pelinäkymä näkyy
    });
});

// Clickääni
function soitaClickAani() {
    clickAani.currentTime = 0;
    clickAani.play().catch(err => console.log("Klikkiääntä ei voitu toistaa:", err));
}

// --- Viive click-äänelle ---
function clickViive(action) {
    soitaClickAani();
    setTimeout(action, 450); // 450 ms viive
}

// --- Paluu etusivulle ---
if (etusivuNappi) {
    etusivuNappi.addEventListener("click", (event) => {
        event.preventDefault();
        clickViive(() => {
            window.location.href = etusivuNappi.getAttribute("href");
        });
    });
}

// --- Näytetään info-ikkuna painikkeella ---
infoNappi.addEventListener("click", () => {
    clickViive (() => {
        ikkuna.classList.add("nakyvissa");
    });
});

// --- Suljetaan info-ikkuna ruksista ---
suljeIkkuna.addEventListener("click", () => {
    clickViive (() => {
        ikkuna.classList.remove("nakyvissa");
    });
});
