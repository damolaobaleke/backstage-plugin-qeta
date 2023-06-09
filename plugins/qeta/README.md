# qeta

Welcome to the qeta plugin!

Qeta allows you to add Q&A section to your Backstage application.
This plugin requires that you also install
[@nytimes/backstage-plugin-qeta-backend](https://www.npmjs.com/package/@nytimes/backstage-plugin-qeta-backend)
plugin.

## Adding to your application

Add the plugin to your frontend app:

```bash
cd packages/app && yarn add @nytimes/backstage-plugin-qeta
```

Expose the questions page:

```ts
// packages/app/src/App.tsx
import { QetaPage } from '@nytimes/backstage-plugin-qeta';

// ...

const AppRoutes = () => (
  <FlatRoutes>
    // ...
    <Route path="/qeta" element={<QetaPage />} />
    // ...
  </FlatRoutes>
);
```

An interface for Q&A is now available at `/qeta`.
