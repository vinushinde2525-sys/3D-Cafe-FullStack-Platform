import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props { data: { _id: string; revenue: number; orders: number }[] }

const fmt = (v: number) => `₹${(v / 1000).toFixed(1)}k`

export const RevenueTrendChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%"  stopColor="#B89052" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#B89052" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#D8C3A5" opacity={0.4} />
      <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#9B7E5A', fontFamily: 'Outfit' }} tickLine={false} />
      <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#9B7E5A', fontFamily: 'Outfit' }} tickLine={false} axisLine={false} />
      <Tooltip
        contentStyle={{ background: '#FFF8F0', border: '1px solid #D8C3A5', borderRadius: 12, fontFamily: 'Manrope', fontSize: 12 }}
        formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
      />
      <Area type="monotone" dataKey="revenue" stroke="#B89052" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: '#B89052' }} activeDot={{ r: 5 }} />
    </AreaChart>
  </ResponsiveContainer>
)

export default RevenueTrendChart
