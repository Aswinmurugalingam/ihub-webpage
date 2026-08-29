import { BRANDS } from '../../data/siteData';
import styles from './Brands.module.css';

export default function Brands() {
  const doubled = [...BRANDS, ...BRANDS];
  return (
    <section className={styles.brands}>
      <div className={styles.label}>Trusted across India for every major brand</div>
      <div className={styles.trackWrap}>
        <div className={styles.maskL} />
        <div className={styles.maskR} />
        <div className={styles.track}>
          {doubled.map((b, i) => <span key={i}>{b}</span>)}
        </div>
      </div>
    </section>
  );
}
