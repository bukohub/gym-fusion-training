# Gym Management System

A complete gym management system built with Node.js (NestJS) backend and React frontend, featuring user management, membership tracking, payment processing, class scheduling, and inventory management.

## 🚀 Features

- **User & Role Management**: Registration, login, password recovery, and role-based permissions (admin, receptionist, trainer, client)
- **Membership Management**: Create, edit, and renew plans (monthly, quarterly, yearly) with expiration tracking
- **Payments & Invoicing**: Payment records (cash, card, transfer), PDF invoice generation, and financial reports
- **Class & Trainer Scheduling**: Calendar to schedule classes, assign trainers, and allow online bookings
- **Access Control**: Optional integration with QR code scanner or fingerprint reader for member check-in
- **Inventory Management**: Manage products (supplements, sportswear) and stock control
- **Reports & Statistics**: Charts for revenue, client attendance, upcoming expirations, and class usage
- **Admin Dashboard**: Key KPIs displayed in a responsive dashboard
- **Secure REST API**: JWT authentication, request validation, and modular architecture
- **Responsive Design**: Modern, intuitive, and mobile-friendly UI

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: Class Validator & Joi
- **Documentation**: Swagger/OpenAPI
- **PDF Generation**: Puppeteer

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query & Context API
- **Forms**: React Hook Form with Yup validation
- **UI Components**: Headless UI
- **Icons**: Heroicons & Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd gym-management-system
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set up the database
```bash
# Create a PostgreSQL database
createdb gym_management

# Copy environment variables
cd ../backend
cp .env.example .env

# Edit .env with your database connection details
# DATABASE_URL="postgresql://username:password@localhost:5432/gym_management?schema=public"
```

### 4. Run database migrations
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### 5. Seed the database (optional)
```bash
npm run seed
```

### 6. Start the development servers
```bash
# Terminal 1: Start backend
cd backend
npm run start:dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

## 📁 Project Structure

```
gym-management-system/
├── backend/                 # NestJS backend
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── memberships/    # Membership management
│   │   ├── payments/       # Payment processing
│   │   ├── classes/        # Class scheduling
│   │   ├── products/       # Inventory management
│   │   ├── reports/        # Reports and analytics
│   │   └── common/         # Shared utilities
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/gym_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRATION="24h"
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

## 🏃‍♂️ Running in Production

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with your preferred web server
```

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

### Frontend
```bash
cd frontend
npm run test
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:3000/api/docs to view the interactive Swagger documentation.

## 🔐 Default Admin User

After seeding the database, you can log in with:
- **Email**: admin@gym.com
- **Password**: admin123

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

## 🎯 Roadmap

- [ ] Implement membership management module
- [ ] Add payment processing with PDF invoices
- [ ] Create class scheduling system
- [ ] Build QR code access control
- [ ] Add inventory management
- [ ] Implement comprehensive reporting
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-gym support
- [ ] Integration with fitness trackers