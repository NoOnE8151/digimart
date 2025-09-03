import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="w-full bg-muted shadow-xs border-gray-300 border-[1px] p-5 rounded-lg flex flex-col justify-center items-center gap-4">
      <div className="overflow-hidden">
        <img
          src={product?.thumbnail?.url}
          alt={product?.title}
          className="w-full hover:scale-110 cursor-pointer transition-all duration-700 rounded-lg"
        />
      </div>
      <h2 className="text-lg font-semibold capitalize">
        {product?.title}
      </h2>
      <a className="underline text-muted-foreground" href={`/${product?.username}`}>
        {product?.username}
      </a>
      <div className="flex justify-between w-full">
        <div className="font-semibold">Price ₹{product?.price}</div>
        <button className="bg-element text-white rounded-lg font-semibold px-3 py-1">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
