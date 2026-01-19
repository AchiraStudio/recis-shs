import React, { useState, useEffect, useRef } from 'react';
// ... (keep your existing icons and imports)

const CheckoutProcess = ({ 
  isOpen, onClose, cart, cartTotal, formData, handleInput, 
  paymentProof, handlePaymentProof, onSubmit, isSubmitting 
}) => {
  
  const [step, setStep] = useState(1);
  const [activeConfig, setActiveConfig] = useState(0); 
  const [preview, setPreview] = useState(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const contentRef = useRef(null);

  // --- NEW: DISABLE BODY SCROLL ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ... (keep your existing useEffects for steps and previews)

  const next = () => {
    if(step === 1 && (!formData.namaLengkap || !formData.email || !formData.nomorTelepon)) {
       alert("Please complete all identity details.");
       return;
    }
    setStep(s => s + 1);
  };
  
  const back = () => setStep(s => s - 1);

  if (!isOpen) return null;

  return (
    <div className={`checkout-portal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="portal-container" onClick={e => e.stopPropagation()}>
        
        {/* LEFT PANEL */}
        <div className={`portal-left ${isMobileSummaryOpen ? 'visible' : ''}`}>
          <div className="manifest-header">
            <h2 className="manifest-title">MANIFEST</h2>
            <div className="manifest-subtitle">EST. MMXXVI // RECUP</div>
            {/* Mobile close for manifest */}
            <button className="mobile-manifest-close" onClick={() => setIsMobileSummaryOpen(false)}>DONE</button>
          </div>
          
          <div className="manifest-scroll">
            {cart.map((item, i) => (
              <div key={i} className="manifest-item">
                <img src={item.image} alt="" className="m-img" />
                <div className="m-details">
                  <h4>{item.name}</h4>
                  <div className="m-qty">Qty: {item.quantity}</div>
                </div>
                <div className="m-price">
                  { (item.price * item.quantity).toLocaleString('id-ID') }
                </div>
              </div>
            ))}
          </div>

          <div className="manifest-total">
            <span className="mt-label">TOTAL TRIBUTE</span>
            <span className="mt-value">Rp {cartTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="portal-right">
          <div className="portal-header">
            <div className="mobile-summary-toggle" onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}>
              <FiShoppingBag /> {isMobileSummaryOpen ? 'Hide' : 'Show'} Order
            </div>

            <div className="step-indicator">
              {/* ... (keep your steps mapping) */}
            </div>

            <button className="portal-close" onClick={onClose}><FiX /></button>
          </div>

          <div className="portal-content" ref={contentRef}>
            <form id="checkoutForm" onSubmit={onSubmit}>
              {/* STEP 1 & 2 remain the same */}
              {/* STEP 3: TRIBUTE (Modified for better mobile fit) */}
              {step === 3 && (
                <div className="fade-slide-up tribute-step">
                  <div className="payment-grid">
                    {/* ... (Keep your payment cards) */}
                  </div>

                  {formData.metodePembayaran === 'Transfer Bank' && (
                     <div className="payment-info-box">
                       <p className="acc-number">BCA: 0950477491</p>
                       <p className="acc-name">a.n. Frans Indroyono</p>
                     </div>
                  )}

                  {formData.metodePembayaran === 'QRIS' && (
                     <div className="qris-container">
                       <img src="./assets/recup/bundles/qris.jpeg" alt="QRIS" />
                     </div>
                  )}

                  {(formData.metodePembayaran === 'Transfer Bank' || formData.metodePembayaran === 'QRIS') && (
                    <div className="upload-section">
                       <label className="upload-area">
                         <input type="file" hidden accept="image/*" onChange={handlePaymentProof} />
                         <FiUpload size={24} />
                         <div className="upload-text">
                           {preview ? 'IMAGE SELECTED' : 'UPLOAD PROOF'}
                         </div>
                       </label>
                       {preview && (
                         <div className="preview-container">
                           <img src={preview} alt="Proof" />
                         </div>
                       )}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          <div className="portal-footer">
            {step > 1 ? (
              <button className="btn-portal" onClick={back}>BACK</button>
            ) : <div />}

            {step < 3 ? (
              <button className="btn-portal primary" onClick={next}>NEXT STEP</button>
            ) : (
              <button className="btn-portal primary" onClick={onSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'SEALING...' : 'CONFIRM TRIBUTE'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};