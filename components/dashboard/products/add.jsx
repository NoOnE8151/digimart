"use client"
import React, { useRef, useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  CloudUpload,
  ArrowUpFromLine,
  X,
  ImageUp,
  Trash2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { deleteFile } from "@/utils/deleteFile";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";

const AddProductForm = ({ setIsProductAdding, fetchProductList, handlePopup }) => {
  const [productType, setProductType] = useState("document");
  const [isProductTypeMenuOpen, setIsProductTypeMenuOpen] = useState(false);

  const toggleProductMenu = () => {
    setIsProductTypeMenuOpen((prev) => !prev);
  };

  const handleProductTypeSelection = (type) => {
    setProductType(type);
    toggleProductMenu();
  };

  //handling product upload
  const productInputRef = useRef(null);

  const handleOpenProductInput = () => {
    productInputRef.current?.click();
  };

  const [product, setProduct] = useState({ url: '', publicId: '' });
const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);

const uploadIntervalRef = useRef(null);

// Start fake progress when isUploading is true
useEffect(() => {
  if (isUploading) {
    setUploadProgress(1); // start from 1
    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev; // cap at 90
        const increment = Math.floor(Math.random() * 5) + 1; // random 1–5
        let next = prev + increment;
        if (next > 90) next = 90;
        return next;
      });
    }, 500); // every 500ms
  } else {
    clearInterval(uploadIntervalRef.current);
  }

  return () => clearInterval(uploadIntervalRef.current);
}, [isUploading]);

// When isUploading becomes false and progress >= 90, jump to 100
useEffect(() => {
  if (isUploading) {
    setUploadProgress(1); // start from 1
    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 1; // always +1
      });
    }, 50); // fast interval: every 50ms
  } else {
    clearInterval(uploadIntervalRef.current);
  }

  return () => clearInterval(uploadIntervalRef.current);
}, [isUploading]);


const handleProductUpload = async (e) => {
  setIsUploading(true);
  const file = e.target.files[0];

  const maxSizeInMB = productType === 'image' ? 20 : 300;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    alert(`File size exceeds ${maxSizeInMB} MB limit.`);
    e.target.value = null;
    setIsUploading(false);
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', productType);

  try {
    const res = await fetch('/api/cloudinary/upload', {
      method: "POST",
      body: formData
    });
    const r = await res.json();

    console.log('response', r)
    setProduct({ url: r.data.url, publicId: r.data.public_id });
  } catch (error) {
    console.error('Upload failed', error);
  } finally {
    setIsUploading(false);
  }
};

const handleDeleteSelectedProduct = async () => {
   setProduct({url: '', publicId: ''})
  const resourceType = productType === 'audio' || 'video' ? 'video' : productType === 'image' ? 'image' : 'raw';
  await deleteFile(product.publicId, resourceType);
}

//handling thumbnail upload
const thumbnailRef = useRef(null);
const openThumbnailInput = () => {
    thumbnailRef.current?.click();
}

const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
const [thumbnail, setThumbnail] = useState({ url: '', publicId: ''});

const handleThumbnailUpload = async (e) => {
  setIsThumbnailUploading(true);
  const image = e.target.files[0];

  if(thumbnail.publicId) {
    console.log('checking public id exists or not', thumbnail.publicId)
    await deleteFile(thumbnail.publicId, 'image');
  }

  const formData = new FormData();
  formData.append('file', image);
  formData.append('folder', 'thumbnail');
  formData.append('resourceType', 'image');

  const res = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body: formData
  })

  const r = await res.json();
  console.log('thumbanial uploaded', r)
  setThumbnail({ url: r.data.url, publicId: r.data.public_id });
  setIsThumbnailUploading(false);
}

