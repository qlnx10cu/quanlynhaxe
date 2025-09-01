# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vietnamese automotive service management system ("Quản lý nhà xe") with two main components:
- **MuoiCu_Server**: Backend Node.js/Express API server
- **app**: Frontend React application

## Architecture

### Backend (MuoiCu_Server)
- **Framework**: Express.js with Socket.io for real-time features
- **Database**: MySQL with connection pooling (mysql2)
- **Authentication**: JWT + Passport.js
- **Template Engine**: Handlebars for server-side rendering
- **Key Libraries**: 
  - ExcelJS for spreadsheet operations
  - Puppeteer for PDF generation
  - Nodemailer for email notifications
  - Zalo API integration for messaging

### Frontend (app)
- **Framework**: React with Redux for state management
- **Build System**: Gulp + Browserify
- **Styling**: Styled Components
- **Real-time**: Socket.io client

### Database Structure
- Models follow an Abstract class pattern in `MuoiCu_Server/models/`
- Key entities: Customer, Bill, BillLe, BillSuachua, Employee, Item, ItemPart, ItemAccessary
- Connection pooling with configurable limits

## Development Commands

### Backend Server
```bash
cd MuoiCu_Server
npm install          # Install dependencies
npm run dev         # Development with nodemon (auto-restart)
npm start           # Production mode
```

### Frontend Application
```bash
cd app
npm install          # Install dependencies
npm start           # Development with live reload (gulp live)
npm run build       # Build for production (gulp dev)
npm run prod        # Production build (gulp prod)
npm run lint        # Run linting
npm run pretty      # Format code with Prettier
```

### Build Process
The `build_app.sh` script automatically builds the frontend and copies it to the server's public directory before starting the server.

## Configuration

### Environment Variables
Create `.env` files in both `MuoiCu_Server/` and `app/` directories:

**MuoiCu_Server/.env**:
- `PORT`: Server port (default: 8080)
- `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_HOST`, `DB_PORT`: MySQL connection
- `LIMIT`: Database connection pool limit
- `secret_key`, `expires_in`: JWT configuration
- `ENABLE_EMAIL`, `ENABLE_ZNS`, `ENABLE_ZCC`: Feature flags

**app/.env**:
- `API_HOST`: Backend API URL
- `NODE_ENV`: Environment mode
- `SKIP_PREFLIGHT_CHECK=true`

## Database Migrations
SQL migration files are in `MuoiCu_Server/migrations/` - run these in order when setting up the database.

## Backup
The `backup_database.sh` script backs up MySQL to Google Drive using rclone (requires DB_USER and DB_PASS environment variables).

## API Structure
- Routes defined in `MuoiCu_Server/routes/`
- Controllers in `MuoiCu_Server/controllers/`
- RESTful endpoints for each entity (Customer, Bill, Employee, etc.)
- Socket.io events for real-time updates

## Testing
No automated tests are currently configured. Manual testing recommended for all features.

## Key Business Features
- Customer management (Khách hàng)
- Retail billing (Bán lẻ)
- Repair service billing (Sửa chữa)
- Employee management and timekeeping (Nhân viên, Chấm công)
- Inventory management (Parts and Accessories)
- Statistics and reporting (Thống kê)
- Integration with Zalo for customer notifications