# Arahin - Route Optimization for UMKM Delivery

A SaaS MVP for optimizing delivery routes for small and medium enterprises (UMKM) in Indonesia. Built with Next.js frontend and FastAPI backend.

## Features

- **Landing Page**: Simple explanation with CTA
- **Authentication**: Register/Login with JWT
- **Dashboard**: List and manage delivery plans
- **Delivery Plan Creation**: Input start location and multiple stops with bulk paste support
- **Route Optimization**: Uses Google OR-Tools TSP solver for efficient routes
- **Map Visualization**: Display routes on interactive maps
- **Google Maps Integration**: Generate shareable navigation links
- **Driver View**: Mobile-friendly interface for delivery drivers
- **Status Tracking**: Track delivery progress in real-time

## Tech Stack

### Frontend
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form + Zod
- Leaflet for maps

### Backend
- Python FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic migrations
- Pydantic
- Google OR-Tools
- JWT authentication

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- PostgreSQL
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and other settings
```

5. Set up database:
```bash
# Create PostgreSQL database
createdb arahin_db

# Run migrations
alembic upgrade head
```

6. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with API URL
```

4. Run the development server:
```bash
npm run dev
```

Frontend will be available at http://localhost:3000

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

## Database Schema

### Users
- id, name, email, password_hash, created_at

### DeliveryPlans
- id, user_id, title, start_address, start_lat, start_lng, status, total_distance_km, total_duration_minutes, share_code, created_at, updated_at

### DeliveryStops
- id, delivery_plan_id, recipient_name, phone, raw_address, formatted_address, lat, lng, note, priority, sequence_order, status, estimated_arrival, delivered_at, created_at, updated_at

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Backend linting
cd backend
flake8

# Frontend linting
cd frontend
npm run lint
```

## Deployment

### Backend
- Use Docker for containerization
- Deploy to cloud platforms like Railway, Render, or AWS
- Set up proper environment variables for production

### Frontend
- Build for production: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License

## Sample API Usage

### Register User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Create Delivery Plan
```bash
curl -X POST "http://localhost:8000/delivery-plans" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Daily Deliveries", "start_address": "Jl. Sudirman No. 1", "start_lat": -7.7956, "start_lng": 110.3695}'
```

### Bulk Add Stops
```bash
curl -X POST "http://localhost:8000/delivery-plans/1/stops/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"stops": [{"recipient_name": "Budi", "phone": "08123456789", "raw_address": "Jl. Ijen No. 10", "lat": -7.7956, "lng": 110.3695}]}'
```

### Optimize Route
```bash
curl -X POST "http://localhost:8000/delivery-plans/1/optimize" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Roadmap

- [ ] Add geocoding service integration
- [ ] Multi-driver VRP optimization
- [ ] Real-time tracking
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Payment integration