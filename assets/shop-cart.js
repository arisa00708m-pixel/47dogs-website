
const products=[{name:'群馬｜鹿肉のおやつ',region:'GUNMA · VENISON',price:1480,t:'',label:'GUNMA'},{name:'三重｜伊賀の恵み',region:'MIE · VENISON',price:1680,t:'t2',label:'MIE'},{name:'神奈川｜海辺のごほうび',region:'KANAGAWA · SELECTION',price:1380,t:'t3',label:'KANAGAWA'}];const cart={};
const cartKey='47dogs-demo-bag-v1';
function readCart(){
 try{
  const saved=JSON.parse(sessionStorage.getItem(cartKey)||'{}');
  products.forEach((_,i)=>{const n=saved?.[i];cart[i]=Number.isSafeInteger(n)&&n>0?n:0});
 }catch{}
}
function saveCart(){try{sessionStorage.setItem(cartKey,JSON.stringify(cart))}catch{}}
readCart();
function productCard(p,i){return `<article class="product"><div class="product-photo ${p.t}"><div class="pack ${p.t}"><div class="small">JAPAN'S LITTLE GIFTS</div><div class="num">47</div><div class="dots">DOGS TREAT</div><div class="region">${p.label}</div></div></div><div class="product-info"><div class="meta">${p.region}</div><h3>${p.name}</h3><div class="price">¥${p.price.toLocaleString('ja-JP')} <small>（仮価格）</small></div><button class="buy" onclick="addToCart(${i})">ADD TO BAG <span>＋</span></button></div></article>`}
const productGrid=document.querySelector('#products');
if(productGrid)productGrid.innerHTML=products.map(productCard).join('');
function count(){return Object.values(cart).reduce((a,b)=>a+b,0)}function addToCart(i){cart[i]=(cart[i]||0)+1;saveCart();updateCart();toast('デモカートに追加しました');}function updateCart(){document.getElementById('cartcount').textContent=`(${count()})`;document.getElementById('mobilecount').textContent=`(${count()})`;const el=document.getElementById('cartItems');el.innerHTML=count()?Object.entries(cart).filter(([i,n])=>n>0).map(([i,n])=>`<div class="cart-item"><div>${products[i].name}<small>¥${products[i].price.toLocaleString('ja-JP')} × ${n}</small></div><div class="quantity"><button aria-label="数量を減らす" onclick="changeQty(${i},-1)">−</button>${n}<button aria-label="数量を増やす" onclick="changeQty(${i},1)">＋</button></div></div>`).join(''):'<p>バッグに商品はありません。</p>';const total=Object.entries(cart).reduce((s,[i,n])=>s+products[i].price*n,0);document.getElementById('cartTotal').textContent=`小計（仮価格）：¥${total.toLocaleString('ja-JP')}`;}function changeQty(i,d){cart[i]=Math.max(0,(cart[i]||0)+d);saveCart();updateCart()}function openCart(){document.getElementById('drawer').classList.add('active');document.getElementById('backdrop').classList.add('active');updateCart();document.querySelector('.close').focus()}function closeCart(){document.getElementById('drawer').classList.remove('active');document.getElementById('backdrop').classList.remove('active')}function toggleMenu(){const open=document.getElementById('mobileMenu').classList.toggle('open');document.querySelector('.hamburger').setAttribute('aria-expanded',String(open))}let toastTimer;function toast(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2500)}function demoSubscribe(e){e.preventDefault();document.getElementById('email').value='';toast('試作品のため登録は行われません')}document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});updateCart();


window.addEventListener('pageshow',()=>{readCart();updateCart()});

const regionShop=document.getElementById('shop-map');
if(regionShop){
 const buttons=[...regionShop.querySelectorAll('[data-region]')];
 const results=document.getElementById('region-products');
 const status=document.getElementById('region-status');
 const reset=document.getElementById('region-reset');
 let selectedKey='';
 function select(key,name){
   if(key===selectedKey)return;
   selectedKey=key;
   const matches=products.map((item,i)=>({item,i})).filter(({item})=>item.label===key);
   for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.region===key));
   results.innerHTML=matches.map(({item,i})=>productCard(item,i)).join('');
   status.textContent=key?name+'のおやつ（'+matches.length+'品）':'現在選べる産地は、群馬・三重・神奈川です。';
   reset.hidden=!key;
 }
 for(const button of buttons)button.addEventListener('click',()=>select(button.dataset.region,button.dataset.name));
 reset.addEventListener('click',()=>{select('','');regionShop.querySelector('.region-buttons [data-region]').focus()});
}
