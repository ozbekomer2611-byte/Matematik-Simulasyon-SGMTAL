// ----------------------- DOM ELEMENTLER -----------------------
const otomat = document.getElementById("otomatContainer");
const pence = document.getElementById("pence");
const secBtn = document.getElementById("secBtn");
const kart = document.getElementById("kart");

// ----------------------- TOPLAR -----------------------
let tops = [];
const renkler = ["red","blue","green","yellow","purple","orange","pink"];
let sonUc = [];

for (let i = 0; i < 12; i++) {
    let t = document.createElement("div");
    t.classList.add("top");
    t.style.background = renkler[i % renkler.length];
    t.style.width = "40px";
    t.style.height = "40px";
    t.style.borderRadius = "50%";
    t.style.position = "absolute";
    t.style.left = (40 + (i % 4) * 80) + "px";
    t.style.bottom = (20 + Math.floor(i / 4) * 50) + "px";
    otomat.appendChild(t);
    tops.push(t);
}

// ----------------------- PENÇE SAĞ-SOL -----------------------
let penceX = 175;
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") penceX -= 10;
    if (e.key === "ArrowRight") penceX += 10;
    penceX = Math.max(0, Math.min(otomat.offsetWidth - 50, penceX));
    pence.style.left = penceX + "px";
});

// ----------------------- SEÇ BUTONU -----------------------
secBtn.addEventListener("click", () => {
    kart.style.display = "none"; // tabloyu gizle

    // 1) En yakın alt sıradaki topu bul
    let hedefTop = null;
    let minMesafe = Infinity;

    for (let t of tops) {
        let tx = parseInt(t.style.left);
        let mesafe = Math.abs(tx - penceX);
        if (mesafe < 40) { // aynı kolon
            let btm = parseInt(t.style.bottom);
            if (btm < minMesafe) {
                minMesafe = btm;
                hedefTop = t;
            }
        }
    }

    if (!hedefTop) return; // top yoksa dur

    // ----------------------- PENÇE İNME -----------------------
    let topBottom = parseInt(hedefTop.style.bottom);
    let hedefY = otomat.offsetHeight - topBottom - 40; // pençenin tam inmesi gereken yükseklik
    let y = 0;

    let inAnim = setInterval(() => {
        if (y >= hedefY) {
            clearInterval(inAnim);

            // topu pençeye yapıştır
            hedefTop.style.left = (penceX + 5) + "px";
            hedefTop.style.bottom = (otomat.offsetHeight - hedefY - 30) + "px";

            // ----------------------- PENÇE YUKARI -----------------------
            let upAnim = setInterval(() => {
                if (y <= 0) {
                    clearInterval(upAnim);

                    // top kaybolsun
                    hedefTop.remove();
                    tops = tops.filter(t => t !== hedefTop);

                    sonUc.push(hedefTop);
                    if (sonUc.length === 3) {
                        tabloOlustur(sonUc);
                        sonUc = [];
                    }

                } else {
                    y -= 5;
                    pence.style.top = y + "px";
                    hedefTop.style.bottom = (otomat.offsetHeight - y - 30) + "px";
                }
            }, 16);

        } else {
            y += 5;
            pence.style.top = y + "px";
        }
    }, 16);
});

// ----------------------- TABLO -----------------------
function tabloOlustur(ucTop) {
    // Rastgele çevre ve çap
    let cevreler = ucTop.map(()=> (Math.random()*6+28));
    let caplar  = ucTop.map(()=> (Math.random()*4+8));

    let ortCevre = cevreler.reduce((a,b)=>a+b)/3;
    let ortCap   = caplar.reduce((a,b)=>a+b)/3;

    let pi = ortCevre / ortCap;

    let sapmalar = cevreler.map((c,i)=> Math.abs(c/caplar[i] - pi));
    let stdSapma = (sapmalar.reduce((a,b)=>a+b)/3).toFixed(3);

    let html = "<h3>3 Topun Hesabı</h3>";
    for (let i=0;i<3;i++){
        html += `Top ${i+1}: Çevre ${cevreler[i].toFixed(1)}, Çap ${caplar[i].toFixed(1)}<br>`;
    }
    html += `<br>Ortalama Çevre: ${ortCevre.toFixed(2)}<br>`;
    html += `Ortalama Çap: ${ortCap.toFixed(2)}<br>`;
    html += `<b>Pi Yaklaşımı: ${pi.toFixed(3)}</b><br>`;
    html += `Standart Sapma: ${stdSapma}`;

    kart.innerHTML = html;
    kart.style.display = "block";
}