import React, { useState, useEffect, useRef } from 'react';
import '../css/recup-checkout.css';
import { FiX, FiChevronDown, FiUpload, FiCreditCard, FiTruck, FiDollarSign, FiShoppingBag } from 'react-icons/fi';

const CheckoutProcess = ({ 
  isOpen, onClose, cart, cartTotal, formData, handleInput, 
  paymentProof, handlePaymentProof, onSubmit, isSubmitting 
}) => {
  
  const [step, setStep] = useState(1);
  const [activeConfig, setActiveConfig] = useState(0); 
  const [preview, setPreview] = useState(null);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  const contentRef = useRef(null);

  const steps = [
    { id: 1, title: 'IDENTITY' },
    { id: 2, title: 'SPECS' },
    { id: 3, title: 'OFFERING' }
  ];

  const sizesBlack = ['M', 'L', 'XL', '2XL']; 
  const sizesWhite = ['XS', 'S', 'M', 'L', 'XL', '2XL']; 
  const bracelets = ['Hitam', 'Cream', 'Maroon', 'Light Blue'];

  // LOCK BODY SCROLL WHEN OPEN
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setIsMobileSummaryOpen(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if(paymentProof) {
      const u = URL.createObjectURL(paymentProof);
      setPreview(u);
      return () => URL.revokeObjectURL(u);
    }
    setPreview(null);
  }, [paymentProof]);

  useEffect(() => {
    if(contentRef.current) contentRef.current.scrollTop = 0;
  }, [step]);

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
        
        {/* --- LEFT PANEL: MANIFEST --- */}
        <div className={`portal-left ${isMobileSummaryOpen ? 'visible' : ''}`}>
          <div className="manifest-header">
            <h2 className="manifest-title">MANIFEST</h2>
            <div className="manifest-subtitle">EST. MMXXVI // RECUP</div>
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

        {/* --- RIGHT PANEL: FORM --- */}
        <div className="portal-right">
          
          <div className="portal-header">
            <div className="mobile-summary-toggle" onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}>
              <FiShoppingBag /> {isMobileSummaryOpen ? 'Hide' : 'Show'} Order
            </div>

            <div className="step-indicator">
              {steps.map(s => (
                <div key={s.id} className={`step-dot ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                  <span>0{s.id}</span>
                  <span>{s.title}</span>
                </div>
              ))}
            </div>

            <button className="portal-close" onClick={onClose}><FiX /></button>
          </div>

          <div className="portal-content" ref={contentRef}>
            <form id="checkoutForm" onSubmit={onSubmit}>
              
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="fade-slide-up">
                  <div className="input-group">
                    <label className="c-label">FULL NAME</label>
                    <input className="c-input" name="namaLengkap" value={formData.namaLengkap} onChange={handleInput} placeholder="e.g. JONATHAN JOESTAR" style={{textTransform:'uppercase'}} required />
                  </div>
                  
                  <div className="input-group">
                    <label className="c-label">EMAIL SCROLL</label>
                    <input type="email" className="c-input" name="email" value={formData.email} onChange={handleInput} placeholder="name@domain.com" required />
                  </div>
                  
                  <div className="input-group">
                    <label className="c-label">WHATSAPP</label>
                    <input type="tel" className="c-input" name="nomorTelepon" value={formData.nomorTelepon} onChange={handleInput} placeholder="08..." required />
                  </div>
                </div>
              )}

              {/* STEP 2: SPECS */}
              {step === 2 && (
                <div className="fade-slide-up">
                  {cart.map((item, idx) => {
                    if(item.type === 'accessory') return (
                       <div key={idx} className="config-item" style={{opacity:0.7}}>
                         <div className="config-header">
                            <h4>{item.name} (x{item.quantity}) - No Config Needed</h4>
                         </div>
                       </div>
                    );

                    return (
                      <div key={idx} className={`config-item ${activeConfig === idx ? 'active' : ''}`}>
                        <div className="config-header" onClick={() => setActiveConfig(activeConfig === idx ? -1 : idx)}>
                          <h4 style={{textTransform:'uppercase'}}>{item.name} (x{item.quantity})</h4>
                          <FiChevronDown className="config-icon" />
                        </div>
                        
                        <div className="config-body">
                           {Array.from({length: item.quantity}).map((_, i) => {
                             const key = `${idx}_${i}`;
                             let sizeOptions = [];
                             let showColor = false;
                             let showBracelets = false;

                             if (item.type === 'shirt_black') { sizeOptions = sizesBlack; } 
                             else if (item.type === 'shirt_white') { sizeOptions = sizesWhite; } 
                             else if (item.type === 'bundle') { sizeOptions = sizesWhite; showColor = true; showBracelets = true; }

                             return (
                               <div key={i} style={{marginBottom: i === item.quantity - 1 ? 0 : 25}}>
                                 <div className="spec-item-divider">ITEM #{i+1} SPECIFICATIONS</div>
                                 {(item.type === 'shirt_black' || item.type === 'shirt_white' || item.type === 'bundle') && (
                                   <div className="c-row">
                                     <div className="input-group">
                                       <label className="c-label">SIZE</label>
                                       <select className="c-select" name={`sizeTshirt_${key}`} value={formData[`sizeTshirt_${key}`]} onChange={handleInput} required>
                                         <option value="">Select Size</option>
                                         {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                       </select>
                                     </div>
                                     {showColor && (
                                       <div className="input-group">
                                         <label className="c-label">COLOR</label>
                                          <select className="c-select" name={`warnaTshirt_${key}`} value={formData[`warnaTshirt_${key}`]} onChange={handleInput} required>
                                           <option value="">Select Color</option>
                                           <option value="Hitam">Hitam</option>
                                           <option value="Putih">Putih</option>
                                          </select>
                                       </div>
                                     )}
                                   </div>
                                 )}
                                 {showBracelets && (
                                   <div className="input-group">
                                     <label className="c-label">WRISTBAND</label>
                                     <select className="c-select" name={`warnaGelang_${key}`} value={formData[`warnaGelang_${key}`]} onChange={handleInput} required>
                                       <option value="">Select Color</option>
                                       {bracelets.map(c => <option key={c} value={c}>{c}</option>)}
                                     </select>
                                   </div>
                                 )}
                               </div>
                             )
                           })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* STEP 3: TRIBUTE */}
              {step === 3 && (
                <div className="fade-slide-up">
                  <div className="payment-grid">
                    <div className={`payment-card ${formData.metodePembayaran === 'Transfer Bank' ? 'selected' : ''}`}
                      onClick={() => handleInput({target: {name: 'metodePembayaran', value: 'Transfer Bank'}})}>
                      <FiCreditCard size={24} />
                      <span>TRANSFER</span>
                    </div>
                    <div className={`payment-card ${formData.metodePembayaran === 'QRIS' ? 'selected' : ''}`}
                      onClick={() => handleInput({target: {name: 'metodePembayaran', value: 'QRIS'}})}>
                      <FiDollarSign size={24} />
                      <span>QRIS</span>
                    </div>
                    <div className={`payment-card ${formData.metodePembayaran === 'COD' ? 'selected' : ''}`}
                      onClick={() => handleInput({target: {name: 'metodePembayaran', value: 'COD'}})}>
                      <FiTruck size={24} />
                      <span>COD</span>
                    </div>
                  </div>

                  {formData.metodePembayaran === 'Transfer Bank' && (
                     <div className="bank-details-box">
                       <p className="bank-acc">BCA: 0950477491</p>
                       <p className="bank-name">a.n. Frans Indroyono</p>
                     </div>
                  )}

                  {formData.metodePembayaran === 'QRIS' && (
                     <div className="qris-display">
                       <img src="./assets/recup/bundles/qris.jpeg" alt="QRIS" />
                     </div>
                  )}

                  {(formData.metodePembayaran === 'Transfer Bank' || formData.metodePembayaran === 'QRIS') && (
                    <div className="upload-container">
                       <label className="upload-area">
                         <input type="file" hidden accept="image/*" onChange={handlePaymentProof} />
                         <FiUpload size={24} />
                         <div className="upload-label-text">{preview ? 'IMAGE SELECTED' : 'UPLOAD PROOF'}</div>
                       </label>
                       {preview && (
                         <div className="upload-preview-wrapper">
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
            {step > 1 ? ( <button className="btn-portal" onClick={back}>BACK</button> ) : ( <div /> )}
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

export default CheckoutProcess;