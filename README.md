# TradeVault - Virtual Stock Simulator

A comprehensive virtual stock trading platform built with Spring Boot backend and React frontend.

## 🏗️ Architecture

### Backend (Spring Boot)
- **Java 17+** with Spring Boot framework
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **MySQL** database for data persistence
- **External API Integration** (Alpha Vantage) for real-time stock prices

### Frontend (React)
- **React 19** with modern hooks and context API
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Chart.js** for data visualization

## 🚀 Features

### Core Features
- ✅ User registration and authentication with JWT
- ✅ Virtual wallet starting with $10,000
- ✅ Real-time stock price fetching
- ✅ Buy/Sell stock functionality
- ✅ Portfolio tracking with profit/loss calculations
- ✅ Transaction history
- ✅ Trading dashboard with summary cards

### Advanced Features
- ✅ Secure REST API endpoints
- ✅ Database entities for Users, Portfolios, and Transactions
- ✅ Responsive UI with modern design
- ✅ Error handling and validation
- 📊 Live charts (in progress)
- 🏆 Leaderboard system (basic implementation)

## 📋 Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven

### Backend Setup

1. **Database Configuration**
   ```sql
   CREATE DATABASE tradevault;
   ```

2. **Update Application Properties**
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/tradevault?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. **Run the Backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:6060`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password_hash` - Encrypted password
- `virtual_balance` - Available virtual cash (default: $10,000)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Portfolios Table
- `id` - Primary key
- `user_id` - Foreign key to Users table
- `stock_symbol` - Stock ticker symbol
- `quantity` - Number of shares owned
- `average_buy_price` - Average purchase price per share
- `created_at` - First purchase timestamp
- `updated_at` - Last update timestamp

### Transactions Table
- `id` - Primary key
- `user_id` - Foreign key to Users table
- `symbol` - Stock ticker symbol
- `type` - BUY or SELL
- `quantity` - Number of shares
- `price` - Price per share at transaction time
- `timestamp` - Transaction timestamp

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

### Stocks
- `GET /api/stocks/search/{symbol}` - Get stock price

### Trading
- `POST /api/trading/buy` - Buy stocks
- `POST /api/trading/sell` - Sell stocks
- `GET /api/trading/portfolio` - Get user portfolio
- `GET /api/trading/transactions` - Get transaction history
- `GET /api/trading/summary` - Get trading summary

### Leaderboard
- `GET /api/leaderboard` - Get top traders

## 🔐 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration
- Input validation
- SQL injection prevention with JPA

## 🎯 Usage Guide

1. **Register Account**: Create a new account with username, email, and password
2. **Login**: Sign in to access your dashboard
3. **View Dashboard**: See your virtual balance, portfolio value, and total assets
4. **Search Stocks**: Enter stock symbols (e.g., AAPL, GOOGL, TSLA) to get current prices
5. **Trade Stocks**: Buy or sell stocks with real-time pricing
6. **Track Performance**: Monitor your portfolio with profit/loss calculations
7. **View History**: Access your complete transaction history

## 🎨 UI Features

- Modern, responsive design with Tailwind CSS
- Real-time price updates
- Interactive trading panel
- Comprehensive portfolio table
- Summary cards with key metrics
- Loading states and error handling

## 🔧 Configuration

### Stock API
The application uses Alpha Vantage for stock prices. For production:
1. Get a free API key from [Alpha Vantage](https://www.alphavantage.co/)
2. Update the configuration in `application.properties`:
   ```properties
   stock.api.key=your_api_key_here
   ```

## 🚀 Future Enhancements

- [ ] Advanced charting with historical data
- [ ] Real-time WebSocket updates
- [ ] Social features (follow traders)
- [ ] Advanced order types (limit, stop-loss)
- [ ] Portfolio analytics and insights
- [ ] Mobile app development
- [ ] Paper trading competitions

## 📝 Development Notes

- Backend runs on port 8080
- Frontend runs on port 5173
- Database connection uses MySQL
- JWT tokens expire after 24 hours
- All monetary values are stored in USD

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. Feel free to use and modify for learning.

---

**Happy Trading! 📈💰**
