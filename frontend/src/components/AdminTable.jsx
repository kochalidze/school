import { fmtDate } from './PostCard.jsx';
export default function AdminTable({ items, onEdit, onDelete }) {
  if (!items.length) return <p className="muted">ჩანაწერები არ არის.</p>;
  return (
    <div className="table-wrap"><table>
      <thead><tr><th>სათაური</th><th>თარიღი</th><th></th></tr></thead>
      <tbody>{items.map((i) => (
        <tr key={i.id}><td>{i.title}</td><td>{fmtDate(i.date)}</td>
          <td className="actions"><button className="link-btn" onClick={() => onEdit(i)}>რედაქტირება</button>
            <button className="link-btn danger" onClick={() => onDelete(i)}>წაშლა</button></td></tr>
      ))}</tbody>
    </table></div>
  );
}
