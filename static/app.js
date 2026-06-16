document.addEventListener("DOMContentLoaded", () => {
    const projectForm = document.getElementById("projectForm");
    const clearBtn = document.getElementById("clearBtn");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const spinner = submitBtn.querySelector(".spinner");

    // Theme Toggle
    const themeToggle = document.getElementById("themeToggle");

    // Panels
    const resultsPlaceholder = document.getElementById("resultsPlaceholder");
    const resultsLoading = document.getElementById("resultsLoading");
    const resultsReport = document.getElementById("resultsReport");

    // Loading indicators
    const loadingProgress = document.getElementById("loadingProgress");
    const loadingStatusText = document.getElementById("loadingStatusText");

    // Report elements
    const reportProjectName = document.getElementById("reportProjectName");
    const scoreText = document.getElementById("scoreText");
    const scoreRing = document.getElementById("scoreRing");
    const recommendationBanner = document.getElementById("recommendationBanner");
    const recIcon = document.getElementById("recIcon");
    const recStatus = document.getElementById("recStatus");
    const recExplanation = document.getElementById("recExplanation");
    const copySummaryBtn = document.getElementById("copySummaryBtn");
    const exportCsvBtn = document.getElementById("exportCsvBtn");

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        if (themeToggle) themeToggle.checked = true;
    } else {
        document.body.classList.remove("light-theme");
        if (themeToggle) themeToggle.checked = false;
    }

    // Report cards
    const clarityStatus = document.getElementById("clarityStatus");
    const clarityDesc = document.getElementById("clarityDesc");
    const missingReqsList = document.getElementById("missingReqsList");
    const securityRisksList = document.getElementById("securityRisksList");
    const edgeCasesList = document.getElementById("edgeCasesList");
    const testingRecsList = document.getElementById("testingRecsList");
    const monitoringList = document.getElementById("monitoringList");
    const checklistItems = document.getElementById("checklistItems");

    // Toast element
    const toast = document.getElementById("toast");

    // Radial progress ring details
    const radius = scoreRing.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    scoreRing.style.strokeDasharray = `${circumference} ${circumference}`;
    scoreRing.style.strokeDashoffset = circumference;

    let currentReviewData = null; // Stored review data for copying

    // Set SVG stroke offset based on percentage
    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        scoreRing.style.strokeDashoffset = offset;
    }

    // Helper to escape HTML to prevent XSS
    function escapeHTML(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Toast Utility
    function showToast(message) {
        toast.querySelector("span").textContent = message;
        toast.classList.remove("hidden");
        setTimeout(() => {
            toast.classList.add("hidden");
        }, 3000);
    }

    // Handle Form Submission
    projectForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Simple client-side validation
        const projectNameInput = document.getElementById("project_name");
        const formGroup = projectNameInput.closest(".form-group");
        
        if (!projectNameInput.value.trim()) {
            formGroup.classList.add("has-error");
            projectNameInput.focus();
            return;
        } else {
            formGroup.classList.remove("has-error");
        }

        // Setup loading state UI
        submitBtn.disabled = true;
        clearBtn.disabled = true;
        btnText.classList.add("hidden");
        spinner.classList.remove("hidden");
        
        resultsPlaceholder.classList.add("hidden");
        resultsReport.classList.add("hidden");
        resultsLoading.classList.remove("hidden");

        // Collect Form Data
        const formData = {
            project_name: projectNameInput.value,
            description: document.getElementById("description").value,
            tech_stack: document.getElementById("tech_stack").value,
            deployment_target: document.getElementById("deployment_target").value,
            main_features: document.getElementById("main_features").value,
            auth_details: document.getElementById("auth_details").value,
            database_storage: document.getElementById("database_storage").value,
            external_apis: document.getElementById("external_apis").value,
            known_risks: document.getElementById("known_risks").value
        };

        // Simulated Progress bar loader
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            if (progress > 95) progress = 95; // Stop at 95% until response returns
            
            loadingProgress.style.width = `${progress}%`;
            
            if (progress < 25) {
                loadingStatusText.textContent = "Scanning tech stack details...";
            } else if (progress < 55) {
                loadingStatusText.textContent = "Analyzing requirements & structural dependencies...";
            } else if (progress < 75) {
                loadingStatusText.textContent = "Assessing security profiles & credential risks...";
            } else {
                loadingStatusText.textContent = "Formulating edge cases & test plans...";
            }
        }, 80);

        try {
            const response = await fetch("/api/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to process deployment assessment.");
            }

            const data = await response.json();
            currentReviewData = data; // save globally

            // Fill progress to 100%
            clearInterval(progressInterval);
            loadingProgress.style.width = "100%";
            loadingStatusText.textContent = "Assessment ready!";

            setTimeout(() => {
                renderReport(data, formData.project_name);
                
                // Hide loading, show report
                resultsLoading.classList.add("hidden");
                resultsReport.classList.remove("hidden");

                // Reset submit button state
                submitBtn.disabled = false;
                clearBtn.disabled = false;
                btnText.classList.remove("hidden");
                spinner.classList.add("hidden");
            }, 300);

        } catch (error) {
            console.error(error);
            clearInterval(progressInterval);
            
            showToast("An error occurred. Please try again.");
            
            // Revert to placeholder state
            resultsLoading.classList.add("hidden");
            resultsPlaceholder.classList.remove("hidden");
            submitBtn.disabled = false;
            clearBtn.disabled = false;
            btnText.classList.remove("hidden");
            spinner.classList.add("hidden");
        }
    });

    // Clear Form button action
    clearBtn.addEventListener("click", () => {
        projectForm.reset();
        
        // Remove error states if present
        document.getElementById("project_name").closest(".form-group").classList.remove("has-error");

        // Transition back to placeholder view
        resultsReport.classList.add("hidden");
        resultsLoading.classList.add("hidden");
        resultsPlaceholder.classList.remove("hidden");
        
        // Reset stored assessment
        currentReviewData = null;
    });

    // Populate and render report panels
    function renderReport(data, projectName) {
        reportProjectName.textContent = projectName;
        scoreText.textContent = `${data.score}%`;
        setProgress(data.score);

        // Update score ring color dynamically based on score thresholds
        if (data.score >= 85) {
            scoreRing.style.stroke = "var(--success)";
        } else if (data.score >= 50) {
            scoreRing.style.stroke = "var(--warning)";
        } else {
            scoreRing.style.stroke = "var(--danger)";
        }

        // Configure recommendation banner
        const status = data.final_recommendation.status;
        const explanation = data.final_recommendation.explanation;
        
        recStatus.textContent = status;
        recExplanation.textContent = explanation;

        recommendationBanner.className = "recommendation-banner"; // reset
        if (status === "Ready to Deploy") {
            recommendationBanner.classList.add("status-ready");
            recIcon.className = "fa-solid fa-circle-check";
        } else if (status === "Needs Minor Fixes") {
            recommendationBanner.classList.add("status-warning");
            recIcon.className = "fa-solid fa-triangle-exclamation";
        } else {
            recommendationBanner.classList.add("status-danger");
            recIcon.className = "fa-solid fa-circle-xmark";
        }

        // Requirements clarity card
        const clarity = data.clarity.status;
        clarityStatus.textContent = clarity;
        clarityStatus.className = "badge"; // reset
        if (clarity === "High") {
            clarityStatus.classList.add("badge-success");
        } else if (clarity === "Medium") {
            clarityStatus.classList.add("badge-warning");
        } else {
            clarityStatus.classList.add("badge-danger");
        }
        clarityDesc.textContent = data.clarity.description;

        // Missing requirements list
        missingReqsList.innerHTML = data.missing_requirements
            .map(item => `<li>${escapeHTML(item)}</li>`)
            .join("");

        // Security risks list
        securityRisksList.innerHTML = data.security_risks
            .map(item => `<li>${escapeHTML(item)}</li>`)
            .join("");

        // Edge Cases
        edgeCasesList.innerHTML = data.edge_cases
            .map(item => `<li>${escapeHTML(item)}</li>`)
            .join("");

        // Testing Recommendations
        testingRecsList.innerHTML = data.testing_recommendations
            .map(item => `<li>${escapeHTML(item)}</li>`)
            .join("");

        // Monitoring & Logging
        monitoringList.innerHTML = data.monitoring_logging
            .map(item => `<li>${escapeHTML(item)}</li>`)
            .join("");

        // Custom Checklist Items
        checklistItems.innerHTML = data.deployment_readiness.checklist
            .map((item, index) => `
                <div class="checklist-item" data-index="${index}">
                    <div class="chk-checkbox"></div>
                    <div class="checklist-info">
                        <h4>${escapeHTML(item.title)}</h4>
                        <p>${escapeHTML(item.description)}</p>
                    </div>
                </div>
            `).join("");

        // Add Event Listeners for Checklist toggling
        const checkItems = checklistItems.querySelectorAll(".checklist-item");
        checkItems.forEach(item => {
            item.addEventListener("click", () => {
                item.classList.toggle("checked");
            });
        });
    }

    // Copy Summary details to Clipboard
    copySummaryBtn.addEventListener("click", () => {
        if (!currentReviewData) return;

        const projectName = reportProjectName.textContent;
        const score = currentReviewData.score;
        const status = currentReviewData.final_recommendation.status;
        const explanation = currentReviewData.final_recommendation.explanation;

        const clarityVal = currentReviewData.clarity.status;
        const missing = currentReviewData.missing_requirements.map(item => `- ${item}`).join("\n");
        const security = currentReviewData.security_risks.map(item => `- ${item}`).join("\n");
        const edges = currentReviewData.edge_cases.map(item => `- ${item}`).join("\n");

        const summaryText = `LAUNCHGUARD AI REPORT - PRE-FLIGHT DEPLOYMENT ASSESSMENT
================================================================
Project: ${projectName}
Readiness Score: ${score}%
Final Recommendation: ${status}
Details: ${explanation}

SUMMARY DETAILS:
----------------------------------------------------------------
1. Requirements Clarity: ${clarityVal}
2. Key Missing Requirements:
${missing}
3. Critical Security & Privacy Risks:
${security}
4. Crucial Edge Cases to Address:
${edges}

Verify items and ensure safety parameters are met before push to production.
================================================================
Generated via LaunchGuard AI`;

        navigator.clipboard.writeText(summaryText)
            .then(() => {
                showToast("Assessment summary copied to clipboard!");
            })
            .catch(err => {
                console.error("Clipboard copy failed: ", err);
                showToast("Failed to copy summary to clipboard.");
            });
    });

    // Export to CSV Action
    exportCsvBtn.addEventListener("click", () => {
        if (!currentReviewData) return;

        const projectName = reportProjectName.textContent;
        const rows = [
            ["Category", "Item", "Status/Details"]
        ];

        // Overview
        rows.push(["Overview", "Project Name", projectName]);
        rows.push(["Overview", "Readiness Score", `${currentReviewData.score}%`]);
        rows.push(["Overview", "Final Recommendation", currentReviewData.final_recommendation.status]);
        rows.push(["Overview", "Recommendation Details", currentReviewData.final_recommendation.explanation]);

        // Requirements Clarity
        rows.push(["Requirements Clarity", "Clarity Rating", currentReviewData.clarity.status]);
        rows.push(["Requirements Clarity", "Feedback", currentReviewData.clarity.description]);

        // Missing Requirements
        currentReviewData.missing_requirements.forEach((item, idx) => {
            rows.push(["Missing Requirements", `Item ${idx + 1}`, item]);
        });

        // Security Risks
        currentReviewData.security_risks.forEach((item, idx) => {
            rows.push(["Security Risks", `Risk ${idx + 1}`, item]);
        });

        // Edge Cases
        currentReviewData.edge_cases.forEach((item, idx) => {
            rows.push(["Edge Cases", `Case ${idx + 1}`, item]);
        });

        // Testing Recommendations
        currentReviewData.testing_recommendations.forEach((item, idx) => {
            rows.push(["Testing", `Recommendation ${idx + 1}`, item]);
        });

        // Monitoring & Logging
        currentReviewData.monitoring_logging.forEach((item, idx) => {
            rows.push(["Monitoring & Logging", `Suggestion ${idx + 1}`, item]);
        });

        // Generate CSV File
        const csvString = rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `launchguard_assessment_${projectName.toLowerCase().replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast("Assessment CSV exported successfully!");
    });

    // Card Specific Copy to Clipboard Action (Delegated Listener)
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-copy-card");
        if (!btn) return;

        e.stopPropagation();
        const target = btn.getAttribute("data-target");
        if (!target || !currentReviewData) return;

        let textToCopy = "";
        let label = "";

        switch (target) {
            case "clarity":
                textToCopy = `Requirements Clarity Rating: ${currentReviewData.clarity.status}\nDescription: ${currentReviewData.clarity.description}`;
                label = "Clarity rating";
                break;
            case "missing":
                textToCopy = `Missing Requirements:\n${currentReviewData.missing_requirements.map(item => `- ${item}`).join("\n")}`;
                label = "Missing requirements";
                break;
            case "security":
                textToCopy = `Security & Privacy Risks:\n${currentReviewData.security_risks.map(item => `- ${item}`).join("\n")}`;
                label = "Security risks";
                break;
            case "edge":
                textToCopy = `Edge Cases to Handle:\n${currentReviewData.edge_cases.map(item => `- ${item}`).join("\n")}`;
                label = "Edge cases list";
                break;
            case "testing":
                textToCopy = `Testing Recommendations:\n${currentReviewData.testing_recommendations.map(item => `- ${item}`).join("\n")}`;
                label = "Testing recommendations";
                break;
            case "monitoring":
                textToCopy = `Monitoring & Logging Suggestions:\n${currentReviewData.monitoring_logging.map(item => `- ${item}`).join("\n")}`;
                label = "Monitoring & Logging suggestions";
                break;
        }

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showToast(`${label} copied to clipboard!`);
            })
            .catch(err => {
                console.error("Card copy failed: ", err);
                showToast("Failed to copy card details.");
            });
    });

    // Theme Switcher Listener
    if (themeToggle) {
        themeToggle.addEventListener("change", () => {
            if (themeToggle.checked) {
                document.body.classList.add("light-theme");
                localStorage.setItem("theme", "light");
            } else {
                document.body.classList.remove("light-theme");
                localStorage.setItem("theme", "dark");
            }
        });
    }
});
