"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import PaymentSuccess from "./payment/success";

const Cart = ({
  setIsCartOpen,
  setIsCartClosing,
  cartItems,
  getTotalPrice,
  fetchCart,
  fetchProduct,
}) => {
  const { user } = useUser();

  const handleRemoveCartItem = async (cartProductId) => {
    const res = await fetch("/api/shop/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productIds: [cartProductId],
        username: user.username,
      }),
    });
    const r = await res.json();
    fetchCart(user.username);
    fetchProduct();
  };

  //create order for multiple products
  const handleCreateOrder = async () => {
    const res = await fetch("/api/razorpay/order/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems: cartItems.map((item) => ({
          product: {
            price: item.price,
            merchant: item.merchant,
          },
        })),
      }),
    });
    const r = await res.json();
    return r;
  };

  //handle purchase
  const [showPaymentFailedError, setShowPaymentFailed] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const [isPaymentPending, setIsPaymentPending] = useState(false);

  const [cartItemsCount, setCartItemsCount] = useState(0);
  const handlePurchase = async () => {
    setIsPaymentPending(true);

    const data = await handleCreateOrder();
    console.log("order created, handling purchase with data: ", data);
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_GATEWAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: "Digimart",
      description: "Order Payment",
      order_id: data.orderId,
      handler: async function (response) {
        const res = await fetch("/api/razorpay/verifyPayment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const r = await res.json();

        if (!r.success) {
          setShowPaymentFailed(true);
          return;
        }

        //adding product to user's library after successful purchase
        const libResponse = await fetch("/api/library/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: cartItems }),
        });

        const jsonRes = await libResponse.json();
        console.log("product added to library", jsonRes);

        //removing products from cart
        let itemIdsToDelete = [];
        for (const item of cartItems) {
          itemIdsToDelete.push(item._id);
        }
        const deleteRes = await fetch("/api/shop/cart/remove", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productIds: itemIdsToDelete, username: user.username }),
        });
        const deleteR = await deleteRes.json();
        fetchCart();
        fetchProduct();
        console.log("removed purchased items from cart", deleteR);

        // //store merchants earnings to database if payments verification success
        const earningsRes = await fetch("/api/earnings/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: cartItems.map((item) => {
              return {
                buyer: user.username,
                merchant: item.username,
                earnings: item.price,
              };
            }),
          }),
        });
        const earningsR = await earningsRes.json();
        console.log("earnings stored", earningsR);

        // //store buyer to merchant's customer list
        const customerRes = await fetch("/api/customer/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customers: cartItems.map((item) => {
              return {
                buyer: user.username,
                merchant: item.username,
              };
            }), }),
        });
        const customerR = await customerRes.json();
        console.log("customer strored", customerR);

        //update sale count of purchased product
        const saleRes = await fetch("/api/product/updateSaleCount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: cartItems.map((item) => {
            return {
              productId: item.actualProductId,
              quantity: 1
            }
          }) }),
        });
        const saleR = await saleRes.json();
        console.log("product's sale count updated", saleR);

        setShowPaymentSuccess(true);
        setIsPaymentPending(false);
        return;
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-background absolute right-0 w-[25%] top-0 h-full p-5 flex flex-col gap-3 overflow-y-auto">
      <div className="flex items-center justify-between px-5">
        <h1 className="font-semibold text-lg text-center">Your Cart</h1>
        <button
          onClick={() => {
            setIsCartClosing(true);
            setTimeout(() => {
              setIsCartOpen(false);
              setIsCartClosing(false);
            }, 500);
          }}
          className="cursor-pointer"
        >
          <X />
        </button>
      </div>
      <hr />

      <div className="flex flex-col gap-3">
        {cartItems?.map((product, idx) => {
          return (
            <div key={product._id}>
              <div className="flex items-center w-full gap-3">
                <div className="w-1/3 p-3">
                  <img
                    src={product.thumbnail.url}
                    alt="featured image"
                    className="rounded-lg"
                  />
                </div>
                <div className="w-1/3 flex flex-col ">
                  <a href={"#"} className="font-semibold">
                    {product.title}
                  </a>
                  <div>₹{product.price}</div>
                </div>
                <div className="w-1/3  flex justify-center">
                  <button
                    onClick={() => handleRemoveCartItem(product._id)}
                    className="text-muted-foreground underline text-xs cursor-pointer hover:text-muted-foreground/70"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <hr />
        <div className="flex items-center justify-between px-3 font-semibold">
          <div>Total</div>
          <div>₹{getTotalPrice()}</div>
        </div>
      </div>

      <hr />
      <button
        onClick={handlePurchase}
        className="bg-element text-white font-semibold px-5 py-3 rounded"
      >
        Checkout
      </button>

      {showPaymentSuccess && (
                <div className="bg-black/60 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                  <div className="bg-background p-5 flex flex-col items-center rounded-lg gap-5">
                    <h2 className="text-2xl font-bold">Payment Success!</h2>
                    <p className="font-semibold">Successfully added all purchased products to your library.</p>
                    <div className="w-full flex items-center justify-center gap-5">
                    <a href="/dashboard/library" className="bg-element text-white py-2 px-5 rounded-lg font-semibold hover:bg-element-hover active:bg-element-active">View library</a>
                    <button onClick={() => setShowPaymentSuccess(false)} className="bg-gray-200 py-2 px-5 rounded-lg cursor-pointer hover:bg-gray-100">Keep Shopping</button>
                    </div>
                  </div>
                </div>
              )}
              {showPaymentFailedError && <div className="bg-black/60 fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                  <div className="bg-background p-5 flex flex-col items-center rounded-lg gap-5">
                    <h2 className="text-2xl font-bold">Payment Failed!</h2>
                    <p className="font-semibold">Something went wrong, please try again later.</p>
                    <div className="w-full flex items-center justify-center gap-5">
                    <button onClick={handleCreateOrder} className="bg-red-500 py-2 px-5 rounded-lg cursor-pointer hover:bg-red-400 text-white font-semibold">Retry</button>
                    </div>
                  </div>
                </div>}
    </div>
  );
};

export default Cart;
