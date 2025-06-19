# Startup Backend

A Express.js backend for serving product data, handling user comments, and managing contact form email submissions for a startup website.

## 🔍 Features

- **Endpoints**:
  - `GET /products`: Fetch all products
  - `GET /comments`: Fetch all comments
  - `POST /comments-add`: Add a comment
  - `POST /comments-delete`: delete a comment
  - `POST /send`: Send email to both user and admin
- **Email Integration**:
  - Sends confirmation email using `nodemailer`
  - Email sent to both user and admin
- **JSON-Based Storage**:
  - Reads from and writes to local JSON files (no external DB)

## 🛠️ Packages Used

- **Node.js + Express**
- **Handlebars** (configured with `express-handlebars`, though views are not rendered)
- **Nodemailer** – sends confirmation emails
- **CORS** – for cross-origin frontend communication
- **dotenv** – for environment configuration

## 📁 Data Storage

- Product and comment data stored in JSON files
- All read/write handled through server-side file operations

## 🚀 Run Locally

```bash
git clone https://github.com/Soheil7100Z/Startup-Backend.git
cd Startup-Backend
npm install
node StartUp-Backend.js
