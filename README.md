# Blockchain Indexing Platform

A modern web application that enables developers to easily integrate and index Solana blockchain data into their PostgreSQL databases using Helius webhooks.

## Features

- User authentication and database credential management
- Real-time blockchain data indexing using Helius webhooks
- Support for multiple indexing categories:
  - NFT bids
  - NFT prices
  - Token borrow information
  - Token prices
- Secure PostgreSQL database integration
- Modern, responsive UI built with Next.js and Tailwind CSS

## Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- Helius API key
- Solana devnet account (for testing)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blockchain_indexing"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Helius
HELIUS_API_KEY="your-helius-api-key"
HELIUS_WEBHOOK_SECRET="your-helius-webhook-secret"

# Solana
SOLANA_RPC_URL="https://api.devnet.solana.com"
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blockchain-indexing.git
cd blockchain-indexing
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
blockchain-indexing/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   └── webhooks/
│   ├── auth/
│   ├── dashboard/
│   └── layout.tsx
├── components/
├── lib/
│   ├── helius.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── public/
└── styles/
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration

### Database Connections
- `POST /api/db-connections` - Create a new database connection
- `GET /api/db-connections` - List all database connections
- `DELETE /api/db-connections/:id` - Delete a database connection

### Indexing Tasks
- `POST /api/indexing-tasks` - Create a new indexing task
- `GET /api/indexing-tasks` - List all indexing tasks
- `PUT /api/indexing-tasks/:id` - Update an indexing task
- `DELETE /api/indexing-tasks/:id` - Delete an indexing task

### Webhooks
- `POST /api/webhooks/helius` - Helius webhook endpoint for blockchain events

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Migrations
```bash
npx prisma migrate dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Helius](https://helius.xyz/) for providing the blockchain indexing infrastructure
- [Next.js](https://nextjs.org/) for the React framework
- [Prisma](https://www.prisma.io/) for the database ORM
- [Tailwind CSS](https://tailwindcss.com/) for the styling 