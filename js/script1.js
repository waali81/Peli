let pelaajaLkm = 0; // Pelaajien määrä
let nimet = []; // Pelaajien nimet
let pisteet = []; // Kokonaispisteet
let vuoroPisteet = 0; // Vuoropisteet
let nykyinenPelaaja = 0; // Vuorossa oleva pelaaja
const pisteetVoittoon = 100; // Voittoon tarvittavat pisteet

// --- Haetaan  DOM-elementit ---
const pelaajaMaaraBox = document.getElementById("p-maara");
const pelaajaNimet = document.getElementById("nimet");
const nimiLomake = document.getElementById("nimiForm");
const peliOsio = document.getElementById("peli");
const clickAani = document.getElementById("click-sound");
const aloitaPeliNappi = document.getElementById("startGame");
const noppa = document.getElementById("noppa");
const teksti = document.getElementById("viesti");
const heitaNappi = document.getElementById("heita-nappi");
const talletaNappi = document.getElementById("pida-nappi");
const vasenPuoli = document.getElementById("vasen-puoli");
const oikeaPuoli = document.getElementById("oikea-puoli");
const pelaajakortit = document.querySelectorAll(".pelaajakortti");
const voittoAani = document.getElementById("voitto-sound");
const uusiPeliNappi = document.getElementById("uusi-peli");
const taustaMusa = document.getElementById("tausta-musa");
const noppaAani = document.getElementById("noppa-sound");
const talteenAani = document.getElementById("talletus-sound");
const infoNappi = document.getElementById("info-nappi");
const ikkuna = document.getElementById("saannot");
const suljeIkkuna = document.getElementById("sulje-ikkuna");
const etusivuNappi = document.querySelector(".header-nappi");


