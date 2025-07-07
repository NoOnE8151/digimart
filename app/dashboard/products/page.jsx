"use client";
import { Ellipsis, Plus } from "lucide-react"
import AddProductForm from "@/components/dashboard/products/add";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Products() {
  const [isProductAdding, setIsProductAdding] = useState(false);
  const [productList, setProductList] = useState([]);

  const showAddProductForm = () => {
    setIsProductAdding(true);
  }

  const { user } = useUser()
  const fetchProductList = async (userId) => {
    const res = await fetch('/api/product/getList', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId})
    })
    const r = await res.json();
    console.log('product list fetched', r.productList);
    setProductList(r.productList)
  }

  useEffect(() => {
    fetchProductList(user?.id);
  }, [user?.id]);

  useEffect(()=> {
    console.log(productList);
  }, [productList])
  

  return (
    <div className="grid justify-items-center py-[3rem] h-full">
  <div className="w-full md:w-[55%] flex flex-col gap-7 py-10">
    <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Your Products</h1>
    <button onClick={showAddProductForm} className="bg-element text-white px-5 py-2 text-sm font-semibold rounded-full flex items-center cursor-pointer"><Plus size={18} />&nbsp;Add Product</button>
    </div>
    {/* product list */}
    {productList?.map((product, idx) => {
      return <div key={product._id} className="flex items-center justify-between border-[1px] border-gray-300 rounded-sm p-5 relative">
        <div className="flex items-center gap-5">
        <img src={product.thumbnail.url ? product.thumbnail.url : product.type === 'document' ? '/assets/product icons/document.jpg' : product.type === 'video' ? '/assets/product icons/video.jpg' : product.type === 'audio' ? '/assets/product icons/audio.jpg' : '/assets/product icons/image.jpg'} alt="thumbnail" className="w-[5rem] rounded-lg" />


        <div>
        <h2 className="font-semibold">{product.title}</h2>
        <div className="font-semibold">Price: ₹{product.price}</div>
        </div>
        </div>

        <div className="flex items-center gap-5 px-5">
          <div className="text-gray-500">Total Sales {product.sales}</div>
          <button className="cursor-pointer"><Ellipsis /></button>
        </div>

    </div>})}
  </div>

  {isProductAdding && <AddProductForm setIsProductAdding={setIsProductAdding} fetchProductList={fetchProductList} />}

</div>

  );
}
