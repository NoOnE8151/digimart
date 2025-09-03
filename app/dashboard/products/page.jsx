"use client";
import { Ellipsis, Plus } from "lucide-react"
import AddProductForm from "@/components/dashboard/products/add";
import EditProductForm from "@/components/dashboard/products/edit";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Popup from "@/components/ui/popup";
import Loader from "@/components/ui/loader";
import { usePathname } from "next/navigation";

export default function Products() {
  const [isProductAdding, setIsProductAdding] = useState(false);
  const [isProductEditing, setIsProductEditing] = useState(false);
  const [productList, setProductList] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname])

  const showAddProductForm = () => {
    setIsProductAdding(true);
  }

  const { user } = useUser()
  console.log(user)
  const fetchProductList = async (username) => {
    const res = await fetch('/api/product/getList', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
    const r = await res.json();
    console.log('product list fetched', r.productList);
    setProductList(r.productList)
    if(r.productList.length < 1) {
      setIsProductLoading(false);
    }
  }

  useEffect(() => {
    fetchProductList(user?.username);
  }, [user?.username]);

  useEffect(() => {
    if(productList.length > 0) {
      setIsProductLoading(false);
    }
  }, [productList])

  const [menuIdx, setMenuIdx] = useState(null);
  const toggleMenu = (idx) => {
  setMenuIdx(menuIdx === idx ? null : idx);
};

//handling edit product feature
const [productToEdit, setProductToEdit] = useState({});
const handleEditProduct = (product) => {
  setProductToEdit(product);
  setIsProductEditing(true);
}

//handling delete product feature
const [isDeletePending, setIsDeletePending] = useState(false);
const [productToDelete, setProductToDelete] = useState('');
const [isDeleting, setIsDeleting] = useState(false);
const handleDeleteProduct = async (id) => {
  setIsDeletePending(true);
  setProductToDelete(id);
}
const deleteProduct = async () => {
    const res = await fetch('/api/product/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId: productToDelete })
  })
  const r = await res.json();
  fetchProductList(user.name);
  setIsDeleting(false);
  setIsDeletePending(false);
}

//handling popup indicator for edited/added product
const [showPopup, setShowPopup] = useState(false);
const [popupText, setPopupText] = useState('');
const handlePopup = (text) => {
  setPopupText(text);
  setShowPopup(true);
  setTimeout(() => {
    setShowPopup(false);
  }, 3000);
}

//handling product loading screeen while products are being fetched
const [isProductLoading, setIsProductLoading] = useState(true);


  return (
    <div className="grid justify-items-center gap-3 h-full relative px-7 py-[7rem]">
  <div className="w-full md:w-[55%] flex flex-col gap-7">
    <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Your Products</h1>
    <button onClick={showAddProductForm} className="bg-element hover:bg-element-hover active:bg-element-active text-white px-5 py-2 text-sm font-semibold rounded-full flex items-center cursor-pointer"><Plus size={18} />&nbsp;Add Product</button>
    </div>
    {/* product list */}
    {productList?.map((product, idx) => {
      return <div key={product._id} className="flex items-center justify-between border-[1px] border-gray-300 rounded-sm md:p-5 p-2 relative">
        <div className="flex items-center md:gap-5 gap-3">
        <img src={product.thumbnail.url ? product.thumbnail.url : product.type === 'document' ? '/assets/product icons/document.jpg' : product.type === 'video' ? '/assets/product icons/video.jpg' : product.type === 'audio' ? '/assets/product icons/audio.jpg' : '/assets/product icons/image.jpg'} alt="thumbnail" className="max-w-[4rem] md:w-[5rem] rounded-lg" />


        <div>
        <h2 className="font-semibold text-sm md:text-md">{product.title}</h2>
        <div className="font-semibold text-sm md:text-md">Price: ₹{product.price}</div>
        </div>
        </div>

        <div className="flex items-center md:gap-5 gap-3 px-3 md:px-5">
          <div className="text-gray-500"><span className="md:block hidden">Total Sales</span> {product.sales}</div>
          <button onClick={() => toggleMenu(idx)} className="cursor-pointer"><Ellipsis className="w-5" /></button>
        </div>

        { menuIdx === idx && <ul className="bg-background list-none m-0 p-0 flex flex-col absolute bottom-[-3rem]  right-5 md:right-[-2rem] border-border border-2 min-w-[35%] md:min-w-[17%] min-h-[85%] md:min-h-[70%] z-50 rounded">
  <li onClick={() => {setMenuIdx(null); handleEditProduct(product)}} className="hover:bg-muted cursor-pointer w-full flex-1 flex items-center px-3 border-b-[1px] border-border">Edit</li>
  <li onClick={() => {setMenuIdx(null); handleDeleteProduct(product._id)}} className="hover:bg-muted cursor-pointer w-full flex-1 flex items-center px-3 text-red-500">Delete</li>
</ul>}

    </div>})}

    {/* if no product found */}
    {productList.length < 1 && !isProductLoading && <div className="w-full h-full flex items-center justify-center flex-col gap-3 mb-14">
      <img src="/assets/product icons/box.gif" className="w-[30%]" />
      <p className="text-muted-foreground text-xl">No product found</p>
      <button onClick={showAddProductForm} className="flex items-center bg-element text-white px-5 py-2 font-semibold rounded-full cursor-pointer hover:bg-element-hover active:bg-element-active"><Plus />Add product</button>
    </div>}


    {isProductLoading && <div className="py-[10rem]"><Loader text={'Loading Products...'} /></div>}
  </div>

  {isProductAdding && <AddProductForm setIsProductAdding={setIsProductAdding} fetchProductList={fetchProductList} handlePopup={handlePopup} />}
  {isProductEditing && <EditProductForm setIsProductEditing={setIsProductEditing} fetchProductList={fetchProductList} productData={productToEdit} handlePopup={handlePopup} />}

   {showPopup && <Popup text={popupText} />}

   {/* delete confirmation */}
   {isDeletePending && <div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/60">
   <div className="bg-background absolute p-5 rounded-lg flex flex-col gap-5 justify-center items-center w-[20%]">
    <h1 className="font-bold text-2xl">Are you sure?</h1>
    <p className="font-semibold">This cannot be undone</p>
    <div className="flex items-center gap-5">
      <button onClick={() => setIsDeletePending(false)} className="w-1/2 bg-muted/50 active:bg-muted/110 cursor-pointer hover:bg-muted font-semibold shadow-sm px-7 py-2 rounded-full">Cancel</button>
      <button onClick={deleteProduct} className="w-1/2 bg-destructive cursor-pointer active:bg-destructive/90 hover:bg-destructive/80 shadow-sm text-white font-semibold px-7 py-2 rounded-full flex items-center gap-3">{isDeleting && <div className="w-5 h-5 rounded-full border-t-2 border-white loader"></div>} {isDeleting ? 'Deleting' : 'Delete'}</button>
    </div>
   </div>
   </div>}
</div>

  );
}
