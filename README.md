# Nuxt Expenses App

A sleek and efficient expense tracking application built with Nuxt.js.

## 🚀 Getting Started

Follow these steps to get the application up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v22 or higher)
- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/) (install with `npm install -g pnpm`)

### Installation

1. **Install pnpm** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Clone the repository**:
   ```bash
   git clone https://github.com/kirurr/nuxt-finance-management-app.git
   cd nuxt-finance-management-app
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

5. **Set up Turso Database**:
   - [Create a Turso database](https://app.turso.tech/)
   - In the database overview, copy the database URL
   - In the database overview, create a new read & write token
   - Update your `.env` file with those details according to the `.env.example` file

6. **Generate Authentication Secret**:
   - Visit [Better Auth](https://www.better-auth.com/docs/installation#set-environment-variables) to generate an auth secret
   - Or, run the following command to generate a random secret:
    ```bash
    openssl rand -base64 32
    ```
   - Add the secret to your `.env` file

7. **Install dependencies**:
   ```bash
   pnpm install
   ```

8. **Apply the database schema**:
     ```bash
     pnpm db:push
     ```

9. **Populate the database**:
   - Run the following command to populate the database with sample data:
     ```bash
     pnpm db:seed
     ```

10. **Build the application**:
   ```bash
   pnpm build
   ```

11. **Start the application**:
   ```bash
   pnpm start
   ```

12. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 📝 Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `TURSO_DATABASE_URL` - Your Turso database URL
- `TURSO_AUTH_TOKEN` - Your Turso authentication token
- `BETTER_AUTH_SECRET` - Your Better Auth secret
