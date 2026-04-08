import { useEffect, useMemo, useState } from "react";
import FilePondUploader from "@/components/FilePondUploader";

export type VariantInput = {
  key: string;
  value: string;
  price: string;
  cost: string;
  comparePrice: string;
  quantity: string;
};

export type WholesaleTierInput = {
  minOrder: string;
  maxOrder: string;
  price: string;
};

export type CatalogOption = {
  id: number;
  title: string;
};

export type ProductFormValues = {
  title: string;
  slug: string;
  sku: string;
  price: string;
  comparePrice: string;
  discount: string;
  cost: string;
  quantity: string;
  productType: string;
  isActive: boolean;
  isFeatured: boolean;
  isFlash: boolean;
  isNew: boolean;
  isCod: boolean;
  isPreorder: boolean;
  isContinueSelling: boolean;
  isPrivate: boolean;
  isLanding: boolean;
  isUnlisted: boolean;
  isResell: boolean;
  isVariant: boolean;
  categories: number[];
  subCategories: number[];
  subSubCategories: number[];
  brands: number[];
  authors: number[];
  tags: number[];
  supplierId: string;
  thumbnail: string;
  thumbnailFile: File | null;
  images: string[];
  galleryFiles: File[];
  variants: VariantInput[];
  wholesale: WholesaleTierInput[];
  wholesalePrice: string;
  wholesalePricePercentage: string;
  minResellPrice: string;
  maxResellPrice: string;
};

type ProductFormProps = {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
  loading?: boolean;
  submitLabel: string;
  categories?: CatalogOption[];
  subCategories?: CatalogOption[];
  subSubCategories?: CatalogOption[];
  brands?: CatalogOption[];
  authors?: CatalogOption[];
  tags?: CatalogOption[];
  suppliers?: CatalogOption[];
};

const defaultValues: ProductFormValues = {
  title: "",
  slug: "",
  sku: "",
  price: "",
  comparePrice: "",
  discount: "",
  cost: "",
  quantity: "",
  productType: "1",
  isActive: true,
  isFeatured: false,
  isFlash: false,
  isNew: false,
  isCod: false,
  isPreorder: false,
  isContinueSelling: true,
  isPrivate: false,
  isLanding: false,
  isUnlisted: false,
  isResell: false,
  isVariant: false,
  categories: [],
  subCategories: [],
  subSubCategories: [],
  brands: [],
  authors: [],
  tags: [],
  supplierId: "",
  thumbnail: "",
  thumbnailFile: null,
  images: [],
  galleryFiles: [],
  variants: [],
  wholesale: [],
  wholesalePrice: "",
  wholesalePricePercentage: "",
  minResellPrice: "",
  maxResellPrice: ""
};

