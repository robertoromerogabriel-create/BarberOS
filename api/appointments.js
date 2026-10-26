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
      const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      // Mapear nombres de columnas
      const mapped = data.map(a => ({
        id: a.id,
        clientName: a.client_name,
        clientPhone: a.client_phone,
        serviceId: a.service_id,
        serviceName: a.service_name,
        barber: a.barber,
        date: a.date,
        time: a.time,
        price: a.price,
        status: a.status,
        paymentMethod: a.payment_method
      }));
      return res.status(200).json(mapped);
    }

    if (req.method === 'POST') {
      const apt = req.body;
      const { data, error } = await supabase.from('appointments').insert([{
        id: apt.id,
        client_name: apt.clientName,
        client_phone: apt.clientPhone,
        service_id: apt.serviceId,
        service_name: apt.serviceName,
        barber: apt.barber,
        date: apt.date,
        time: apt.time,
        price: apt.price,
        status: apt.status,
        payment_method: apt.paymentMethod
      }]).select().single();
      if (error) throw error;
      return res.status(201).json(apt);
    }

    if (req.method === 'PUT') {
      const apt = req.body;
      const updates = {};
      if (apt.clientName !== undefined) updates.client_name = apt.clientName;
      if (apt.clientPhone !== undefined) updates.client_phone = apt.clientPhone;
      if (apt.serviceId !== undefined) updates.service_id = apt.serviceId;
      if (apt.serviceName !== undefined) updates.service_name = apt.serviceName;
      if (apt.barber !== undefined) updates.barber = apt.barber;
      if (apt.date !== undefined) updates.date = apt.date;
      if (apt.time !== undefined) updates.time = apt.time;
      if (apt.price !== undefined) updates.price = apt.price;
      if (apt.status !== undefined) updates.status = apt.status;
      if (apt.paymentMethod !== undefined) updates.payment_method = apt.paymentMethod;
      
      const { data, error } = await supabase.from('appointments').update(updates).eq('id', apt.id).select().single();
      if (error) throw error;
      return res.status(200).json(apt);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
