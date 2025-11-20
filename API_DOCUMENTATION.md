# Shambani API Documentation

## Base URL

```
http://localhost:5000/api
```

---

## Authentication

All protected endpoints require the `x-auth-token` header:

```
x-auth-token: <JWT_TOKEN>
```

The JWT token is obtained from login/register endpoints and contains:

- `user.id` - User's MongoDB ID
- `user.role` - User's role (farmer, data_entry, admin)

---

## Public Endpoints

### Categories

#### Get All Categories

```
GET /api/categories
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Vegetables",
    "type": "Product",
    "sort_order": 1,
    "createdAt": "2025-11-18T10:00:00.000Z",
    "updatedAt": "2025-11-18T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Cereals",
    "type": "Product",
    "sort_order": 2,
    "createdAt": "2025-11-18T10:00:00.000Z",
    "updatedAt": "2025-11-18T10:00:00.000Z"
  }
]
```

**Status Codes:**

- `200 OK` - Successfully retrieved categories
- `500 Server Error` - Database error

---

### Products

#### Get Products by Category

```
GET /api/products/byCategory/:categoryId
```

**Parameters:**

- `categoryId` (path) - MongoDB ID of the category

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Tomatoes",
    "category_type": "Vegetables",
    "unit": "KES/kg",
    "createdAt": "2025-11-18T10:00:00.000Z",
    "updatedAt": "2025-11-18T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439021",
    "name": "Onions",
    "category_type": "Vegetables",
    "unit": "KES/kg",
    "createdAt": "2025-11-18T10:00:00.000Z",
    "updatedAt": "2025-11-18T10:00:00.000Z"
  }
]
```

**Status Codes:**

- `200 OK` - Successfully retrieved products
- `404 Not Found` - Category does not exist
- `500 Server Error` - Database error

---

### Markets

#### Get All Markets

```
GET /api/markets
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439030",
    "name": "Wakulima Market",
    "county": "Nairobi",
    "contact": "0712345678",
    "location": {
      "type": "Point",
      "coordinates": [36.8172, -1.2921]
    },
    "createdAt": "2025-11-18T10:00:00.000Z",
    "updatedAt": "2025-11-18T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439031",
    "name": "Mombasa Central Market",
    "county": "Mombasa",
    "contact": "0713567890",
    "location": {
      "type": "Point",
      "coordinates": [39.6652, -4.0435]
    },
    "createdAt": "2025-11-18T10:00:00.000Z",
    "updatedAt": "2025-11-18T10:00:00.000Z"
  }
]
```

**Status Codes:**

- `200 OK` - Successfully retrieved markets
- `500 Server Error` - Database error

#### Get Market Details with Products

```
GET /api/markets/:marketId
```

**Parameters:**

- `marketId` (path) - MongoDB ID of the market

**Response:**

```json
{
  "market": {
    "_id": "507f1f77bcf86cd799439030",
    "name": "Wakulima Market",
    "county": "Nairobi",
    "contact": "0712345678",
    "location": {
      "type": "Point",
      "coordinates": [36.8172, -1.2921]
    }
  },
  "products": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "price": 85.5,
      "product_id": {
        "_id": "507f1f77bcf86cd799439020",
        "name": "Tomatoes",
        "category_type": "Vegetables",
        "unit": "KES/kg"
      }
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Successfully retrieved market details
- `404 Not Found` - Market does not exist
- `500 Server Error` - Database error

---

### Prices

#### Get Price Comparison for Product

```
GET /api/prices/product/:productId
```

**Parameters:**

- `productId` (path) - MongoDB ID of the product

**Response:**

```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Tomatoes",
    "category_type": "Vegetables",
    "unit": "KES/kg"
  },
  "priceComparison": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "price": 85.5,
      "market_id": {
        "_id": "507f1f77bcf86cd799439030",
        "name": "Wakulima Market",
        "county": "Nairobi",
        "contact": "0712345678"
      }
    },
    {
      "_id": "507f1f77bcf86cd799439041",
      "price": 94.05,
      "market_id": {
        "_id": "507f1f77bcf86cd799439031",
        "name": "Mombasa Central Market",
        "county": "Mombasa",
        "contact": "0713567890"
      }
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Successfully retrieved price comparison
- `404 Not Found` - Product does not exist
- `500 Server Error` - Database error

#### Get All Products at Market

```
GET /api/prices/market/:marketId
```

**Parameters:**

- `marketId` (path) - MongoDB ID of the market

**Response:**

```json
{
  "market": {
    "_id": "507f1f77bcf86cd799439030",
    "name": "Wakulima Market",
    "county": "Nairobi",
    "contact": "0712345678"
  },
  "prices": [
    {
      "_id": "507f1f77bcf86cd799439040",
      "price": 85.5,
      "product_id": {
        "_id": "507f1f77bcf86cd799439020",
        "name": "Tomatoes",
        "category_type": "Vegetables",
        "unit": "KES/kg"
      }
    }
  ]
}
```

**Status Codes:**

- `200 OK` - Successfully retrieved market prices
- `404 Not Found` - Market does not exist
- `500 Server Error` - Database error

---

## Protected Endpoints

### Authentication

#### Register User

```
POST /api/auth/register
```

**Body:**

```json
{
  "username": "john_farmer",
  "password": "secure_password_123",
  "location": "Nairobi"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_farmer",
  "role": "farmer",
  "location": "Nairobi"
}
```

**Status Codes:**

- `200 OK` - Successfully registered
- `400 Bad Request` - User already exists
- `500 Server Error` - Server error

#### Login User

```
POST /api/auth/login
```

**Body:**

```json
{
  "username": "john_farmer",
  "password": "secure_password_123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_farmer",
  "role": "farmer",
  "location": "Nairobi"
}
```

**Status Codes:**

- `200 OK` - Successfully logged in
- `400 Bad Request` - Invalid credentials
- `500 Server Error` - Server error

---

### Farm Records

#### Get All Records (User's Own)

```
GET /api/records
Headers: x-auth-token: <token>
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439050",
    "user": "507f1f77bcf86cd799439001",
    "commodity": "Maize",
    "recordType": "Stock",
    "quantity": 100,
    "unit": "bags",
    "price": 5000,
    "dateRecorded": "2025-11-18T10:00:00.000Z"
  }
]
```

**Status Codes:**

- `200 OK` - Successfully retrieved records
- `401 Unauthorized` - No token or invalid token
- `500 Server Error` - Server error

#### Create Record (Admin/Data Entry Only)

```
POST /api/records
Headers: x-auth-token: <token>
```

**Body:**

```json
{
  "commodity": "Maize",
  "recordType": "Stock",
  "quantity": 100,
  "unit": "bags",
  "price": 5000
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439050",
  "user": "507f1f77bcf86cd799439001",
  "commodity": "Maize",
  "recordType": "Stock",
  "quantity": 100,
  "unit": "bags",
  "price": 5000
}
```

**Status Codes:**

- `201 Created` - Record created successfully
- `400 Bad Request` - Invalid data
- `401 Unauthorized` - No token or invalid token
- `403 Forbidden` - User role not allowed
- `500 Server Error` - Server error

#### Delete Record (Admin/Data Entry Only)

```
DELETE /api/records/:recordId
Headers: x-auth-token: <token>
```

**Response:**

```json
{
  "message": "Record deleted successfully"
}
```

**Status Codes:**

- `200 OK` - Record deleted successfully
- `401 Unauthorized` - No token or invalid token
- `403 Forbidden` - User role not allowed
- `404 Not Found` - Record does not exist
- `500 Server Error` - Server error

---

## Error Responses

### Common Error Format

```json
{
  "msg": "Error message describing what went wrong"
}
```

### Common Error Codes

| Status | Message                                   | Cause                                  |
| ------ | ----------------------------------------- | -------------------------------------- |
| 400    | User already exists                       | Duplicate username during registration |
| 400    | Invalid Credentials                       | Wrong password or username             |
| 401    | No token, authorization denied            | Missing x-auth-token header            |
| 401    | Token is not valid                        | Invalid or expired token               |
| 403    | Access denied. You do not have permission | User role insufficient                 |
| 404    | Category not found                        | Invalid category ID                    |
| 404    | Product not found                         | Invalid product ID                     |
| 404    | Market not found                          | Invalid market ID                      |
| 500    | Server error                              | Unexpected server error                |

---

## Rate Limiting

Currently not implemented but recommended for production:

- Limit: 100 requests per minute per IP
- Implement using express-rate-limit

---

## CORS Configuration

Frontend URL: `http://localhost:3000`

