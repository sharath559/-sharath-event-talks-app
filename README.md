# LaunchGuard AI 🛡️🚀

**LaunchGuard AI** is a pre-deployment readiness review assistant designed for vibe-coded and AI-generated applications. It scans project architectures, specifications, and configurations to spot potential security hazards, structural oversights, performance edge cases, and logging gaps before they make it to production.

---

## ✨ Features

- **Project Configuration Audit**: Evaluates parameters including project description, tech stack, authentication models, databases, and APIs.
- **Dynamic Heuristic Scoring**: Rates the project from `0` to `100` and assigns a status indicator:
  - 🟢 **Ready to Deploy** (Score >= 85)
  - 🟡 **Needs Minor Fixes** (Score 50 - 84)
  - 🔴 **Not Ready** (Score < 50)
- **Tailored Security Assessments**: Flags vulnerabilities (e.g., lack of authentication, database leak parameters, hardcoded API secrets).
- **Production Checklist**: Instantly compiles checklist actions customized for specific tech stacks (Flask, React, etc.) and hosts (Google Cloud Run, AWS Lambda, Vercel).
- **Clipboard Report Export**: Easily exports the full ready-to-print assessment reports for code reviews.
- **Modern Responsive Design**: Clean, dark-themed dashboard using a glassmorphic look, SVG score gauge, and custom progress indicators.

---

## 🛠️ Project Structure

```text
├── app.py                   # Python Flask backend server and Heuristics engine
├── .gitignore               # Excludes bytecode caches, local env, and IDEs
├── README.md                # Project documentation
├── Documents/
│   └── requirements.txt     # Project dependencies
├── MockData/                # Synthetic test and mock data configurations
│   ├── customer_reviews.json # 3 synthetic customer reviews for a smartphone
│   ├── daily_sales.json     # 7 mock daily sales records
│   ├── users_insert.sql     # 5 SQL INSERT commands for user accounts
│   ├── user_service_config.yaml # Sample configuration for a user microservice
│   └── test_emails.json     # 8 standard and edge-case validation emails
├── templates/
│   └── index.html           # Main application web interface template
└── static/
    ├── app.js               # Frontend validation, loading intervals, and DOM updates
    └── style.css            # Custom UI layouts, animations, and typography styles
```

---

## 🚀 Getting Started

Follow these steps to set up and run LaunchGuard AI locally:

### Prerequisites
Make sure you have **Python 3.8+** installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/sharath559/-sharath-event-talks-app.git
cd -sharath-event-talks-app
```

### 2. Install dependencies
Install the required Flask dependencies from `Documents/requirements.txt`:
```bash
pip install -r Documents/requirements.txt
```

### 3. Run the application
Run the Flask server locally:
```bash
python app.py
```

### 4. Access the web interface
Open your web browser and navigate to:
**[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🖥️ How it Works (Under the Hood)
1. **Developer Inputs Parameters**: Fill in key components of your codebase architecture.
2. **Heuristic Evaluation**: The Flask backend compiles a detailed review based on keyword queries of your specifications (e.g. checking auth patterns, testing targets, risk factors).
3. **Checklist & Telemetry Generation**: The interface displays standard container configurations, telemetry recommendations (Sentry, JSON logging), and custom instructions depending on your chosen database and cloud hosts.
4. **Copy Summary & Verify**: Check items off your production checklist, copy your report, and verify items with team members before pushing code live.

---

## 🧪 Synthetic Mock Data & Configurations

For testing and validation, a set of synthetic data and configurations is provided in the `MockData/` directory:

* **[customer_reviews.json](file:///Users/sharathyakara/agy-cli-projects/bq-releases-notes/MockData/customer_reviews.json)**: A JSON array of 3 smartphone customer reviews with UUID identifiers, ratings, and detailed text logs.
* **[daily_sales.json](file:///Users/sharathyakara/agy-cli-projects/bq-releases-notes/MockData/daily_sales.json)**: A JSON dataset of 7 sequential daily sales entries (revenue, volume, region) ideal for testing reporting charts.
* **[users_insert.sql](file:///Users/sharathyakara/agy-cli-projects/bq-releases-notes/MockData/users_insert.sql)**: Pre-compiled SQL INSERT commands to quickly bootstrap database user tables.
* **[user_service_config.yaml](file:///Users/sharathyakara/agy-cli-projects/bq-releases-notes/MockData/user_service_config.yaml)**: Microservice yaml configuration containing database credentials and API key placeholders.
* **[test_emails.json](file:///Users/sharathyakara/agy-cli-projects/bq-releases-notes/MockData/test_emails.json)**: A collection of 8 test emails combining valid structures, missing elements, wrong domains, and special character edge cases for system testing.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
