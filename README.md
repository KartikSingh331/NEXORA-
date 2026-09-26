# NEXORA — Full-Stack E-Commerce Platform

**NEXORA** is a modern full-stack e-commerce web application built to provide a complete online shopping experience, from user authentication and product discovery to cart management, checkout, payment processing, order tracking, and invoice generation.

The project follows a **client-server architecture** with a React/TypeScript frontend and a Node.js/Express backend connected to MongoDB.

## 🚀 Live Demo

**Live Application:**
https://nexora-n98a.onrender.com

**GitHub Repository:**
https://github.com/KartikSingh331/NEXORA-

---

## 📌 Key Features

### 👤 User Features

* User registration and login
* Authentication and protected routes
* Product browsing and product details
* Category-based product exploration
* Add/remove products from cart
* Update product quantities
* Checkout functionality
* Order placement and order tracking
* Invoice generation
* Payment integration
* Responsive interface for different screen sizes

### 🛠️ Admin Features

* Admin authentication
* Role-based access control
* Product management
* Add, update and delete products
* Order management
* User/order administration
* Admin dashboard for managing the e-commerce platform

### 💳 Payment

The project includes payment-flow implementation with:

* UPI QR payment flow
* Razorpay mock integration
* Order/payment status handling

> Payment functionality in the deployed/demo version may use mock or test flows rather than processing real transactions.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      NEXORA USER     │
                    └──────────┬───────────┘
                               │
                               ▼
                 ┌─────────────────────────┐
                 │   React + TypeScript    │
                 │   Vite + Tailwind CSS   │
                 └────────────┬────────────┘
                              │
                         REST API
                              │
                              ▼
                 ┌─────────────────────────┐
                 │    Node.js + Express    │
                 │      TypeScript API     │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │        MongoDB          │
                 │   Users / Products /    │
                 │    Orders / Payments   │
                 └─────────────────────────┘
```

---

## 🧰 Technology Stack

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS
* REST API integration

### Backend

* Node.js
* Express.js
* TypeScript
* RESTful APIs
* Authentication & authorization

### Database

* MongoDB

### Development Tools

* Git
* GitHub
* npm
* Postman
* VS Code

### Deployment

* Render

---

## 📁 Project Structure

```text
NEXORA/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── package.json
├── README.md
└── ...
```

### Client

The `client` directory contains the complete React frontend including UI components, pages, routing, state handling and API communication.

### Server

The `server` directory contains the Node.js/Express backend responsible for REST APIs, authentication, business logic, database operations and order management.

---

## 🔐 Authentication & Authorization

NEXORA implements authentication and role-based access control.

There are two primary roles:

```text
User
 │
 ├── Browse products
 ├── Manage cart
 ├── Place orders
 └── Track orders

Admin
 │
 ├── Manage products
 ├── Manage orders
 └── Access admin dashboard
```

Protected functionality is restricted according to the authenticated user's role.

---

## 🛒 E-Commerce Workflow

```text
User
 │
 ▼
Browse Products
 │
 ▼
Product Details
 │
 ▼
Add to Cart
 │
 ▼
Checkout
 │
 ▼
Payment
 │
 ▼
Order Created
 │
 ▼
Invoice Generated
 │
 ▼
Order Tracking
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm
* MongoDB / MongoDB Atlas

### 1. Clone Repository

```bash
git clone https://github.com/KartikSingh331/NEXORA-.git
cd NEXORA-
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create the required `.env` file inside the server directory.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add other environment variables required by your payment or cloud-storage configuration.

**Never commit real API keys, database credentials, or secrets to GitHub.**

---

## ▶️ Run the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The backend runs on the configured server port.

---

## 🔌 Backend API

The backend follows a REST API architecture.

Major API areas include:

```text
Authentication
├── Register
├── Login
└── User authentication

Products
├── Get products
├── Get product details
├── Create product
├── Update product
└── Delete product

Orders
├── Create order
├── Get user orders
├── Get order details
└── Update order status

Admin
├── Product management
└── Order management
```

---

## 📊 Core Database Entities

The application manages data related to:

* Users
* Products
* Orders
* Order items
* Payments
* User roles

The backend communicates with MongoDB to store and retrieve application data.

---

## 💡 What This Project Demonstrates

This project demonstrates practical experience with:

* Full-stack web development
* React component-based development
* TypeScript
* REST API development
* Node.js and Express
* MongoDB database integration
* Authentication
* Role-based authorization
* CRUD operations
* E-commerce business logic
* Payment-flow integration
* Order management
* Frontend-backend integration
* Responsive UI development
* Git/GitHub workflow
* Deployment

---

## 📸 Screenshots

Add screenshots of the major application screens here.

Recommended screenshots:

1. Home Page
2. Product Listing
3. Product Details
4. Shopping Cart
5. Checkout
6. Login/Register
7. Order Tracking
8. Invoice
9. Admin Dashboard

Example:

```markdown
![NEXORA Home Page](screenshots/home.png)

![NEXORA Product Page](screenshots/products.png)

![NEXORA Admin Dashboard](screenshots/admin.png)
```

---

## 🔒 Security Notes

For security reasons:

* API keys are stored in environment variables.
* Database credentials are not committed to GitHub.
* Authentication-protected routes restrict unauthorized access.
* Admin functionality is protected using role-based authorization.

---

## 🚀 Future Improvements

Potential improvements include:

* Real-time order notifications
* Product reviews and ratings
* Wishlist functionality
* Advanced search and filtering
* Coupon and discount system
* Real payment gateway production integration
* Email notifications
* Advanced analytics dashboard
* Cloud image optimization
* Automated testing and CI/CD

---

## 👨‍💻 Developer

**Kartik Singh**

B.Tech — Computer Science & Engineering

### Project

**NEXORA — Full-Stack E-Commerce Platform**

Built using:

`React` `TypeScript` `Vite` `Tailwind CSS` `Node.js` `Express.js` `MongoDB`

---

## ⭐ If You Find This Project Useful

Feel free to explore the repository and review the implementation.

**Live Demo:**
https://nexora-n98a.onrender.com

**GitHub:**
https://github.com/KartikSingh331/NEXORA-
