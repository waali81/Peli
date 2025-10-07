// Haetaan audio elementti, ja ladataan ääni valmiiksi
const clickSound = document.getElementById("click-sound");
clickSound.load();

// Haetaan linkit
document.querySelectorAll("a").forEach(link => {
    // Lisätään klikkauksen tapahtumakuuntelija linkeille
    link.addEventListener("click", (e) => {
        e.preventDefault();
        // Ääni alkaa alusta
        clickSound.currentTime = 0;
        clickSound.play().catch(error => {
            console.log("Ääntä ei voitu soittaa:", error);
        });
        // Viive sivunvaihtoon, jotta ääni kuuluu kokonaan
        setTimeout(() => {
            window.location.href = link.href;
        }, 450);
    });
});
