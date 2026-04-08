import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import ProductForm, { type ProductFormValues } from "@/pages/products/ProductForm";
import { SELF_STORE_PRODUCT_CREATE } from "@/graphql/mutations/product";
import {
  STORE_AUTHORS,
  STORE_BRANDS,
  STORE_CATEGORIES,
  STORE_SUB_CATEGORIES,
  STORE_SUB_SUB_CATEGORIES,
  STORE_SUPPLIERS,
  STORE_TAGS
} from "@/graphql/queries/catalog";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

const toFloat = (value: string) => (value === "" ? null : Number(value));

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export default function ProductCreate() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const [createProduct, { loading }] = useMutation(SELF_STORE_PRODUCT_CREATE);
  const siteId = site?.id ?? null;

  const { data: categoriesData } = useQuery(STORE_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });
  const { data: subCategoriesData } = useQuery(STORE_SUB_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });
  const { data: subSubCategoriesData } = useQuery(STORE_SUB_SUB_CATEGORIES, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });
  const { data: brandsData } = useQuery(STORE_BRANDS, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });
  const { data: authorsData } = useQuery(STORE_AUTHORS, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });
  const { data: tagsData } = useQuery(STORE_TAGS, {
    variables: { siteId: siteId ? [siteId] : [], first: 200 },
    skip: !siteId
  });
  const { data: suppliersData } = useQuery(STORE_SUPPLIERS, {
    variables: { siteId, first: 200 },
    skip: !siteId
  });

  const categories = useMemo(
    () => categoriesData?.storeCategories?.edges?.map((edge: any) => edge.node) ?? [],
    [categoriesData]
  );
  const subCategories = useMemo(
    () => subCategoriesData?.storeSubCategories?.edges?.map((edge: any) => edge.node) ?? [],
    [subCategoriesData]
  );
  const subSubCategories = useMemo(
    () => subSubCategoriesData?.storeSubSubCategories?.edges?.map((edge: any) => edge.node) ?? [],
    [subSubCategoriesData]
  );
  const brands = useMemo(
    () => brandsData?.storeBrands?.edges?.map((edge: any) => edge.node) ?? [],
    [brandsData]
  );
  const authors = useMemo(
    () => authorsData?.storeAuthors?.edges?.map((edge: any) => edge.node) ?? [],
    [authorsData]
  );
  const tags = useMemo(
    () => tagsData?.storeTags?.edges?.map((edge: any) => edge.node) ?? [],
    [tagsData]
  );
  const suppliers = useMemo(
    () =>
      suppliersData?.storeSuppliers?.edges
        ?.map((edge: any) => edge.node)
        ?.filter((item: any) => item.isActive) ?? [],
    [suppliersData]
  );

  const handleSubmit = async (values: ProductFormValues) => {
    if (!user?.id || !site?.id) return;
    const galleryUploads = await Promise.all(values.galleryFiles.map((file) => toDataUrl(file)));
    const images = values.images.filter(Boolean).map((image, index) => ({ id: index + 1, image }));
    const galleryImages = galleryUploads.map((image, index) => ({ id: images.length + index + 1, image }));
    const variants = values.variants
      .filter((variant) => variant.key || variant.value)
      .map((variant, index) => ({
        priority: index + 1,
        imageIndex: 0,
        price: toFloat(variant.price) ?? 0,
        cost: toFloat(variant.cost) ?? 0,
        comparePrice: toFloat(variant.comparePrice) ?? 0,
        quantity: toFloat(variant.quantity) ?? 0,
        variant: [{ key: variant.key, value: variant.value }]
      }));
    const wholesale = values.wholesale
      .filter((tier) => tier.minOrder || tier.maxOrder || tier.price)
      .map((tier) => ({
        minOrder: toFloat(tier.minOrder) ?? 0,
        maxOrder: toFloat(tier.maxOrder) ?? 0,
        price: toFloat(tier.price) ?? 0
      }));
    await createProduct({
      variables: {
        userId: user.id,
        siteId: site.id,
        title: values.title,
        slug: values.slug || null,
        sku: values.sku || null,
        price: toFloat(values.price),
        comparePrice: toFloat(values.comparePrice),
        discount: toFloat(values.discount),
        cost: toFloat(values.cost),
        quantity: toFloat(values.quantity),
        productType: Number(values.productType || 1),
        image: values.thumbnailFile ?? null,
        thumbnail: values.thumbnail || null,
        images: images.length || galleryImages.length ? [...images, ...galleryImages] : null,
        variants: variants.length ? variants : null,
        wholesale: wholesale.length ? wholesale : null,
        wholesalePrice: toFloat(values.wholesalePrice),
        wholesalePricePercentage: toFloat(values.wholesalePricePercentage),
        minResellPrice: toFloat(values.minResellPrice),
        maxResellPrice: toFloat(values.maxResellPrice),
        categories: values.categories,
        subCategories: values.subCategories,
        subSubCategories: values.subSubCategories,
        brands: values.brands,
        authors: values.authors,
        tags: values.tags,
        supplierId: values.supplierId ? Number(values.supplierId) : null,
        isActive: values.isActive,
        isFeatured: values.isFeatured,
        isFlash: values.isFlash,
        isNew: values.isNew,
        isCod: values.isCod,
        isPreorder: values.isPreorder,
        isContinueSelling: values.isContinueSelling,
        isPrivate: values.isPrivate,
        isLanding: values.isLanding,
        isUnlisted: values.isUnlisted,
        isResell: values.isResell,
        isVariant: values.isVariant
      }
    });
    navigate("/product/");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Create Product</h2>
        <p className="text-sm text-slate-500">Add a new product to your catalog.</p>
      </div>
      <ProductForm
        submitLabel="Create Product"
        loading={loading}
        onSubmit={handleSubmit}
        categories={categories}
        subCategories={subCategories}
        subSubCategories={subSubCategories}
        brands={brands}
        authors={authors}
        tags={tags}
        suppliers={suppliers}
      />
    </div>
  );
}
