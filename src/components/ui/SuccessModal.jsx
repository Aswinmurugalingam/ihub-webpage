import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
  const okRef = useRef(null);
  const previousFocusRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => okRef.current?.focus(), 20);

    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOk?.();
      }
      if (event.key === 'Tab') {
        // This success dialog has one action. Keep keyboard focus inside it until OK/Escape.
        event.preventDefault();
        okRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      const previous = previousFocusRef.current;
      if (previous && typeof previous.focus === 'function') {
        window.setTimeout(() => previous.focus({ preventScroll: true }), 0);
      }
    };
  }, [open, onOk]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduceMotion ? 1 : 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ihub-success-title"
          aria-describedby={message ? 'ihub-success-message' : undefined}
        >
          <motion.div
            className={styles.modal}
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: .98 }}
            transition={{ duration: reduceMotion ? 0 : .26, ease: [.22, 1, .36, 1] }}
          >
            <div className={styles.glow} aria-hidden="true" />
            <div className={styles.icon}><Icon name="check" size={31}/></div>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 id="ihub-success-title">{title}</h2>
            {message && <p id="ihub-success-message">{message}</p>}
            {reference && (
              <div className={styles.reference}>
                <span>{referenceLabel}</span>
                <strong>{reference}</strong>
              </div>
            )}
            <button ref={okRef} type="button" className={`${styles.okButton} brand-grad`} onClick={onOk}>
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
