import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props { data: { name: string; totalOrders: number; revenue: number }[] }

const COLORS = ['#3A2415','#5C3D26','#7A5230','#B89052','#D4AF6E','#EFE7DA','#9B7E5A','#D8C3A5']

export const PopularItemsChart = ({ data }: Props) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
      <XAxis type="number" tick={{ fontSize: 11, fill: '#9B7E5A' }} tickLine={false} axisLine={false} />
      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9B7E5A', fontFamily: 'Manrope' }} tickLine={false} width={110} />
      <Tooltip contentStyle={{ background: '#FFF8F0', border: '1px solid #D8C3A5', borderRadius: 12, fontFamily: 'Manrope', fontSize: 12 }}
        formatter={(v: number) => [v, 'Orders']} />
      <Bar dataKey="totalOrders" radius={[0, 6, 6, 0]} barSize={16}>
        {data.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)

export default PopularItemsChart
