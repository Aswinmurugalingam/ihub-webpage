import { Link, useLocation } from 'react-router-dom';
import styles from './Policy.module.css';

const privacy=[
  ['Information we collect','When you request a quote, book a repair, schedule pickup or submit a used-phone sale request, we may collect your name, phone number, email, device details, condition information, address, preferred appointment time and device photos you choose to upload.'],
  ['How it is used','Information is used to respond to enquiries, coordinate pickup/appointments, provide repair updates, review used-phone sale requests, prepare estimates or offers and support the requested service. Uploaded sale-request photos are used to assess the submitted device condition.'],
  ['Device data','Hardware repairs normally do not require access to personal content. If software, data-recovery or testing work requires device access, the scope should be agreed before work begins. Back up important data whenever possible.'],
  ['Sharing and retention','Customer information should only be shared with service providers when needed to provide the requested service, and retained only as needed for service, warranty, accounting or legal requirements.'],
  ['Your choices','You may ask iHub to correct contact information or discuss removal of information that is no longer required, subject to legal or warranty record requirements.'],
];
const repair=[
  ['Estimate & approval','Website prices are indicative. A final quote is confirmed after diagnosis and before chargeable repair work begins.'],
  ['Parts & warranty','Part grade, availability and warranty period can vary by device and repair. The confirmed job sheet/invoice should state the warranty that applies to the completed repair. Warranty normally applies to the repaired/replaced component, not new physical or liquid damage.'],
  ['Data & backups','Customers should back up important data before repair whenever possible. iHub should not intentionally access personal content unless required for the requested service and agreed with the customer. Data recovery cannot be guaranteed.'],
  ['Pickup & delivery','Free mobile pickup/delivery is subject to eligible service areas, scheduling and confirmation. Collection/delivery details must match the booking. Device condition should be recorded at handover.'],
  ['Uncollected devices','Collection timelines, storage fees (if any) and disposal rules should be communicated on the job sheet/invoice and applied according to applicable law.'],
];
export default function Policy(){const {pathname}=useLocation();const isPrivacy=pathname==='/privacy';const sections=isPrivacy?privacy:repair;return <section className={styles.page}><div className="container"><div className={styles.wrap}><span className="tag">iHub policies</span><h1>{isPrivacy?'Privacy Policy':'Repair & Warranty Policy'}</h1><p className={styles.intro}>{isPrivacy?'How website and repair-request information is handled.':'General website terms for estimates, repair approvals, warranty, data and pickup/delivery.'}</p><div className={styles.notice}>This website policy is a general customer-facing summary. The final invoice/job sheet should contain the exact warranty and service terms that apply to each repair.</div>{sections.map(([h,p])=><article key={h}><h2>{h}</h2><p>{p}</p></article>)}<div className={styles.links}><Link to="/contact" className="btn-primary brand-grad">Contact iHub</Link><Link to={isPrivacy?'/repair-policy':'/privacy'} className="btn-secondary">{isPrivacy?'Repair Policy':'Privacy Policy'}</Link></div></div></div></section>}