//delete files when page refreshes before submitting form
useEffect(() => {
  const handleBeforeUnload = () => {
    const filesToDelete = [
      { publicId: product.publicId, resourceType: productType === 'audio' || productType === 'video' ? 'video' : productType === 'image' ? 'image' : 'raw' },
      { publicId: thumbnail.publicId, resourceType: 'image' },
    ].filter(file => file.publicId);  // remove items without publicId

    if (filesToDelete.length > 0) {
      const data = JSON.stringify({ files: filesToDelete });
      navigator.sendBeacon('/api/cloudinary/delete', data);
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [product.publicId, productType, thumbnail.publicId]);

const [categories, setCategories] = useState([]);
const [categoryError, setCategoryError] = useState(false);
//form for adding categories
const {
    handleSubmit: handleSubmitCategory,
    register: registerCategory,
    setValue: setCategoryValue
} =  useForm();

const handleAddCategory = (data) => {
    if(!categories.includes(data.category)) {
          setCategories((prev) => ([
    ...prev,
    data.category
  ]))
  setCategoryValue('category', '');
  setCategoryError(false);
    } else {
    setCategoryError(true);
    }
}

const handleDeleteCategory = (categoryToDelete) => {
  setCategories((prev) =>
    prev.filter((category) => category !== categoryToDelete)
  );
};


//handling form submission (add a product)
const {
    handleSubmit: handleSubmitProduct,
    register: registerProduct,
    watch: watchProduct,
    reset: resetProductForm,
    formState:{errors: productErrors}
} = useForm();

const titleInput = watchProduct('title');
const descriptionInput = watchProduct('description');

const { user } = useUser();
const addProduct = async (data) => {
  if(!product.url) {
    alert('please upload your product to continue');
    return
  }
  const payload = {
    ...data,
    product: product,
    thumbnail: thumbnail,
    userId: user.id,
    type: productType,
    categories
  }
  console.log(payload);
  
  const res = await fetch('/api/product/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const r = await res.json();
  console.log('added product', r);
  resetProductForm();
  setIsProductAdding(false);
  fetchProductList(user.id);
  window.scrollTo({ top: 0, behavior: 'auto' });
  handlePopup('Added product successfull!')
}

  return (
    <div className="absolute w-[100vw] bg-background min-h-[100vh] flex py-[5rem] justify-center">
      <form onSubmit={handleSubmitProduct(addProduct)} className="bg-background md:border-[1px] md:border-gray-400 absolute md:w-[45%] p-7 rounded-lg flex flex-col gap-5 ">
        <h1 className="text-xl font-semibold">Adding a product</h1>

        <div className="md:w-[92%] flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <label className="tex-lg font-semibold">Name</label>
            <input
              type="text"
              placeholder="Enter a product name"
              className="bg-input px-5 py-2 rounded-lg border-[1px]"
              {...registerProduct('title', {
                required: {value: true, message: 'please enter product name'}
              })}
            />
            {productErrors.title && <p className="text-red-500">{productErrors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="tex-lg font-semibold">Description</label>
            <textarea
              placeholder="Preciesly describe your product"
              className="bg-input rounded-lg px-5 py-2 min-h-[100px]"
              {...registerProduct('description', {
                required: {value: true, message: 'please enter product name'},
                minLength: {value: 20, message: 'description lenth should be minimum 20 characters long'},
                maxLength: {value: 500, message: 'maximum length can be 500 characters'}
              })}
            ></textarea>
            {productErrors.description && <p className="text-red-500">{productErrors.description.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="tex-lg font-semibold">Price ₹</label>
            <input
              type="number"
              placeholder="₹150"
              className="bg-input px-5 py-2 rounded-lg"
              {...registerProduct('price', {
                required: {value: true, message: 'please set product price'}
              })}
            />
            {productErrors.price && <p className="text-red-500">{productErrors.price.message}</p>}
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-semibold">Product Type</label>
            <button
              type="button"
              disabled={product.url}
              onClick={toggleProductMenu}
              className={`capitalize border-[1px] border-black rounded-sm px-5 py-2 flex items-center justify-between font-semibold ${product.url ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {productType}{" "}
              {isProductTypeMenuOpen ? <ChevronLeft /> : <ChevronDown />}
            </button>
            {isProductTypeMenuOpen && (
              <ul className="list-none bg-background border-[1px] rounded-lg px-5 py-3">
                <li
                  onClick={() => handleProductTypeSelection("doucment")}
                  className="hover:bg-input/50 px-5 my-2 py-2 rounded-lg cursor-pointer"
                >
                  Document
                </li>
                <li
                  onClick={() => handleProductTypeSelection("audio")}
                  className="hover:bg-input/50 px-5 my-2 py-2 rounded-lg cursor-pointer"
                >
                  Audio
                </li>
                <li
                  onClick={() => handleProductTypeSelection("video")}
                  className="hover:bg-input/50 px-5 my-2 py-2 rounded-lg cursor-pointer"
                >
                  Video
                </li>
                <li
                  onClick={() => handleProductTypeSelection("image")}
                  className="hover:bg-input/50 px-5 my-2 py-2 rounded-lg cursor-pointer"
                >
                  Image
                </li>
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Product</label>
           {!product.url &&  <button
              type="button"
              disabled={isUploading}
              onClick={handleOpenProductInput}
              className="border-2 border-gray-400 hover:bg-input border-dashed px-5 py-3 flex justify-center items-center rounded-lg flex-col min-h-[200px] cursor-pointer"
            >
                {!isUploading && <div className="flex flex-col justify-center items-center">
              <CloudUpload size={48} className="text-foreground" />
              <div>Click to upload</div>
                </div>}
                {isUploading && <div className="w-full flex flex-col items-center justify-center">
                    <div className="text-lg font-semibold flex items-center gap-3"><ArrowUpFromLine size={24} className="fade-in-out" strokeWidth={1.5} />Uploading...</div>
                    <div className="w-[80%] py-5"><Progress value={uploadProgress} /> </div>
                    <p>This may take a moment, dont panic if it feels stuck</p>
                    </div>}
              
              <input
                type="file"
                ref={productInputRef}
                onChange={handleProductUpload}
                className="hidden"
                accept={
                  productType === "document"
                    ? ".pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt, .zip"
                    : productType === "audio"
                    ? ".mp3, .wav, .aac, .m4a, .ogg, .flac, .amr, .aiff, .wma"
                    : productType === "video"
                    ? ".mp4, .mov, .avi, .mkv, .webm, .flv, .wmv, .m4v, .3gp"
                    : ".jpg, .jpeg, .png, .gif, .webp, .bmp, .tiff, .svg, .heic"
                }
              />
            </button>}

            {product.url && <div className="flex items-center justify-between border-[1px] border-border px-3 gap-5 py-3 rounded-lg relative max-h-26">
                <div className="w-[15%]">
                <img src={productType === 'document' ? '/assets/product icons/document.jpg' : productType === 'video' ? '/assets/product icons/video.jpg' : productType === 'audio' ? '/assets/product icons/audio.jpg' : '/assets/product icons/image.jpg'} alt="thumbnail" className="w-full rounded-lg" />
                </div>
                <div className="w-[80%] flex flex-col gap-1 ">
                    <h2 className="text-lg font-semibold capitalize">{titleInput}</h2>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{descriptionInput}</p>
                </div>
                <button onClick={handleDeleteSelectedProduct} type="button" className="w-[5%]flex justify-center h-full cursor-pointer">
                    <X />
                </button>
            </div>}

            <p className="text-muted-foreground">
              if you want to upload multiple files then please compress them to
              a zip file and upload.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <label>
              <span className="font-semibold">Featured Image</span> (thumbnail)
            </label>

            <div className="flex items-center gap-5">
              <button onClick={openThumbnailInput} disabled={isThumbnailUploading} type="button" className={`flex flex-col items-center justify-center border-foreground/50 border-2 ${thumbnail.url ? '' : 'border-dashed'} md:w-[20%] w-[30%] h-[5rem] rounded-lg cursor-pointer hover:bg-input`}>

                {!isThumbnailUploading && !thumbnail.url && <div className="flex flex-col items-center">
                <ImageUp strokeWidth={1.5} className="text-foreground" />
                <div>Upload</div>
                </div>}
                
                {isThumbnailUploading && <div className="bg-black/70 w-full h-full text-white flex flex-col justify-center items-center rounded-lg">
                <ArrowUpFromLine size={24} strokeWidth={1.5} className="fade-in-out" />
                <span className="text-xs fade-in-out">uploading</span>
                </div>}

                {thumbnail.url && !isThumbnailUploading && <div className="group w-full h-full relative">
  <img src={thumbnail.url} alt="thumbnail" className="w-full h-full" />
  <div className="absolute inset-0 flex justify-center items-center bg-black/0 group-hover:bg-black/20">
    <span className="opacity-0 group-hover:opacity-100 text-muted">Change</span>
  </div>
</div>}

                <input type="file"
                ref={thumbnailRef}
                onChange={handleThumbnailUpload}
                accept="image/*"
                className="hidden" />
              </button>

              <div className="w-[70%] md:w-auto">
                <span className="md:block hidden">
                  We recommend an image should be square, at least 1080x1080px,
                and JPG, PNG or GIF format.
                  </span>
                  <span className="md:hidden">Recommended size 1080x1080px</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="font-semibold">Add to Category</label>
            {categories.length > 0 && <ul className="list-none flex items-center flex-wrap gap-3">
                {categories.map((category, idx) => {
                    return <li key={idx} className="flex items-center justify-between gap-2 shadow-2xs border-border border-[1px] px-3 py-1 rounded-full"><span>{category}</span> <button onClick={() => handleDeleteCategory(category)} type="button" className="hover:bg-muted rounded-full cursor-pointer"><X size={18} /></button></li>})}
            </ul>}
            <input
              type="text"
              placeholder="E-book, Presentation, etc..."
              className="bg-input px-5 py-3 rounded-lg w-[60%]"
              {...registerCategory('category', {
                required: true,
              })}
            />
            {categoryError && <p className="text-red-500">this keyword is already added</p>}
            <button
              type="button"
              onClick={handleSubmitCategory(handleAddCategory)}
              className="bg-black font-semibold self-start text-white px-7 py-2 w-1/3 rounded-lg cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        <hr className="mt-5" />

        <div className="flex justify-center items-start gap-3">
          <input id="checkbox" type="checkbox" className="w-4 h-4 mt-2"
          {...registerProduct('checkbox', {
                required: {value: true, message: 'you must accept terms and services to sell this product.'}
              })} />
          <label htmlFor="checkbox" className="cursor-pointer">
            I created this and it doesn't contain any illegal, adult,
            copyrighted or prohibited content.
          </label>
        </div>
        {productErrors.checkbox && <p className="text-red-500">{productErrors.checkbox.message}</p>}

        <button
          onClick={() => { setIsProductAdding(false); resetProductForm();}}
          type="button"
          className="absolute right-0 top-0 p-5 cursor-pointer"
        >
          <X />
        </button>

        <input disabled={isUploading || isThumbnailUploading} type="submit" value={'Add This Product'} className={`py-2 px-5 rounded-full font-semibold text-white text-lg  ${isUploading || isThumbnailUploading ? 'cursor-not-allowed bg-element/70' : 'cursor-pointer bg-element '}`} />
      </form>
    </div>
  );
};

export default AddProductForm;
