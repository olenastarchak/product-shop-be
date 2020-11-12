CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  price INT NOT NULL,
  image text NOT NULL
);

CREATE TABLE IF NOT EXISTS stocks (
  product_id uuid PRIMARY KEY,
  count INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO products (id, title, description, price, image)
SELECT id, title, description, price, image
FROM json_populate_recordset (NULL::products,
'[
  {
  "id": "909af13e-cfa5-4025-9daf-402697dd7bb9",
  "description": "Myrtaceae",
  "price": 83,
  "title": "Oryx gazella callotis",
  "image": "https://images.unsplash.com/photo-1572096440536-480da44a35de?w=400"
}, {
  "id": "d6b48bac-b750-4e78-8cda-cba576627cdc",
  "description": "Boraginaceae",
  "price": 68,
  "title": "Canis aureus",
  "image": "https://images.unsplash.com/photo-1551044531-ab2753e871c3?w=400"
}, {
  "id": "d9a3b1c6-df01-42cc-9bb7-02be9b2c6be5",
  "description": "Dryopteridaceae",
  "price": 16,
  "title": "Mephitis mephitis",
  "image": "https://images.unsplash.com/photo-1585992776250-1c0ceb34827f?w=400"
}, {
  "id": "ea8ce80c-c03a-432a-8e27-ced7d1a5af7d",
  "description": "Boraginaceae",
  "price": 2,
  "title": "Spheniscus magellanicus",
  "image": "https://images.unsplash.com/photo-1601285135794-62115fa4ecf5?w=400"
}, {
  "id": "805a4e44-127a-47c8-9850-ffb58d38a082",
  "description": "Asteraceae",
  "price": 30,
  "title": "Phoca vitulina",
  "image": "https://images.unsplash.com/photo-1571203962034-6bcf84f23a2b?w=400"
}, {
  "id": "edd8b41d-71b4-4503-b32a-900b8306c265",
  "description": "Asteraceae",
  "price": 52,
  "title": "Mabuya spilogaster",
  "image": "https://images.unsplash.com/photo-1582238918897-3dd40caf24e3?w=400"
}, {
  "id": "fe444562-3737-4fd6-8c5a-213ad85a1f4b",
  "description": "Pannariaceae",
  "price": 95,
  "title": "Pseudocheirus peregrinus",
  "image": "https://images.unsplash.com/photo-1579685818514-43fdab45dbd9?w=400"
}, {
  "id": "45472c5e-f05b-4563-9d45-f3f8a2a3db32",
  "description": "Rosaceae",
  "price": 35,
  "title": "Gyps bengalensis",
  "image": "https://images.unsplash.com/photo-1498121694787-97844766694e?w=400"
}, {
  "id": "db080c67-2fd3-4b85-8076-c109049732ad",
  "description": "Solanaceae",
  "price": 89,
  "title": "Gymnorhina tibicen",
  "image": "https://images.unsplash.com/photo-1542820243-6c18415893ce?w=400"
}
]');

INSERT INTO stocks (product_id, count)
SELECT *
FROM json_populate_recordset (NULL::stocks,
'[
  {
    "product_id": "909af13e-cfa5-4025-9daf-402697dd7bb9",
    "count": 3
  },
  {
    "product_id": "d6b48bac-b750-4e78-8cda-cba576627cdc",
    "count": 5
  },
  {
    "product_id": "d9a3b1c6-df01-42cc-9bb7-02be9b2c6be5",
    "count": 4
  },
  {
    "product_id": "ea8ce80c-c03a-432a-8e27-ced7d1a5af7d",
    "count": 6
  },
  {
    "product_id": "805a4e44-127a-47c8-9850-ffb58d38a082",
    "count": 2
  },
  {
    "product_id": "edd8b41d-71b4-4503-b32a-900b8306c265",
    "count": 1
  },
  {
    "product_id": "fe444562-3737-4fd6-8c5a-213ad85a1f4b",
    "count": 7
  },
  {
    "product_id": "45472c5e-f05b-4563-9d45-f3f8a2a3db32",
    "count": 8
  },
  {
    "product_id": "db080c67-2fd3-4b85-8076-c109049732ad",
    "count": 3
  }
]');