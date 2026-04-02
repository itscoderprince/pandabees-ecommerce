<div align="center">

<img src="public/images/favicon.ico" alt="PandaBees Logo" width="80" height="80" style="border-radius: 16px;" />

# 🐼 PandaBees

### A Modern Full-Stack Ecommerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-Components-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

<br />

> ✨ **Built for performance, security, and a premium admin experience.**  
> Full-stack Ecommerce with role-based access, two-factor authentication, and a beautiful admin dashboard.

<br />

![App Preview Placeholder](https://placehold.co/900x400/0f172a/7c3aed?text=PandaBees+Admin+Panel)

</div>

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | ![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?logo=nextdotjs) |
| **UI Library** | ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white) |
| **Components** | ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-000?logo=shadcnui&logoColor=white) |
| **Icons** | ![Lucide](https://img.shields.io/badge/Lucide-React-f97316?logo=lucide&logoColor=white) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white) |
| **Auth & Security** | ![Jose](https://img.shields.io/badge/JWT-jose-F59E0B?logo=jsonwebtokens&logoColor=white) + ![bcrypt](https://img.shields.io/badge/bcryptjs-Password_Hashing-0f172a) |
| **State Management** | ![Redux](https://img.shields.io/badge/Redux_Toolkit-+_Persist-764ABC?logo=redux&logoColor=white) |
| **Forms** | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-+_Zod-EC4899?logo=reacthookform&logoColor=white) |
| **Email** | ![Nodemailer](https://img.shields.io/badge/Nodemailer-OTP_Delivery-22c55e) |
| **Notifications** | ![Sonner](https://img.shields.io/badge/Sonner-Toasts-F59E0B) |
| **Theme** | ![next-themes](https://img.shields.io/badge/next--themes-Dark_Mode-7c3aed) |
| **HTTP Client** | ![Axios](https://img.shields.io/badge/Axios-REST_Client-5A29E4?logo=axios&logoColor=white) |

---

## ✨ Features

### 🔐 Authentication
- **Two-Phase Login Flow** — Email → OTP verification for enhanced security
- **JWT Session Management** — Secure `httpOnly` cookie-based sessions (7-day expiry)
- **Password Hashing** — Industry-standard bcryptjs encryption
- **Email Verification** — Activation link for new accounts via Nodemailer
- **OTP Resend** — 60-second cooldown with live timer

### 🛒 Admin Panel
- **Responsive Sidebar** — Collapsible with icon-only mode and smooth transitions
- **Dynamic Breadcrumbs** — Auto-generated from route context
- **Dark / Light Mode** — Animated Sun/Moon toggle with `next-themes`
- **Real-time Search** — Searchbar in the top navigation bar

### 📦 E-Commerce Management
| Module | Route |
|---|---|
| 📊 Dashboard | `/admin` |
| 🛍️ Products | `/admin/products` |
| 🗂️ Categories | `/admin/categories` |
| 📋 Orders | `/admin/orders` |
| 👥 Customers | `/admin/customers` |
| 🖼️ Banners & Media | `/admin/banners` |
| 🎟️ Coupons | `/admin/coupons` |
| ❓ FAQs | `/admin/faqs` |
| 📈 Analytics | `/admin/analytics` |
| ⚙️ Settings | `/admin/settings` |

---

## 🗂️ Project Structure

```
pandabees-ecommerce/
├── 📂 app/
│   ├── 📂 (root)/
│   │   ├── 📂 (admin)/admin/      # Admin panel layout & pages
│   │   └── 📂 (auth)/auth/        # Login, Register, Verify
│   ├── 📂 api/
│   │   └── 📂 auth/               # login / logout / register / otp
│   └── layout.js                  # Root layout (ThemeProvider)
├── 📂 components/
│   ├── 📂 shared/                 # Reusable: LogoutButton, Searchbar, DynamicBreadcrumb
│   ├── 📂 ui/                     # shadcn/ui components
│   ├── app-sidebar.jsx            # Admin sidebar navigation
│   ├── nav-main.jsx               # Main nav links
│   ├── nav-projects.jsx           # Management section links
│   └── nav-user.jsx               # User profile dropdown
├── 📂 store/
│   └── 📂 reducer/
│       └── authReducer.js         # Redux auth slice
├── 📂 configs/                    # DB, Email, Env config
├── 📂 models/                     # Mongoose models
├── 📂 lib/                        # Helpers, Zod schemas, JWT utils
├── 📂 routes/
│   ├── Admin.Route.js             # Centralized admin routes
│   └── Website.Route.js          # Public routes
└── 📂 emails/                     # Email templates (OTP, Verification)
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** `>= 20.x`
- **MongoDB** instance (local or Atlas)
- **SMTP** credentials for email delivery (Gmail, Resend, etc.)

### 1. Clone the repository

```bash
git clone https://github.com/itscoderprince/pandabees-ecommerce.git
cd pandabees-ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/pandabees

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth
JWT_SECRET=your_super_secret_jwt_key_here

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="PandaBees <noreply@pandabees.com>"
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔒 Security

- All admin routes are protected via **JWT cookie verification**
- Passwords are hashed using **bcryptjs** before storage
- OTP codes are **time-limited** (10 mins) and auto-deleted after use
- Cookies are marked `httpOnly`, `SameSite: lax`, and `Secure` in production
- Zod schemas validate **all incoming API request bodies**

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your proposed changes.

```bash
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "feat: add amazing feature"

# Push to the branch
git push origin feature/amazing-feature
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ by **PandaBees Team**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-7c3aed?style=for-the-badge)](#)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-000?style=for-the-badge&logo=github)](https://github.com/)

</div>
