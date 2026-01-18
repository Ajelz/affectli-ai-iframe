# Dashboard Redesign Plan: iframe-Ready AI Platform

## Context
This dashboard will be embedded as an **iframe** within Affectli's integrations page. It needs to be:
- Self-contained (no sidebar - Affectli provides navigation)
- Clean, professional, production-grade
- Focused on AI audit insights
- Responsive within iframe constraints
- Bilingual (EN/AR) with proper RTL support

---

## Phase 1: Remove Sidebar & Restructure Layout

### 1.1 Remove Sidebar Component
- **Delete**: `src/components/layout/Sidebar.jsx` (no longer needed)
- **Update**: `src/App.jsx`
  - Remove Sidebar import
  - Remove `sidebarOpen` state
  - Remove margin calculations for sidebar
  - Simplify layout to single full-width column

### 1.2 Simplify Header for iframe
- **Update**: `src/components/layout/Header.jsx`
  - Remove hamburger menu toggle (no sidebar to toggle)
  - Keep: Logo, Language toggle, Notifications, User profile
  - Remove: Search bar and filters (reduce complexity)
  - Make header more compact for iframe
  - Add subtle branding that fits within Affectli

---

## Phase 2: New Simplified Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo | AI Status | Lang Toggle | User         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  AI Insights Hero (4 KPI cards in row)          │   │
│  │  [Missions] [AI Rate] [High Risk] [Pending]     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌────────────────────┐  ┌──────────────────────────┐  │
│  │  Risk Overview     │  │  AI Recommendations      │  │
│  │  (Donut + Legend)  │  │  (Cards with Accept/Rej) │  │
│  └────────────────────┘  └──────────────────────────┘  │
│                                                         │
│  ┌────────────────────┐  ┌──────────────────────────┐  │
│  │  Mission Summary   │  │  Activity Feed           │  │
│  │  (Compact)         │  │  (Live updates)          │  │
│  └────────────────────┘  └──────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 3: Design System Cleanup

### 3.1 Consistent Spacing
- Container padding: `24px` (p-6)
- Card padding: `20px` (p-5)
- Grid gap: `20px` (gap-5)
- Section margin: `20px` (mb-5)

### 3.2 Card Styling (unified)
```css
.card {
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
```

### 3.3 Typography Scale
- Page title: 20px semibold
- Card headers: 15px semibold
- Body text: 14px regular
- Labels: 12px medium
- Captions: 11px regular

### 3.4 Color Palette (keep Affectli teal)
- Primary: `#14b8a6` (teal-500)
- Background: `#f8fafc` (slate-50)
- Cards: `#ffffff`
- Text primary: `#1e293b` (slate-800)
- Text secondary: `#64748b` (slate-500)
- Border: `#e2e8f0` (slate-200)
- Status: red/orange/yellow/green for risk levels

---

## Phase 4: Component Updates

### 4.1 Header.jsx (Simplified)
- Compact single-row header
- Left: Small logo + "AI Audit Dashboard" text
- Center: AI Processing indicator (always visible)
- Right: Language toggle + minimal user info
- Height: ~56px max

### 4.2 AIHeroSection.jsx (Streamlined)
- Remove the dark gradient background (cleaner look)
- 4 KPI cards in a clean white/light row
- Keep animated counters
- Keep the gauge for AI acceptance
- Remove the trend chart (too much for iframe)

### 4.3 RiskOverview.jsx (Keep mostly as-is)
- Donut chart + legend
- Top risk entities list
- Good as-is, minor padding tweaks

### 4.4 AIRecommendations.jsx (Simplify)
- Remove the header AI processing badge (redundant with header)
- Cleaner card styling
- Keep accept/reject functionality
- Limit to 3-4 visible at once

### 4.5 MissionSummary.jsx (Keep compact)
- Mini donut + status pills
- Recent missions list
- Good as-is

### 4.6 ActivityFeed.jsx (Keep compact)
- Live feed with pause
- Footer stats
- Good as-is

---

## Phase 5: CSS Cleanup

### 5.1 index.css Updates
- Remove sidebar-specific styles
- Standardize card classes
- Add `.iframe-container` class for proper iframe behavior
- Ensure smooth scrolling within content area
- Clean up unused animation classes

### 5.2 New Utility Classes
```css
.card-base { /* unified card styling */ }
.card-header-simple { /* compact card headers */ }
.kpi-card-light { /* light-themed KPI cards */ }
```

---

## Phase 6: iframe Optimization

### 6.1 Responsive Behavior
- Min-width: 800px (below this, stack cards)
- Max-width: fluid (fills iframe)
- Height: auto with scroll within main content

### 6.2 Performance
- Reduce animation complexity
- Lazy load charts
- Optimize re-renders

### 6.3 Integration Ready
- Clean URLs (GitHub Pages compatible)
- No external navigation attempts
- Self-contained state

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `src/App.jsx` | Modify | Remove sidebar, simplify layout |
| `src/components/layout/Header.jsx` | Modify | Simplify for iframe |
| `src/components/layout/Sidebar.jsx` | Delete | No longer needed |
| `src/components/dashboard/AIHeroSection.jsx` | Modify | Lighter design |
| `src/components/dashboard/AIRecommendations.jsx` | Modify | Minor cleanup |
| `src/index.css` | Modify | Add new utilities, remove old |

---

## Execution Order

1. **Update App.jsx** - Remove sidebar, fix layout
2. **Delete Sidebar.jsx** - Clean removal
3. **Update Header.jsx** - Simplify for iframe
4. **Update index.css** - New card utilities, cleanup
5. **Update AIHeroSection.jsx** - Lighter KPI design
6. **Minor tweaks** to other components
7. **Test** - Verify in browser, test RTL
8. **Deploy ready** - GitHub Pages compatible

---

## Expected Result
A clean, professional, production-grade AI dashboard that:
- Works perfectly in an iframe
- Has no sidebar (relies on parent app navigation)
- Features consistent spacing and styling
- Maintains bilingual support
- Looks impressive but not flashy
- Is simple, focused, and enterprise-ready
