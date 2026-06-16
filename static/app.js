document.addEventListener("DOMContentLoaded", () => {
    const projectForm = document.getElementById("projectForm");
    const clearBtn = document.getElementById("clearBtn");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    const spinner = submitBtn.querySelector(".spinner");

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
});
