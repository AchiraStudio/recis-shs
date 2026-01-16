import React from 'react';
import '../css/merch-greek.css'; // Ensure path is correct to new CSS
import { FiPlus } from "react-icons/fi"; // Optional icon for visual flair

const MerchDisplay = ({ products, onAddToCart }) => {
  return (
    <section className="merch-section-greek" id="merch">
      
      <div className="merch-container-greek">
        <div className="merch-header-greek">
          <span className="mh-sub-greek">Equip Yourself</span>
          <h2 className="mh-title-greek">THE ARMORY</h2>
        </div>

        <div className="merch-grid-greek">
          {products.map(product => (
            <div key={product.id} className="item-card-greek">
              {product.featured && (
                <div className="featured-flag-greek">BEST SELLER</div>
              )}
              
              <div className="ic-img-box-greek">
                <img src={product.image} alt={product.name} />
                
                {/* Desktop Hover Overlay */}
                <div className="ic-overlay">
                  <button className="quick-add-greek" onClick={() => onAddToCart(product)}>
                    ACQUIRE +
                  </button>
                </div>
              </div>
              
              <div className="ic-info-greek">
                <h3 className="ic-name-greek">{product.name}</h3>
                <div className="ic-price-greek">
                  <span className="currency-greek">Rp</span> 
                  {product.price.toLocaleString('id-ID')}
                </div>
              </div>

              {/* Mobile Only Button (Visible via CSS media query) */}
              <div className="mobile-add-btn" onClick={() => onAddToCart(product)}>
                ACQUIRE <FiPlus style={{marginLeft:5}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchDisplay;