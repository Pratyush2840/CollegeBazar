import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const adminLogin = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {

        const result = await db.query(
        `SELECT * FROM admins WHERE username = $1`,
        [username]
        );

        if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }

        const admin = result.rows[0];
        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
        { admin_id: admin.admin_id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        );

        res.status(200).json({ message: 'Admin logged in successfully', token });

    } 
    catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ error: 'Server error during admin login' });
    }

};

export const approveProduct = async (req, res) => {

    const { product_id, status } = req.body;
    const admin_id = req.user.admin_id;

    if(!admin_id){
        return res.status(403).json({ error: 'Not an admin'});
    }

    try {

        const existing = await db.query(
        `SELECT * FROM products WHERE product_id = $1`,
        [product_id]
        );

        if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
        }

        if (existing.rows[0].status === 'active' || existing.rows[0].status === 'disapproved') {
        return res.status(400).json({ error: 'Product is already approved' });
        }

        const result = await db.query(
        `UPDATE products
        SET status = $1
        WHERE product_id = $2
        RETURNING *`,
        [status, product_id]
        );

        res.status(200).json({ message: 'Product approved successfully', product: result.rows[0] });

    } 
    catch (err) {
        console.error('Error approving product:', err);
        if (err.code === '23514') {
        return res.status(400).json({ error: 'Invalid product data' });
        }
        res.status(500).json({ error: 'Failed to approve product' });
    }

};

export const getApprovalPendingProducts = async (req, res) => {

    const admin_id = req.user.admin_id;

    if(!admin_id){
      return res.status(403).json({ error: 'Not an admin'});
    }

    try {

        const result = await db.query(
        `SELECT * FROM products WHERE status = $1`,
        ['approval-pending']
        );

        res.status(200).json({
        message: 'Approval-pending products retrieved successfully',
        products: result.rows,
        });

    } 
    catch (err) {
        console.error('Error fetching approval-pending products:', err);
        res.status(500).json({ error: 'Failed to fetch approval-pending products' });
    }

};