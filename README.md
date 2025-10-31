# San Francisco Experience Discovery Platform

A sophisticated web application that helps users discover and plan experiences in San Francisco. Built with Next.js 16, TypeScript, Tailwind CSS, and inspired by Airbnb's design language.

## Features

### ✅ Implemented (MVP)

- **Smart Search & Discovery**: Natural language search for experiences
- **Advanced Filtering**: Filter by type, price, neighborhood, time of day, and features
- **Experience Cards**: Beautiful, hoverable cards with quick actions
- **Interactive Map**: Mapbox integration with location pins, popups, and fullscreen mode
- **Favorites System**: Save experiences to favorites with local storage persistence
- **Itinerary Builder**: Create and manage day plans with timeline interface
- **Planning Options**: Occasion selector (birthday, anniversary, date night, etc.), duration (half-day, full-day, evening), and budget filters
- **Experience Detail Pages**: Full details with booking links and add-to-itinerary
- **Filter Drawer**: Slide-out panel for detailed filtering
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Beautiful UI**: Clean, spacious layouts with SF-inspired color palette

### 🚧 Coming Soon

- Booking integrations (OpenTable, Resy)
- Calendar export functionality (Google Calendar, Apple Calendar)
- User accounts and profiles with cloud sync
- AI-powered recommendations based on preferences
- Route optimization between locations
- Real-time availability checking
- Natural language processing for search
- Community reviews and ratings

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Maps**: Mapbox GL JS (to be implemented)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "SF Tour Reserve App"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── search/            # Search results page
│   ├── experience/[id]/   # Experience detail page
│   ├── itinerary/         # Itinerary builder
│   ├── favorites/         # Saved favorites
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Site header/navigation
│   ├── SearchBar.tsx      # Search input component
│   ├── ExperienceCard.tsx # Experience card component
│   ├── ExperienceMap.tsx # Interactive Mapbox map component
│   ├── FilterDrawer.tsx   # Filter sidebar
│   └── PlanningOptions.tsx # Occasion, duration, and budget selector
├── lib/                   # Utilities and data
│   ├── store.ts          # Zustand store (state management)
│   ├── mockData.ts       # Sample SF experiences
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Design System

### Colors

- **Primary**: Teal/Blue (#14b8a6) - SF Bay inspired
- **Secondary**: Coral/Orange (#f97316) - Golden Gate Bridge inspired
- **Neutrals**: Warm grays for text and backgrounds

### Typography

- **Font**: Inter (system fallback)
- **Scale**: Responsive sizing with Tailwind's type scale

## Data

Currently using mock data from `lib/mockData.ts`. Replace with real API integrations:

- Google Places API
- Yelp Fusion API
- Eventbrite API
- SF FunCheap API

## Environment Variables

Create a `.env.local` file for API keys (see `.env.example` for template):

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_key
```

**Note**: The Mapbox token is required for the interactive map feature. If not provided, the app will show a message and fall back to list view.

To get a Mapbox token:
1. Sign up at https://account.mapbox.com/
2. Navigate to Access Tokens
3. Create a new token or use your default public token
4. Add it to your `.env.local` file

## Contributing

This is a work in progress. Feel free to contribute improvements!

## License

ISC

