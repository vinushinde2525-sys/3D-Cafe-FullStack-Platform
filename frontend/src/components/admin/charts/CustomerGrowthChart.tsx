import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props { data: { _id: string; revenue: number; orders: number }[] }

export const CustomerGrowthChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={220}>
    <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#D8C3A5" opacity={0.4} />
      <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#9B7E5A', fontFamily: 'Outfit' }} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#9B7E5A', fontFamily: 'Outfit' }} tickLine={false} axisLine={false} />
      <Tooltip contentStyle={{ background: '#FFF8F0', border: '1px solid #D8C3A5', borderRadius: 12, fontFamily: 'Manrope', fontSize: 12 }} />
      <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: 12 }} />
      <Line type="monotone" dataKey="orders" stroke="#3A2415" strokeWidth={2} dot={{ r: 3 }} name="Orders" />
      <Line type="monotone" dataKey="revenue" stroke="#B89052" strokeWidth={2} dot={{ r: 3 }} name="Revenue (₹)" />
    </LineChart>
  </ResponsiveContainer>
)

export default CustomerGrowthChart
