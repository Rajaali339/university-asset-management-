// ================= APP.JS =================


import {

    auth,

    db,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged,

    collection,

    addDoc,

    getDocs,

    deleteDoc,

    doc

} from "./firebase.js";



// ================= GET HTML ELEMENTS =================


const loginPage =
    document.getElementById("loginPage");


const dashboardPage =
    document.getElementById("dashboardPage");


const emailInput =
    document.getElementById("email");


const passwordInput =
    document.getElementById("password");


const loginBtn =
    document.getElementById("loginBtn");


const logoutBtn =
    document.getElementById("logoutBtn");


const loginMessage =
    document.getElementById("loginMessage");


const assetForm =
    document.getElementById("assetForm");


const assetTable =
    document.getElementById("assetTable");


const searchInput =
    document.getElementById("search");



// ================= CHECK ELEMENTS =================


console.log(
    "Login Button:",
    loginBtn
);


console.log(
    "Email Input:",
    emailInput
);


console.log(
    "Password Input:",
    passwordInput
);



// ================= LOGIN =================


loginBtn.addEventListener(
    "click",
    async function () {


        const email =
            emailInput.value.trim();


        const password =
            passwordInput.value;


        // Empty fields

        if (
            email === "" ||
            password === ""
        ) {

            loginMessage.textContent =
                "Please enter email and password.";

            loginMessage.style.color =
                "red";

            return;

        }


        // Disable button

        loginBtn.disabled =
            true;


        loginMessage.textContent =
            "Logging in...";

        loginMessage.style.color =
            "blue";


        try {


            // Firebase Login

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            console.log(
                "Login successful!"
            );


            console.log(
                "User:",
                userCredential.user
            );


            loginMessage.textContent =
                "Login successful!";

            loginMessage.style.color =
                "green";


        }

        catch (error) {


            console.error(
                "Firebase Login Error:",
                error
            );


            loginMessage.style.color =
                "red";


            // Wrong credentials

            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                loginMessage.textContent =
                    "Wrong email or password.";

            }


            // Invalid email

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                loginMessage.textContent =
                    "Invalid email address.";

            }


            // Email/password disabled

            else if (
                error.code ===
                "auth/operation-not-allowed"
            ) {

                loginMessage.textContent =
                    "Email/Password login is not enabled in Firebase.";

            }


            // User disabled

            else if (
                error.code ===
                "auth/user-disabled"
            ) {

                loginMessage.textContent =
                    "This user account has been disabled.";

            }


            // Other error

            else {

                loginMessage.textContent =
                    "Firebase Error: " +
                    error.message;

            }

        }


        loginBtn.disabled =
            false;


    }
);



// ================= LOGOUT =================


logoutBtn.addEventListener(
    "click",
    async function () {


        try {

            await signOut(auth);

            console.log(
                "User logged out."
            );

        }

        catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);



// ================= AUTH STATE =================


onAuthStateChanged(
    auth,
    function (user) {


        if (user) {


            console.log(
                "Authenticated user:",
                user.email
            );


            // Hide login

            loginPage.classList.add(
                "hidden"
            );


            // Show dashboard

            dashboardPage.classList.remove(
                "hidden"
            );


            // Load assets

            loadAssets();

        }

        else {


            // Show login

            loginPage.classList.remove(
                "hidden"
            );


            // Hide dashboard

            dashboardPage.classList.add(
                "hidden"
            );

        }

    }
);

// ================= SIDEBAR NAVIGATION =================

const menuButtons =
    document.querySelectorAll(".menu-btn");


const allSections = [
    "dashboardSection",
    "assetsSection",
    "assetListSection",
    "departmentsSection",
    "locationsSection",
    "assignmentsSection",
    "maintenanceSection",
    "reportsSection",
    "usersSection"
];


menuButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const sectionId =
                    button.getAttribute(
                        "data-section"
                    );


                // Remove active from all buttons

                menuButtons.forEach(
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                // Add active to clicked button

                button.classList.add(
                    "active"
                );


                // Hide all sections

                allSections.forEach(
                    function(id) {

                        const section =
                            document.getElementById(
                                id
                            );


                        if (section) {

                            section.classList.add(
                                "hidden"
                            );

                        }

                    }
                );


                // Dashboard button

                if (
                    sectionId ===
                    "dashboardSection"
                ) {

                    document
                        .getElementById(
                            "dashboardSection"
                        )
                        .classList.remove(
                            "hidden"
                        );


                    document
                        .getElementById(
                            "assetsSection"
                        )
                        .classList.remove(
                            "hidden"
                        );


                    document
                        .getElementById(
                            "assetListSection"
                        )
                        .classList.remove(
                            "hidden"
                        );

                }


                // Assets button

                else if (
                    sectionId ===
                    "assetsSection"
                ) {

                    document
                        .getElementById(
                            "assetsSection"
                        )
                        .classList.remove(
                            "hidden"
                        );


                    document
                        .getElementById(
                            "assetListSection"
                        )
                        .classList.remove(
                            "hidden"
                        );

                }


                // Other pages

                else {

                    const selectedSection =
                        document.getElementById(
                            sectionId
                        );


                    if (selectedSection) {

                        selectedSection.classList.remove(
                            "hidden"
                        );

                    }

                }

            }
        );

    }
);

