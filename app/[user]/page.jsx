"use client";
import { Ellipsis, Plus } from "lucide-react"
import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/ui/loader";
import { useParams } from "next/navigation";

export default function Products() {
  const [productList, setProductList] = useState([]);
  const params = useParams();

  const fetchProductList = async (username) => {
    const res = await fetch('/api/product/getList', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username})
    })
    const r = await res.json();
    console.log('product list fetched', r.productList);
    setProductList(r.productList)
    if(r.productList.length < 1) {
      setIsProductLoading(false);
    }
  }

  useEffect(() => {
    fetchProductList(params.user);
  }, [params.user]);

  useEffect(() => {
    if(productList.length > 0) {
      setIsProductLoading(false);
    }
  }, [productList])


//handling product loading screeen while products are being fetched
const [isProductLoading, setIsProductLoading] = useState(true);


  return (
    <div className="grid justify-items-center py-[3rem] h-full relative px-7">
  <div className="w-full md:w-[55%] flex flex-col gap-7 py-10">
    <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Products</h1>
    </div>
    {/* product list */}
    {productList?.map((product, idx) => {
      return <Link href={`/products/${params.user}/${product._id}`} key={product._id} className="flex items-center justify-between border-[1px] border-gray-300 rounded-sm md:p-5 p-2 relative hover:scale-105 transition-all duration-200 cursor-pointer hover:bg-muted/50">
        <div className="flex items-center md:gap-5 gap-3">
        <img src={product.thumbnail.url ? product.thumbnail.url : product.type === 'document' ? '/assets/product icons/document.jpg' : product.type === 'video' ? '/assets/product icons/video.jpg' : product.type === 'audio' ? '/assets/product icons/audio.jpg' : '/assets/product icons/image.jpg'} alt="thumbnail" className="max-w-[4rem] md:w-[5rem] rounded-lg" />


        <div>
        <h2 className="font-semibold text-sm md:text-md">{product.title}</h2>
        <div className="font-semibold text-sm md:text-md">Price: ₹{product.price}</div>
        </div>
        </div>

        <div className="flex items-center md:gap-5 gap-3 px-3 md:px-5">
          <div className="text-gray-500"> <button className="bg-element px-5 cursor-pointer text-white rounded-full font-semibold py-2">Buy now</button></div>
        </div>

    </Link>})}

    {/* if no product found */}
    {productList.length < 1 && !isProductLoading && <div className="w-full h-full flex items-center justify-center flex-col gap-3 mb-14">
      <img src="/assets/product icons/box.gif" className="w-[30%]" />
      <p className="text-muted-foreground text-xl">No product found</p>
    </div>}


    {isProductLoading && <div className="py-[10rem]"><Loader text={'Loading Products...'} /></div>}
  </div>
</div>

  );
}
