# Fileden

A modern file storage and management web application built with Next.js, TypeScript, Tailwind CSS, and Appwrite.

## Features

- User authentication (sign up, sign in, OTP)
- File upload, download, and preview
- File type icons and thumbnails
- Recent files and file sorting
- Pagination and search
- Responsive design with mobile sidebar
- Storage usage details
- Appwrite integration for backend services

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Appwrite](https://appwrite.io/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- Appwrite instance (self-hosted or cloud)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/fileden.git
   cd fileden/my-app
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```
3. Configure Appwrite:

   - Update `src/lib/appwrite/env.ts` with your Appwrite endpoint and project credentials.

4. Run the development server:
   ```sh
   pnpm dev
   # or
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` — Next.js app directory (routing, layouts, pages)
- `src/components/` — UI and functional components
- `src/action/` — Server actions (auth, file storage)
- `src/lib/` — Utility functions and Appwrite client
- `src/store/` — State management
- `public/assets/` — Icons and images

## Customization

- Update branding assets in `public/assets/icons/` and `public/assets/images/`.
- Modify Tailwind config in `tailwind.config.ts`.

## License

MIT

---

> Built with ❤️ using Next.js, Tailwind CSS, and Appwrite.