// ================= ADD ASSET =================


assetForm.addEventListener(
    "submit",
    async function (event) {


        event.preventDefault();


        // Get values

        const assetId =
            document
                .getElementById("assetId")
                .value
                .trim();


        const assetName =
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



        // Validate

        if (
            assetId === "" ||
            assetName === ""
        ) {

            alert(
                "Please enter Asset ID and Asset Name."
            );

            return;

        }



        try {


            // Add to Firestore

            await addDoc(
                collection(
                    db,
                    "assets"
                ),

                {

                    assetId:
                        assetId,

                    assetName:
                        assetName,

                    category:
                        category,

                    department:
                        department,

                    location:
                        location,

                    serialNumber:
                        serialNumber,

                    status:
                        status,

                    purchaseDate:
                        purchaseDate,

                    createdAt:
                        new Date()

                }

            );


            alert(
                "Asset added successfully!"
            );


            // Clear form

            assetForm.reset();


            // Reload table

            loadAssets();


        }

        catch (error) {


            console.error(
                "Add Asset Error:",
                error
            );


            alert(
                "Error adding asset: " +
                error.message
            );

        }

    }
);



// ================= LOAD ASSETS =================


async function loadAssets() {


    assetTable.innerHTML = "";


    try {


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "assets"
                )
            );


        let total =
            0;


        let available =
            0;


        let assigned =
            0;


        let maintenance =
            0;



        snapshot.forEach(
            function (assetDocument) {


                const asset =
                    assetDocument.data();


                total++;


                if (
                    asset.status ===
                    "Available"
                ) {

                    available++;

                }


                if (
                    asset.status ===
                    "Assigned"
                ) {

                    assigned++;

                }


                if (
                    asset.status ===
                    "Maintenance"
                ) {

                    maintenance++;

                }


                addAssetToTable(
                    assetDocument.id,
                    asset
                );

            }
        );



        // Update statistics

        document
            .getElementById(
                "totalAssets"
            )
            .textContent =
                total;


        document
            .getElementById(
                "availableAssets"
            )
            .textContent =
                available;


        document
            .getElementById(
                "assignedAssets"
            )
            .textContent =
                assigned;


        document
            .getElementById(
                "maintenanceAssets"
            )
            .textContent =
                maintenance;


    }

    catch (error) {


        console.error(
            "Load Assets Error:",
            error
        );


    }

}



// ================= ADD ASSET TO TABLE =================


function addAssetToTable(
    documentId,
    asset
) {


    const row =
        document.createElement(
            "tr"
        );


    const status =
        asset.status || "";


    const statusClass =
        status
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );



    row.innerHTML = `

        <td>
            ${escapeHTML(asset.assetId || "")}
        </td>

        <td>
            ${escapeHTML(asset.assetName || "")}
        </td>

        <td>
            ${escapeHTML(asset.category || "")}
        </td>

        <td>
            ${escapeHTML(asset.department || "")}
        </td>

        <td>
            ${escapeHTML(asset.location || "")}
        </td>

        <td>

            <span class="status status-${statusClass}">

                ${escapeHTML(status)}

            </span>

        </td>

        <td>

            <button
                class="delete-btn"
                type="button"
            >
                Delete
            </button>

        </td>

    `;



    const deleteButton =
        row.querySelector(
            ".delete-btn"
        );


    deleteButton.addEventListener(
        "click",
        function () {

            deleteAsset(
                documentId
            );

        }
    );



    assetTable.appendChild(
        row
    );

}



// ================= DELETE ASSET =================


async function deleteAsset(
    documentId
) {


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
                documentId
            )
        );


        alert(
            "Asset deleted successfully!"
        );


        loadAssets();


    }

    catch (error) {


        console.error(
            "Delete Error:",
            error
        );


        alert(
            "Error deleting asset: " +
            error.message
        );

    }

}



// ================= SEARCH =================


searchInput.addEventListener(
    "input",
    function () {


        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        const rows =
            assetTable.querySelectorAll(
                "tr"
            );


        rows.forEach(
            function (row) {


                const rowText =
                    row.textContent
                        .toLowerCase();


                if (
                    rowText.includes(
                        searchText
                    )
                ) {

                    row.style.display =
                        "";

                }

                else {

                    row.style.display =
                        "none";

                }

            }
        );

    }
);



// ================= SECURITY HELPER =================


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