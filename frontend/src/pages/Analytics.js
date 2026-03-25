import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../api/axios';

const COLORS = ['#1a73e8','#34a853','#ea4335','#f57c00','#9c27b0','#00bcd4'];

export default function Analytics() {
  const [revenue, setRevenue] = useState([]);
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [rev, books] = await Promise.all([api.get('/fines/revenue'), api.get('/books')]);
        setRevenue(rev.data.slice(0,6).map(r => ({
          month: r.month,
          collected: parseFloat(r.amount_collected) || 0,
          outstanding: parseFloat(r.amount_outstanding) || 0
        })));
        const top5 = [...books.data].sort((a,b) => parseInt(b.available_copies) - parseInt(a.available_copies)).slice(0,5);
        setBookData(top5.map(b => ({
          name: b.title.length > 20 ? b.title.substring(0,20)+'...' : b.title,
          copies: parseInt(b.available_copies) || 0
        })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="container" style={{paddingTop:'24px'}}>
      <div className="page-title">Analytics Dashboard</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
        <div className="card">
          <h3 style={{marginBottom:'16px',fontSize:'16px',fontWeight:'600'}}>Monthly Fine Revenue (PKR)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" name="Collected" fill="#34a853" />
              <Bar dataKey="outstanding" name="Outstanding" fill="#ea4335" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{marginBottom:'16px',fontSize:'16px',fontWeight:'600'}}>Top 5 Books by Availability</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={bookData} dataKey="copies" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {bookData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
