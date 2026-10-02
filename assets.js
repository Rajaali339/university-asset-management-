import {
    auth,
    db,
    signOut,
    onAuthStateChanged,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "./firebase.js";


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const form = document.getElementById("assetForm");

const table = document.getElementById("assetTable");

const logoutBtn = document.getElementById("logoutBtn");

const assetMessage =
    document.getElementById("assetMessage");


// FILTER ELEMENTS

const filterAssetId =
    document.getElementById("filterAssetId");

const filterCategory =
    document.getElementById("filterCategory");

const filterDepartment =
    document.getElementById("filterDepartment");

const filterLocation =
    document.getElementById("filterLocation");

const filterBtn =
    document.getElementById("filterBtn");

const clearFilterBtn =
    document.getElementById("clearFilterBtn");


// RESULT ELEMENTS

const assetCount =
    document.getElementById("assetCount");

const noAssets =
    document.getElementById("noAssets");


// =====================================================
// STORE ASSETS
// =====================================================

let assets = [];


// =====================================================
// CHECK LOGIN
// =====================================================

onAuthStateChanged(auth, user => {

    if (!user) {

        window.location.href = "index.html";

        return;
    }

    // User is logged in
    loadAssets();

});


// =====================================================
// LOGOUT
// =====================================================

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "index.html";

    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );

    }

});


// =====================================================
// ADD NEW ASSET
// =====================================================

form.addEventListener("submit", async event => {

    event.preventDefault();


    // Get form values

    const assetId =
        document
        .getElementById("assetId")
        .value
        .trim();


    const name =
        document
        .getElementById("assetName")
        .value
        .trim();


    const category =
        document
        .getElementById("category")
        .value;


    const department =
        document
        .getElementById("department")
        .value;


    const location =
        document
        .getElementById("location")
        .value
        .trim();


    const serialNumber =
        document
        .getElementById("serialNumber")
        .value
        .trim();


    const status =
        document
        .getElementById("status")
        .value;


    const purchaseDate =
        document
        .getElementById("purchaseDate")
        .value;


    // Basic validation

    if (!assetId || !name) {

        assetMessage.textContent =
            "Please enter Asset ID and Asset Name.";

        assetMessage.style.color = "red";

        return;
    }


    // Create asset object

    const asset = {

        assetId: assetId,

        name: name,

        category: category,

        department: department,

        location: location,

        serialNumber: serialNumber,

        status: status,

        purchaseDate: purchaseDate,

        createdAt:
            new Date().toISOString()

    };


    try {

        // Save to Firebase

        await addDoc(
            collection(db, "assets"),
            asset
        );


        // Success message

        assetMessage.textContent =
            "Asset added successfully.";

        assetMessage.style.color =
            "green";


        // Clear form

        form.reset();


        // Reload assets

        await loadAssets();


    } catch (error) {

        console.error(
            "Add Asset Error:",
            error
        );


        assetMessage.textContent =
            "Error: " + error.message;

        assetMessage.style.color =
            "red";

    }

});


// =====================================================
// LOAD ASSETS FROM FIREBASE
// =====================================================

async function loadAssets() {

    try {

        table.innerHTML = "";


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "assets"
                )
            );


        assets = [];


        snapshot.forEach(item => {

            assets.push({

                id: item.id,

                ...item.data()

            });

        });


        // Display all assets

        displayAssets(assets);


    } catch (error) {

        console.error(
            "Load Assets Error:",
            error
        );


        table.innerHTML = "";


        assetCount.textContent =
            "0 Assets";


        noAssets.style.display =
            "block";


        noAssets.textContent =
            "Unable to load assets.";

    }

}


// =====================================================
// DISPLAY ASSETS
// =====================================================

