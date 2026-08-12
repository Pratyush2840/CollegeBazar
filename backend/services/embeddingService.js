import db from '../config/db.js';
import { embeddings } from '../config/genai.js';

const toVectorLiteral = (vector) => `[${vector.join(',')}]`;

const productContent = (product) =>
  `${product.name}\nCategory: ${product.category}\n${product.description || ''}`.trim();

export const upsertProductEmbedding = async (product) => {
  if (!embeddings) return;

  const content = productContent(product);
  const vector = await embeddings.embedQuery(content);

  await db.query(
    `INSERT INTO product_embeddings (product_id, content, embedding, updated_at)
     VALUES ($1, $2, $3::vector, NOW())
     ON CONFLICT (product_id)
     DO UPDATE SET content = EXCLUDED.content, embedding = EXCLUDED.embedding, updated_at = NOW()`,
    [product.product_id, content, toVectorLiteral(vector)]
  );
};

export const findSimilarProducts = async (queryText, { limit = 4, excludeProductId = null } = {}) => {
  if (!embeddings) return [];

  const vector = await embeddings.embedQuery(queryText);
  const literal = toVectorLiteral(vector);

  const result = await db.query(
    `SELECT pe.product_id, pe.content, p.name, p.category, p.asking_price
     FROM product_embeddings pe
     JOIN products p ON p.product_id = pe.product_id
     WHERE p.status = 'active' AND ($2::int IS NULL OR pe.product_id != $2)
     ORDER BY pe.embedding <=> $1::vector
     LIMIT $3`,
    [literal, excludeProductId, limit]
  );

  return result.rows;
};
