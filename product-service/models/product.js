import { Client } from 'pg';
import { dbOptions } from '../db/dbOptions';

export const getProductList = async () => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const { rows: products } = await client.query(`
    SELECT p.*, s.count
    FROM products p, stocks s
    WHERE p.id = s.product_id
    `);
    return products;
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

export const getProduct = async (id) => {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const { rows: [product] } = await client.query(`
    SELECT p.*, s.count
    FROM products p, stocks s
    WHERE p.id = s.product_id
    AND p.id = $1
    `, [id]);
    return product;
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

export const createProduct = async product => {
  const client = new Client(dbOptions);
  await client.connect();
  const {
    title,
    description,
    price,
    image,
    count
  } = product;
  try {
    await client.query('BEGIN');

    const insertProductsText = `
    INSERT INTO products (title, description, price, image) 
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `;
    const insertProductsValues = [title, description, price, image];
    const { rows: [{ id }] } = await client.query(insertProductsText, insertProductsValues);

    const insertStocksText = `
    INSERT INTO stocks (product_id, count)
    VALUES ($1, $2)
    `;
    const insertStocksValues = [id, count];
    await client.query(insertStocksText, insertStocksValues);
    await client.query('COMMIT');

    return { id, ...product };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.end();
  }
};
