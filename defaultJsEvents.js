<script>
  
  // WHATS CLICK
  document.querySelectorAll('a[href^="https://web.whatsapp"], a[href^="https://wa.me"], a[href^="https://api.whatsapp"], a[href^="https://wa.link"]').forEach(function(wtsBtn){
    wtsBtn.addEventListener('click', function(){
      dataLayer.push({'event': 'whats-click'});
    });
  });
  
  setTimeout(function(){
    var rdForm = document.querySelector('.rdstation-popup-js-form-identifier');
    if(rdForm){
      rdForm.addEventListener('submit', function(){
        dataLayer.push({'event': 'whats-click'});
      });
    }
  },1500)
  
  
  // ADD CART - HOME  
  document.querySelectorAll('.add_cart a').forEach(function(addCartBtnList){
    addCartBtnList.addEventListener('click', function(event){
      var parent = event.target.closest('.grid-item');
      var valor = parseFloat(parent.querySelector('.price_wrapper .price').innerText.replaceAll('R$ ','').replaceAll('.', '').replaceAll(',', '.'));
      var quantidade = parseInt(parent.querySelector('.quantidade').value);
      var itemName = parent.querySelector('.title > h2').innerText;
      var itemId = parent.querySelector('.produto_codigo').value;
      var obj = {
        event : 'add-to-cart',
        currency: "BRL",
        value: valor * quantidade,
        items: [
          {
            id: itemId,
            name: itemName,
            price: valor,
            quantity: quantidade
          }
        ]
      };
      
      dataLayer.push(obj);
    });
  });
  
  // PRODUTO
  if(window.location.pathname.indexOf('/produto') >= 0){
    // VIEW ITEM
    var valor = parseFloat(document.querySelector('.new_price').innerText.replace(/\D/g, "")) / 100;
    var quantidade = parseInt(document.querySelector('#produto_quantidade_preview').value);
    var itemName = document.querySelector('.prod_title').innerText;
    var itemId = document.querySelector('#idProduto').value;
    var obj = {
      event : 'view-item',
      currency: "BRL",
      value: valor * quantidade,
      items: [
        {
          id: itemId,
          name: itemName,
          price: valor,
          quantity: quantidade
        }
      ]
    };
    
    dataLayer.push(obj);
    
    // ADD CART
    document.querySelectorAll('.prod_info a[href^="/carrinho"]').forEach(function(addCartBtnProd){
      addCartBtnProd.addEventListener('click', function(event){
        console.log(event.target);
        var valor = parseFloat(document.querySelector('.new_price').innerText.replace(/\D/g, "")) / 100;
        var quantidade = parseInt(document.querySelector('#produto_quantidade_preview').value);
        var itemName = document.querySelector('.prod_title').innerText;
        var itemId = document.querySelector('#idProduto').value;
        var obj = {
          event : 'add-to-cart',
          currency: "BRL",
          value: valor * quantidade,
          items: [
            {
              id: itemId,
              name: itemName,
              price: valor,
              quantity: quantidade
            }
          ]
        };
        
        dataLayer.push(obj);
        
      });
    });
  }
      
  document.querySelectorAll('.finish_purchase').forEach(function(beginChechoutBtn){
    beginChechoutBtn.addEventListener('click', function(event){
      var valorTotal = parseFloat(document.querySelector('.total .value > .item').innerText.replace(/\D/g, "")) / 100;
      var cupom = document.querySelector('#cupom_input').value;
      var items = [];
      
      document.querySelectorAll('.product-item').forEach(function(it){
        var objItem = {
          id: it.querySelector('[name="idProduto"]').value,
          name: it.querySelector('.picture_name .name').innerText,
          price: parseFloat(it.querySelector('.price-uni strong').innerText.replace(/\D/g, "")) / 100,
          quantity: it.querySelector('.iptQtd').value
        };
        
        items.push(objItem);
      });
      
      var obj = {
        event : 'begin-checkout',
        currency: "BRL",
        value: valorTotal,
        coupon: cupom,
        items: items
      };
        
      dataLayer.push(obj);
    });
  });
  
  if(document.querySelectorAll('.closed_order').length > 0){
    var valorTotal = parseFloat(document.querySelector('.price_total').innerText.replace(/\D/g, "")) / 100;
    var transaction_id = document.querySelector('.order_number').innerText.replace(/\D/g, "");
    var shipping = parseFloat(document.querySelector('.shipping_services_value').innerText.replace(/\D/g, "")) / 100;
    var items = [];
    
    document.querySelectorAll('.right_order tbody tr').forEach(function(it){
      var objItem = {
        name: it.querySelector('.name').innerText,
        price: parseFloat(it.querySelector('.total').innerText.replace(/\D/g, "")) / 100,
        quantity: it.querySelector('.quantify').innerText
      };
      items.push(objItem);
    });
      
    var obj = {
      event : 'checkout',
      currency: "BRL",
      value: valorTotal,
      shipping: shipping,
      items: items
    };
    
    dataLayer.push(obj);
  }
    
</script>
