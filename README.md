# PhilHealth Transparency Portal

A modern, production-grade transparency and accountability portal for the Philippine Health Insurance Corporation (PhilHealth), built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Pages
- **Home** - Landing page with hero section, KPIs, and latest policy updates
- **Financials** - Financial reports, revenue/expenditure charts, investment portfolio
- **Claims** - Claims analytics, approval rates, processing time trends
- **Coverage** - Enrollment statistics, membership distribution, contribution rates
- **Facilities** - Searchable directory of accredited healthcare providers
- **Procurement** - Transparent procurement contracts and vendor information
- **Governance** - Board meetings, executive compensation, resolutions
- **Engagement** - Public feedback, complaint metrics, policy updates

### Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom PhilHealth theme
- **Charts**: Recharts for data visualization
- **Tables**: TanStack React Table (sortable, filterable)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Dark Mode**: next-themes

### Key Features
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Semantic HTML
- ✅ Keyboard navigable
- ✅ Production-ready code structure
- ✅ Mock JSON data endpoints
- ✅ Reusable component library

## Color Theme
- **Primary**: #009a3d (PhilHealth Green)
- **Secondary**: #2e2e2e
- **Accent**: #f4f4f4

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
philhealth-transp/
├── public/
│   └── data/              # Mock JSON data files
│       ├── claims.json
│       ├── coverage.json
│       ├── engagement.json
│       ├── facilities.json
│       ├── financials.json
│       ├── governance.json
│       └── procurement.json
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── claims/
│   │   ├── coverage/
│   │   ├── engagement/
│   │   ├── facilities/
│   │   ├── financials/
│   │   ├── governance/
│   │   ├── procurement/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── home/          # Home page components
│   │   │   ├── cta-section.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── kpi-section.tsx
│   │   │   └── policy-updates.tsx
│   │   ├── layout/        # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navbar.tsx
│   │   ├── providers/     # Context providers
│   │   │   └── theme-provider.tsx
│   │   └── ui/            # Reusable UI components
│   │       ├── breadcrumbs.tsx
│   │       ├── chart-card.tsx
│   │       ├── data-table.tsx
│   │       ├── filter-dropdown.tsx
│   │       ├── kpi-stat-card.tsx
│   │       ├── page-heading.tsx
│   │       ├── pagination-controls.tsx
│   │       ├── search-bar.tsx
│   │       └── status-chip.tsx
│   └── lib/
│       └── utils.ts       # Utility functions
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Components

### UI Components
- `KPIStatCard` - Key performance indicator display cards
- `StatusChip` - Status badges with variants
- `PageHeading` - Consistent page titles
- `Breadcrumbs` - Navigation breadcrumbs
- `SearchBar` - Search input with icon
- `FilterDropdown` - Dropdown filters
- `DataTable` - Sortable/filterable tables
- `ChartCard` - Chart wrapper with title
- `PaginationControls` - Table pagination

### Layout Components
- `Navbar` - Top navigation with mobile menu
- `Footer` - Site footer with links
- `DashboardLayout` - Sidebar layout for dashboard pages

## Data Files

Mock JSON data is located in `public/data/`:
- `financials.json` - Financial reports and investments
- `claims.json` - Claims processing data
- `coverage.json` - Membership and coverage stats
- `facilities.json` - Accredited healthcare facilities
- `procurement.json` - Procurement contracts
- `governance.json` - Board meetings and compensation
- `engagement.json` - Public feedback and complaints

## Accessibility

This application follows WCAG 2.1 AA guidelines:
- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Sufficient color contrast
- Screen reader friendly

## License

ISC

## Contact

For questions or support, contact: transparency@philhealth.gov.ph
