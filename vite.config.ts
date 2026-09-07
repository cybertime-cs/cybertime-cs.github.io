import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// The previous local preview used /HomePage/. Keep existing preview tabs usable.
export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [
    {
      name: 'local-preview-redirect',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url === '/HomePage' || request.url?.startsWith('/HomePage/')) {
            response.writeHead(302, { Location: request.url.slice('/HomePage'.length) || '/' });
            response.end();
            return;
          }
          next();
        });
      },
    },
    vinext(),
  ],
});
