# Christian Life Center (CLC) Tagum City - Portal

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.30-C5F74F?logo=drizzle)](https://orm.drizzle.team/)
[![tRPC](https://img.shields.io/badge/tRPC-11.0-2596be?logo=trpc)](https://trpc.io/)

The Christian Life Center (CLC) Tagum City Portal is a comprehensive community management system designed to streamline church operations, enhance member engagement, and provide a seamless attendance tracking experience. This platform serves as the digital hub for all members to stay connected with the church's mission and activities.

Live Web App: [clctagum.com](https://clctagum.com)

---

## Key Features

### Event Management and Registration
- **Browse Events**: Users can browse a dynamically updated list of upcoming services, conferences, and community gatherings. Each event provides comprehensive details including schedules, locations, and specific ministry information to help members stay connected. This serves as the central hub for all scheduled activities within the church community.
- **Seamless Registration**: The registration flow is designed for speed and efficiency, allowing members to secure their spots in events with minimal effort. It supports various registration types and captures necessary attendee information to help organizers plan effectively. Instant digital confirmations provide peace of mind and clear instructions for the upcoming gathering.
- **E-Receipts**: For every successful registration, the application generates a portable PDF document that serves as an official confirmation or receipt. These documents can be stored on mobile devices for easy access during event entry or shared with relevant parties. This feature provides a professional and paperless way to manage attendance records.

### Attendance Tracking (Smart Scanner)
- **QR Code Scanning**: The application includes a high-performance QR scanner built directly into the mobile interface for rapid attendance marking. It enables ushers and marshals to check in hundreds of attendees per minute during large gatherings or Sunday services. This real-time synchronization ensures that attendance data is always accurate and up to date.
- **Digital ID**: Every registered member is assigned a unique digital QR ID that can be accessed through the "My QR" section of the portal. This personal code simplifies the check-in process, as it carries the member's profile and historical attendance data. It eliminates the need for physical ID cards and speeds up entry into various church functions.
- **Real-time Stats**: Administrative users have access to dynamic dashboards that visualize attendance trends and growth metrics over time. These analytics provide valuable insights into community engagement and help leadership make data-driven decisions for future planning. The data is presented in clear charts and tables for easy interpretation and reporting.

### Community and Ministries
- **Ministry Engagement**: Members can explore a wide variety of ministry opportunities, from the Worship Team and Media to Kid's Church and General Services. Detailed descriptions and responsibility lists help individuals find where their talents and passions align best with the church's needs. The portal facilitates the initial contact and application process for those looking to serve.
- **Clusters and Networks**: The system supports an organized hierarchy of clusters and networks to ensure every member receives proper care and discipleship. This structure allows leaders to track progress and maintain communication within smaller, more manageable sub-groups. It is essential for fostering a sense of belonging and accountability across the entire congregation.
- **Outreach and Locations**: The platform provides detailed information about various outreach programs and satellite church locations within the region. Users can find maps, service times, and contact details for these specific points of impact. This transparency helps the community understand the broader reach and mission of the church.

### Spiritual Growth and Resources
- **The Word**: This dedicated section hosts a rich archive of sermons, spiritual blogs, and daily devotionals authored by church leaders. It provides members with easy access to life-changing messages and study materials that support their personal growth outside of regular services. The content is organized by series and topics for convenient searching and study.
- **Prayer and Fasting**: The portal includes specialized resources and schedules for congregational prayer events and seasonal fasting periods. It lists prayer points and provides a framework for members to participate in unified spiritual disciplines. This feature strengthens the collective prayer life of the church by keeping everyone focused on the same objectives.
- **Giving**: A secure and convenient online gateway allows members to contribute tithes, offerings, and special donations from anywhere. It supports multiple payment methods and provides a transparent way to support the church's various missions and operational needs. This digital platform ensures that financial stewardship remains accessible and straightforward for the modern believer.

### Admin Dashboard
- **Member Management**: The administration area houses a robust database for managing comprehensive records of all church participants and volunteers. It allows authorized staff to update profiles, verify details, and track engagement levels across different ministries. This centralized data source ensures that the church remains connected with its members.
- **Admin Tools**: Staff are equipped with powerful tools for creating events, managing scanning permissions, and generating detailed reports. These utilities streamline back-office operations and reduce the manual workload associated with church administration. Granular permission controls ensure that sensitive data is only accessible to qualified personnel.
- **System Configuration**: The configuration module allows for real-time updates to site-wide content, ministry descriptions, and outreach location details. It provides a simple interface for maintaining the accuracy of the information presented to the public. This ensures that the portal always reflects the current state of the church's activities and structure.

---

## Tech Stack

- **Framework**: Next.js (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with Framer Motion for animations.
- **Database**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM
- **API**: tRPC for end-to-end type-safe APIs.
- **UI Components**: Radix UI and Lucide Icons.
- **PWA**: Fully installable as a Progressive Web App for mobile-like experience.

---

## Project Structure

```text
├── app/                  # Next.js App Router (Pages, Layouts, API)
│   ├── (public)/        # Public-facing website pages
│   ├── admin/           # Admin dashboard and management tools
│   ├── scanner/         # QR Attendance scanner interface
│   ├── registration/    # Event registration flows
│   └── mobile/          # Optimized mobile views
├── components/           # Reusable UI components
├── db/                   # Database schema and Drizzle configuration
├── drizzle/              # Validations and migration files
├── lib/                  # Shared utilities, hooks, and tRPC logic
├── public/               # Static assets (images, icons, manifest)
└── config/               # Static configuration (ministries, locations)
```

---

## Getting Started

### Prerequisites
- Node.js (Latest LTS)
- pnpm or npm
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd clc
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root and add your database credentials.

4. **Sync Database**:
   ```bash
   pnpm db:push
   ```

5. **Run the development server**:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

---

## Location and Contact

Christian Life Center Tagum City  
Cor. Sobrecary and Pioneer Streets,  
Tagum City, Davao del Norte, Philippines 8100  

- **Facebook**: [clctagum](https://www.facebook.com/clctagum)
- **Instagram**: [clctagum](https://www.instagram.com/clctagum)
- **Email**: contact@clctagum.com

---

Developed for the community of faith at Christian Life Center Tagum City.
    