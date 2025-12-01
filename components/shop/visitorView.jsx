"use client"
import React, { useState, useEffect } from "react";
import Loader from "@/components/ui/loader";
import { Car, ExternalLink } from "lucide-react";
import Cart from "./cart";

const ShopPublicView = ({ children, shop }) => {

  if (!shop) {
    return (
      <div className="grid justify-items-center py-[3rem] h-full relative">
        {" "}
        <Loader text={"Loading Shop"} />
      </div>
    );
  }
  return (
    <div className="grid justify-items-center h-full relative">
      <div className="w-[100%] h-[80%] relative">
        <div className="w-full h-[44%] bg-element relative">
          <div
            className="absolute flex items-center justify-center z-20 w-full h-full text-white gap-3 font-semibold text-lg"
          >
          </div>

          {shop?.coverImage?.url && (
            <img
              src={shop?.coverImage?.url}
              className="w-full h-full absolute z-10"
            />
          )}
        </div>

        <div className="w-full min-h-[45%] flex flex-col items-center bg-muted px-10">
          <div className="absolute z-50 top-[44%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-900">
            <div
              className="relative flex items-center justify-center group"
            >
              <img
                src={shop?.image?.url || null}
                alt="shop logo"
                className="w-[120px] h-[120px] rounded-lg"
              />
            </div>
          </div>

            <div className="flex flex-col items-center justify-center gap-3 mt-[100px] w-full">
            <div className="text-2xl font-bold capitalize w-auto py-2 cursor-text text-center bg-transparent">
              {shop?.name}
            </div>

             <a
              href={`/${shop?.username}`}
              className="text-muted-foreground/80 flex items-center gap-2"
              target="_blank"
            >
              <ExternalLink />
              digimart.vercel.app/{shop?.username}
            </a>

            <p className="text-md capitalize py-2 cursor-text text-center bg-transparent w-full min-h-[40px] text-muted-foreground">{shop?.description}</p>            
          </div>
        </div>
        <hr className="border-border w-full" />
        <div className="w-full">{children}</div>\
      </div>
    </div>
  );
};

export default ShopPublicView;