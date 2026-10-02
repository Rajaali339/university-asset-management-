import {
    auth,
    db,
    signOut,
    onAuthStateChanged,
    collection,
    addDoc,
    getDocs
} from "./firebase.js";


const form =
document.getElementById(
    "maintenanceForm"
);

const table =
document.getElementById(
    "maintenanceTable"
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


form.addEventListener(
"submit",
async event => {

    event.preventDefault();


    const ticketId =
    "TKT-" +
    Date.now()
    .toString()
    .slice(-6);


    const ticket = {

        ticketId:

        ticketId,

        assetId:

        document.getElementById(
            "ticketAsset"
        ).value.trim(),

        issue:

        document.getElementById(
            "issue"
        ).value.trim(),

        priority:

        document.getElementById(
            "priority"
        ).value,

        reportedBy:

        document.getElementById(
            "reportedBy"
        ).value.trim(),

        status:
        "Open",

        createdAt:
        new Date().toISOString()

    };


    try {

        await addDoc(
            collection(
                db,
                "maintenance"
            ),
            ticket
        );


        document.getElementById(
            "ticketMessage"
        ).textContent =

        "Ticket generated: " +
        ticketId;


        document.getElementById(
            "ticketMessage"
        ).style.color =
        "green";


        form.reset();


        loadTickets();


    } catch(error) {

        console.error(error);

        document.getElementById(
            "ticketMessage"
        ).textContent =
        error.message;

    }

});


async function loadTickets() {

    table.innerHTML = "";


    const snapshot =
    await getDocs(
        collection(
            db,
            "maintenance"
        )
    );


    snapshot.forEach(item => {

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
                ${ticket.priority || "-"}
            </td>

            <td>
                ${ticket.reportedBy || "-"}
            </td>

            <td>
                ${ticket.status || "Open"}
            </td>

        `;


        table.appendChild(row);

    });

}


loadTickets();