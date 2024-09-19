Here are the **domain resolution examples** for different approaches to structuring URLs in a **multi-tenant** platform:

### 1. **Subdomain-Based URL Structure**

In this approach, each tenant is assigned its own **subdomain**, and the main domain remains shared.

**Example URL Structure**:

```
https://tenant1.example.com
https://tenant2.example.com
```

- **Homepage for Tenant 1**: `https://tenant1.example.com/`
- **Product Page for Tenant 1**: `https://tenant1.example.com/product/123`
- **Homepage for Tenant 2**: `https://tenant2.example.com/`
- **Checkout Page for Tenant 2**: `https://tenant2.example.com/checkout`

**Use Case**:

- Ideal for larger platforms where each tenant requires a unique identity or branding via subdomains.

**Considerations**:

- Requires wildcard DNS and SSL certificates for each subdomain.

---

### 2. **Path-Based URL Structure**

In this approach, tenants are distinguished by a URL **path** rather than a subdomain. All tenants share the same main domain.

**Example URL Structure**:

```
https://example.com/tenant1/
https://example.com/tenant2/
```

- **Homepage for Tenant 1**: `https://example.com/tenant1/`
- **Product Page for Tenant 1**: `https://example.com/tenant1/product/123`
- **Homepage for Tenant 2**: `https://example.com/tenant2/`
- **Checkout Page for Tenant 2**: `https://example.com/tenant2/checkout`

**Use Case**:

- Easier to configure and maintain without needing complex DNS or SSL setups.

**Considerations**:

- URLs may look less professional than subdomains, but this structure is easier to implement.

---

### 3. **Custom Domain (Vanity Domain) Per Tenant**

Each tenant uses their own **custom domain**, allowing full branding control.

**Example URL Structure**:

```
https://tenant1.com
https://tenant2.com
```

- **Homepage for Tenant 1**: `https://tenant1.com/`
- **Product Page for Tenant 1**: `https://tenant1.com/product/123`
- **Homepage for Tenant 2**: `https://tenant2.com/`
- **Checkout Page for Tenant 2**: `https://tenant2.com/checkout`

**Use Case**:

- Ideal for businesses that want to use their own domain name for branding purposes.

**Considerations**:

- Requires each tenant to configure their DNS and point it to your platform.
- You will need to manage individual SSL certificates for each custom domain.

---

### 4. **Combination of Subdomain + Path**

This approach combines a **subdomain** for the platform with a **path** for each tenant.

**Example URL Structure**:

```
https://app.example.com/tenant1/
https://app.example.com/tenant2/
```

- **Homepage for Tenant 1**: `https://app.example.com/tenant1/`
- **Product Page for Tenant 1**: `https://app.example.com/tenant1/product/123`
- **Homepage for Tenant 2**: `https://app.example.com/tenant2/`
- **Checkout Page for Tenant 2**: `https://app.example.com/tenant2/checkout`

**Use Case**:

- Useful for applications where the main platform is hosted on a single subdomain (e.g., `app.example.com`), but you still want to distinguish tenants by path.

**Considerations**:

- Easier DNS and SSL management since only one subdomain (e.g., `app.example.com`) is involved.

---

### Summary of Domain Resolution Options:

- **Subdomain-Based**: `https://tenant1.example.com/`
- **Path-Based**: `https://example.com/tenant1/`
- **Custom Domain**: `https://tenant1.com/`
- **Combination (Subdomain + Path)**: `https://app.example.com/tenant1/`

The choice of URL structure depends on the needs of your platform, branding requirements for tenants, and the level of DNS and SSL complexity you're willing to manage.
