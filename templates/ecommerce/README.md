### Example Data for Rendering:

When rendering these templates, you would provide the data in a format like this:

json

    `{
      "siteName": "ShopMaster",
      "bannerTitle": "Welcome to ShopMaster!",
      "bannerSubtitle": "Find the best deals on electronics and more!",
      "featuredProducts": [
        { "id": 1, "name": "Laptop", "price": "899.99", "imageUrl": "/images/laptop.png" },
        { "id": 2, "name": "Smartphone", "price": "499.99", "imageUrl": "/images/smartphone.png" }
      ],
      "currentYear": "2024",
      "product": {
        "name": "Laptop",
        "description": "A high-performance laptop for all your needs.",
        "price": "899.99",
        "imageUrl": "/images/laptop.png"
      },
      "relatedProducts": [
        { "id": 2, "name": "Smartphone", "price": "499.99", "imageUrl": "/images/smartphone.png" },
        { "id": 3, "name": "Headphones", "price": "99.99", "imageUrl": "/images/headphones.png" }
      ]
    }`

### Summary:

- **home.hbs**: Displays the homepage with featured products and a banner.
- **product.hbs**: Displays a detailed product page with related products.

These templates will be dynamically populated with product data, and Handlebars will handle the rendering logic to generate HTML.
