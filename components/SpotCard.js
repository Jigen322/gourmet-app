import Link from 'next/link'

export default function SpotCard({ spot }) {
  return (
    <Link href={`/spots/${spot.id}`} className="spot-card" style={{ display: 'block', color: 'inherit' }}>
      {spot.image_url ? (
        <img src={spot.image_url} alt={spot.title} className="spot-card-image" />
      ) : (
        <div className="spot-card-image" />
      )}
      <span className="hanko-stamp">{spot.area}</span>
      <div className="spot-card-body">
        <h3>{spot.title}</h3>
        {spot.shop_name && <p className="spot-card-shop">{spot.shop_name}</p>}
        {spot.category && (
          <span className="role-badge role-poster" style={{ marginBottom: 8 }}>
            {spot.category}
          </span>
        )}
      </div>
    </Link>
  )
}
