{
  "name": "shopez-ecommerce",
  "version": "2.0.0",
  "description": "ShopEZ — Full-stack MERN e-commerce application with admin dashboard",
  "private": true,
  "scripts": {
    "dev": "concurrently --kill-others-on-fail -n \"CLIENT,SERVER\" -c \"cyan.bold,magenta.bold\" \"npm run client\" \"npm run server\"",
    "client": "npm run dev --prefix Client",
    "server": "npm run dev --prefix Server",
    "seed": "npm run seed --prefix Server",
    "install:all": "npm install && npm install --prefix Client && npm install --prefix Server",
    "build": "npm run build --prefix Client"
  },
  "keywords": [
    "mern",
    "ecommerce",
    "react",
    "nodejs",
    "express",
    "mongodb"
  ],
  "author": "Dhanish Ladwani (https://github.com/dhanish0711/)",
  "license": "MIT",
  "devDependencies": {
    "concurrently": "^10.0.3"
  }
}
