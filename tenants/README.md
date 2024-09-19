In a **Next.js** project, the **`/tenants`** directory would be located in the root directory of the project, alongside other directories such as **`src`**, **`public`**, and **`node_modules`**.

Here’s how the directory structure would look:

```
/project-root
    /tenants                    <-- Tenant-specific websites stored here
        /tenant1
            /my-new-website      <-- Templates and files for tenant1's website
                home.hbs
                product.hbs
    /src                        <-- Source code (Next.js pages, components, etc.)
        /pages
        /components
    /public                     <-- Public assets like images, fonts, etc.
    /node_modules
    /templates                  <-- Default templates for different website types (e.g., eCommerce, Doctor)
    /prisma                     <-- Prisma-related files (if using Prisma)
    /package.json
    /next.config.js
    /.env
```

### Directory Breakdown:

- **`/tenants`**: This is the top-level directory where tenant-specific websites will be stored.
- **`/tenants/tenant1/my-new-website/`**: Each tenant will have their own directory, and under that, there will be a folder for each website the tenant creates. The **templates** (e.g., `home.hbs`, `product.hbs`) will be copied into this directory when the website is created.

### How to Reference the Tenant Folder in Code:

When you're referencing this folder in your Next.js project, you can use **`process.cwd()`**, which returns the current working directory (i.e., the project root). From there, you can construct the path to the tenant’s folder.

Example:

```typescript
const tenantWebsitePath = path.join(
  process.cwd(),
  'tenants',
  'tenant1',
  'my-new-website'
);
```

This would resolve to:

```
/project-root/tenants/tenant1/my-new-website/
```

### When Would the Tenant Folder Be Used?

- **On website creation**: When a tenant creates a new website, the platform would copy the default templates (stored in `/templates`) into the tenant’s folder (e.g., `/tenants/tenant1/my-new-website/`).
- **On rendering a website**: When a request comes in to render the website, the platform would serve the content from the tenant’s folder based on the specific URL (e.g., subdomain or path-based URL).

This setup ensures that tenant-specific templates are isolated, and each tenant's website can be customized independently.
