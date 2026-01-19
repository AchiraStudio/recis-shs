import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MerchDisplay from './merch/MerchDisplay';
import CheckoutProcess from './merch/CheckoutProcess';
import './css/recup-merch.css';

// Using Google Script Web App URLs
const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxT6o1Wynifg9xZNcijfF-vGPLXjXKoupBT70MD29H-XObi0ZSdYxtgcGHQ1StA6Jo/exec';
const UPLOAD_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxx1FNEgjCY2PTKwfuzYbXjLiaMUjFAWWHwtgN85dwXr0W3_QGmyyT5p2HR45Qx0jxW/exec';

const RecupMerch = () => {
  // Data
  const sampleProducts = useMemo(() => [
        // --- NEW ITEMS ---
    {
      id: 7, name: "Official T-Shirt: White Edition", price: 150000,
      image: "./assets/recup/bundles/white-shirt.png", 
      description: "Limited Edition Black T-Shirt. High quality cotton.",
      soldOut: false, type: 'shirt_black', featured: true
    },
    {
      id: 8, name: "Official T-Shirt: Black Edition", price: 150000,
      image: "./assets/recup/bundles/black-shirt.png",
      description: "Standard Edition White T-Shirt. Full size range available.",
      soldOut: false, type: 'shirt_white', featured: true
    },
    {
      id: 9, name: "Recup Totebag", price: 65000,
      image: "./assets/recup/bundles/totebag.png",
      description: "Canvas material, durable print.",
      soldOut: false, type: 'accessory', featured: false
    },
    // --- OLD BUNDLES (SOLD OUT) ---
    {
      id: 1, name: "Bundle 1: Zeus Armory", price: 195000,
      image: "./assets/recup/bundles/bundle1.jpeg",
      description: "Complete Set: Ticket, T-Shirt, Bracelet, Totebag.",
      soldOut: true, type: 'bundle'
    },
    {
      id: 2, name: "Bundle 2: Hermes Kit", price: 170000,
      image: "./assets/recup/bundles/bundle2.jpeg",
      description: "Scout Set: Ticket, T-Shirt, Bracelet, Keychain.",
      soldOut: true, type: 'bundle'
    },
    {
      id: 3, name: "Bundle 3: Poseidon Pack", price: 220000,
      image: "./assets/recup/bundles/bundle3.jpeg",
      description: "Hydration Set: Ticket, T-Shirt, Tumbler, Bracelet.",
      soldOut: true, type: 'bundle'
    },
    {
      id: 4, name: "Bundle 4: Athena Scroll", price: 200000,
      image: "./assets/recup/bundles/bundle4.jpeg",
      description: "Scholar Set: Ticket, Totebag, Tumbler, Bracelet.",
      soldOut: true, type: 'bundle'
    },
    {
      id: 5, name: "Bundle 5: Apollo Gear", price: 160000,
      image: "./assets/recup/bundles/bundle5.jpeg",
      description: "Essential: Ticket, Tumbler, Bracelet, Keychain.",
      soldOut: true, type: 'bundle'
    },
    {
      id: 6, name: "Bundle 6: Ares Starter", price: 155000,
      image: "./assets/recup/bundles/bundle6.jpeg",
      description: "Novice: Ticket, Totebag, Bracelet, Keychain.",
      soldOut: true, type: 'bundle'
    }
  ], []);

  // State
  const [products] = useState(sampleProducts);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Checkout Form - Removed kelas and nomorAbsen
  const [formData, setFormData] = useState({
    email: '', namaLengkap: '', nomorTelepon: '', metodePembayaran: ''
  });
  const [paymentProof, setPaymentProof] = useState(null);

  // Restore Cart
  useEffect(() => {
    const saved = localStorage.getItem('recupMerchCart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save Cart
  useEffect(() => {
    localStorage.setItem('recupMerchCart', JSON.stringify(cart));
  }, [cart]);

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  // Handlers
  const addToCart = useCallback((product) => {
    if (product.soldOut) return;
    setCart(prev => {
      const exist = prev.find(p => p.id === product.id);
      if (exist) return prev.map(p => p.id === product.id ? {...p, quantity: p.quantity + 1} : p);
      return [...prev, {...product, quantity: 1}];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(0, item.quantity + delta) };
      return item;
    }).filter(item => item.quantity > 0));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const handlePaymentProof = (e) => setPaymentProof(e.target.files[0]);
  const handleInput = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // --- SUBMISSION LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isSubmitting) return;

    // VALIDATION: Removed checks for kelas and nomorAbsen
    if (!formData.email || !formData.namaLengkap || !formData.nomorTelepon) {
        alert("Please complete all identity fields.");
        return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Image
      let proofUrl = '';
      if (paymentProof) {
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(paymentProof);
        });
        
        const uploadRes = await fetch(UPLOAD_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify({
            image: base64,
            fileName: `PROOF_${formData.namaLengkap.replace(/\s/g,'')}_${Date.now()}.jpg`,
            mimeType: paymentProof.type
          })
        });
        const uploadData = await uploadRes.json();
        proofUrl = uploadData.fileUrl || uploadData.url;
      }

      // 2. Submit Rows
      const rows = [];
      cart.forEach((item, idx) => {
        for(let i=0; i<item.quantity; i++) {
          const key = `${idx}_${i}`;
          
          let specificColor = '-';
          let specificSize = '-';

          if (item.type === 'shirt_black') {
            specificColor = 'Hitam';
            specificSize = formData[`sizeTshirt_${key}`] || '-';
          } else if (item.type === 'shirt_white') {
            specificColor = 'Putih';
            specificSize = formData[`sizeTshirt_${key}`] || '-';
          } else if (item.type === 'bundle') {
            specificColor = formData[`warnaTshirt_${key}`] || '-';
            specificSize = formData[`sizeTshirt_${key}`] || '-';
          }

          const specificGelang = formData[`warnaGelang_${key}`] || '-';

          // --- DATA MAPPING: Removed 'Kelas' and 'Nomor Absen' keys ---
          rows.push({
            'Timestamp': new Date().toLocaleString('id-ID'), 
            'Email': formData.email, 
            'Nama lengkap (KAPITAL SEMUA)': formData.namaLengkap.toUpperCase(), 
            'Nomor Telepon (cth. 081287198857)': formData.nomorTelepon,
            'Pilih Bundle': item.name, 
            'Warna T-Shirt': specificColor,
            'Size T-Shirt': specificSize,
            'Warna Gelang': specificGelang,
            'Metode Pembayaran': formData.metodePembayaran,
            'Harga': item.price,
            'Total Harga': cartTotal,
            'Bukti': proofUrl 
          });
        }
      });

      // Send to Google Script
      for (const row of rows) {
        await fetch(APP_SCRIPT_URL, { 
            method: 'POST', 
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(row) 
        });
      }

      setCart([]);
      setIsCheckoutOpen(false);
      setShowSuccess(true);
      localStorage.removeItem('recupMerchCart');

    } catch (err) {
      alert("Error submitting: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="merch">
      <MerchDisplay
        products={products}
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onAdd={addToCart}
        onUpdate={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        cartTotal={cartTotal}
      />

      <CheckoutProcess
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        formData={formData}
        handleInput={handleInput}
        paymentProof={paymentProof}
        handlePaymentProof={handlePaymentProof}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Success Modal */}
      {showSuccess && (
        <div className="checkout-portal-overlay open" onClick={() => setShowSuccess(false)}>
          <div className="portal-container" style={{height:'auto', padding:'60px', alignItems:'center', justifyContent:'center', textAlign:'center', flexDirection:'column', maxWidth:'500px'}}>
            <h2 style={{fontFamily:'var(--font-heading)', color:'var(--portal-accent)', fontSize:'2rem'}}>OFFERING ACCEPTED</h2>
            <p style={{color:'var(--portal-text-muted)', marginBottom:30}}>Your equipment has been secured. Check your email for confirmation.</p>
            <button className="btn-portal primary" onClick={() => setShowSuccess(false)}>RETURN</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecupMerch;