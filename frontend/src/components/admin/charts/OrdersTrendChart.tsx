import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props { data: { _id: string; orders: number }[] }

export const OrdersTrendChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barSize={20}>
      <CartesianGrid strokeDasharray="3 3" stroke="#D8C3A5" opacity={0.4} vertical={false} />
      <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#9B7E5A', fontFamily: 'Outfit' }} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#9B7E5A', fontFamily: 'Outfit' }} tickLine={false} axisLine={false} />
      <Tooltip contentStyle={{ background: '#FFF8F0', border: '1px solid #D8C3A5', borderRadius: 12, fontFamily: 'Manrope', fontSize: 12 }}
        formatter={(v: number) => [v, 'Orders']} />
      <Bar dataKey="orders" fill="#3A2415" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
)

export default OrdersTrendChart
