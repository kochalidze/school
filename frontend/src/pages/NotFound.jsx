import { Link } from 'react-router-dom';
export default function NotFound() { return <div className="container center"><h1>404</h1><p>გვერდი ვერ მოიძებნა.</p><Link to="/" className="btn">მთავარზე დაბრუნება</Link></div>; }
