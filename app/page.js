import { createClient } from '@/lib/supabase/server'
import SpotCard from '@/components/SpotCard'

export default async function HomePage() {
  const supabase = createClient()
  const { data: spots } = await supabase
    .from('gourmet_spots')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container">
      <div style={{ padding: '40px 0 0' }}>
        <h1 style={{ fontSize: '1.8rem' }}>みんなのご当地グルメ手帖</h1>
        <p style={{ color: 'var(--color-ink-soft)', marginTop: 8 }}>
          全国各地のご当地グルメを、旅のスタンプのように集めています。
        </p>
      </div>

      {spots && spots.length > 0 ? (
        <div className="spots-grid">
          {spots.map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          まだ投稿がありません。最初のご当地グルメを投稿してみましょう。
        </div>
      )}
    </div>
  )
}
