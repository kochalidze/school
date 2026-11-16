import PostCard from './PostCard.jsx';
export default function Section({ title, items, loading, kind }) {
  return (
    <section className="section"><div className="container">
      <h2 className="section-title">{title}</h2>
      {loading ? <p className="muted">იტვირთება...</p>
        : items.length === 0 ? <p className="muted">ჯერ არაფერი დამატებულა.</p>
        : <div className="grid">{items.map((p) => <PostCard key={p.id} post={p} kind={kind} />)}</div>}
    </div></section>
  );
}
