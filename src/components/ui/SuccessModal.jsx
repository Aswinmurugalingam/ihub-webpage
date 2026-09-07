import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import styles from './SuccessModal.module.css';

export default function SuccessModal({
  open,
  eyebrow = 'Request received',
  title = 'Successfully submitted',
  message,
  reference,
  referenceLabel = 'Reference',
  onOk,
  okLabel = 'OK',
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = event => {
      if (event.key === 'Escape') onOk?.();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onOk]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ihub-success-title"
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 22, scale: .94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: .97 }}
            transition={{ duration: .32, ease: [.22, 1, .36, 1] }}
          >
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.icon}><Icon name="check" size={31}/></div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 id="ihub-success-title">{title}</h2>
            {message && <p>{message}</p>}
            {reference && (
              <div className={styles.reference}>
                <span>{referenceLabel}</span>
                <strong>{reference}</strong>
              </div>
            )}
            <button type="button" className={`${styles.okButton} brand-grad`} onClick={onOk} autoFocus>
              {okLabel}
            </button>
            <small>A confirmation email has been sent to the email address you entered.</small>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
