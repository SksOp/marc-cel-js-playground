# CEL Playground

An interactive environment to explore and experiment with the Common Expression Language (CEL) using JavaScript. Built with Next.js and powered by [`@marcbachmann/cel-js`](https://github.com/marcbachmann/cel-js).

## Features

### 🚀 **Core Functionality**

- **Interactive CEL Evaluation**: Write and test CEL expressions in real-time using [`@marcbachmann/cel-js`](https://github.com/marcbachmann/cel-js)
- **Dynamic Version Loading**: Load different CEL-JS versions on-demand via ESM
- **Dual Format Support**: Input variables in both JSON and YAML formats
- **Auto-Format Detection**: Automatically detects and validates JSON/YAML input
- **Format Conversion**: Easy switching between JSON and YAML with one-click conversion
- **Safe Result Serialization**: Handles BigInt and complex objects with `fast-json-stringify`

### 📚 **Template System**

- **Pre-built Examples**: Curated collection of CEL expressions with sample data
- **Category Organization**: Templates organized by use cases (Kubernetes, Istio, General, etc.)
- **One-Click Loading**: Select any template to instantly load expression and variables
- **Default Template**: Meaningful example loads automatically on first visit

### 🔗 **Sharing & Collaboration**

- **URL Sharing**: Generate shareable URLs that encode your current playground state
- **State Restoration**: Open shared URLs to restore exact expression, variables, and version
- **Clean URLs**: Shared URLs automatically clean themselves after loading
- **Real-time Updates**: URLs update as you make changes for easy sharing

### 🎨 **User Experience**

- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Syntax Highlighting**: Monospace fonts for better code readability
- **Spell Check Disabled**: No red underlines on CEL expressions or JSON/YAML
- **Hover Cards**: Interactive help and explanations
- **Error Handling**: Clear error messages and validation feedback

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SksOp/marc-cel-js-playground.git
   cd marc-cel-js-playground
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Writing CEL Expressions

1. **Select a CEL Version**: Choose your preferred CEL-JS version from the dropdown
2. **Write Expression**: Enter your CEL expression in the left panel
3. **Define Variables**: Add input data in JSON or YAML format in the right panel
4. **Evaluate**: Click "Run" to see the result

### Using Templates

1. **Browse Templates**: Use the template selector in the expression editor
2. **Load Example**: Select any template to load expression and sample data
3. **Modify**: Edit the loaded example to fit your needs

### Sharing Your Work

1. **Generate Share URL**: Click the "Share" button to copy a shareable URL
2. **Share with Others**: Send the URL to collaborators
3. **Open Shared URLs**: Anyone can open your shared URL to see your exact setup

### Format Support

- **JSON**: Traditional object notation `{"key": "value"}`
- **YAML**: Human-readable format with proper indentation
- **Auto-Detection**: Automatically detects and validates your input format
- **Conversion**: Switch between formats with one-click buttons

## Project Structure

```
cel-js-playground/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── cel-*             # CEL-specific components
│   └── ui/               # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── package/               # CEL-related packages
│   ├── lib/              # Parser utilities
│   └── template/         # Template definitions
└── public/               # Static assets
```

## Key Components

- **CelPlayground**: Main playground component
- **CelExpressionEditor**: CEL expression input with template selector
- **CelVariablesEditor**: Variables input with JSON/YAML support
- **CelTemplateSelector**: Template selection dropdown
- **ShareButton**: URL generation and sharing functionality
- **CelVersionSelector**: CEL version selection

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **[@marcbachmann/cel-js](https://github.com/marcbachmann/cel-js)**: JavaScript implementation of CEL
- **js-yaml**: YAML parsing and generation
- **fast-json-stringify**: High-performance JSON serialization
- **ESM.sh**: Dynamic module loading for CEL versions

## Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check
```

### Adding New Templates

Templates are defined in `package/template/template.ts`. To add a new template:

```typescript
{
  name: 'Your Template Name',
  cel: 'your CEL expression here',
  dataInput: 'your sample data in YAML or JSON',
  category: 'Category Name'
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [CEL Specification](https://github.com/google/cel-spec) - Common Expression Language specification
- [@marcbachmann/cel-js](https://github.com/marcbachmann/cel-js) - High-performance JavaScript implementation of CEL with advanced features
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [ESM.sh](https://esm.sh/) - ES modules CDN for dynamic loading
