export const fmtDate = (d) => new Date(d).toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric' });
export default function PostCard({ post, kind }) {
  return (
    <article className="card">
      <time>{fmtDate(post.date)}</time>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      {kind === 'event' && post.location && <span className="tag">📍 {post.location}</span>}
    </article>
  );
}
