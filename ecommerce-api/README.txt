# 🛒 Ecommerce API

API RESTful construida con **Node.js**, **Express** y **MongoDB (Mongoose)** para gestionar un sistema de comercio electrónico.  
Soporta autenticación con **JWT**, control de roles, productos, categorías, carritos, órdenes y reseñas.

---

## 🚀 Requisitos

- Node.js v18 o superior  
- MongoDB (local o en la nube)

---

## ⚙️ Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/ecommerce-api.git
   cd ecommerce-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear el archivo **.env** en la raíz del proyecto con este contenido:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=ecommerce-db
   # Genera un secreto con:
   # node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   JWT_SECRET=d0c7c676f145a91f15eea6beb4aa58ee38ff0f55a82c8a40a442c356518692f36b60970b8d26c2299dc6ca32142ec13f5353f1e39113a4239333fe8df89d42d4
   ```

---

## ▶️ Uso

Levantar el servidor en modo desarrollo:
```bash
npm run dev
```

Levantar el servidor en producción:
```bash
npm start
```

El servidor estará disponible en:  
👉 http://localhost:3000

---

## 📚 Endpoints principales

- **Auth** → `/api/auth` (registro, login)  
- **Users** → `/api/user`  
- **Categories** → `/api/categories`  
- **Products** → `/api/products`  
- **Cart** → `/api/cart`  
- **Reviews** → `/api/reviews`  
- **Orders** → `/api/order`  

---

## 👥 Roles

- **admin** → acceso total  
- **user** → acceso a su perfil, su carrito y compras  

---

## 📄 Licencia

Proyecto para fines educativos y de práctica.
