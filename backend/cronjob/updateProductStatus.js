import db from '../config/db.js';

export const updateProductStatus = async () => {

  try {

    const result = await db.query(`
      UPDATE products p
      SET status = CASE
        WHEN EXISTS (
          SELECT 1
          FROM bids b
          WHERE b.product_id = p.product_id
        ) THEN 'sold'
        ELSE 'expired'
      END
      WHERE p.deadline < NOW()
        AND p.status = 'active'
      RETURNING product_id, name, status, seller_id;
    `);

    const soldProducts = result.rows.filter(p => p.status === 'sold');
    for (const product of soldProducts) {
        await db.query(`
        UPDATE bids
        SET status = 'purchased'
        WHERE product_id = $1 AND status = 'highest'
        `, [product.product_id]);
    }

    const updatedProducts = result.rows;

    if (updatedProducts.length === 0) {
      console.log('No products updated.');
      return { message: 'No products updated', updatedProducts: [] };
    }

    console.log(`Updated ${updatedProducts.length} products:`, updatedProducts);

    // Placeholder for future email logic
    /*
    for (const product of updatedProducts) {
      const seller = await db.query('SELECT email FROM users WHERE user_id = $1', [product.seller_id]);
      await sendEmail({
        to: seller.rows[0].email,
        subject: \`Product ${product.name} Status Update\`,
        body: \`Your product "${product.name}" is now ${product.status}.\`
      });
    }
    */

    return {
      message: `Successfully updated ${updatedProducts.length} products`,
      updatedProducts,
    };

  } 
  catch (err) {
    console.error('Error updating product statuses:', err);
    throw new Error('Failed to update product statuses');
  }

};
