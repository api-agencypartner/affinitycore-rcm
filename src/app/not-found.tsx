import Link from 'next/link';
export default function NotFound() {
  return <main className="page container" style={{ padding: '20rem 0', textAlign: 'center' }}><h1 className="page-title">Page not found</h1><p style={{ marginTop: 24 }}><Link href="/" className="text-link">Back to the homepage</Link></p></main>;
}
