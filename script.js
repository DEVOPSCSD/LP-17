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
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const project =
            document.getElementById("projectName").value;

        const environment =
            document.getElementById("environment").value;

        const cloud =
            document.getElementById("cloud").value;

        const region =
            document.getElementById("region").value;

        const instanceType =
            document.getElementById("instanceType").value;

        const docker =
            document.getElementById("docker").value;

        const description =
            document.getElementById("environmentDescription").value;

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

        try {

            const response = await fetch(
    "http://127.0.0.1:5000/api/projects",
    {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: project,
                        environment: environment,
                        cloud: cloud,
                        region: region,
                        instance_type: instanceType,
                        docker_enabled: docker === "Enabled" ? 1 : 0,
                        description: description
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Provisioning failed");
            }

            title.innerText =
                "Environment Created Successfully ✓";

            message.innerText =
                project +
                " - " +
                environment +
                " environment has been saved.";

            addLog(
                "Environment provisioned successfully. Project ID: " +
                result.project_id
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

        } catch (error) {

            title.innerText =
                "Provisioning Failed ✗";

            message.innerText =
                error.message;

            addLog(
                "Provisioning failed: " +
                error.message
            );
        }
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

async function addProject() {

    const name = prompt("Enter project name:");

    if (!name) {
        return;
    }

    try {

        // Save project to Flask backend
        const response = await fetch(
            "http://127.0.0.1:5000/api/projects",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    environment: "Development",
                    cloud: "AWS",
                    region: "India - Hyderabad",
                    instance_type: "Small",
                    docker_enabled: 1,
                    description: "New application project created using OneClick DevOps."
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to create project"
            );
        }

        // Add project card to frontend
        const projectGrid =
            document.getElementById("projectGrid");

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

        // Add log
        addLog(
            "Project '" +
            name +
            "' created successfully. Project ID: " +
            result.project_id
        );

        alert(
            "Project created successfully!"
        );

    } catch (error) {

        console.error(error);

        addLog(
            "Project creation failed: " +
            error.message
        );

        alert(
            "Project creation failed: " +
            error.message
        );
    }
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

        loadProjects();

    }
);
/* =========================================
   LOAD PROJECTS FROM DATABASE
========================================= */

async function loadProjects() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/projects"
        );

        const projects = await response.json();

        if (!response.ok) {
            throw new Error("Failed to load projects");
        }

        const projectGrid =
            document.getElementById("projectGrid");

        projectGrid.innerHTML = "";

        projects.forEach(function(project) {

            const card =
                document.createElement("div");

            card.className = "project-card";

            card.innerHTML = `
                <div class="project-top">

                    <div class="project-icon">
                        📦
                    </div>

                    <span class="status success">
                        Active
                    </span>

                </div>

                <h3>${project.name}</h3>

                <p>
                    ${project.description ||
                    "Application project created using OneClick DevOps."}
                </p>

                <div class="project-info">
                    <span>☁️ ${project.cloud}</span>
                    <span>🐳 Docker</span>
                </div>

                <button class="secondary-btn"
                        onclick="deployProject('${project.name}')">

                    🚀 Deploy

                </button>
            `;

            projectGrid.appendChild(card);
        });

        document.getElementById(
            "projectCount"
        ).innerText = projects.length;

        addLog(
            projects.length +
            " project(s) loaded from database."
        );

    } catch (error) {

        console.error(
            "Error loading projects:",
            error
        );

        addLog(
            "Failed to load projects: " +
            error.message
        );
    }
}