Cross-origin requests are allowed for:

- GET requests
- POST requests with JSON body
- Headers: `Content-Type`, `x-auth-token`

---

## Example Usage with cURL

### Get Categories

```bash
curl http://localhost:5000/api/categories
```

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "farmer1",
    "password": "pass123",
    "location": "Nairobi"
  }'
```

### Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "farmer1",
    "password": "pass123"
  }'
```

### Get Protected Resource

```bash
curl -H "x-auth-token: YOUR_TOKEN_HERE" \
  http://localhost:5000/api/records
```

### Get Price Comparison (replace with actual ID)

```bash
curl http://localhost:5000/api/prices/product/507f1f77bcf86cd799439020
```

---

## Pagination (Future Enhancement)

Recommended query parameters for pagination:

```
GET /api/products/byCategory/:categoryId?page=1&limit=10
GET /api/markets?page=1&limit=20
GET /api/prices/product/:productId?page=1&limit=15
```

---

## Sorting (Future Enhancement)

Recommended query parameters for sorting:

```
GET /api/products/byCategory/:categoryId?sort=name&order=asc
GET /api/markets?sort=county&order=asc
GET /api/prices/product/:productId?sort=price&order=asc
```

---

## Filtering (Future Enhancement)

Recommended query parameters for filtering:

```
GET /api/prices/product/:productId?minPrice=50&maxPrice=150&county=Nairobi
GET /api/markets?county=Nairobi
```

---

## Versioning

Current API version: **v1** (implicit)

Recommended for future: Add `/api/v1/` prefix to all endpoints

---

## Webhook Support (Future)

Recommended endpoints for webhook notifications:

- `POST /api/webhooks/price-update` - Price change notification
- `POST /api/webhooks/market-update` - Market data update

---

## Testing with Postman

Import collection:

1. Open Postman
2. Click "Import"
3. Add environment variable: `token` from login response
4. Use `{{token}}` in x-auth-token header

---

## SDK Availability

Consider building SDKs for:

- JavaScript/TypeScript npm package
- React hooks for common queries
- Mobile SDK for React Native

---

**Last Updated: November 18, 2025**
