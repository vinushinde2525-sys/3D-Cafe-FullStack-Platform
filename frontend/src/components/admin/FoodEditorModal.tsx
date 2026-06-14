import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { MotionButton } from '@/components/ui/Button'
import { foodAPI } from '@/api/services'
import toast from 'react-hot-toast'
import type { FoodItem } from '@/types'

const CATEGORIES = ['Coffee','Tea','Burgers','Pizza','Sandwiches','Desserts','Beverages','Breakfast','Pasta','Salads']

interface Props { item?: FoodItem | null; isOpen: boolean; onClose: () => void; onSave: () => void }

export const FoodEditorModal = ({ item, isOpen, onClose, onSave }: Props) => {
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>()

  useEffect(() => {
    reset(item ? {
      name: item.name, description: item.description, price: item.price,
      discountPrice: item.discountPrice || '', category: item.category,
      preparationTime: item.preparationTime, isVegetarian: item.isVegetarian,
      isVegan: item.isVegan, isGlutenFree: item.isGlutenFree, isSpicy: item.isSpicy,
      isFeatured: item.isFeatured, isSpecial: item.isSpecial, isAvailable: item.isAvailable,
    } : { category: 'Coffee', isAvailable: true, preparationTime: 15 })
  }, [item, reset])

  const onSubmit = async (data: any) => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => v !== '' && v !== undefined && fd.append(k, String(v)))
      if (item) await foodAPI.update(item._id, fd)
      else await foodAPI.create(fd)
      toast.success(item ? 'Item updated!' : 'Item created!')
      onSave(); onClose()
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Item' : 'New Menu Item'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Name" {...register('name', { required: true })} error={errors.name ? 'Required' : ''} containerClassName="col-span-2" />
          <Textarea label="Description" rows={3} {...register('description', { required: true })} containerClassName="col-span-2" />
          <Input label="Price (₹)" type="number" step="0.01" {...register('price', { required: true, min: 0 })} error={errors.price ? 'Required' : ''} />
          <Input label="Discount Price (₹)" type="number" step="0.01" {...register('discountPrice')} hint="Optional" />
          <div className="space-y-1.5">
            <label className="block font-display text-sm font-medium text-ink-2">Category</label>
            <select {...register('category', { required: true })} className="w-full h-11 bg-cream border border-beige/60 rounded-xl px-4 text-sm font-sans text-ink outline-none focus:border-gold/50">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input label="Prep Time (min)" type="number" {...register('preparationTime')} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[['isVegetarian','Vegetarian'],['isVegan','Vegan'],['isGlutenFree','Gluten Free'],['isSpicy','Spicy'],['isFeatured','Featured'],['isAvailable','Available']].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register(k)} className="w-4 h-4 rounded border-beige accent-gold" />
              <span className="font-sans text-sm text-ink-2">{l}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <MotionButton type="submit" variant="espresso" pill isLoading={saving} fullWidth>
            {item ? 'Save Changes' : 'Create Item'}
          </MotionButton>
          <MotionButton type="button" variant="cream" pill onClick={onClose}>Cancel</MotionButton>
        </div>
      </form>
    </Modal>
  )
}

export default FoodEditorModal
