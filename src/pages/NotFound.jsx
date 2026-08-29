import { Link } from 'react-router-dom';
import DeviceScene from '../components/3d/DeviceScene';
import styles from './NotFound.module.css';
export default function NotFound(){return <section style={{padding:'64px 0 96px'}}><div className={`container ${styles.grid}`}><div><span className="tag">404 · Lost signal</span><h1>Page <span className="brand-text">not found</span></h1><p>The page may have moved. Return home, browse services, or book a repair.</p><div className={styles.actions}><Link to="/" className="btn-primary brand-grad">Back Home</Link><Link to="/services" className="btn-secondary">View Services</Link></div></div><DeviceScene compact/></div></section>}
