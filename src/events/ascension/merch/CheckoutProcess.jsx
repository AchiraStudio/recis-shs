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

  // --- UPDATED CLASS SORTING LOGIC ---
  // Generates: X-1...X-9, then XI-1...XI-9, then XII-1...XII-9
  const kelasOptions = ['X', 'XI', 'XII'].flatMap(grade => 
    Array.from({ length: 9 }, (_, i) => `${grade}-${i + 1}`)
  );

  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  const colors = ['Hitam', 'Putih'];
  const bracelets = ['Hitam', 'Cream', 'Maroon', 'Light Blue'];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsMobileSummaryOpen(false);
    }
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
    if(step === 1 && (!formData.namaLengkap || !formData.email || !formData.kelas)) {
       alert("Please complete identity details.");
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
                  
                  <div className="c-row">
                    <div className="input-group">
                      <label className="c-label">CLASS</label>
                      <select className="c-select" name="kelas" value={formData.kelas} onChange={handleInput} required>
                        <option value="">Select Legion</option>
                        {kelasOptions.map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="c-label">ABSENT NO.</label>
                      <input type="number" className="c-input" name="nomorAbsen" value={formData.nomorAbsen} onChange={handleInput} required />
                    </div>
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
                  {cart.map((item, idx) => (
                    <div key={idx} className={`config-item ${activeConfig === idx ? 'active' : ''}`}>
                      <div className="config-header" onClick={() => setActiveConfig(activeConfig === idx ? -1 : idx)}>
                        <h4 style={{textTransform:'uppercase'}}>{item.name} (x{item.quantity})</h4>
                        <FiChevronDown className="config-icon" />
                      </div>
                      
                      <div className="config-body">
                         {Array.from({length: item.quantity}).map((_, i) => {
                           const key = `${idx}_${i}`;
                           return (
                             <div key={i} style={{marginBottom: i === item.quantity - 1 ? 0 : 25}}>
                               <div style={{fontSize:'0.75rem', color:'var(--portal-accent-dim)', marginBottom:10, borderBottom:'1px solid var(--portal-border)', paddingBottom:5}}>
                                 ITEM #{i+1} CONFIGURATION
                               </div>
                               
                               {item.hasTshirt && (
                                 <div className="c-row">
                                   <div className="input-group" style={{marginBottom:15}}>
                                     <label className="c-label">SIZE</label>
                                     <select className="c-select" name={`sizeTshirt_${key}`} value={formData[`sizeTshirt_${key}`]} onChange={handleInput} required>
                                       <option value="">Select Size</option>
                                       {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                     </select>
                                   </div>
                                   <div className="input-group" style={{marginBottom:15}}>
                                     <label className="c-label">COLOR</label>
                                     <select className="c-select" name={`warnaTshirt_${key}`} value={formData[`warnaTshirt_${key}`]} onChange={handleInput} required>
                                       <option value="">Select Color</option>
                                       {colors.map(c => <option key={c} value={c}>{c}</option>)}
                                     </select>
                                   </div>
                                 </div>
                               )}
                               
                               <div className="input-group" style={{marginBottom:0}}>
                                 <label className="c-label">WRISTBAND</label>
                                 <select className="c-select" name={`warnaGelang_${key}`} value={formData[`warnaGelang_${key}`]} onChange={handleInput} required>
                                   <option value="">Select Color</option>
                                   {bracelets.map(c => <option key={c} value={c}>{c}</option>)}
                                 </select>
                               </div>
                             </div>
                           )
                         })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3: TRIBUTE */}
              {step === 3 && (
                <div className="fade-slide-up">
                  <div style={{marginBottom:15, fontFamily:'var(--font-heading)', color:'var(--portal-accent)', fontSize:'0.9rem'}}>
                    SELECT METHOD
                  </div>
                  
                  <div className="payment-grid">
                    <div 
                      className={`payment-card ${formData.metodePembayaran === 'transfer' ? 'selected' : ''}`}
                      onClick={() => handleInput({target: {name: 'metodePembayaran', value: 'transfer'}})}
                    >
                      <FiCreditCard size={24} />
                      <span>TRANSFER</span>
                    </div>
                    <div 
                      className={`payment-card ${formData.metodePembayaran === 'qris' ? 'selected' : ''}`}
                      onClick={() => handleInput({target: {name: 'metodePembayaran', value: 'qris'}})}
                    >
                      <FiDollarSign size={24} />
                      <span>QRIS</span>
                    </div>
                    <div 
                      className={`payment-card ${formData.metodePembayaran === 'cod' ? 'selected' : ''}`}
                      onClick={() => handleInput({target: {name: 'metodePembayaran', value: 'cod'}})}
                    >
                      <FiTruck size={24} />
                      <span>COD</span>
                    </div>
                  </div>

                  {formData.metodePembayaran === 'transfer' && (
                     <div style={{background:'var(--portal-left-bg)', padding:15, borderRadius:4, marginBottom:20, textAlign:'center'}}>
                       <p style={{margin:0, color:'var(--portal-accent)', fontFamily:'var(--font-heading)'}}>BCA: 0950477491</p>
                       <p style={{margin:0, fontSize:'0.8rem', color:'var(--portal-text-muted)'}}>a.n. Frans Indroyono</p>
                     </div>
                  )}

                  {formData.metodePembayaran === 'qris' && (
                     <div style={{textAlign:'center', marginBottom:20}}>
                       <img src="./assets/recup/bundles/qris.jpeg" style={{width:180, borderRadius:8, border:'1px solid var(--portal-border)'}} alt="QRIS" />
                     </div>
                  )}

                  {(formData.metodePembayaran === 'transfer' || formData.metodePembayaran === 'qris') && (
                    <div className="input-group">
                       <label className="upload-area">
                         <input type="file" hidden accept="image/*" onChange={handlePaymentProof} />
                         <FiUpload size={30} style={{marginBottom:10, color:'var(--portal-accent-dim)'}} />
                         <div style={{fontFamily:'var(--font-heading)', color:'var(--portal-text-main)'}}>
                           {preview ? 'IMAGE SELECTED' : 'UPLOAD PROOF'}
                         </div>
                         <div style={{fontSize:'0.75rem', marginTop:5}}>Click to browse gallery</div>
                       </label>
                       {preview && (
                         <div style={{marginTop:10, textAlign:'center'}}>
                           <img src={preview} alt="Proof" style={{height:100, border:'1px solid var(--portal-border)', borderRadius:4}} />
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
            ) : (
              <div />
            )}

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