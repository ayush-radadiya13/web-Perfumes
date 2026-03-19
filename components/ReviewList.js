export default function ReviewList({ reviews }) {
  if (!reviews?.length) {
    return <p className="text-cream-muted">No reviews yet. Be the first.</p>;
  }
  return (
    <ul className="space-y-6">
      {reviews.map((r) => (
        <li key={r._id} className="border-b border-white/10 pb-6">
          <div className="flex justify-between">
            <span className="font-medium text-cream">{r.customerName}</span>
            <span className="text-gold">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
          </div>
          {r.comment && <p className="mt-2 text-cream/80">{r.comment}</p>}
          <p className="text-xs text-cream-muted mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
