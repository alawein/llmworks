---
type: canonical
source: none
sync: none
sla: none
---

# LLMWorks

> LLM security & testing platform

## Design and branding

- **Design system:** Shared tokens and style guides: [devkit/tokens](https://github.com/alawein/devkit/tree/main/tokens), [repz/branding](https://github.com/alawein/repz/tree/main/branding). Apply token-first styling and consistent logo placement (header, footer, loading).

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/alawein/llmworks.git
cd llmworks

# Install dependencies
npm install

# Start development
npm run dev

# Visit http://localhost:3004
```

## ✨ Features

- LLM Security
- Testing Tools

## 🛠 Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Vite**

### Backend

- **Supabase**
- **OpenAI**
- **Anthropic**

### Testing

- **Vitest**
- **Playwright**

### Specialized

- **LLM Integration**
- **Security Testing**

## 📁 Project Structure

```text
llmworks/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── stores/        # State management
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
├── docs/             # Documentation
└── scripts/          # Build and utility scripts
```

## 🧪 Development

### Available Scripts

```bash
dev: npm run dev
build: npm run build
test: npm run test
lint: npm run lint
typeCheck: npm run type-check
preview: npm run preview
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t llmworks .

# Run container
docker run -p 3004:3004 llmworks
```

### Docker Compose

```bash
# Start with profile
docker-compose --profile llmworks up -d
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.

## 🔗 Links

- **Main Repository**: https://github.com/alawein/llmworks
- **Documentation**: [docs/](docs/)
- **Issues**: https://github.com/alawein/llmworks/issues

## 📊 Monitoring

- **Error Tracking**: Sentry
- **Performance**: Web Vitals
- **Analytics**: Plausible

## 🔒 Security

- **Content Security Policy**: Configured
- **Rate Limiting**: Implemented
- **Dependency Auditing**: Automated

---

_Platform: LLMWorks_ _Entity: Alawein Technologies_ _Status: production_ _Last
updated: 2025-12-15_
