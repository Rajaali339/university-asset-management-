import {
    auth,
    db,
    signOut,
    onAuthStateChanged,
    collection,
    getDocs
} from "./firebase.js";


const grid =
document.getElementById(
    "reportGrid"
);

const logoutBtn =
document.getElementById(
    "logoutBtn"
);


onAuthStateChanged(auth, user => {

    if (!user) {

        window.location.href =
        "index.html";

    }

});


logoutBtn.addEventListener(
"click",
async () => {

    await signOut(auth);

    window.location.href =
    "index.html";

});


async function loadReport() {

    const snapshot =
    await getDocs(
        collection(
            db,
            "assets"
        )
    );


    let total = 0;

    let available = 0;

    let assigned = 0;

    let maintenance = 0;

    let disposed = 0;


    snapshot.forEach(item => {

        const asset =
        item.data();


        total++;


        if (
            asset.status ===
            "Available"
        )
            available++;


        if (
            asset.status ===
            "Assigned"
        )
            assigned++;


        if (
            asset.status ===
            "Maintenance"
        )
            maintenance++;


        if (
            asset.status ===
            "Disposed"
        )
            disposed++;

    });


    const reports = [

        ["Total Assets", total],

        ["Available", available],

        ["Assigned", assigned],

        ["Maintenance", maintenance],

        ["Disposed", disposed]

    ];


    grid.innerHTML = "";


    reports.forEach(report => {

        const card =
        document.createElement(
            "div"
        );


        card.className =
        "simple-card";


        card.innerHTML = `

            <p>
                ${report[0]}
            </p>

            <h2>
                ${report[1]}
            </h2>

        `;


        grid.appendChild(card);

    });

}


loadReport();