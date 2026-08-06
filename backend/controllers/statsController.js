import db from '../config/db.js';

export const getSummary = async (req, res) => {

  try {

    const [studentsResult, activeResult, soldResult] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM users WHERE email LIKE '%@iiitdmj.ac.in'`),
      db.query(`SELECT COUNT(*) FROM products WHERE status = 'active'`),
      db.query(`SELECT COUNT(*) FROM products WHERE status = 'sold'`),
    ]);

    res.status(200).json({
      students: parseInt(studentsResult.rows[0].count),
      active_listings: parseInt(activeResult.rows[0].count),
      items_sold: parseInt(soldResult.rows[0].count),
    });

  }
  catch (err) {
    console.error('Error fetching stats summary:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }

};