export default function ProductForm({
  initialValues,
  onSubmit,
  loading,
  submitLabel,
  categories = [],
  subCategories = [],
  subSubCategories = [],
  brands = [],
  authors = [],
  tags = [],
  suppliers = []
}: ProductFormProps) {
  const merged = useMemo(() => ({ ...defaultValues, ...initialValues }), [initialValues]);
  const [values, setValues] = useState<ProductFormValues>(merged as ProductFormValues);

  useEffect(() => {
    setValues(merged as ProductFormValues);
  }, [merged]);

  const handleChange = (field: keyof ProductFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const handleMultiSelect = (field: keyof ProductFormValues) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const next = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
      setValues((prev) => ({ ...prev, [field]: next }));
    };

  const handleSupplierSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, supplierId: event.target.value }));
  };

  const addThumbnail = (file: File) => {
    setValues((prev) => ({ ...prev, thumbnailFile: file }));
  };

  const removeThumbnail = () => {
    setValues((prev) => ({ ...prev, thumbnailFile: null }));
  };

  const addGalleryFile = (file: File) => {
    setValues((prev) => ({ ...prev, galleryFiles: [...prev.galleryFiles, file] }));
  };

  const removeGalleryFile = (file: File) => {
    setValues((prev) => ({ ...prev, galleryFiles: prev.galleryFiles.filter((item) => item !== file) }));
  };

  const updateImage = (index: number, value: string) => {
    setValues((prev) => {
      const next = [...prev.images];
      next[index] = value;
      return { ...prev, images: next };
    });
  };

  const addImage = () => {
    setValues((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImage = (index: number) => {
    setValues((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const updateVariant = (index: number, field: keyof VariantInput, value: string) => {
    setValues((prev) => {
      const next = prev.variants.map((variant, idx) =>
        idx === index ? { ...variant, [field]: value } : variant
      );
      return { ...prev, variants: next };
    });
  };

  const addVariant = () => {
    setValues((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { key: "", value: "", price: "", cost: "", comparePrice: "", quantity: "" }
      ]
    }));
  };

  const removeVariant = (index: number) => {
    setValues((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const updateWholesale = (index: number, field: keyof WholesaleTierInput, value: string) => {
    setValues((prev) => {
      const next = prev.wholesale.map((tier, idx) =>
        idx === index ? { ...tier, [field]: value } : tier
      );
      return { ...prev, wholesale: next };
    });
  };

  const addWholesale = () => {
    setValues((prev) => ({
      ...prev,
      wholesale: [...prev.wholesale, { minOrder: "", maxOrder: "", price: "" }]
    }));
  };

  const removeWholesale = (index: number) => {
    setValues((prev) => ({ ...prev, wholesale: prev.wholesale.filter((_, i) => i !== index) }));
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="grid gap-6 lg:grid-cols-[2fr_1fr]"
    >
      <div className="space-y-6">
        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Product Basics</h3>
          <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
            <input
              value={values.title}
              onChange={handleChange("title")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Product title"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Slug</label>
            <input
              value={values.slug}
              onChange={handleChange("slug")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="product-slug"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">SKU</label>
            <input
              value={values.sku}
              onChange={handleChange("sku")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="SKU"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Product Type</label>
            <select
              value={values.productType}
              onChange={handleChange("productType")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="1">Physical</option>
              <option value="2">Digital</option>
            </select>
          </div>
        </div>
      </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Pricing</h3>
          <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Price</label>
            <input
              value={values.price}
              onChange={handleChange("price")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Compare Price</label>
            <input
              value={values.comparePrice}
              onChange={handleChange("comparePrice")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Discount</label>
            <input
              value={values.discount}
              onChange={handleChange("discount")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Cost</label>
            <input
              value={values.cost}
              onChange={handleChange("cost")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Quantity</label>
            <input
              value={values.quantity}
              onChange={handleChange("quantity")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="1"
            />
          </div>
        </div>
      </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Classification</h3>
          <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Categories</label>
            <select
              multiple
              value={values.categories.map(String)}
              onChange={handleMultiSelect("categories")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sub Categories</label>
            <select
              multiple
              value={values.subCategories.map(String)}
              onChange={handleMultiSelect("subCategories")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {subCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sub-Sub Categories</label>
            <select
              multiple
              value={values.subSubCategories.map(String)}
              onChange={handleMultiSelect("subSubCategories")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {subSubCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Brands</label>
            <select
              multiple
              value={values.brands.map(String)}
              onChange={handleMultiSelect("brands")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {brands.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Authors</label>
            <select
              multiple
              value={values.authors.map(String)}
              onChange={handleMultiSelect("authors")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {authors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tags</label>
            <select
              multiple
              value={values.tags.map(String)}
              onChange={handleMultiSelect("tags")}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {tags.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Supplier</label>
            <select
              value={values.supplierId}
              onChange={handleSupplierSelect}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select supplier</option>
              {suppliers.map((item) => (
                <option key={item.id} value={String(item.id)}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

        <div className="rounded-2xl border bg-white p-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Media</h3>
          <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Thumbnail URL</label>
            <input
              value={values.thumbnail}
              onChange={handleChange("thumbnail")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Thumbnail Upload</label>
            <FilePondUploader
              files={values.thumbnail ? [{ source: values.thumbnail }] : undefined}
              onAdded={addThumbnail}
              onRemove={removeThumbnail}
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-600">Gallery Images</label>
              <button type="button" onClick={addImage} className="text-xs text-brand-600 hover:underline">
                Add image
              </button>
            </div>
            <div className="space-y-2">
              {values.images.map((image, index) => (
                <div key={`image-${index}`} className="flex items-center gap-2">
                  <input
                    value={image}
                    onChange={(event) => updateImage(index, event.target.value)}
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-xs text-rose-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {values.images.length === 0 ? (
                <p className="text-xs text-slate-400">No gallery images added.</p>
              ) : null}
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1">Upload Gallery</label>
              <FilePondUploader allowMultiple onAdded={addGalleryFile} onRemove={removeGalleryFile} />
            </div>
          </div>
        </div>
      </div>

        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Variants</h3>
            <button type="button" onClick={addVariant} className="text-xs text-brand-600 hover:underline">
              Add variant
            </button>
          </div>
          <div className="space-y-3">
          {values.variants.map((variant, index) => (
            <div key={`variant-${index}`} className="grid gap-2 rounded-lg border p-3 md:grid-cols-6">
              <input
                value={variant.key}
                onChange={(event) => updateVariant(index, "key", event.target.value)}
                className="rounded-md border px-2 py-1 text-xs"
                placeholder="Option (e.g. Size)"
              />
              <input
                value={variant.value}
                onChange={(event) => updateVariant(index, "value", event.target.value)}
                className="rounded-md border px-2 py-1 text-xs"
                placeholder="Value (e.g. L)"
              />
              <input
                value={variant.price}
                onChange={(event) => updateVariant(index, "price", event.target.value)}
                className="rounded-md border px-2 py-1 text-xs"
                placeholder="Price"
              />
              <input
                value={variant.cost}
                onChange={(event) => updateVariant(index, "cost", event.target.value)}
                className="rounded-md border px-2 py-1 text-xs"
                placeholder="Cost"
              />
              <input
                value={variant.comparePrice}
                onChange={(event) => updateVariant(index, "comparePrice", event.target.value)}
                className="rounded-md border px-2 py-1 text-xs"
                placeholder="Compare"
              />
              <div className="flex items-center gap-2">
                <input
                  value={variant.quantity}
                  onChange={(event) => updateVariant(index, "quantity", event.target.value)}
                  className="w-full rounded-md border px-2 py-1 text-xs"
                  placeholder="Qty"
                />
                <button type="button" onClick={() => removeVariant(index)} className="text-xs text-rose-500">
                  Remove
                </button>
              </div>
            </div>
          ))}
          {values.variants.length === 0 ? (
            <p className="text-xs text-slate-400">No variants added.</p>
          ) : null}
        </div>
      </div>

        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700">Wholesale / Resell</h3>
            <button type="button" onClick={addWholesale} className="text-xs text-brand-600 hover:underline">
              Add tier
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Wholesale Price</label>
            <input
              value={values.wholesalePrice}
              onChange={handleChange("wholesalePrice")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Wholesale %</label>
            <input
              value={values.wholesalePricePercentage}
              onChange={handleChange("wholesalePricePercentage")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Min Resell Price</label>
            <input
              value={values.minResellPrice}
              onChange={handleChange("minResellPrice")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Max Resell Price</label>
            <input
              value={values.maxResellPrice}
              onChange={handleChange("maxResellPrice")}
              className="w-full rounded-md border px-3 py-2 text-sm"
              type="number"
              step="0.01"
            />
          </div>
        </div>
        <div className="space-y-2">
          {values.wholesale.map((tier, index) => (
            <div key={`wholesale-${index}`} className="grid gap-2 rounded-lg border p-3 md:grid-cols-4">
              <input
                value={tier.minOrder}
                onChange={(event) => updateWholesale(index, "minOrder", event.target.value)}
                className="rounded-md border px-2 py-1 text-xs"
                placeholder="Min order"
              />
              <input
                value={tier.maxOrder}
                onChange={(event) => updateWholesale(index, "maxOrder", event.target.value)}
                className="rounded-md border px-2 py-1 text-xs"
                placeholder="Max order"
              />
              <input
                value={tier.price}
                onChange={(event) => updateWholesale(index, "price", event.target.value)}
                className="rounded-md border px-2 py-1 text-xs"
                placeholder="Price"
              />
              <button type="button" onClick={() => removeWholesale(index)} className="text-xs text-rose-500">
                Remove
              </button>
            </div>
          ))}
          {values.wholesale.length === 0 ? (
            <p className="text-xs text-slate-400">No wholesale tiers added.</p>
          ) : null}
        </div>
      </div>

      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border bg-white p-6 sticky top-20">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Status & Flags</h3>
          <div className="grid gap-3 text-sm text-slate-600">
            {(
              [
                ["isActive", "Active"],
                ["isFeatured", "Featured"],
                ["isFlash", "Flash"],
                ["isNew", "New"],
                ["isCod", "Cash on Delivery"],
                ["isPreorder", "Preorder"],
                ["isContinueSelling", "Continue Selling"],
                ["isPrivate", "Private"],
                ["isLanding", "Landing"],
                ["isUnlisted", "Unlisted"],
                ["isResell", "Resell"],
                ["isVariant", "Variant"]
              ] as Array<[keyof ProductFormValues, string]>
            ).map(([key, label]) => (
              <label key={key} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={values[key] as boolean} onChange={handleChange(key)} />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
