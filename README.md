# CareConnect 🩺

CareConnect is a full-stack web application designed to connect patients with doctors, allowing for easy online appointment scheduling and management. It features a role-based system for patients, doctors, and administrators, built with a modern tech stack.

## Features

* **Role-Based Access Control**: Separate dashboards and permissions for **Patients**, **Doctors**, and **Admins**.
* **Secure Authentication**: End-to-end authentication using **JWT** (JSON Web Tokens) and **Spring Security**.
* **Patient Dashboard**: View, book, cancel, and reschedule appointments.
* **Doctor Dashboard**: View and manage daily/weekly appointment schedules.
* **Admin Dashboard**: Register new doctors, manage existing doctors, and view all users.
* **Dynamic Availability**: Doctors can have unique weekly schedules, and the system generates available timeslots in real-time.
* **Containerized Environment**: The entire application stack (Frontend, Backend, Database) runs in Docker containers orchestrated by **Docker Compose**.

## Tech Stack

* **Backend**: Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate, Maven
* **Frontend**: React, Vite, Axios, React Router
* **Database**: MySQL
* **DevOps**: Docker, Docker Compose

## Project Structure
This project is a monorepo containing the frontend and backend applications.

```bash
CareConnect-Project/
├── docker-compose.yml
├── .env
├── start-dev.bat
├── start-dev.sh
├── appointment-system/      (Backend: Spring Boot)
└── healthcare-appointment-frontend/ (Frontend: React)
```

## Getting Started

### Prerequisites
* Docker & Docker Compose
* Java 21+
* Maven 3+
* Node.js 20+

### How to Run
1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd CareConnect-Project
    ```
2.  **Create the Environment File**: Create a `.env` file in the root directory and add your database password:
    ```
    MYSQL_PASSWORD=your_secure_password
    ```
3.  **Build the Backend**: Before starting Docker, you must compile the backend code. Navigate into the backend folder and run the Maven package command.
    ```bash
    cd appointment-system
    mvn clean package -DskipTests
    cd ..
    ```
4.  **Run the Application**: Now, from the root `CareConnect-Project` folder, start the application.
    ```bash
    docker-compose up --build
    ```
5.  **Access the Application**:
    * Frontend (React App): **`http://localhost:3000`**
    * Backend API: **`http://localhost:8085`**

## Default Login Credentials
The application is seeded with the following demo users on startup:

* **Patient**:
    * **Email**: `patient@example.com`
    * **Password**: `password123`
* **Doctor**:
    * **Email**: `doctor@example.com`
    * **Password**: `password123`
* **Admin**:
    * **Email**: `admin@example.com`
    * **Password**: `admin123`
