import {
    auth,
    db,
    signOut,
    onAuthStateChanged,
    collection,
    getDocs
} from "./firebase.js";


/* =========================
   HTML ELEMENTS
========================= */

const totalAssets =
    document.getElementById("totalAssets");

const availableAssets =
    document.getElementById("availableAssets");

const assignedAssets =
    document.getElementById("assignedAssets");

const maintenanceAssets =
    document.getElementById("maintenanceAssets");

const disposedAssets =
    document.getElementById("disposedAssets");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================
   CHART VARIABLE
========================= */

let assetChart = null;


/* =========================
   AUTHENTICATION
========================= */

onAuthStateChanged(auth, user => {

    if (!user) {

        window.location.href =
            "index.html";

    }

});


/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "index.html";

        } catch (error) {

            console.error(
                "Logout Error:",
                error
            );

        }

    }
);


/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard() {

    try {

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


            if (
                asset.status ===
                "Disposed"
            ) {

                disposed++;

            }

        });


        /* =========================
           UPDATE CARDS
        ========================= */

        totalAssets.textContent =
            total;

        availableAssets.textContent =
            available;

        assignedAssets.textContent =
            assigned;

        maintenanceAssets.textContent =
            maintenance;

        disposedAssets.textContent =
            disposed;


        /* =========================
           CREATE CHART
        ========================= */

        createChart(
            available,
            assigned,
            maintenance,
            disposed
        );


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


/* =========================
   CREATE ASSET CHART
========================= */

function createChart(
    available,
    assigned,
    maintenance,
    disposed
) {

    const canvas =
        document.getElementById(
            "assetChart"
        );


    if (!canvas) {

        console.error(
            "assetChart canvas not found."
        );

        return;

    }


    /* =========================
       DESTROY OLD CHART
    ========================= */

    if (assetChart) {

        assetChart.destroy();

    }


    /* =========================
       CREATE NEW CHART
    ========================= */

    assetChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [

                        "Available",

                        "Assigned",

                        "Maintenance",

                        "Disposed"

                    ],


                    datasets: [

                        {

                            label:
                                "Number of Assets",


                            data: [

                                available,

                                assigned,

                                maintenance,

                                disposed

                            ],


                            /* =========================
                               DIFFERENT COLORS
                            ========================= */

                            backgroundColor: [

                                "#2196F3",  // Available - Blue

                                "#22A65A",  // Assigned - Green

                                "#FF9800",  // Maintenance - Orange

                                "#7E57C2"   // Disposed - Purple

                            ],


                            borderColor: [

                                "#1976D2",

                                "#16834B",

                                "#F57C00",

                                "#673AB7"

                            ],


                            borderWidth: 1,


                            borderRadius: 5

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            display: true

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                stepSize: 1

                            }

                        }

                    }

                }

            }

        );

}


/* =========================
   LOAD MAINTENANCE TICKETS
========================= */

async function loadTickets() {

    const table =
        document.getElementById(
            "ticketTable"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "maintenance"
                )
            );


        let count = 0;


        snapshot.forEach(item => {

            if (count >= 5) {

                return;

            }


            const ticket =
                item.data();


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${ticket.ticketId || "-"}
                </td>

                <td>
                    ${ticket.assetId || "-"}
                </td>

                <td>
                    ${ticket.issue || "-"}
                </td>

                <td>

                    <span class="priority">

                        ${ticket.priority || "-"}

                    </span>

                </td>

                <td>
                    ${ticket.status || "Open"}
                </td>

            `;


            table.appendChild(row);


            count++;

        });


    } catch (error) {

        console.error(
            "Ticket Loading Error:",
            error
        );

    }

}


/* =========================
   START DASHBOARD
========================= */

loadDashboard();

loadTickets();