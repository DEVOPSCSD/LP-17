/* =========================================
   ONECLICK DEVOPS JAVASCRIPT
========================================= */


/* =========================================
   NAVIGATION
========================================= */

function showSection(sectionId, button) {

    // Hide all sections
    const sections = document.querySelectorAll(".section");

    sections.forEach(function(section) {
        section.classList.remove("active");
    });


    // Show selected section
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }


    // Remove active from navigation buttons
    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });


    // Add active to clicked button
    if (button) {
        button.classList.add("active");
    }


    // Update page title
    const titles = {
        dashboard: "Dashboard",
        projects: "Projects",
        provision: "Provision Environment",
        deployments: "Deployments",
        logs: "Deployment Logs",
        settings: "Settings"
    };

    document.getElementById("pageTitle").innerText =
        titles[sectionId] || "Dashboard";
}


/* =========================================
   PROVISION ENVIRONMENT
========================================= */

document.getElementById("provisionForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const project =
            document.getElementById("projectName").value;

        const environment =
            document.getElementById("environment").value;

        const cloud =
            document.getElementById("cloud").value;


        const status =
            document.getElementById("provisionStatus");

        const title =
            document.getElementById("provisionTitle");

        const message =
            document.getElementById("provisionMessage");


        // Show status
        status.classList.remove("hidden");

        title.innerText =
            "Provisioning Environment...";

        message.innerText =
            "Creating " +
            environment +
            " environment on " +
            cloud +
            "...";


        // Add log
        addLog(
            "Starting environment provisioning for " +
            project
        );


        // Simulate provisioning
        setTimeout(function() {

            title.innerText =
                "Environment Created Successfully ✓";

            message.innerText =
                project +
                " - " +
                environment +
                " environment is now running.";


            // Add log
            addLog(
                "Environment provisioned successfully."
            );


            // Update environment count
            let count =
                parseInt(
                    document.getElementById(
                        "environmentCount"
                    ).innerText
                );

            document.getElementById(
                "environmentCount"
            ).innerText = count + 1;


        }, 3000);

    });


/* =========================================
   ADD LOG
========================================= */

function addLog(message) {

    const terminal =
        document.querySelector(".terminal-body");


    const time =
        new Date().toLocaleTimeString();


    const newLog =
        document.createElement("p");


    newLog.innerHTML =
        '<span class="green-text">$</span> ' +
        time +
        " - " +
        message;


    terminal.appendChild(newLog);


    // Automatically scroll to bottom
    terminal.scrollTop =
        terminal.scrollHeight;
}


/* =========================================
   DEPLOY PROJECT
========================================= */

function deployProject(projectName) {

    addLog(
        "Starting deployment for " +
        projectName
    );


    alert(
        "Deployment started for " +
        projectName +
        "!"
    );


    // Update deployment count
    let count =
        parseInt(
            document.getElementById(
                "deploymentCount"
            ).innerText
        );

    document.getElementById(
        "deploymentCount"
    ).innerText = count + 1;


    // Create new deployment row
    const table =
        document.getElementById(
            "allDeployments"
        );


    const row =
        document.createElement("tr");


    row.innerHTML = `
        <td>#DEP-${Date.now().toString().slice(-3)}</td>

        <td>${projectName}</td>

        <td>Development</td>

        <td>v1.0.0</td>

        <td>
            <span class="status running">
                Running
            </span>
        </td>

        <td>
            <button class="small-btn"
                    onclick="viewLogs()">
                Logs
            </button>
        </td>
    `;


    table.prepend(row);


    // Finish deployment after 3 seconds
    setTimeout(function() {

        const status =
            row.querySelector(".status");

        status.className =
            "status success";

        status.innerText =
            "Success";


        addLog(
            projectName +
            " deployed successfully."
        );

    }, 3000);
}


/* =========================================
   VIEW LOGS
========================================= */

function viewLogs() {

    showSection("logs");


    // Find Logs navigation button
    const buttons =
        document.querySelectorAll(".nav-btn");


    buttons.forEach(function(button) {

        button.classList.remove("active");


        if (
            button.innerText
                .toLowerCase()
                .includes("logs")
        ) {
            button.classList.add("active");
        }

    });
}


/* =========================================
   CLEAR LOGS
========================================= */

function clearLogs() {

    const terminal =
        document.querySelector(".terminal-body");


    terminal.innerHTML = `
        <p>
            <span class="green-text">$</span>
            Logs cleared.
        </p>
    `;
}


/* =========================================
   ADD PROJECT
========================================= */

function addProject() {

    const name =
        prompt("Enter project name:");

    if (!name) {
        return;
    }


    const projectGrid =
        document.getElementById(
            "projectGrid"
        );


    const card =
        document.createElement("div");


    card.className =
        "project-card";


    card.innerHTML = `

        <div class="project-top">

            <div class="project-icon">
                📦
            </div>

            <span class="status success">
                Active
            </span>

        </div>

        <h3>${name}</h3>

        <p>
            New application project created
            using OneClick DevOps.
        </p>

        <div class="project-info">

            <span>🔗 GitHub</span>

            <span>🐳 Docker</span>

        </div>

        <button class="secondary-btn"
                onclick="deployProject('${name}')">

            🚀 Deploy

        </button>
    `;


    projectGrid.appendChild(card);


    // Update project count
    let count =
        parseInt(
            document.getElementById(
                "projectCount"
            ).innerText
        );


    document.getElementById(
        "projectCount"
    ).innerText = count + 1;


    addLog(
        "Project '" +
        name +
        "' created."
    );

}


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        addLog(
            "OneClick DevOps dashboard loaded."
        );

    }
);
