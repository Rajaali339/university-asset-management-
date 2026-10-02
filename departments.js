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
    "departmentGrid"
);

const table =
document.getElementById(
    "departmentTable"
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


async function loadDepartments() {

    const snapshot =
    await getDocs(
        collection(
            db,
            "assets"
        )
    );


    const departments = {};


    snapshot.forEach(item => {

        const asset =
        item.data();


        const department =
        asset.department ||
        "Other";


        if (!departments[
            department
        ]) {

            departments[
                department
            ] = [];

        }


        departments[
            department
        ].push(asset);

    });


    grid.innerHTML = "";


    Object.keys(
        departments
    ).forEach(department => {

        const card =
        document.createElement(
            "div"
        );


        card.className =
        "department-card";


        card.innerHTML = `

            <h3>
                ${department}
            </h3>

            <h2>
                ${departments[department].length}
            </h2>

            <p>
                Assets
            </p>

        `;


        card.addEventListener(
        "click",
        () => {

            displayAssets(
                departments[
                    department
                ]
            );

        });


        grid.appendChild(card);

    });

}



function displayAssets(assets) {

    table.innerHTML = "";


    assets.forEach(asset => {

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
                ${asset.location || "-"}
            </td>

            <td>
                ${asset.status || "-"}
            </td>

        `;


        table.appendChild(row);

    });

}


loadDepartments();