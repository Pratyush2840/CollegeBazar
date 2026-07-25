import db from '../config/db.js';

export const postQuery = async (req, res) => {

    const { product_id } = req.params;
    const { query } = req.body;
    const customer_id = req.user.user_id;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query text is required' });
    }

    try {

        const productResult = await db.query(
        `SELECT seller_id FROM products WHERE product_id = $1`,
        [product_id]
        );

        if (productResult.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
        }

        const seller_id = productResult.rows[0].seller_id;

        if (seller_id === customer_id) {
        return res.status(400).json({ error: 'You cannot post a query on your own product' });
        }

        const insertResult = await db.query(
          `INSERT INTO queries (product_id, customer_id, query, created_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING query_id, product_id, customer_id, query, created_at`,
          [product_id, customer_id, query.trim()]
        );
    
        const insertedQuery = insertResult.rows[0];
    
        const queryResult = await db.query(
          `SELECT q.*, u.name AS customer_name
           FROM queries q
           JOIN users u ON q.customer_id = u.user_id
           WHERE q.query_id = $1`,
          [insertedQuery.query_id]
        );

        res.status(201).json({ message: 'Query posted', query: queryResult.rows[0] });

    } 
    catch (err) {
        console.error('Error posting query:', err);
        res.status(500).json({ error: 'Failed to post query' });
    }

};

export const editQuery = async (req, res) => {

  const { query_id } = req.params;
  const { query: updatedText } = req.body;
  const customer_id = req.user.user_id;

  if (!updatedText || updatedText.trim() === '') {
    return res.status(400).json({ error: 'Updated query text is required' });
  }

  try {

    const existing = await db.query(
      `SELECT customer_id, reply FROM queries WHERE query_id = $1`,
      [query_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Query not found' });
    }

    if (existing.rows[0].reply) {
      return res.status(403).json({ error: 'Cannot edit query after seller reply' });
    }

    if (existing.rows[0].customer_id !== customer_id) {
      return res.status(403).json({ error: 'You are not authorized to edit this query' });
    }

    const updateResult = await db.query(
      `UPDATE queries
       SET query = $1
       WHERE query_id = $2
       RETURNING query_id, product_id, customer_id, query, created_at`,
      [updatedText.trim(), query_id]
    );

    const result = await db.query(
      `SELECT q.*, u.name AS customer_name
       FROM queries q
       JOIN users u ON q.customer_id = u.user_id
       WHERE q.query_id = $1`,
      [query_id]
    );

    res.status(200).json({ message: 'Query updated', query: result.rows[0] });

  } 
  catch (err) {
    console.error('Error editing query:', err);
    res.status(500).json({ error: 'Failed to update query' });
  }

};

export const deleteQuery = async (req, res) => {

  const { query_id } = req.params;
  const customer_id = req.user.user_id;

  try {

    const result = await db.query(
      `SELECT customer_id FROM queries WHERE query_id = $1`,
      [query_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Query not found' });
    }

    if (result.rows[0].customer_id !== customer_id) {
      return res.status(403).json({ error: 'You are not authorized to delete this query' });
    }

    await db.query(`DELETE FROM queries WHERE query_id = $1`, [query_id]);

    res.status(200).json({ message: 'Query deleted successfully' });

  } 
  catch (err) {
    console.error('Error deleting query:', err);
    res.status(500).json({ error: 'Failed to delete query' });
  }
  
};


export const getQueriesOnProduct = async (req, res) => {

  const { product_id } = req.params;
  const user_id = req.user ? req.user.user_id : null;

  try {

    let userQueries = [];
    if (user_id) {
      const userQueriesResult = await db.query(
        `SELECT q.*, u.name AS customer_name
         FROM queries q
         JOIN users u ON q.customer_id = u.user_id
         WHERE q.product_id = $1 AND q.customer_id = $2
         ORDER BY q.created_at ASC`,
        [product_id, user_id]
      );
      userQueries = userQueriesResult.rows;
    }

    const otherQueriesResult = await db.query(
      `SELECT q.*, u.name AS customer_name
       FROM queries q
       JOIN users u ON q.customer_id = u.user_id
       WHERE q.product_id = $1 ${user_id ? 'AND q.customer_id != $2' : ''}
       ORDER BY q.created_at ASC`,
      user_id ? [product_id, user_id] : [product_id]
    );
    const otherQueries = otherQueriesResult.rows;

    res.status(200).json({
      userQueries,
      otherQueries,
    });

  } 
  catch (err) {
    console.error('Error fetching queries:', err);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
  
};

  export const respondToQuery = async (req, res) => {

    const { query_id } = req.params;
    const { reply } = req.body;
    const seller_id = req.user.user_id;
  
    if (!reply || reply.trim() === '') {
      return res.status(400).json({ error: 'Reply text is required' });
    }
  
    try {

      const queryResult = await db.query(
        `SELECT q.*, p.seller_id
         FROM queries q
         JOIN products p ON q.product_id = p.product_id
         WHERE q.query_id = $1`,
        [query_id]
      );
  
      if (queryResult.rows.length === 0) {
        return res.status(404).json({ error: 'Query not found' });
      }
  
      const query = queryResult.rows[0];
  
      if (query.seller_id !== seller_id) {
        return res.status(403).json({ error: 'You are not authorized to reply to this query' });
      }
  
      const updateResult = await db.query(
        `UPDATE queries
         SET reply = $1
         WHERE query_id = $2
         RETURNING *`,
        [reply, query_id]
      );
  
      res.status(200).json({ message: 'Reply added', query: updateResult.rows[0] });
  
    } 
    catch (err) {
      console.error('Error replying to query:', err);
      res.status(500).json({ error: 'Failed to reply to query' });
    }
    
  };
  
  
