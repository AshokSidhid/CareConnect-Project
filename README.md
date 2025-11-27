# CareConnect 🩺

CareConnect is a comprehensive full-stack web application designed to streamline the connection between patients and doctors. It facilitates secure user authentication, role-based dashboards, and a dynamic appointment scheduling system with real-time availability checks.

## 🌟 Features

### Core Functionality
* **Role-Based Access Control (RBAC)**: Distinct portals and permissions for **Patients**, **Doctors**, and **Admins**.
* **Secure Authentication**: End-to-end security using **JWT** (JSON Web Tokens), Spring Security, and BCrypt password hashing.
* **Dynamic Doctor Availability**: Doctors have specific weekly working hours (e.g., Mon 9-5, Wed 10-2). The system automatically calculates and offers available time slots to patients.

### User Portals
* **Patient Dashboard**: 
    * Browse doctor profiles and specializations.
    * Book appointments based on real-time slot availability.
    * **Reschedule** existing appointments with conflict detection.
    * Cancel upcoming appointments.
    * Manage personal profile details.
* **Doctor Dashboard**: 
    * View upcoming daily/weekly schedule.
    * Access detailed patient information for scheduled appointments.
* **Admin Dashboard**: 
    * Register new doctors and assign them to specific specializations.
    * Manage existing doctors (view/delete).

## 🛠️ Tech Stack

### Frontend
* **React (Vite)**: Fast, modern UI development.
* **Axios**: For API communication and interceptors.
* **React Router**: For client-side routing and protected paths.
* **CSS Modules**: For modular and scoped styling.

### Backend
* **Java 21**: The latest LTS version of Java.
* **Spring Boot 3**: For building robust RESTful APIs.
* **Spring Security**: For authentication and authorization.
* **Spring Data JPA / Hibernate**: For ORM and database interactions.
* **Maven**: For dependency management and build automation.

### Database & DevOps
* **MySQL 8.0**: Relational database for persistent storage.
* **Docker & Docker Compose**: For containerizing the full stack (Frontend, Backend, DB).
* **Kubernetes (K8s)**: For container orchestration and scaling.
* **Ansible**: For automating the Kubernetes deployment process.

---

## 🚀 Getting Started

### Prerequisites
* Docker & Docker Compose
* Java 21+ & Maven 3+ (for local builds)
* Node.js 20+ (for local frontend dev)

### Option 1: Quick Start (Docker Compose)
This is the easiest way to run the full application locally.

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd CareConnect-Project
    ```
2.  **Create the Environment File**: Create a `.env` file in the root directory:
    ```env
    MYSQL_PASSWORD=your_secure_password
    ```
3.  **Build the Backend**:
    ```bash
    cd appointment-system
    mvn clean package -DskipTests
    cd ..
    ```
4.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
5.  **Access the App**:
    * Frontend: **`http://localhost:3000`**
    * Backend API: `http://localhost:8085`

### Option 2: Kubernetes Deployment (with Ansible)
If you have a Kubernetes cluster (like Docker Desktop K8s or Minikube), you can use the included Ansible playbook.

1.  **Navigate to the Ansible directory**:
    ```bash
    cd ansible
    ```
2.  **Run the Playbook** (Requires WSL on Windows or Linux):
    ```bash
    ansible-playbook -i hosts.ini deploy.yaml --ask-become-pass
    ```
    *This automates the creation of Secrets, Deployments, and Services.*

3.  **Access the App**:
    * Frontend: **`http://localhost`** (Port 80)

---

## ✅ Verification Steps

Use these steps to confirm that your Kubernetes deployment was successful and is fully operational.

### 1. Verify Kubernetes (The "State")
Concept: Prove that the "manifests" (YAML files) Ansible applied actually created running resources.

**A. Check the Pods (The Containers)**
* **Command:**
    ```bash
    kubectl get pods
    ```
* **Explanation:**
    * Show that there are **3 Pods** (`frontend`, `backend`, `mysql`).
    * **STATUS: `Running`**: They are alive.
    * **READY: `1/1`**: The internal processes are healthy.

**B. Check the Services (The Networking)**
* **Command:**
    ```bash
    kubectl get services
    ```
* **Explanation:**
    * **`mysql` (ClusterIP)**: Only visible internally. Backend talks to this.
    * **`backend` (LoadBalancer)**: Exposed on `localhost:8085`.
    * **`frontend` (LoadBalancer)**: Exposed on `localhost:80`. This is the entry point for users.

**C. Check the Secrets (The Security)**
* **Command:**
    ```bash
    kubectl get secrets
    ```
* **Explanation:**
    * Show `db-credentials`.
    * This confirms that passwords are **not** hardcoded in the YAML files; they are stored securely here and injected into the containers as Environment Variables.

### 2. Verify Functionality (The "End-to-End" Test)
Concept: Prove the Frontend talks to the Backend, and the Backend talks to the Database.

**A. Frontend Loading (UI Check)**
* **Action:** Open browser to **`http://localhost`**.
* **Result:** The "CareConnect" homepage loads.
* **Proof:** This proves the **Frontend Pod** is running and Nginx is serving files.

**B. Backend Connectivity (API Check)**
* **Action:** Open browser to **`http://localhost:8085/api/doctors`**.
* **Result:** You see a JSON list of doctors (or an empty list `[]` if public access is disabled).
* **Proof:** This proves the **Backend Pod** is running and accepting HTTP requests.

---

## 🔐 Default Login Credentials

The application creates sample data on startup (via `DataLoader.java`) if the database is empty.

### Patient
* **Email**: `patient@example.com`
* **Password**: `password123`

### Doctor
* **Email**: `doctor@example.com`
* **Password**: `password123`
* *(Other sample doctors: `sarah.chen@example.com`, `michael.lee@example.com` - same password)*

### Admin
* **Email**: `admin@example.com`
* **Password**: `admin123`

---

## 📂 Project Structure

```text
CareConnect-Project/
├── appointment-system/              # Spring Boot Backend
│   ├── src/main/java/.../entity     # Database Models
│   ├── src/main/java/.../controller # API Endpoints
│   ├── src/main/java/.../service    # Business Logic
│   └── Dockerfile
├── healthcare-appointment-frontend/ # React Frontend
│   ├── src/pages/                   # UI Pages (Dashboards, Profiles)
│   ├── src/context/                 # AuthContext (State Management)
│   └── Dockerfile
├── k8s/                             # Kubernetes Manifests
├── ansible/                         # Ansible Automation Playbooks
├── docker-compose.yml               # Docker Compose Config
└── .env                             # Secrets (Not committed)
