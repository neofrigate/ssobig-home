# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Ssobig (쏘빅) homepage - a Next.js 15 marketing website for a platform that connects people through social events without alcohol. The site showcases multiple brand services including Love Buddies, Now Seoul, Game Orb, and Ssobig Tool.

## Tech Stack
- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 (PostCSS plugin)
- **Analytics**: Google Analytics 4, Google Tag Manager, Facebook Pixel, Vercel Analytics
- **Customer Support**: Channel Talk integration

## Key Commands

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Run linter
npm run lint

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── brand/              # Brand-specific pages
│   │   ├── game_orb/       # Game Orb brand page
│   │   ├── love_buddies/   # Love Buddies with /detail subpage
│   │   ├── now_seoul/      # Now Seoul brand page
│   │   └── ssobig_tool/    # Ssobig Tool page
│   ├── design-guide/       # Design system documentation
│   ├── realdata/          # Real-time data display
│   └── layout.tsx         # Root layout with analytics
├── components/            # Reusable components
│   ├── GoogleAnalytics.tsx # GA4 implementation
│   ├── ChannelTalk.tsx    # Customer support chat
│   ├── LinkWithUtm.tsx    # UTM parameter preservation
│   └── PageViewTracker.tsx # Page view tracking
└── utils/
    ├── gtag.ts           # Google Analytics utilities
    └── utm.ts            # UTM parameter handling
```

## Key Architecture Patterns

### Analytics Integration
The site has comprehensive analytics tracking:
- **Google Analytics 4** (ID: `G-RN7MB0CJZS`)
- **Google Tag Manager** on Love Buddies detail page (ID: `GTM-P69VJBN8`)
- **Facebook Pixel** integration on specific pages
- Custom event tracking with `gtag.event()` for user interactions

### UTM Parameter Handling
- All internal links preserve UTM parameters using `LinkWithUtm` component
- UTM parameters are stored in sessionStorage and appended to all navigation
- Critical for tracking marketing campaign effectiveness

### Brand Page Pattern
Each brand page follows a consistent structure:
1. Hero section with key messaging
2. Feature cards with benefits
3. Call-to-action buttons with analytics tracking
4. FAQ component
5. External form integration (smore.im)

### Responsive Design
- Mobile-first approach with 620px max content width
- Custom viewport meta tag in root layout
- Touch action optimizations for mobile

## Common Development Tasks

### Adding a New Brand Page
1. Create directory under `src/app/brand/[brand-name]/`
2. Add `page.tsx` with metadata export
3. Implement analytics tracking for page views and interactions
4. Use existing components (Card, FAQ, ActionButton)
5. Integrate external form if needed

### Implementing Analytics Events
```typescript
import { gtag } from '@/utils/gtag';

// Track button clicks
gtag.event({
  action: 'click',
  category: 'engagement',
  label: 'button_label',
  value: 1,
  context: {
    brandPage: 'love_buddies',
    buttonType: 'cta',
    destination: 'external_form'
  }
});
```

### Adding New Components
1. Create component in `src/components/`
2. Follow existing naming conventions (PascalCase)
3. Use TypeScript interfaces for props
4. Ensure responsive design
5. Add analytics tracking where appropriate

## Current Development Focus

Working on branch: `feature-gtm-lovebuddies-detail`
- Implementing Google Tag Manager for Love Buddies detail page
- Enhanced conversion tracking for event registrations

## Important Considerations

### External Integrations
- **Channel Talk**: Plugin key in ChannelTalk.tsx
- **Google Sheets API**: Real-time data for Love Buddies schedules
- **smore.im Forms**: External registration forms for events

### Image Handling
- Static images in `/public/images/` and `/public/ssobig_assets/`
- Use Next.js Image component for optimization
- Facebook images require domain configuration in next.config.mjs

### Performance
- Turbopack enabled for faster development builds
- Vercel Speed Insights for monitoring
- Lazy loading for heavy components

## Testing Checklist

When making changes, verify:
1. Analytics events fire correctly in GA4 DebugView
2. UTM parameters persist across navigation
3. Responsive design works on mobile devices
4. External form integrations load properly
5. No TypeScript errors (`npm run build`)
6. ESLint passes (`npm run lint`)

## Deployment

The site is deployed on Vercel with:
- Automatic deployments from main branch
- Preview deployments for pull requests
- Analytics and Speed Insights enabled
- No additional build configuration needed