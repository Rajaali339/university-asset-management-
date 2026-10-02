import {
    auth,
    db,
    signOut,
    onAuthStateChanged,
    collection,
    getDocs
} from "./firebase.js";


const table =
document.getElementById(
    "locationTable"
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


async function loadLocations() {

    table.innerHTML = "";


    const snapshot =
    await getDocs(
        collection(
            db,
            "assets"
        )
    );


    snapshot.forEach(item => {

        const asset =
        item.data();


        const row =
        document.createElement(
            "tr"
        );


        row.innerHTML = `

            <td>
                ${asset.assetId || "-"}
            </td>

            <td>
                ${asset.name || "-"}
            </td>

            <td>
                ${asset.department || "-"}
            </td>

            <td>

                <strong>
                    ${asset.department || "-"}
                    -
                    ${asset.location || "-"}
                </strong>

            </td>

            <td>
                ${asset.status || "-"}
            </td>

        `;


        table.appendChild(row);

    });

}


loadLocations();