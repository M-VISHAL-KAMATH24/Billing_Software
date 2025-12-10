Kamaths Food Point – Retail Billing Software  
[Built with React (Vite) + Spring Boot + H2]

> Note: This README is based on the current project structure and tech stack described in our conversation and may need small path/command tweaks to match your exact repo layout.[1]

***

## Overview

Kamaths Food Point Billing Software is a full‑stack POS-style application built for a restaurant to manage:

- Order creation and editing  
- Pending orders and payment tracking  
- Printable customer bills  
- A rich Sales Dashboard with daily, monthly, and lifetime revenue analytics and charts  
- A persistent database so data is retained across server restarts[1]

The project is split into:

- `frontend/` – React + Vite app (modern UI, Tailwind‑inspired design)  
- `backend/` – Spring Boot REST API with JPA/Hibernate and H2 file database[1]

***

## Tech Stack

**Frontend**

- React (with Vite bundler)  
- JavaScript / JSX  
- Tailwind‑inspired custom styling (gradients, glassmorphism, responsive grids)[1]
- Axios for API communication  
- React Router for navigation  

**Backend**

- Spring Boot  
- Spring Web (REST)  
- Spring Data JPA / Hibernate  
- H2 file‑based database for persistence (`jdbc:h2:file:./data/kamaths_food`)[1]

***

## Features

### 1. Home Page

- Hero section introducing **Kamaths Food Point** and the billing system  
- Founders section highlighting **Mr. Manjunath Kamath** and **Divya Kamath**  
- Shop section with visuals and a short story about the restaurant  
- Call‑to‑action area and contact footer (location, timing, phone, email)[1]

### 2. Orders Module

- **Add Orders** page to create new customer orders with:
  - Customer name & phone
  - Payment method
  - Notes
  - Dynamic list of order items (name, price, quantity)
- Menu modal to quickly add items from a food menu
- Manual item entry for custom dishes
- Automatic total amount calculation on the frontend and backend
- **Orders** page showing all **pending** orders with:
  - Customer and order metadata
  - Quick items preview and total
  - Actions: Add items, Print bill, Mark Paid, Delete[1]

Printing:

- Generates a clean HTML bill in a new window
- Shows restaurant branding, order details, items table, and grand total  

### 3. Sales Dashboard

- **Today’s Sales** – total paid revenue for the current day  
- **This Month** – current month’s revenue  
- **Lifetime** – sum of all sales recorded  
- “Refresh Data” button to re‑pull the latest stats  
- Visual sections:
  - Bar‑style **Daily Sales Trend (Last 10 Days)** using recent sale records
  - **Recent Transactions** list with amount and date
  - **Weekly Growth** mini‑chart using mocked/aggregated data[1]

### 4. Data Persistence & Flow

- Previously, similar projects used non‑persistent/in‑memory DB; this project uses a **file‑based H2 DB**, so:
  - Orders and sales entries are **stored on disk**
  - Data survives server restarts and temporary disconnections[1]

**Order → Sales flow:**

- Orders are created with status `pending` and stored in `orders` + `order_items`
- When the user clicks **“Mark Paid”**:
  - Backend sets `status = "paid"`
  - A new `Sale` record is inserted with `amount = order.totalAmount`
- Sales dashboard aggregates from the `sales` table for today/month/total and charts[1]

***

## Project Structure (Suggested)

```text
root/
  README.md
  backend/
    pom.xml
    src/main/java/com/kamaths/foodpoint/...
    src/main/resources/
    data/ (H2 database files, created at runtime)
  frontend/
    package.json
    vite.config.js
    src/
      main.jsx
      App.jsx
      pages/
        HomePage.jsx
        AddOrders.jsx
        Orders.jsx
        Sales.jsx
      components/
```

Adapt paths to your actual repo layout if different.[1]

***

## Backend – Setup & Run

### Prerequisites

- Java 21+  
- Maven  

### Configuration

Default H2 file DB URL (in `application.properties`):

```properties
spring.datasource.url=jdbc:h2:file:./data/kamaths_food
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=SA
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
```

This configuration ensures persistence across restarts.[1]

### Key Backend Components

- `Order` + `OrderItem` entities (one‑to‑many via `@ElementCollection` or mapped relation)  
- `Sale` entity with `amount` and `createdAt`  
- `OrderRepository`, `SalesRepository` with custom JPA queries  
- `OrderService`, `SalesService`:
  - `OrderService.markPaymentDone(id)`:
    - Sets status to `"paid"`
    - Calls `salesService.addSale(order.getTotalAmount())`
  - `SalesService`:
    - `addSale(Double amount)` – inserts a `Sale`
    - `getTodaySales()`, `getMonthlySales()`, `getTotalSales()` – aggregate sums with date ranges
- `OrderController` (`/api/orders/...`)  
- `SalesController` (`/api/sales/...`) providing:
  - `/today`, `/total`, `/monthly`, `/recent`, `/trend`[1]

### Running the Backend

From `backend/`:

```bash
mvn clean package
mvn spring-boot:run
```

API base URL (default): `http://localhost:8080/api`  

***

## Frontend – Setup & Run

### Prerequisites

- Node.js (LTS)  
- npm or yarn  

### Install & Run

From `frontend/`:

```bash
npm install
npm run dev
```

Default dev URL: `http://localhost:5173` (Vite).[1]

### Important Frontend Pages

- `HomePage.jsx` – landing page with animated shapes and restaurant branding  
- `AddOrders.jsx` – create orders and add items  
- `Orders.jsx` – manage pending orders and actions (print, mark paid, edit, delete)  
- `Sales.jsx` – sales analytics dashboard consuming backend `/api/sales/...` endpoints[1]

***

## API Endpoints (Summary)

**Orders**

- `POST /api/orders` – create order  
- `GET /api/orders` – list all orders  
- `GET /api/orders/pending` – list pending orders  
- `PUT /api/orders/{id}` – update order (items + totals)  
- `PUT /api/orders/{id}/payment-done` – mark as paid + create sale  
- `DELETE /api/orders/{id}` – delete (only if pending)[1]

**Sales**

- `GET /api/sales/today` – numeric total for today  
- `GET /api/sales/total` – numeric all‑time total  
- `GET /api/sales/monthly` – numeric current month total  
- `GET /api/sales/recent` – recent sale records (for charts & list)  
- `GET /api/sales/trend` – weekly/daily aggregated data (for growth chart)[1]

***

## How to Use

1. Start backend (Spring Boot).  
2. Start frontend (Vite dev server).  
3. Go to `/`:
   - View home page and navigation.  
4. Go to `/add-orders`:
   - Create a new order, add items from menu or manually, save.  
5. Go to `/orders`:
   - See pending orders, print bills, edit orders.  
   - Click **“Mark Paid”** to complete an order and send its total to Sales.  
6. Go to `/sales`:
   - Click **“Refresh Data”** to update stats and charts.[1]

***

## Future Improvements

- Authentication and role‑based access (admin / cashier)  
- Export reports to CSV/PDF  
- More detailed product/category analytics  
- Multi‑branch support and configuration panel[1]



Add a license section here (e.g., MIT, Apache 2.0) depending on how you want to share this project.

[1](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/90730156/822a22f8-0834-4b50-8184-f42a2b88701a/image.jpg)
