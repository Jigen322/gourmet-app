'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function NewSpotPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({
    title: '', area: '', category: '', shop_name: '', address: '', description: '',
  })
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('ログインが必要です')
      setLoading(false)
      return
    }

    let image_url = null
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('gourmet-images')
        .upload(path, file)

      if (uploadError) {
        setError('画像のアップロードに失敗しました: ' + uploadError.message)
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('gourmet-images').getPublicUrl(path)
      image_url = urlData.publicUrl
    }

    const { error: insertError } = await supabase.from('gourmet_spots').insert({
      ...form,
      image_url,
      created_by: user.id,
    })

    setLoading(false)
    if (insertError) {
      setError('投稿に失敗しました(権限がないかもしれません): ' + insertError.message)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="container" style={{ maxWidth: 560, paddingTop: 40, paddingBottom: 60 }}>
      <h2 style={{ marginBottom: 24 }}>ご当地グルメを投稿する</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">タイトル *</label>
          <input id="title" required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="例: 札幌の濃厚味噌ラーメン" />
        </div>
        <div className="form-field">
          <label htmlFor="area">地域 *(スタンプに表示されます)</label>
          <input id="area" required value={form.area} onChange={(e) => update('area', e.target.value)} placeholder="例: 北海道" />
        </div>
        <div className="form-field">
          <label htmlFor="category">ジャンル</label>
          <input id="category" value={form.category} onChange={(e) => update('category', e.target.value)} placeholder="例: ラーメン" />
        </div>
        <div className="form-field">
          <label htmlFor="shop_name">お店の名前</label>
          <input id="shop_name" value={form.shop_name} onChange={(e) => update('shop_name', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="address">住所</label>
          <input id="address" value={form.address} onChange={(e) => update('address', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="description">紹介文</label>
          <textarea id="description" rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="image">写真</label>
          <input id="image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? '投稿中…' : '投稿する'}
        </button>
      </form>
    </div>
  )
}