// Pelaajien määrän valinta
pelaajakortit.forEach(card => {
    card.addEventListener("click", () => {
        clickViive(() => {
            // Poistetaan aiemmat valinnat ja korostetaan valittu
            pelaajakortit.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            // Tallennetaan pelaajamäärä data-num:sta
            pelaajaLkm = parseInt(card.dataset.num);

            // Siirrytään nimien syöttövaiheeseen
            pelaajaMaaraBox.classList.add("piilo"); // Piilotetaan pelaajamäärä valinta
            pelaajaNimet.classList.remove("piilo"); // Näytetään nimen syöttö

            // Tyhjennetään lomake ja luodaan pelaajille nimi-inputit
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
            nimet.push(name || `Pelaaja ${i + 1}`); // Annetaan oletusnimi, mikäli nimeä ei ole annettu
        }
        // Siirrytään nimistä pelinäkymään
        pelaajaNimet.classList.add("piilo");
        peliOsio.classList.remove("piilo");

        // Käynnistetään taustamusiikki
        taustaMusa.play().catch((error) => {
            console.log("Musiikkia ei voitu toistaa automaattisesti:", error);
        });

        aloitaPeli(); // Käyynistetään peli
    });
});

// --- Peli alkaa ---
function aloitaPeli() {
    // Nollataan pisteet
    pisteet = new Array(pelaajaLkm).fill(0);
    vuoroPisteet = 0;
    nykyinenPelaaja = 0;

     // Tyhjennetään pelaajataulukot
    vasenPuoli.innerHTML = "";
    oikeaPuoli.innerHTML = "";

    // Luodaan pelaajakortit
    for (let i = 0; i < pelaajaLkm; i++) {
        const pelaajakortti = document.createElement("div");
        pelaajakortti.classList.add("player");
        if (i === 0) pelaajakortti.classList.add("active"); // Ensimmäinen pelaaja aloittaa
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

    // Napit käytössä
    heitaNappi.disabled = false;
    talletaNappi.disabled = false;

    // Aloitusteksti
    teksti.textContent = `Aloitetaan! Ensimmäisenä heittää ${nimet[0]}.`;    
}

// --- Vuoron vaihto ---
function vuoronVaihto() {
    document.getElementById(`player-${nykyinenPelaaja}`).classList.remove("active"); // Poistetaan korostus nykyiseltä pelaajalta
    nykyinenPelaaja = (nykyinenPelaaja + 1) % pelaajaLkm; // Siirrytään seuraavaan pelaajaan
    document.getElementById(`player-${nykyinenPelaaja}`).classList.add("active"); // Korostetaan seuraava pelaaja
    vuoroPisteet = 0; // Nollataan vuoropisteet
    teksti.textContent = `Nyt on pelaajan ${nimet[nykyinenPelaaja]} vuoro.`; // Päivitetään teksti
}

// --- Nopan heitto ---
function noppaEmoji(value) {
    const symbolit = ["⚀","⚁","⚂","⚃","⚄","⚅"];
    return symbolit[value - 1];
}

heitaNappi.addEventListener("click", () => {
    noppaAani.currentTime = 0; // Soitetaan ääni alusta
    noppaAani.play().catch((error) => {
        console.log("Noppaääntä ei voitu toistaa:", error);
    });
    // Estetään napit (heiton ajaksi)
    heitaNappi.disabled = true;
    talletaNappi.disabled = true;
    // Nopan animaatio, silmäluvut vaihtuu nopeasti ja noppa "värisee"
    noppa.classList.add("rolling");

    // Animaatio: noppa vaihtaa kuvioita
    const animation = setInterval(() => {
        const temp = Math.floor(Math.random() * 6) + 1;
        noppa.textContent = noppaEmoji(temp);
    }, 100);

    // Pysäytetään animaatio 1 sekunnin kuluttua ja silmäluvun arvonta
    setTimeout(() => {
        clearInterval(animation);
        noppa.classList.remove("rolling");

        const roll = Math.floor(Math.random() * 6) + 1; // Arvottu silmäluku
        noppa.textContent = noppaEmoji(roll);

        if (roll === 1) {
            // Vuoron vaihto ykkösellä
            teksti.textContent = `${nimet[nykyinenPelaaja]} heitti ykkösen! Vuoro siirtyy.`;
            vuoronVaihto();
        } else {
            // Lisätään pisteet vuoropisteisiin
            vuoroPisteet += roll;
            teksti.textContent = `${nimet[nykyinenPelaaja]} keräsi ${vuoroPisteet} pistettä tällä vuorolla.`;
        }

        // Napit takaisin käyttöön
        heitaNappi.disabled = false;
        talletaNappi.disabled = false;
    }, 1000);
});

// Pisteiden tallantaminen
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

// Kun peli loppuu, näytetään nappi uuden pelin aloittamiseen
function uusiPeliNappiNakyy() {
    uusiPeliNappi.classList.remove("piilo");
}

uusiPeliNappi.addEventListener("click", () => {
    clickViive(() => {
        // Piilotetaan nappi ja viestit
        uusiPeliNappi.classList.add("piilo")

        teksti.textContent = "";

        // Nollataan pisteet ja vuorot
        pisteet = new Array(pelaajaLkm).fill(0);
        vuoroPisteet = 0;
        nykyinenPelaaja = 0;

        // Päivitetään pelinäkymä ja aloitetaan peli
        aloitaPeli();
        peliOsio.classList.remove("piilo"); // varmistaa, että pelinäkymä näkyy
    });
});

// Click-ääni
function soitaClickAani() {
    clickAani.currentTime = 0;
    clickAani.play().catch(err => console.log("Klikkiääntä ei voitu toistaa:", err));
}

// Viive click-äänelle
function clickViive(action) {
    soitaClickAani();
    setTimeout(action, 450); // 450 ms viive
}

// Paluu etusivulle
if (etusivuNappi) {
    etusivuNappi.addEventListener("click", (event) => {
        event.preventDefault(); // Estetään linkin avaus
        clickViive(() => {
            window.location.href = etusivuNappi.getAttribute("href");
        });
    });
}

// Näytetään info-ikkuna painikkeella
infoNappi.addEventListener("click", () => {
    clickViive (() => {
        ikkuna.classList.add("nakyvissa"); // Näytetään säännöt
    });
});

// Suljetaan info-ikkuna ruksista
suljeIkkuna.addEventListener("click", () => {
    clickViive (() => {
        ikkuna.classList.remove("nakyvissa"); // Piilotetaan säännöt
    });
});
