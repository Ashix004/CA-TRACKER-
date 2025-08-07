# CA Study Tracker

A simple web application to track your CA (Chartered Accountancy) study progress across different subjects and chapters.

## Features

- Track progress for all CA subjects and chapters
- Progress bars for visual tracking
- Dark/Light mode toggle
- Data saved in local storage
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn
```

### Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

This will start the development server at http://localhost:5173

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This will generate a `dist` folder with the production build.

### Previewing the Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Deployment

### Deploying to Netlify

1. Create an account on [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository or upload the `dist` folder
3. Configure the build settings:
   - Build command: `npm run build` or `yarn build`
   - Publish directory: `dist`

### Deploying to Vercel

1. Create an account on [Vercel](https://vercel.com/)
2. Connect your GitHub repository
3. Vercel will automatically detect the Vite configuration

### Deploying to GitHub Pages

1. Install the gh-pages package:

```bash
npm install --save-dev gh-pages
# or
yarn add --dev gh-pages
```

2. Add the following to your `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Add a `base` property to your `vite.config.js`:

```js
export default defineConfig({
  base: '/ca-study-tracker/',
  // other config
});
```

4. Deploy to GitHub Pages:

```bash
npm run deploy
# or
yarn deploy
```

## License

This project is licensed under the MIT License.