function displayAssets(data) {

    table.innerHTML = "";


    // Update count

    assetCount.textContent =
        data.length +
        (data.length === 1
            ? " Asset"
            : " Assets");


    // No assets

    if (data.length === 0) {

        noAssets.style.display =
            "block";

        return;

    }


    noAssets.style.display =
        "none";


    // Create table rows

    data.forEach(asset => {

        const row =
            document.createElement("tr");


        // Status class

        let statusClass =
            getStatusClass(
                asset.status
            );


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    asset.assetId || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    asset.name || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    asset.category || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    asset.department || "-"
                )}
            </td>

            <td>
                ${escapeHTML(
                    asset.location || "-"
                )}
            </td>

            <td>

                <span class="status ${statusClass}">

                    ${escapeHTML(
                        asset.status || "-"
                    )}

                </span>

            </td>

            <td>

                <button
                    class="delete-btn"
                    data-id="${asset.id}">

                    Delete

                </button>

            </td>

        `;


        table.appendChild(row);

    });


    // Add delete events

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                deleteAsset
            );

        });

}


// =====================================================
// STATUS CLASS
// =====================================================

function getStatusClass(status) {

    if (!status) {

        return "";

    }


    switch (
        status.toLowerCase()
    ) {

        case "available":

            return "available";


        case "assigned":

            return "assigned";


        case "maintenance":

            return "maintenance";


        case "damaged":

            return "damaged";


        case "lost":

            return "lost";


        case "disposed":

            return "disposed";


        default:

            return "";

    }

}


// =====================================================
// DELETE ASSET
// =====================================================

async function deleteAsset(event) {

    const assetId =
        event.target.dataset.id;


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this asset?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "assets",
                assetId
            )
        );


        // Reload Firebase data

        await loadAssets();


    } catch (error) {

        console.error(
            "Delete Asset Error:",
            error
        );


        alert(
            "Unable to delete asset: " +
            error.message
        );

    }

}


// =====================================================
// FILTER ASSETS
// =====================================================

function filterAssets() {


    // Get filter values

    const idValue =
        filterAssetId
        .value
        .toLowerCase()
        .trim();


    const categoryValue =
        filterCategory
        .value
        .toLowerCase()
        .trim();


    const departmentValue =
        filterDepartment
        .value
        .toLowerCase()
        .trim();


    const locationValue =
        filterLocation
        .value
        .toLowerCase()
        .trim();


    // Filter Firebase assets

    const filteredAssets =
        assets.filter(asset => {


            const assetId =
                (
                    asset.assetId || ""
                )
                .toLowerCase()
                .trim();


            const category =
                (
                    asset.category || ""
                )
                .toLowerCase()
                .trim();


            const department =
                (
                    asset.department || ""
                )
                .toLowerCase()
                .trim();


            const location =
                (
                    asset.location || ""
                )
                .toLowerCase()
                .trim();


            // Asset ID

            const idMatch =
                assetId.includes(
                    idValue
                );


            // Category

            const categoryMatch =
                categoryValue === "" ||
                category === categoryValue;


            // Department

            const departmentMatch =
                departmentValue === "" ||
                department === departmentValue;


            // Location

            const locationMatch =
                location.includes(
                    locationValue
                );


            return (

                idMatch &&

                categoryMatch &&

                departmentMatch &&

                locationMatch

            );

        });


    // Display filtered assets

    displayAssets(
        filteredAssets
    );

}


// =====================================================
// SEARCH BUTTON
// =====================================================

filterBtn.addEventListener(
    "click",
    filterAssets
);


// =====================================================
// CLEAR FILTERS
// =====================================================

clearFilterBtn.addEventListener(
    "click",
    () => {


        filterAssetId.value = "";

        filterCategory.value = "";

        filterDepartment.value = "";

        filterLocation.value = "";


        // Show all assets again

        displayAssets(assets);

    }
);


// =====================================================
// LIVE FILTERING
// =====================================================

// Asset ID

filterAssetId.addEventListener(
    "input",
    filterAssets
);


// Location

filterLocation.addEventListener(
    "input",
    filterAssets
);


// Category

filterCategory.addEventListener(
    "change",
    filterAssets
);


// Department

filterDepartment.addEventListener(
    "change",
    filterAssets
);


// =====================================================
// HTML SECURITY
// =====================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}