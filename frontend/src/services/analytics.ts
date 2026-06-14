import api from '@/api/axios'

export const analyticsService = {
  getDashboard: async () => {
    const { data } = await api.get('/analytics/dashboard')
    return data.data
  },
  getSales: async (period = '30d') => {
    const { data } = await api.get('/analytics/sales', { params: { period } })
    return data.data
  },
}

export const inventoryService = {
  getAll: async (filters?: Record<string, string>) => {
    const { data } = await api.get('/inventory', { params: filters })
    return data.data
  },
  getLowStock: async () => {
    const { data } = await api.get('/inventory/low-stock')
    return data.data
  },
  getReport: async () => {
    const { data } = await api.get('/inventory/report')
    return data.data
  },
  updateStock: async (id: string, quantity: number, type: string, note?: string) => {
    const { data } = await api.patch(`/inventory/${id}/stock`, { quantity, type, note })
    return data.data
  },
  create: async (item: Record<string, unknown>) => {
    const { data } = await api.post('/inventory', item)
    return data.data
  },
}

export const userManagementService = {
  getAll: async (params?: Record<string, unknown>) => {
    const { data } = await api.get('/users', { params })
    return data.data
  },
  toggleBlock: async (id: string) => {
    const { data } = await api.patch(`/users/${id}/toggle-block`)
    return data.data
  },
  updateRole: async (id: string, role: string) => {
    const { data } = await api.patch(`/users/${id}/role`, { role })
    return data.data
  },
}
