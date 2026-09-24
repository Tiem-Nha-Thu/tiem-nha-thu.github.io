const ZALO_NUMBER = "0907808645";
const ZALO_URL = "https://zalo.me/" + ZALO_NUMBER;

const products = [
  {
    id: 1,
    name: "Túi Vải Canvas",
    category: "Túi",
    price: 119000,
    image: "images/tui-1.jpg",
    description: "Túi handmade nhỏ xinh"
  },

  {
    id: 2,
    name: "Bóp Bút/ Viết",
    category: "Bóp/Ví",
    price: 79000,
    image: "images/bop-but-1.jpg",
    description: "Dung tích lớn, nhiều công dụng"
  }
  
  {
    id: 3,
    name: "Ví Vải Thô/Canvas",
    category: "Bóp/Ví",
    price: 149000,
    image: "images/vi-mini-1.jpg",
    description: "Gọn gàng, tiện mang theo"
  },

  {
    id: 4,
    name: "Cột tóc scrunchies",
    category: "Phụ kiện tóc",
    price: 20000,
    image: "images/cot-toc-1.jpg",
    description: "Vải Xô Muslim/ Thô"
  },

  {
    id: 5,
    name: "Kẹp tóc",
    category: "Phụ kiện tóc",
    price: 25000,
    image: "images/kep-toc-1.jpg",
    description: "Điểm nhấn nhẹ nhàng"
  },

  {
    id: 6,
    name: "Móc khóa handmade",
    category: "Móc khóa",
    price: 9000,
    image: "images/moc-khoa-1.jpg",
    description: "Món quà nhỏ đáng yêu"
  }

  {
    id: 7,
    name: "Dây Chuyền",
    category: "Trang sức",
    price: 15000,
    image: "images/trang-suc-1.jpg",
    description: "Phụ kiện xinh xắn, thu hút tài lộc"
  }

{
    id: 8,
    name: "Gối Ghim Kim",
    category: "Gối Ghim Kim",
    price: 39000,
    image: "images/goi-ghim-kim-1.jpg",
    description: "Bạn đồng hành cho góc may vá"
  }

{
    id: 9,
    name: "Phụ Kiện DIY",
    category: "DIY",
    price: 9000,
    image: "images/DIY-1.jpg",
    description: "Tự tay làm món đồ của bạn"
  }

{
    id: 10,
    name: "Túi Đựng Đồ Cá Nhân",
    category: "Túi",
    price: 39000,
    image: "images/tui-ca-nhan-1.jpg",
    description: "Nhỏ gọn cho những ngày xinh"
  }

  }
];
let cart = JSON.parse(localStorage.getItem("tnth_cart") || "[]");
let activeCategory = "Tất cả";
let searchTerm = "";
let sortMode = "default";

const money = n => new Intl.NumberFormat("vi-VN").format(n) + "đ";
const categories = ["Tất cả", "Túi", "Bóp / Ví", "Phụ kiện tóc", "Trang sức", "Móc khóa", "Gối ghim kim", "DIY"];

function saveCart(){ localStorage.setItem("tnth_cart", JSON.stringify(cart)); }

function renderCategories(){
  const el = document.getElementById("categoryList");
  el.innerHTML = categories.map(c => `<button class="category ${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");
  el.querySelectorAll(".category").forEach(btn => btn.onclick = () => {
    activeCategory = btn.dataset.cat;
    renderCategories(); renderProducts();
    document.getElementById("san-pham").scrollIntoView({behavior:"smooth"});
  });
}

function getFilteredProducts(){
  let list = products.filter(p => (activeCategory==="Tất cả" || p.category===activeCategory) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())));
  if(sortMode==="price-asc") list.sort((a,b)=>a.price-b.price);
  if(sortMode==="price-desc") list.sort((a,b)=>b.price-a.price);
  if(sortMode==="name") list.sort((a,b)=>a.name.localeCompare(b.name,"vi"));
  return list;
}

function renderProducts(){
  const list = getFilteredProducts();
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  empty.classList.toggle("hidden", list.length>0);
  grid.innerHTML = list.map(p => `
    <article class="product-card">
     <div class="product-image">
  <span class="product-tag">${p.category}</span>
  <img src="${p.image}" alt="${p.name}" loading="lazy">
</div>
      <div class="product-info">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="price-row"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="Thêm ${p.name}">+</button></div>
      </div>
    </article>`).join("");
  grid.querySelectorAll("[data-add]").forEach(btn => btn.onclick = () => addToCart(Number(btn.dataset.add)));
}

function addToCart(id){
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id,qty:1});
  saveCart(); renderCart(); showToast("Đã thêm vào giỏ hàng ♡");
}

function changeQty(id, delta){
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(x=>x.id!==id);
  saveCart(); renderCart();
}

function renderCart(){
  const items = document.getElementById("cartItems");
  const count = cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartCount").textContent = count;
  if(!cart.length){
    items.innerHTML = `<div class="empty-state"><div style="font-size:45px">🛍️</div><p>Giỏ hàng đang trống.<br>Chọn một món xinh xinh nhé!</p></div>`;
  } else {
    items.innerHTML = cart.map(item => {
      const p = products.find(x=>x.id===item.id);
      return `<div class="cart-item">
        <div class="cart-thumb">${p.icon}</div>
        <div><h4>${p.name}</h4><span class="mini-price">${money(p.price)}</span>
          <div class="qty"><button data-dec="${p.id}">−</button><b>${item.qty}</b><button data-inc="${p.id}">+</button></div>
        </div>
        <button class="remove" data-remove="${p.id}">Xóa</button>
      </div>`;
    }).join("");
    items.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.dec),-1));
    items.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.inc),1));
    items.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==Number(b.dataset.remove));saveCart();renderCart();});
  }
  const total = cart.reduce((s,x)=>s + (products.find(p=>p.id===x.id)?.price||0)*x.qty,0);
  document.getElementById("cartTotal").textContent = money(total);
}

function openCart(){
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart(){
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden","true");
}
function showToast(msg){
  const t=document.getElementById("toast"); t.textContent=msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}

function checkout(){
  if(!cart.length){showToast("Giỏ hàng đang trống.");return;}
  const lines = cart.map((item,i)=>{
    const p=products.find(x=>x.id===item.id);
    return `${i+1}. ${p.name} x${item.qty} - ${money(p.price*item.qty)}`;
  });
  const total=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);
  const text = `Xin chào Tiệm Nhà Thư ♡\nMình muốn đặt hàng:\n${lines.join("\n")}\n\nTạm tính: ${money(total)}\n\nMình muốn được tư vấn thêm về phí ship và cách thanh toán. Cảm ơn tiệm!`;
  navigator.clipboard?.writeText(text).catch(()=>{});
  window.open(ZALO_URL,"_blank","noopener");
  showToast("Đã sao chép nội dung đơn hàng. Hãy dán vào Zalo nhé!");
}

document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("cartOverlay").onclick=closeCart;
document.getElementById("checkout").onclick=checkout;
document.getElementById("zaloDirect").onclick=()=>window.open(ZALO_URL,"_blank","noopener");
document.getElementById("searchInput").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts()});
document.getElementById("sortSelect").addEventListener("change",e=>{sortMode=e.target.value;renderProducts()});
document.querySelectorAll("[data-footer-cat]").forEach(a=>a.onclick=()=>{activeCategory=a.dataset.footerCat;renderCategories();renderProducts()});
document.getElementById("year").textContent=new Date().getFullYear();

renderCategories();
renderProducts();
renderCart();
