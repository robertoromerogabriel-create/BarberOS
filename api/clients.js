const { supabase } = require('./_lib/supabase');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      // Mapear last_visit a lastVisit para compatibilidad con el frontend
      const mapped = data.map(c => ({
        ...c,
        lastVisit: c.last_visit
      }));
      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const { id, name, phone, email, visits, spent, lastVisit } = req.body;
      const { data, error } = await supabase.from('clients').insert([{
        id,
        name,
        phone,
        email,
        visits: visits || 0,
        spent: spent || 0,
        last_visit: lastVisit === 'Sin visitas aún' ? null : lastVisit
      }]).select().single();
      if (error) throw error;
      return res.status(201).json({ ...data, lastVisit: data.last_visit });
    }

    if (req.method === 'PUT') {
      const { id, lastVisit, ...rest } = req.body;
      const updates = { ...rest };
      if (lastVisit !== undefined) {
        updates.last_visit = lastVisit === 'Sin visitas aún' ? null : lastVisit;
      }
      const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json({ ...data, lastVisit: data.last_visit });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
