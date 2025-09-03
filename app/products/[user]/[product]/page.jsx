"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Link from "next/link";
import { User, ShoppingBag, Check } from "lucide-react";
import Cart from "@/components/shop/cart";
import { useUser } from "@clerk/nextjs";

const Product = () => {
  const { user } = useUser();
  const params = useParams();
  const productId = params.product;
  const merchant = params.user;

  const [product, setProduct] = useState({});
  const fetchProduct = async () => {
    const res = await fetch("/api/product/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    const r = await res.json();
    setProduct(r.product);
  };

  const [shop, setShop] = useState({});
  const fetchShop = async () => {
    const res = await fetch("/api/shop/getShop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: params.user }),
    });
    const r = await res.json();
    setShop(r.shopData);
  };

  useEffect(() => {
    fetchProduct();
    fetchShop();
  }, []);

  useEffect(() => {
    console.log("product is set", product);
  }, [product]);

  const handleAddToCart = async (product) => {
    const res = await fetch("/api/shop/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...product, visitorName: user.username }), //the product object contains the product's author's username, in cart schema need the visitor's username, the visitorName field contains it
    });
    const r = await res.json();
    console.log(r.message, r.cart);
    fetchProduct();
    fetchCart(user.username);
  };

  //handling cart menu toggle
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartClosing, setIsCartClosing] = useState(false);

  //fetching cart items
    //fetching cart items for users
  const [cartItems, setCartItems] = useState([]);
  const fetchCart = async (username) => {
    const res = await fetch('/api/shop/cart/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
    const r = await res.json();
    console.log('cart items fetched: ', r);
    setCartItems(r.cart);
  }

  //calculate total price of all items in cart
  const getTotalPrice = () => {
    return cartItems?.reduce((sum, item) => sum + item.price, 0) || 0;
  }

  useEffect(() => {
    fetchCart(user?.username);
  }, [user])

  return (
    <div>
      <Header />

      <main className="w-[100vw] min-h-[100vh] flex flex-col gap-10 items-center">
        <div className="flex items-center gap-10 w-full border-y-2 border-y-border px-[5rem] py-[1rem] justify-between">
          <div className="flex items-center gap-5">
            <img
              src={shop?.image?.url}
              alt="shop logo"
              className="w-[5rem] rounded-full"
            />
            <nav className="flex items-center gap-5 text-muted-foreground">
              <a href={`/${merchant}`}>view shop</a>
              <a href="#">e books</a>
              <a href="#">videos</a>
              <a href="#">images</a>
              <a href="#">documents</a>
            </nav>
          </div>

          <div className=" flex items-center gap-3 text-muted-foreground">
            <Link href={"#"}>
              <User />
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="cursor-pointer">
              <ShoppingBag />
            </button>
          </div>
        </div>

        <section className="bg-muted w-[80%] min-h-[40%] p-10 flex items-stretch gap-19">
          <div className="w-1/2">
            <img
              src={product?.thumbnail?.url}
              alt="featured image"
              className="w-full"
            />
          </div>
          <div className="h-full flex flex-col gap-5 px-14 w-1/2">
            <h1 className="text-2xl capitalize font-semibold">
              {product.title}
            </h1>
            <div className="text-lg font-semibold">₹{product.price}</div>
            <div className="flex flex-col items-start gap-3">
              <button className="bg-element text-white px-5 py-4 w-full rounded cursor-pointer hover:bg-element-hover font-semibold text-lg">
                Buy now
              </button>
              <button

              disabled={product?.cart?.includes(user?.username)}
                
                onClick={() => handleAddToCart(product)}
                className="border-2 border-element text-element px-5 py-3 w-full rounded cursor-pointer hover:bg-background font-semibold text-lg flex items-center justify-center gap-3"
              >
                {Array.isArray(product?.cart) &&
                product.cart.includes(user?.username) ? (
                  <>
                    Added to cart <Check />
                  </>
                ) : (
                  "Add to cart"
                )}
              </button>
            </div>
            <p>{product.description}</p>
          </div>
        </section>

        {isCartOpen && <div className={`bg-black/50 fixed top-0 left-0 right-0 bottom-0 ${isCartClosing ? '' : 'fade-in'} ${isCartClosing ? 'fade-out' : ''}`}>
        <div className={` ${isCartClosing ? '' : 'slide-left'} ${isCartClosing ? 'slide-right' : ''} h-full`}>
          <Cart setIsCartOpen={setIsCartOpen} setIsCartClosing={setIsCartClosing} cartItems={cartItems} getTotalPrice={getTotalPrice} fetchCart={fetchCart} productId={productId} fetchProduct={fetchProduct} />
        </div>
        </div>}
      </main>
    </div>
  );
};

export default Product;
