import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import db from '../config/db.js';
import { llm } from '../config/genai.js';
import { findSimilarProducts } from '../services/embeddingService.js';

export const askAboutListing = async (req, res) => {

  const { product_id } = req.params;
  const { question } = req.body;

  if (!llm) {
    return res.status(503).json({ error: 'AI Q&A is not configured on this server yet' });
  }

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'A question is required' });
  }

  if (question.length > 500) {
    return res.status(400).json({ error: 'Question is too long (max 500 characters)' });
  }

  try {

    const productResult = await db.query(
      `SELECT product_id, name, description, category, asking_price, deadline, status
       FROM products WHERE product_id = $1`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    const similar = await findSimilarProducts(
      `${product.name} ${product.category} ${product.description || ''}`,
      { limit: 3, excludeProductId: product.product_id }
    );

    const similarContext = similar.length
      ? similar.map((s) => `- ${s.name} (${s.category}, ₹${s.asking_price})`).join('\n')
      : 'None available.';

    const systemPrompt = `You are a helpful assistant answering buyer questions about a single listing on CollegeBazaar, a student marketplace.
Only use the listing details and comparable listings given below. If the answer isn't in this information, say you don't have that detail and suggest the buyer message the seller directly. Keep answers short (2-4 sentences).

Listing:
Name: ${product.name}
Category: ${product.category}
Asking price: ₹${product.asking_price}
Status: ${product.status}
Description: ${product.description || 'No description provided.'}

Comparable listings on the platform:
${similarContext}`;

    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(question),
    ]);

    res.status(200).json({ answer: response.content });

  }
  catch (err) {
    console.error('Error answering listing question:', err);
    res.status(500).json({ error: 'Failed to get an AI answer right now' });
  }

};

export const generateListingAssist = async (req, res) => {

  const { notes, category } = req.body;

  if (!llm) {
    return res.status(503).json({ error: 'AI listing assistant is not configured on this server yet' });
  }

  if (!notes || !notes.trim()) {
    return res.status(400).json({ error: 'A few notes about the item are required' });
  }

  if (notes.length > 800) {
    return res.status(400).json({ error: 'Notes are too long (max 800 characters)' });
  }

  try {

    const sellerResult = await db.query('SELECT email FROM users WHERE user_id = $1', [req.user.user_id]);

    if (sellerResult.rows.length === 0 || !sellerResult.rows[0].email.endsWith('@iiitdmj.ac.in')) {
      return res.status(403).json({ error: 'Only students with an @iiitdmj.ac.in email can use the listing assistant' });
    }

    const similar = await findSimilarProducts(`${notes} ${category || ''}`, { limit: 4 });

    const examples = similar.length
      ? similar.map((s) => `- "${s.name}": ${s.content.split('\n').slice(2).join(' ').slice(0, 140)}`).join('\n')
      : 'No comparable listings yet — write in a clear, friendly, concise style.';

    const systemPrompt = `You help students on CollegeBazaar, a campus marketplace, turn rough notes into a polished listing.
Given the seller's notes and category, write a short catchy title and a 2-3 sentence description highlighting condition, key features, and why it's a good buy. Match the tone of the example listings below where relevant, but never invent details the seller didn't mention.

Example listings on the platform:
${examples}

Respond in exactly this format, nothing else:
TITLE: <title>
DESCRIPTION: <description>`;

    const userPrompt = `Category: ${category || 'Uncategorized'}\nSeller's notes: ${notes}`;

    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    const text = String(response.content);
    const titleMatch = text.match(/TITLE:\s*(.+)/i);
    const descriptionMatch = text.match(/DESCRIPTION:\s*([\s\S]+)/i);

    res.status(200).json({
      title: titleMatch ? titleMatch[1].trim() : '',
      description: descriptionMatch ? descriptionMatch[1].trim() : text.trim(),
    });

  }
  catch (err) {
    console.error('Error generating listing assist:', err);
    res.status(500).json({ error: 'Failed to generate a listing right now' });
  }

};
