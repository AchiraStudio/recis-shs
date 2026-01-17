import React, { memo } from 'react';
import { FiShoppingBag, FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { GiGreekTemple } from "react-icons/gi";

const ProductCard = memo(({ product, onAdd }) => (
  <div className={`merch-card ${product.soldOut ? 'sold-out-card' : ''}`}>
    {product.featured && !product.soldOut && <div className="mc-badge">NEW</div>}
    {product.soldOut && <div className="mc-badge sold">SOLD OUT</div>}
    
    <div className="mc-image-box">
      <img src={product.image} alt={product.name} className="mc-image" loading="lazy" />
      <div className={`mc-overlay ${product.soldOut ? 'sold-out' : ''}`}>
        {product.soldOut ? (
          <span className="sold-text">UNAVAILABLE</span>
        ) : (
          <button className="mc-btn-overlay" onClick={() => onAdd(product)}>ACQUIRE</button>
        )}
      </div>
    </div>
    
    <div className="mc-info">
      <h3 className="mc-name">{product.name}</h3>
      <div className="mc-price">Rp {product.price.toLocaleString('id-ID')}</div>
      {product.type === 'shirt_black' && !product.soldOut && (
         <div style={{fontSize:'0.7rem', color:'var(--accent-red)', marginTop:5}}>*Limited Sizes Available</div>
      )}
    </div>

    <button 
      className="mc-btn-mobile" 
      onClick={() => onAdd(product)} 
      disabled={product.soldOut}
      style={product.soldOut ? {opacity:0.5, cursor:'not-allowed'} : {}}
    >
      {product.soldOut ? 'Sold Out' : 'Add to Cart'}
    </button>
  </div>
));

const MerchDisplay = ({ 
  products, cart, isCartOpen, setIsCartOpen, 
  onAdd, onUpdate, onRemove, onCheckout, cartTotal 
}) => {
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="merch-section">
      <div className="merch-header">
        <span className="mh-subtitle">Equip Yourself</span>
        <h2 className="mh-title">The Armory</h2>
      </div>

      <div className="merch-grid">
        {products.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
      </div>

      {/* Floating Cart */}
      <div className="floating-cart" onClick={() => setIsCartOpen(true)}>
        <FiShoppingBag />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </div>

      {/* Side Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cd-header">
          <span><GiGreekTemple style={{marginRight:10}}/> INVENTORY</span>
          <FiX style={{cursor:'pointer'}} onClick={() => setIsCartOpen(false)} />
        </div>

        <div className="cd-items">
          {cart.length === 0 ? (
            <div style={{textAlign:'center', color:'var(--text-muted)', marginTop:50}}>
              Inventory Empty
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cd-item">
                <img src={item.image} alt="" className="cd-img" />
                <div className="cd-info" style={{flex:1}}>
                  <h4>{item.name}</h4>
                  <div className="cd-price">Rp {item.price.toLocaleString()}</div>
                  <div className="cd-actions">
                    <button className="cd-btn" onClick={() => onUpdate(item.id, -1)}><FiMinus size={12}/></button>
                    <span>{item.quantity}</span>
                    <button className="cd-btn" onClick={() => onUpdate(item.id, 1)}><FiPlus size={12}/></button>
                    <button className="cd-remove" onClick={() => onRemove(item.id)}><FiTrash2 /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cd-footer">
          <div className="cd-total">
            <span>TOTAL</span>
            <span style={{color:'var(--gold-primary)'}}>Rp {cartTotal.toLocaleString()}</span>
          </div>
          <button className="btn-greek" style={{width:'100%', justifyContent:'center'}} onClick={onCheckout} disabled={cart.length === 0}>
            PROCEED TO OFFERING
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchDisplay;