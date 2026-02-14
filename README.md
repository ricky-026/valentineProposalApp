# Valentine Proposal App 💕

A beautiful, interactive Valentine's Day proposal web application built with React, TypeScript, and Vite.

## Features

- 💖 **Interactive Proposal**: "Will you be my Valentine?" with YES and NO buttons
- 🏃 **Evasive NO Button**: The NO button runs away on hover (desktop) or touch (mobile)
- 🎨 **Beautiful Theme**: Pink/red gradient background with animated floating clouds
- 🎉 **Celebration Effects**: Hearts and confetti animation when YES is clicked
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- ✨ **Modern Animations**: Smooth transitions using Framer Motion

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Framer Motion** for smooth animations
- **Canvas Confetti** for celebration effects

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd valentineProposalApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed.

## Deployment

This app can be deployed to any static hosting service:

- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use `gh-pages` package
- **Firebase Hosting**: Use Firebase CLI

## How It Works

1. The app displays a romantic proposal question with two buttons
2. Hovering over (or touching on mobile) the NO button makes it jump to a random position
3. The NO button intelligently avoids overlapping with the YES button
4. Clicking YES triggers a celebration with floating hearts and confetti
5. The background features animated clouds for a dreamy atmosphere

## Customization

You can customize the app by modifying:

- **Colors**: Update the gradient in `App.css` (`.app-container`)
- **Text**: Change the proposal message in `App.tsx`
- **Animations**: Adjust Framer Motion parameters in `App.tsx`
- **Cloud Speed**: Modify animation durations in `App.css`

## License

MIT License - feel free to use this for your own Valentine's proposal! 💕

---

Made with ❤️ for Valentine's Day
