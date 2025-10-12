import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div
        key={product?._id}
        className="w-full bg-muted shadow-xs border-gray-300 border-[1px] p-5 rounded-lg flex flex-col justify-center items-center gap-3"
        >
        {/* Fixed height container */}
        <div className="w-full h-48 overflow-hidden rounded-lg">
        <a href={`/products/${product.username}/${product._id}`}>
          <img
            src={product?.thumbnail?.url}
            alt={product?.title}
            className="w-full h-full object-cover hover:scale-110 cursor-pointer transition-transform duration-700"
            />
            </a>
        </div>

        <h2 className="text-lg font-semibold capitalize">{product?.title}</h2>

        <a
          className="underline text-muted-foreground"
          href={`/${product?.username}`}
          >
          {product?.username}
        </a>

        <div className="flex justify-between items-baseline w-full">
          <div className="font-semibold">Price ₹{product?.price}</div>
          <a href={`/products/${product.username}/${product._id}`} className="bg-element text-white rounded-lg font-semibold px-5 py-2 cursor-pointer">
            Buy Now
          </a>
        </div>
      </div>
  );
};

export default ProductCard;
