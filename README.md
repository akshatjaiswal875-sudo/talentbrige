<div align="center">

# 🌉 TalentBridge

### Connecting talent with opportunity
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Browse internships, filter by skills/location/stipend, and apply in one place.**

[🚀 Live Demo](https://talentbridge-delta.vercel.app) • [🐛 Report Bug](https://github.com/surendrakumar6350/talentbridge/issues) • [✨ Request Feature](https://github.com/surendrakumar6350/talentbridge/issues)

</div>

---
## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 **For Students**
- 🔍 **Smart Filtering** - Find internships by location, skills, stipend range
- ⚡ **Real-time Search** - Instant results as you type
- 📱 **Responsive Design** - Perfect on all devices
- 🎨 **Modern UI** - Clean interface with shadcn components
- ✅ **Easy Applications** - One-click apply with status tracking

</td>
<td width="50%">

### 👨‍💼 **For Admins**
- 📝 **Post Internships** - Easy internship management
- 📊 **Review Applications** - Track and manage applications
- 📈 **Analytics Dashboard** - View application statistics
- 👥 **User Management** - Manage user accounts
- 🔒 **Secure Auth** - JWT-based authentication

</td>
</tr>
</table>

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Auth | Styling |
|:--------:|:-------:|:--------:|:----:|:-------:|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) | ![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| **Next.js 15** | **API Routes** | **Mongoose** | **jose** | **shadcn/ui** |
| TypeScript | Rate Limiting | Atlas Cloud | Google OAuth | Responsive |

</div>

### Core Technologies
- 🚀 **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- 📘 **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- 🧩 **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- 🗄️ **[MongoDB](https://www.mongodb.com/)** - NoSQL database with Mongoose
- 🔐 **[JWT](https://github.com/panva/jose)** - Secure authentication
- ⚡ **[Redis](https://github.com/luin/ioredis)** - Rate limiting & caching

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/surendrakumar6350/talentbridge.git
   cd talentbridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit .env.local with your values:
   SECRET_JWT=your-jwt-secret
   DB=your-mongodb-connection-string
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) 🎉

### 🎯 Environment Setup
> 📋 Check out [`.env.example`](./.env.example) for all required environment variables

## 📁 Project Structure

```
📦 talentbridge/
├── 🎯 app/                   # Next.js App Router
│   ├── 👨‍💼 admin/            # Admin dashboard & management
│   ├── 🔌 api/               # Backend API routes
│   ├── 💼 internships/       # Public internship pages
│   └── 🔐 auth/              # Authentication pages
├── 🧩 components/            # React components
│   ├── 🎨 ui/               # shadcn/ui components
│   └── 👨‍💼 admin/           # Admin-specific components
├── 🗄️ dbConnection/         # Database schemas & connection
├── 📚 lib/                  # Utilities & helper functions
├── 🎨 public/               # Static assets
└── 📝 types/                # TypeScript type definitions
```

## 🎯 Key Features in Detail

<details>
<summary><b>🔍 Advanced Filtering System</b></summary>

- **Multi-criteria Search**: Filter by profile, location, skills, and stipend
- **Real-time Results**: Instant filtering without page reloads
- **Smart Matching**: Intelligent skill and location matching
- **Range Filters**: Flexible stipend range selection with slider
- **Work Type Options**: Full-time, part-time, and remote options

</details>

<details>
<summary><b>📱 Responsive User Experience</b></summary>

- **Mobile-First Design**: Optimized for all screen sizes
- **Sticky Sidebar**: Filters stay accessible while browsing
- **Loading States**: Smooth skeleton loading animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant with keyboard navigation

</details>

<details>
<summary><b>🔐 Authentication & Security</b></summary>

- **JWT Authentication**: Secure token-based auth
- **Google OAuth**: Easy sign-in with Google accounts
- **Rate Limiting**: Protection against API abuse
- **Secure Routes**: Protected admin and user areas
- **Session Management**: Automatic token refresh

</details>

<details>
<summary><b>👨‍💼 Admin Dashboard</b></summary>

- **Internship Management**: Create, edit, and delete internships
- **Application Tracking**: Monitor and update application status
- **User Analytics**: View statistics and user insights
- **Bulk Operations**: Manage multiple items efficiently
- **Export Data**: Download reports and application data

</details>

## 🤝 Contributing

## 🤝 Contributing

We love contributions! Here's how you can help make TalentBridge even better:

### 🚀 Quick Contribution Guide

1. **🍴 Fork the repository**
2. **🌿 Create your feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **💍 Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **📤 Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **🎯 Open a Pull Request**

### 💡 Contribution Ideas

- 🐛 **Bug fixes** - Help us squash those pesky bugs
- ✨ **New features** - Add exciting functionality
- 📚 **Documentation** - Improve our docs
- 🎨 **UI/UX improvements** - Make it even more beautiful
- � **Performance optimizations** - Speed things up

### 📋 Development Guidelines

- Follow TypeScript best practices
- Use shadcn/ui components when possible
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

<div align="center">




### Built with ❤️ by [Surendra Kumar](https://github.com/surendrakumar6350)

⭐ **Star this repo** if you find it helpful! 

[![GitHub stars](https://img.shields.io/github/stars/surendrakumar6350/talentbridge?style=social)](https://github.com/surendrakumar6350/talentbridge)
[![GitHub forks](https://img.shields.io/github/forks/surendrakumar6350/talentbridge?style=social)](https://github.com/surendrakumar6350/talentbridge)

</div># talent_bridge
# talent_bridge
# talent_bridge
# talent_bridge
# talent_bridge
