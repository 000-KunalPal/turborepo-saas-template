# 🚀 Turborepo Next.js Monorepo

[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Turso](https://img.shields.io/badge/Turso-4D4D4D?style=for-the-badge&logo=sqlite&logoColor=white)](https://turso.tech/)
[![Drizzle](https://img.shields.io/badge/Drizzle-0000FF?style=for-the-badge&logo=drizzle&logoColor=white)](https://orm.drizzle.team/)
[![Auth.js](https://img.shields.io/badge/Auth.js-000000?style=for-the-badge&logo=auth0&logoColor=white)](https://authjs.dev/)

Welcome to our cutting-edge Turborepo monorepo! This project showcases a fully functional, production-grade setup with Next.js apps, database integration, authentication, and a sleek UI system.

## 🌟 Features

- 📦 Monorepo structure using Turborepo
- 🖥️ Two Next.js applications: Web and Docs
- 🔐 Authentication powered by Auth.js
- 📨 Email functionality with Resend
- 🎨 Beautiful UI components with shadcn/ui
- 🗃️ Database integration using Turso with Drizzle ORM
- 📚 Comprehensive documentation

## 🛠️ Tech Stack

- [Turborepo](https://turbo.build/repo) - Monorepo management
- [Next.js](https://nextjs.org/) - React framework
- [Auth.js](https://authjs.dev/) - Authentication
- [Resend](https://resend.com/) - Email service
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Turso](https://turso.tech/) - Database
- [Drizzle ORM](https://orm.drizzle.team/) - ORM for Turso

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up your environment variables (see `.env.example` in each app)

4. Run the development server:
   ```bash
   pnpm run dev
   ```

## 📁 Project Structure

```
.
├── apps
│   ├── web
│   └── docs
├── packages
│   ├── db
│   ├── emails
│   ├── ui
│   ├── config
│   └── utils
├── package.json
└── turbo.json
```

## 🔧 Available Scripts

- `pnpm run dev` - Start all apps in development mode
- `pnpm run build` - Build all apps and packages
- `pnpm run lint` - Lint all apps and packages
- `pnpm run test` - Run tests across the monorepo

## 🎨 UI Components

We're using [shadcn/ui](https://ui.shadcn.com/) for our UI components. Check out these amazing components:

1. [Button](https://ui.shadcn.com/docs/components/button)
2. [Dialog](https://ui.shadcn.com/docs/components/dialog)
3. [Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu)
4. [Tabs](https://ui.shadcn.com/docs/components/tabs)
5. [Toast](https://ui.shadcn.com/docs/components/toast)

## 🌟 Show Your Support

If you find this project useful, please consider giving it a star on GitHub! Your support helps us continue to improve and maintain this project.

[![GitHub stars](https://img.shields.io/github/stars/yourusername/your-repo-name.svg?style=social&label=Star)](https://github.com/yourusername/your-repo-name)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/your-repo-name/issues).

---

<p align="center">
  Made with ❤️ by Kunal Pal
</p>
