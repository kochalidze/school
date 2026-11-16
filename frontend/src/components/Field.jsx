export default function Field({ label, as, ...props }) {
  return <label className="field"><span>{label}</span>{as === 'textarea' ? <textarea rows="5" {...props} /> : <input {...props} />}</label>;
}
