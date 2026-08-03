# AgriSmart - Smart Farming & Precision Agriculture Management System 🌾🚜

A modern, role-based Smart Farming and Precision Agriculture Management System built with **Spring Boot**, **React.js**, **Spring Security (JWT)**, and **JPA**.

---

## 📌 Features

- 🔑 **Authentication & Role-Based Access (RBAC)**: Support for Farmers, Field Officers, Agricultural Officers, System Administrators, and Guests.
- 🌾 **Farm Registration & Parcel Mapping**: Register farms, track soil types, acreage, and location parameters.
- 📅 **Crop Season Management**: Plan crops, sowing dates, expected harvest windows, and actual yields.
- 📡 **IoT Soil & Weather Sensors**: Monitor real-time metrics including soil moisture, temperature, humidity, pH, and NPK levels.
- 💧 **Precision Irrigation & Fertiliser Scheduling**: Data-driven recommendation engine for precision farming inputs.
- 🐛 **Pest & Disease Detection**: Image analysis alert system for pest management.
- 📈 **Yield & Financial Analytics**: Comprehensive dashboard for tracking input costs, yield history, and farm profitability.

---

## 🛠️ Technology Stack

* **Backend**: Java 21, Spring Boot 3.2.5, Spring Security, Spring Data JPA, Hibernate, Lombok
* **Frontend**: React 19, Vite, React Router DOM v7, Recharts, Framer Motion, Tailwind/CSS
* **Documentation**: OpenAPI 3.0 / Swagger UI
* **Database**: MySQL / PostgreSQL (JPA compatible)

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```
* **REST API**: Runs at `http://localhost:8080`
* **Swagger API UI**: Access `http://localhost:8080/swagger-ui/index.html`

### 2. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```
* **Web Portal**: Access `http://localhost:5173`

---

## 📄 License & Specification
Developed according to the **Software Requirements Specification (SRS)** for Smart Farming and Precision Agriculture Management System.
