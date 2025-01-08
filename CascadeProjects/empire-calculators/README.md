# Empire Title Calculators

A unified calculator system for Empire Title, including:
- Seller Net Sheet Calculator
- Buyer Closing Costs Calculator
- Refinance Calculator

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Project Structure

```
empire-calculators/
├── public/
│   └── index.html
├── src/
│   ├── js/
│   │   ├── main.js
│   │   ├── calculators/
│   │   └── utils/
│   └── styles/
│       └── main.css
└── package.json
```

## Development

The project uses a modular architecture with:
- Calculator Factory pattern for instantiating different calculators
- Base Calculator class with common functionality
- Individual calculator implementations
- Shared utilities and helpers

## Building for Production

```bash
npm run build
```
