"use client";
import React, { useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  ImagePlus,
  ExternalLink,
  ImageUp,
  ArrowUpFromLine,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Loader from "@/components/ui/loader";
import { deleteFile } from "@/utils/deleteFile";

const ShopLayout = ({ children }) => {
  const { user } = useUser();

  //handling cover image upload
  const [coverImage, setCoverImage] = useState({ url: "", publicId: "" });
  const [isCoverImageUploading, setIsCoverImageUploading] = useState(false);
  const coverImageRef = useRef(null);

  const coverInputClick = () => {
    coverImageRef.current?.click();
  };

  const uploadCoverImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("No file selected");
      return;
    }

    const lowerName = file.name.toLowerCase();
    if (!(lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg"))) {
      alert(
        "Only jpg/jpeg format is supported for cover image. Please select a valid image."
      );
      return;
    }

    setIsCoverImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceType", "image");
    formData.append("folder", "coverImages");

    const res = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });
    const r = await res.json();
    console.log("cover image uploaded", r.data);
    setCoverImage({ url: r.data.url, publicId: r.data.public_id });
    setHasUnsavedChanges(true);
    setIsCoverImageUploading(false);
  };

  //handling shop logo upload
  const [shopLogo, setShopLogo] = useState({ url: "", publicId: "" });
  const [isShopLogoUploading, setIsShopLogoUploading] = useState(false);
  const shopLogoRef = useRef(null);

  const shopLogoInputClick = () => {
    shopLogoRef.current?.click();
  };

  const uploadShopLogo = async (e) => {
    setIsShopLogoUploading(true);

    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("resourceType", "image");
    formData.append("folder", "shop logos");

    const res = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });

    const r = await res.json();
    setShopLogo({ url: r.data.url, publicId: r.data.public_id });
    setIsShopLogoUploading(false);
    setHasUnsavedChanges(true);
  };

  //deleting cover image/shop logo from cloud if page refresh without saving changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const filesToDelete = [
        { publicId: coverImage.publicId, resourceType: "image" },
        { publicId: shopLogo.publicId, resourceType: "image" },
      ].filter((file) => file.publicId);

      if (filesToDelete.length > 0 && hasUnsavedChanges) {
        const data = JSON.stringify({ files: filesToDelete });
        navigator.sendBeacon("/api/cloudinary/delete", data);
      }

      // Only show confirmation if there are unsaved changes
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "You have unsaved changes";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [coverImage.publicId, shopLogo.publicId, hasUnsavedChanges]);

  //handling shop customization (editing texts)
  const [shop, setShop] = useState({}); //for shop data
  const fetchShopInfo = async () => {
    const res = await fetch("/api/shop/getShop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user.id, username: user.username, avatar: user.imageUrl }),
    });
    const r = await res.json();
    setShop(r.shopData);
    setShopName(r.shopData.name);
    setShopDescription(r.shopData.description);
    setCoverImage({
      url: r.shopData.coverImage.url || "",
      publicId: r.shopData.coverImage.publicId || "",
    });
    console.log("shop data fetched", r.shopData);
  };

  useEffect(() => {
    console.log("cover image loging", coverImage);
  }, [coverImage]);

  useEffect(() => {
    if (user?.id) {
      fetchShopInfo();
    }
  }, [user?.id]);

  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");

  const handleShopNameChange = (e) => {
    const newValue = e.target.value;
    setShopName(newValue);

    if (newValue !== shop.name) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  };

  const handleShopNameUnfocus = (e) => {
    if (e.target.value.length < 1) {
      setShopName(`${user?.username}'s shop`);
    }
  };

  const handleShopDescriptionChange = (e) => {
    const newValue = e.target.value;
    setShopDescription(newValue);
    if (newValue !== shop.description) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  };

  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const handleSaveChanges = async () => {
    setIsSavingChanges(true);

    try {
      const payload = {};

      if (shopName && shopName.trim()) payload.name = shopName;
      if (shopDescription && shopDescription.trim())
        payload.description = shopDescription;

      // Only include coverImage if it has valid data
      if (coverImage.url || coverImage.publicId) {
        payload.coverImage = {};
        if (coverImage.url) payload.coverImage.url = coverImage.url;
        if (coverImage.publicId)
          payload.coverImage.publicId = coverImage.publicId;
      }

      // Only include image if it has valid data
      if (shopLogo.url || shopLogo.publicId) {
        payload.image = {};
        if (shopLogo.url) payload.image.url = shopLogo.url;
        if (shopLogo.publicId) payload.image.publicId = shopLogo.publicId;
      }

      if (Object.keys(payload).length === 0) {
        console.log("No changes to save");
        setIsSavingChanges(false);
        return;
      }

      const res = await fetch("/api/shop/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, userId: user.id }),
      });

      const r = await res.json();

      if (r.success) {
        setShop(r.updatedShop);
        setHasUnsavedChanges(false);
        console.log("Shop updated successfully");
      } else {
        console.error("Failed to update shop:", r.message);
      }
    } catch (error) {
      console.error("Error updating shop:", error);
    } finally {
      setIsSavingChanges(false);
    }
  };

  //delte cover image manually when clicked on delete button
  const handleDeleteCoverImage = async () => {
    setCoverImage({ url: "", publicId: "" });
    await deleteFile(coverImage.publicId, "image");
  };

  if (!user) {
    return (
      <div className="grid justify-items-center py-[3rem] h-full relative">
        {" "}
        <Loader text={"Loading your shop"} />
      </div>
    );
  }
  return (
    <div className="grid justify-items-center py-[3rem] h-full relative">
      {hasUnsavedChanges && (
        <div className="flex items-center justify-between h-[5rem] w-full px-7 bg-muted">
          <p>
            You have unsaved changes, please click on save button to save
            changes{" "}
          </p>
          <button
            disabled={isSavingChanges}
            onClick={handleSaveChanges}
            type="button"
            className="bg-element cursor-pointer hover:bg-element-hover active:bg-element-active px-7 py-2 rounded-full font-semibold text-white"
          >
            {isSavingChanges ? "Saving" : "Save"}
          </button>
        </div>
      )}
      <div className="w-[100%] h-[80%] relative">
        <div className="w-full h-[44%] bg-element relative">
          <div
            onClick={coverInputClick}
            className="absolute flex items-center justify-center opacity-0 bg-black/50 z-20 hover:opacity-100 w-full h-full transition-opacity duration-200 text-white gap-3 font-semibold text-lg"
          >
            {!coverImage.url && (
              <div className="flex items-center gap-3">
                <ImagePlus /> Add cover image
              </div>
            )}

            {coverImage.url && (
              <>
                <div className="flex absolute bg-black/50 w-full h-full justify-center items-center gap-3 z-20">
                  <ImageUp /> <span>Change cover image</span>
                </div>
              </>
            )}

            <input
              type="file"
              disabled={isCoverImageUploading}
              ref={coverImageRef}
              onChange={uploadCoverImage}
              accept="image/*"
              className="hidden"
            />

          </div>

          {/* placeholder while image is being uploaded */}
          {isCoverImageUploading && (
            <div className="absolute w-full h-full z-20 flex justify-center items-center font-semibold gap-3 text-white bg-black/50">
              <ArrowUpFromLine className="fade-in-out" />
              Uploading cover image
            </div>
          )}

          {(shop?.coverImage?.url || coverImage?.url) && (
            <img
              src={coverImage?.url || shop?.coverImage?.url}
              className="w-full h-full absolute z-10"
            />
          )}
        </div>

        <div className="w-full min-h-[56%] flex flex-col items-center bg-muted px-10">
          <div className="absolute z-50 top-[44%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-900">
            <div
              onClick={shopLogoInputClick}
              className="relative flex items-center justify-center group"
            >
              <img
                src={shopLogo.url || user?.imageUrl}
                alt="shop logo"
                className="w-[120px] h-[120px] rounded-lg"
              />

              {!isShopLogoUploading && (
                <div
                  className="cursor-pointer border-border border-2 absolute w-full h-full rounded-lg flex items-center justify-center text-white
                  transition-opacity duration-200
                  opacity-0 group-hover:opacity-100 bg-black/50"
                >
                  <ImageUp size={38} />
                </div>
              )}

              {isShopLogoUploading && (
                <div className="cursor-pointer border-border border-2 absolute w-full h-full rounded-lg flex items-center justify-center text-white bg-black/50">
                  <ArrowUpFromLine size={38} className="fade-in-out" />
                </div>
              )}

              <input
                type="file"
                disabled={isShopLogoUploading}
                accept="image/*"
                ref={shopLogoRef}
                onChange={uploadShopLogo}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 mt-[100px] w-full">
            <input
              type="text"
              maxLength={25}
              value={shopName}
              onChange={handleShopNameChange}
              onBlur={handleShopNameUnfocus}
              className="text-2xl font-bold capitalize outline-gray-400 hover:outline hover:outline-gray-400 w-auto py-2 cursor-text text-center bg-transparent"
            />

            <a
              href={`/${user?.username}`}
              className="text-muted-foreground/80 flex items-center gap-2"
              target="_blank"
            >
              <ExternalLink />
              digimart.vercel.app/{user?.username}
            </a>

            <textarea
              type="text"
              maxLength={300}
              value={shopDescription || "Click here to add description"}
              onChange={handleShopDescriptionChange}
              className="text-md capitalize outline-gray-400 hover:outline hover:outline-gray-400 py-2 cursor-text text-center bg-transparent w-full min-h-[40px] text-muted-foreground"
            ></textarea>

          </div>
        </div>
        <hr className="border-border w-full" />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default ShopLayout;
