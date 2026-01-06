import React from 'react';
import '../css/merch-greek.css';

const MerchDisplay = ({ products, onAddToCart }) => {
  return (
    <section className="merch-section-greek" id="merch">
      <div className="parchment-bg-greek"></div>
      
      <div className="merch-container-greek">
        <div className="merch-header-greek">
          <h2 className="mh-title-greek">THE ARMORY</h2>
          <p className="mh-sub-greek">Equip yourself for the games.</p>
        </div>

        <div className="merch-grid-greek">
          {products.map(product => (
            <div key={product.id} className="item-card-greek">
              {product.featured && <div className="featured-flag-greek">BEST SELLER</div>}
              
              <div className="ic-img-box-greek">
                <img src={product.image} alt={product.name} />
                <button className="quick-add-greek" onClick={() => onAddToCart(product)}>
                  ACQUIRE +
                </button>
              </div>
              
              <div className="ic-info-greek">
                <h3 className="ic-name-greek">{product.name}</h3>
                <div className="ic-price-greek">
                  <span className="currency-greek">Rp</span> 
                  {product.price.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default MerchDisplay;