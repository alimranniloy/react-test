import AppTable from "@/components/AppTable";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  BackspaceIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/outline";
import JsBarcode from "jsbarcode";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import Popup from "@/components/Popup";
import File from "@/pages/tools/File";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import FilterSelect, {
  type FilterSelectOption,
} from "@/components/FilterSelect";
import DatePicker from "@/components/DatePicker";
import FilePondUploader from "@/components/FilePondUploader";
import imageCompression from "browser-image-compression";
import PdfToImg from "pdftoimg-js";
import {
  STORE_AUTHORS,
  STORE_BRANDS,
  STORE_CATEGORIES,
  STORE_SUB_CATEGORIES,
  STORE_SUB_SUB_CATEGORIES,
  STORE_SUPPLIERS,
  STORE_TAGS,
} from "@/graphql/queries/catalog";
import { SELF_FILE_FILE_CREATE } from "@/graphql/mutations/file";
import { STORE_PRODUCT } from "@/graphql/queries/product";
import {
  SELF_STORE_PRODUCT_CREATE,
  SELF_STORE_PRODUCT_UPDATE,
} from "@/graphql/mutations/product";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { useNotificationsStore } from "@/stores/notifications";

const tabs = [
  "Overview",
  "Filter",
  "Short PDF",
  "Features",
  "Price",
  "Stock",
  "Description",
  "Syllabus",
  "Will Learn",
  "Image",
  "File",
  "Variant",
  "FAQ",
  "Meta",
  "Review",
  "Landing Page",
];

const countryOptions = [
  { id: 1, title: "বাংলাদেশ" },
  { id: 2, title: "ভারত" },
  { id: 3, title: "সৌদি আরব" },
  { id: 4, title: "মিশর" },
];
const languageOptions = [
  { id: 1, title: "বাংলা" },
  { id: 2, title: "ইংরেজি" },
  { id: 3, title: "আরবি" },
];
const bindingOptions = [
  { id: 1, title: "হোয়াইট প্রিন্ট" },
  { id: 2, title: "নিউজপ্রিন্ট" },
];
const coverOptions = [
  { id: 1, title: "হার্ডকভার" },
  { id: 2, title: "পেপারব্যাক" },
  { id: 3, title: "স্পাইরাল বাইন্ডিং" },
];

const uniqueNumbers = (values: number[]) =>
  Array.from(
    new Set(
      values.filter(
        (value) => typeof value === "number" && !Number.isNaN(value),
      ),
    ),
  );

const toFloat = (value: unknown) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const toInt = (value: unknown) => {
  const num = parseInt(String(value), 10);
  return Number.isFinite(num) ? num : 0;
};

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const formatMoney = (
  value: number | null | undefined,
  currency?: string | null,
) => {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "BDT",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value}`;
  }
};

type Edge<T> = { node: T };

type SiteParent = {
  id: number;
  isActive?: boolean | null;
  percentage?: number | null;
  isFixed?: boolean | null;
  parentId?: number | null;
};

type SiteState = {
  id?: number | null;
  domain?: string | null;
  parent?: SiteParent[] | null;
  currency?: string | null;
  title?: string | null;
  createdById?: number | null;
};

type CatalogNode = { id: number; title: string };

type UnitTypeOption = {
  id: number;
  name: string;
  types: number[];
};

type ProductImage = { id?: number; image: string };
type ProductFeature = {
  id?: number;
  key: string;
  value: string;
  placeholder?: string | null;
};
type ProductFaq = {
  id?: number;
  key?: string;
  value?: string;
  question?: string;
  answer?: string;
};
type ProductNote = {
  genre?: string;
  title?: string;
  subTitle?: string;
  url?: string;
  image?: string;
  file?: string;
  isFree?: boolean | null;
};
type ProductVariantEntry = { key: string; value: string };
type ProductVariant = {
  id: number;
  price?: number | null;
  cost?: number | null;
  comparePrice?: number | null;
  quantity?: number | null;
  priority?: number | null;
  imageIndex?: number | null;
  title?: string | null;
  wholesalePrice?: number | null;
  weight?: number | null;
  variant?: ProductVariantEntry[] | null;
};
type StoreProduct = {
  id: number;
  siteId?: number | null;
  title?: string | null;
  translation?: string | null;
  description?: string | null;
  productType?: number | null;
  isActive?: boolean | null;
  isPrivate?: boolean | null;
  isFeatured?: boolean | null;
  isNew?: boolean | null;
  isCod?: boolean | null;
  campaigns?: number[] | null;
  campaignSites?: number[] | null;
  isContinueSelling?: boolean | null;
  isUnlisted?: boolean | null;
  isLanding?: boolean | null;
  deliveryCharge?: number | null;
  sku?: string | null;
  cost?: number | null;
  price?: number | null;
  comparePrice?: number | null;
  vat?: number | null;
  quantity?: number | null;
  priority?: number | null;
  minOrder?: number | null;
  maxOrder?: number | null;
  weight?: number | null;
  unit?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  fileType?: string | null;
  file?: string | null;
  images?: ProductImage[] | null;
  features?: ProductFeature[] | null;
  faq?: ProductFaq[] | null;
  variants?: ProductVariant[] | null;
  categories?: number[] | null;
  subCategories?: number[] | null;
  subSubCategories?: number[] | null;
  brands?: number[] | null;
  authors?: number[] | null;
  tags?: number[] | null;
  supplierId?: number | null;
  note?: ProductNote[] | null;
  thumbnail?: string | null;
  image?: string | null;
  affiliateCommission?: number | null;
  affiliateCommissionPercentage?: number | null;
  barcode?: string | null;
  cashback?: number | null;
  collections?: number[] | null;
  discount?: number | null;
  deliveryTime?: number | null;
  emiDuration?: number | null;
  emiInterest?: number | null;
  emiPrice?: number | null;
  extraImages?: ProductImage[] | null;
  flashPrice?: number | null;
  isEmi?: boolean | null;
  isExclusive?: boolean | null;
  isFlash?: boolean | null;
  isNegotiable?: boolean | null;
  isOneTime?: boolean | null;
  isPreorder?: boolean | null;
  isResell?: boolean | null;
  isTrack?: boolean | null;
  isVariant?: boolean | null;
  isWarranty?: boolean | null;
  keyword?: string | null;
  maxResellPrice?: number | null;
  minResellPrice?: number | null;
  parentId?: number | null;
  preorderDelivery?: string | null;
  requirements?: ProductFeature[] | null;
  rewardPoints?: number | null;
  salePrice?: number | null;
  schema?: Record<string, unknown> | null;
  source?: string | null;
  stoppages?: number[] | null;
  unitType?: number | null;
  validFor?: number | null;
  videoUrl?: string | null;
  warranty?: number | null;
  wholesale?: Array<{
    minOrder: number;
    maxOrder: number;
    price: number;
  }> | null;
  wholesalePrice?: number | null;
  wholesalePricePercentage?: number | null;
  currency?: string | null;
  shippingType?: number | null;
  supplierTitle?: string | null;
  shops?: number[] | null;
  shop?: CatalogNode[] | null;
  author?: CatalogNode | null;
  brand?: CatalogNode | null;
  campaign?: CatalogNode | null;
  category?: CatalogNode | null;
  collection?: CatalogNode | null;
  subCategory?: CatalogNode | null;
  subSubCategory?: CatalogNode | null;
  html?: Record<string, unknown> | null;
};

type StoreProductData = {
  storeProduct?: StoreProduct | null;
};

type StoreCategoriesData = {
  storeCategories?: { edges?: Edge<FilterSelectOption>[] };
};
type StoreSubCategoriesData = {
  storeSubCategories?: {
    edges?: Edge<FilterSelectOption & { categoryId?: number }>[];
  };
};
type StoreSubSubCategoriesData = {
  storeSubSubCategories?: {
    edges?: Edge<FilterSelectOption & { subCategoryId?: number }>[];
  };
};
type StoreBrandsData = {
  storeBrands?: { edges?: Edge<FilterSelectOption>[] };
};
type StoreAuthorsData = {
  storeAuthors?: { edges?: Edge<FilterSelectOption>[] };
};
type StoreTagsData = {
  storeTags?: { edges?: Edge<FilterSelectOption>[] };
};
type StoreSuppliersData = {
  storeSuppliers?: {
    edges?: Edge<FilterSelectOption & { isActive?: boolean }>[];
  };
};

const decamelizeKey = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

const decamelizeKeys = (input: unknown): unknown => {
  if (input == null) return input;
  if (Array.isArray(input)) return input.map(decamelizeKeys);
  if (input instanceof File || input instanceof Blob) return input;
  if (typeof input === "object") {
    return Object.entries(input as Record<string, unknown>).reduce(
      (acc, [key, value]) => {
        acc[decamelizeKey(key)] = decamelizeKeys(value);
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }
  return input;
};

type ProductActionProps = {
  productId?: number | null;
};

export default function ProductAction({ productId }: ProductActionProps) {
  const { id: routeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { addNotification } = useNotificationsStore();
  const site = useSiteStore((state) => state.site) as SiteState | null;
  const siteId = site?.id ?? null;
  const routeProductId =
    routeId && !Number.isNaN(Number(routeId)) ? Number(routeId) : null;
  const resolvedProductId = productId ?? routeProductId ?? null;
  const actionType = resolvedProductId ? "ProductUpdate" : "ProductCreate";
  const isEditMode = actionType === "ProductUpdate";
  const isCreateRoute = location.pathname === "/product/new";

  const [selectedTab, setSelectedTab] = useState("Overview");

  const [title, setTitle] = useState("");
  const [translation, setTranslation] = useState("");
  const [description, setDescription] = useState("");
  const [affiliateCommission, setAffiliateCommission] = useState("0");
  const [affiliateCommissionPercentage, setAffiliateCommissionPercentage] =
    useState("0");
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [campaignIds, setCampaignIds] = useState<number[]>([]);
  const [campaignSites, setCampaignSites] = useState<number[]>([]);
  const [cashback, setCashback] = useState("0");
  const [isCashback, setIsCashback] = useState(false);
  const [collectionIds, setCollectionIds] = useState<number[]>([]);
  const [discount, setDiscount] = useState("0");
  const [deliveryTime, setDeliveryTime] = useState("0");
  const [emiDuration, setEmiDuration] = useState("0");
  const [emiInterest, setEmiInterest] = useState("0");
  const [emiPrice, setEmiPrice] = useState("0");
  const [extraImages, setExtraImages] = useState<ProductImage[]>([]);
  const [flashPrice, setFlashPrice] = useState("0");
  const [isEmi, setIsEmi] = useState(false);
  const [isExclusive, setIsExclusive] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [isOneTime, setIsOneTime] = useState(false);
  const [isPreorder, setIsPreorder] = useState(false);
  const [isResell, setIsResell] = useState(false);
  const [isTrack, setIsTrack] = useState(false);
  const [isVariant, setIsVariant] = useState(false);
  const [isWarranty, setIsWarranty] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [tempKeywordInput, setTempKeywordInput] = useState("");
  const [maxResellPrice, setMaxResellPrice] = useState("");
  const [minResellPrice, setMinResellPrice] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [preorderDelivery, setPreorderDelivery] = useState("");
  const [requirements, setRequirements] = useState<
    { key: string; value: string }[]
  >([]);
  const [rewardPoints, setRewardPoints] = useState("0");
  const [isRewardPoints, setIsRewardPoints] = useState(false);
  const [salePrice, setSalePrice] = useState("0");
  const [schema, setSchema] = useState<Record<string, unknown>>({});
  const [source, setSource] = useState("");
  const [stoppages, setStoppages] = useState<number[]>([]);
  const [unitType, setUnitType] = useState(28);
  const [validFor, setValidFor] = useState(1);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showFile, setShowFile] = useState(false);
  const [warranty, setWarranty] = useState<number | null>(null);
  const [wholesale, setWholesale] = useState<
    Array<{ minOrder: number; maxOrder: number; price: number }>
  >([]);
  const [isWholesale, setIsWholesale] = useState(false);
  const [isWholesalePricePercentage, setIsWholesalePricePercentage] =
    useState(false);
  const [newWholesale, setNewWholesale] = useState({
    minOrder: "",
    maxOrder: "",
    price: "",
  });
  const [wholesalePrice, setWholesalePrice] = useState("0");
  const [wholesalePricePercentage, setWholesalePricePercentage] = useState("0");
  const [currency, setCurrency] = useState("");
  const [shippingType, setShippingType] = useState<number | null>(null);
  const [supplierTitle, setSupplierTitle] = useState("");
  const [shopIds, setShopIds] = useState<number[]>([]);
  const [shops, setShops] = useState<CatalogNode[]>([]);
  const [author, setAuthor] = useState<CatalogNode | null>(null);
  const [brand, setBrand] = useState<CatalogNode | null>(null);
  const [campaign, setCampaign] = useState<CatalogNode | null>(null);
  const [category, setCategory] = useState<CatalogNode | null>(null);
  const [collection, setCollection] = useState<CatalogNode | null>(null);
  const [subCategory, setSubCategory] = useState<CatalogNode | null>(null);
  const [subSubCategory, setSubSubCategory] = useState<CatalogNode | null>(
    null,
  );
  const [html, setHtml] = useState<Record<string, unknown>>({});
  const lastHydratedIdRef = useRef<number | null>(null);
  const [productSiteId, setProductSiteId] = useState<number | null>(null);
  const [productType, setProductType] = useState(1);
  const productTypes = [
    { id: 1, name: "Physical" },
    { id: 2, name: "Digital" },
    { id: 3, name: "Services" },
    { id: 4, name: "Course" },
    { id: 5, name: "Medicine" },
    { id: 6, name: "Book" },
    { id: 7, name: "Package" },
    { id: 8, name: "Lead" },
  ];
  const [isActive, setIsActive] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isCod, setIsCod] = useState(false);
  const [isCampaignProduct, setIsCampaignProduct] = useState(false);
  const [isContinueSelling, setIsContinueSelling] = useState(true);
  const [isUnlisted, setIsUnlisted] = useState(false);
  const [isDeliveryCharge, setIsDeliveryCharge] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [files, setFiles] = useState<Array<File | { source: string }>>([]);
  const [sku, setSku] = useState("");
  const [isQr, setIsQr] = useState(false);
  const [isBarcode, setIsBarcode] = useState(false);
  const [barcodeQnt, setBarcodeQnt] = useState("0");
  const [columnQnt, setColumnQnt] = useState("4");
  const [appliedColumnQnt, setAppliedColumnQnt] = useState(4);
  const [showBarcodePreview, setShowBarcodePreview] = useState(false);

  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [vat, setVat] = useState("");
  const [bookDiscount, setBookDiscount] = useState("0");
  const [bookDiscountCost, setBookDiscountCost] = useState("0");

  const [quantity, setQuantity] = useState("");
  const [priority, setPriority] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxOrder, setMaxOrder] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isLanding, setIsLanding] = useState(false);
  const [fileType, setFileType] = useState("PDF");
  const [fileUrl, setFileUrl] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [defaultBookFeatures, setDefaultBookFeatures] = useState<
    { id: number; key: string; value: string }[]
  >([
    { id: 2, key: "মুল লেখক", value: "" },
    { id: 3, key: "অনুবাদক", value: "" },
    { id: 4, key: "পেইজ", value: "" },
    { id: 5, key: "কালার গ্রেড", value: "" },
    { id: 6, key: "প্রিন্ট", value: "" },
    { id: 7, key: "পরিবেশনা", value: "" },
    { id: 8, key: "আইএসবিএন", value: "" },
    { id: 9, key: "সংস্করণ", value: "" },
    { id: 10, key: "পৃষ্ঠা", value: "" },
    { id: 11, key: "কভার", value: "" },
    { id: 12, key: "ভাষা", value: "" },
    { id: 13, key: "দেশ", value: "" },
  ]);
  const [newFeatureKey, setNewFeatureKey] = useState("");
  const [newFeatureValue, setNewFeatureValue] = useState("");

  const [faq, setFaq] = useState<{ question: string; answer: string }[]>([]);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  const [variants, setVariants] = useState<
    {
      id: number;
      title: string;
      variantValues?: { key: string; value: string }[];
      imageIndex: number;
      quantity: string;
      price: string;
      cost: string;
      wholesalePrice: string;
      comparePrice: string;
      variantType: string;
    }[]
  >([]);
  const [newVariant, setNewVariant] = useState({
    title: "",
    quantity: "",
    price: "",
    cost: "",
    comparePrice: "",
    variantType: "Size",
  });
  const [parameters, setParameters] = useState<
    { name: string; values: string[] }[]
  >([]);

  const [notes, setNotes] = useState<
    {
      genre: string;
      title: string;
      subTitle: string;
      url: string;
      image: string;
      file: string;
      isFree: boolean;
    }[]
  >([]);
  const [newNote, setNewNote] = useState({
    genre: "",
    title: "",
    subTitle: "",
    url: "",
    image: "",
    file: "",
    isFree: false,
  });

  const variantUnitTypes = [
    { id: 1, name: "Size", types: [] },
    { id: 2, name: "Color", types: [] },
    { id: 3, name: "Material", types: [] },
    { id: 4, name: "Pattern", types: [] },
    { id: 5, name: "Capacity", types: [] },
    { id: 6, name: "Length", types: [] },
    { id: 7, name: "Width", types: [] },
    { id: 8, name: "Height", types: [] },
    { id: 9, name: "Weight", types: [] },
    { id: 10, name: "Volume", types: [] },
    { id: 11, name: "Style", types: [] },
    { id: 12, name: "Type", types: [] },
    { id: 13, name: "Model", types: [] },
    { id: 14, name: "Brand", types: [] },
    { id: 15, name: "Shape", types: [] },
    { id: 16, name: "Storage", types: [] },
    { id: 17, name: "Package", types: [] },
    { id: 18, name: "Gender", types: [] },
    { id: 19, name: "Age", types: [] },
    { id: 20, name: "Season", types: [] },
    { id: 39, name: "Pack", types: [5] },
  ];

  const generateVariants = () => {
    if (parameters.length === 0) return;
    const combos: {
      title: string;
      values: { key: string; value: string }[];
    }[] = [];
    const walk = (index: number, acc: { key: string; value: string }[]) => {
      if (index === parameters.length) {
        combos.push({
          title: acc.map((item) => item.value).join("-"),
          values: acc,
        });
        return;
      }
      const param = parameters[index];
      param.values.forEach((value) => {
        walk(index + 1, [...acc, { key: param.name, value }]);
      });
    };
    walk(0, []);
    const next = combos.map((combo) => ({
      id: Date.now() + Math.random(),
      title: combo.title,
      variantValues: combo.values,
      imageIndex: 1,
      quantity: "1",
      price: price || "0",
      cost: cost || "0",
      wholesalePrice: "0",
      comparePrice: comparePrice || "0",
      variantType: parameters.map((p) => p.name).join(", "),
    }));
    setVariants(next);
  };

  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [subCategoryIds, setSubCategoryIds] = useState<number[]>([]);
  const [subSubCategoryIds, setSubSubCategoryIds] = useState<number[]>([]);
  const [brandIds, setBrandIds] = useState<number[]>([]);
  const [authorIds, setAuthorIds] = useState<number[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [supplierId, setSupplierId] = useState<number | null>(null);

  const [categorySearch, setCategorySearch] = useState<string | null>(null);
  const [subCategorySearch, setSubCategorySearch] = useState<string | null>(
    null,
  );
  const [subSubCategorySearch, setSubSubCategorySearch] = useState<
    string | null
  >(null);
  const [brandSearch, setBrandSearch] = useState<string | null>(null);
  const [authorSearch, setAuthorSearch] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState<string | null>(null);
  const [supplierSearch, setSupplierSearch] = useState<string | null>(null);

  const pricePercentages = useMemo(() => {
    const parents = Array.isArray(site?.parent) ? site.parent : [];
    const activeParents = parents.filter((item) => item?.isActive);
    if (!activeParents.length) return null;
    return activeParents.map((el) => ({
      site_id: el.id,
      percentage: el.percentage,
      is_fixed: el.isFixed,
      parent_id: el.parentId,
    }));
  }, [site]);

  const shouldFetchProduct =
    actionType === "ProductUpdate" && Boolean(resolvedProductId);
  const { data: productData } = useQuery<StoreProductData>(STORE_PRODUCT, {
    variables: { id: resolvedProductId ?? 0, percentage: pricePercentages },
    skip: !shouldFetchProduct,
    fetchPolicy: "network-only",
  });

  console.log("Fetched Product Data:", productData);
  const [createProduct, { loading: creating }] = useMutation(
    SELF_STORE_PRODUCT_CREATE,
  );
  const [updateProduct, { loading: updating }] = useMutation(
    SELF_STORE_PRODUCT_UPDATE,
  );
  const [createFile] = useMutation(SELF_FILE_FILE_CREATE);

  const {
    data: categoriesData,
    refetch: refetchCategories,
    loading: loadingCategories,
  } = useQuery<StoreCategoriesData>(STORE_CATEGORIES, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: categorySearch,
    },
    skip: !siteId,
  });

  const {
    data: subCategoriesData,
    refetch: refetchSubCategories,
    loading: loadingSubCategories,
  } = useQuery<StoreSubCategoriesData>(STORE_SUB_CATEGORIES, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: subCategorySearch,
    },
    skip: !siteId,
  });

  const {
    data: subSubCategoriesData,
    refetch: refetchSubSubCategories,
    loading: loadingSubSubCategories,
  } = useQuery<StoreSubSubCategoriesData>(STORE_SUB_SUB_CATEGORIES, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: subSubCategorySearch,
    },
    skip: !siteId,
  });

  const {
    data: brandsData,
    refetch: refetchBrands,
    loading: loadingBrands,
  } = useQuery<StoreBrandsData>(STORE_BRANDS, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: brandSearch,
    },
    skip: !siteId,
  });

  const {
    data: authorsData,
    refetch: refetchAuthors,
    loading: loadingAuthors,
  } = useQuery<StoreAuthorsData>(STORE_AUTHORS, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: authorSearch,
    },
    skip: !siteId,
  });

  const {
    data: tagsData,
    refetch: refetchTags,
    loading: loadingTags,
  } = useQuery<StoreTagsData>(STORE_TAGS, {
    variables: {
      siteId: siteId ? [siteId] : [],
      first: 200,
      search: tagSearch,
    },
    skip: !siteId,
  });

  const {
    data: suppliersData,
    refetch: refetchSuppliers,
    loading: loadingSuppliers,
  } = useQuery<StoreSuppliersData>(STORE_SUPPLIERS, {
    variables: { siteId, first: 200, search: supplierSearch },
    skip: !siteId,
  });

  const categories: FilterSelectOption[] = useMemo(
    () =>
      categoriesData?.storeCategories?.edges?.map((edge) => edge.node) ?? [],
    [categoriesData],
  );
  const subCategories: (FilterSelectOption & { categoryId?: number })[] =
    useMemo(
      () =>
        subCategoriesData?.storeSubCategories?.edges?.map(
          (edge) => edge.node,
        ) ?? [],
      [subCategoriesData],
    );
  const subSubCategories: (FilterSelectOption & { subCategoryId?: number })[] =
    useMemo(
      () =>
        subSubCategoriesData?.storeSubSubCategories?.edges?.map(
          (edge) => edge.node,
        ) ?? [],
      [subSubCategoriesData],
    );
  const brands: FilterSelectOption[] = useMemo(
    () => brandsData?.storeBrands?.edges?.map((edge) => edge.node) ?? [],
    [brandsData],
  );
  const authors: FilterSelectOption[] = useMemo(
    () => authorsData?.storeAuthors?.edges?.map((edge) => edge.node) ?? [],
    [authorsData],
  );
  const tags: FilterSelectOption[] = useMemo(
    () => tagsData?.storeTags?.edges?.map((edge) => edge.node) ?? [],
    [tagsData],
  );
  const suppliers: FilterSelectOption[] = useMemo(
    () =>
      suppliersData?.storeSuppliers?.edges
        ?.map((edge) => edge.node)
        ?.filter((item) => item.isActive) ?? [],
    [suppliersData],
  );

  useEffect(() => {
    if (supplierId == null) {
      if (supplierTitle !== "") setSupplierTitle("");
      return;
    }
    const match = suppliers.find((item) => item.id === supplierId);
    if (match && match.title !== supplierTitle) {
      setSupplierTitle(match.title);
    }
  }, [supplierId, supplierTitle, suppliers]);

  const filteredSubCategories = useMemo(() => {
    if (!categoryIds.length) return subCategories;
    return subCategories.filter((item) =>
      item.categoryId ? categoryIds.includes(item.categoryId) : true,
    );
  }, [categoryIds, subCategories]);

  const filteredSubSubCategories = useMemo(() => {
    if (!subCategoryIds.length) return subSubCategories;
    return subSubCategories.filter((item) =>
      item.subCategoryId ? subCategoryIds.includes(item.subCategoryId) : true,
    );
  }, [subCategoryIds, subSubCategories]);

  const selectedCategories = useMemo(
    () => categories.filter((item) => categoryIds.includes(item.id)),
    [categories, categoryIds],
  );
  const selectedSubCategories = useMemo(
    () => subCategories.filter((item) => subCategoryIds.includes(item.id)),
    [subCategories, subCategoryIds],
  );
  const selectedSubSubCategories = useMemo(
    () =>
      subSubCategories.filter((item) => subSubCategoryIds.includes(item.id)),
    [subSubCategories, subSubCategoryIds],
  );
  const selectedBrands = useMemo(
    () => brands.filter((item) => brandIds.includes(item.id)),
    [brands, brandIds],
  );
  const selectedAuthors = useMemo(
    () => authors.filter((item) => authorIds.includes(item.id)),
    [authors, authorIds],
  );
  const selectedTags = useMemo(
    () => tags.filter((item) => tagIds.includes(item.id)),
    [tags, tagIds],
  );

  const isOwner = Boolean(
    user?.id &&
      (site as { createdById?: number } | null)?.createdById === user.id,
  );
  const costValue = toFloat(cost);
  const priceValue = toFloat(price);
  const comparePriceValue = toFloat(comparePrice);
  const bookDiscountValue = toFloat(bookDiscount);
  const bookDiscountCostValue = toFloat(bookDiscountCost);
  const margin = useMemo(
    () =>
      priceValue > 0 && costValue > 0
        ? (100 * (priceValue - costValue)) / costValue
        : 0,
    [costValue, priceValue],
  );
  const discountPercent = useMemo(
    () =>
      comparePriceValue > 0
        ? ((comparePriceValue - priceValue) / comparePriceValue) * 100
        : 0,
    [comparePriceValue, priceValue],
  );
  const canEditSite = siteId != null && site?.id != null && siteId === site.id;

  const unitTypes: UnitTypeOption[] = useMemo(
    () => [
      { id: 1, name: "Acre(ac)", types: [] },
      { id: 2, name: "Bag", types: [] },
      { id: 3, name: "Barrel(bbl)", types: [] },
      { id: 4, name: "Bottle", types: [] },
      { id: 5, name: "Box", types: [] },
      { id: 6, name: "Bundel", types: [] },
      { id: 7, name: "Carton", types: [] },
      { id: 40, name: "Color", types: [] },
      { id: 8, name: "Container", types: [] },
      { id: 9, name: "Cup(c)", types: [] },
      { id: 10, name: "Dozen", types: [] },
      { id: 11, name: "Dram", types: [] },
      { id: 12, name: "Drop(dp)", types: [] },
      { id: 13, name: "Each", types: [] },
      { id: 14, name: "Gallon(gl)", types: [] },
      { id: 15, name: "Gram(gm)", types: [] },
      { id: 16, name: "Hectare(htr)", types: [] },
      { id: 17, name: "Jar", types: [] },
      { id: 18, name: "Kilogram(kg)", types: [] },
      { id: 19, name: "Kilometer(km)", types: [] },
      { id: 20, name: "Liter(l)", types: [] },
      { id: 21, name: "Meter(m)", types: [] },
      { id: 22, name: "Milligram(mg)", types: [] },
      { id: 23, name: "Milliliter(ml)", types: [] },
      { id: 24, name: "Pack", types: [] },
      { id: 25, name: "Package", types: [] },
      { id: 26, name: "Packet", types: [] },
      { id: 27, name: "Pair", types: [] },
      { id: 28, name: "Piece(pc.)", types: [5] },
      { id: 29, name: "Pound", types: [] },
      { id: 30, name: "Quintal(Qt.)", types: [] },
      { id: 31, name: "Square Centimeter(scm)", types: [] },
      { id: 32, name: "Square Foot(sf)", types: [] },
      { id: 33, name: "Square Inch(sqi)", types: [] },
      { id: 34, name: "Square Kilometer(skm)", types: [] },
      { id: 35, name: "Square Meter(smeter)", types: [] },
      { id: 36, name: "Square Mile(sqm)", types: [] },
      { id: 37, name: "Square Yard(sy)", types: [] },
      { id: 38, name: "Teaspoon(ts)", types: [] },
      { id: 39, name: "Tonne(t)", types: [] },
    ],
    [],
  );
  const filteredUnitTypes = useMemo(
    () =>
      unitTypes.filter((item) =>
        productType === 1 ? true : item.types.includes(productType),
      ),
    [productType, unitTypes],
  );
  const selectedUnitType = useMemo(
    () => unitTypes.find((item) => item.id === toInt(unitType)),
    [unitType, unitTypes],
  );

  const featureRows = useMemo(() => {
    const rows: Array<
      ProductFeature & { isDefault: boolean; sourceIndex?: number }
    > = [];
    const bookKeys = new Set(defaultBookFeatures.map((item) => item.key));
    features.forEach((feature, index) => {
      if (productType === 6 && bookKeys.has(feature.key)) return;
      rows.push({ ...feature, isDefault: false, sourceIndex: index });
    });
    if (productType === 6) {
      defaultBookFeatures.forEach((feature) => {
        rows.push({ ...feature, isDefault: true });
      });
    }
    return rows;
  }, [defaultBookFeatures, features, productType]);

  const tabsWithContent = new Set([
    "Overview",
    "Filter",
    "Price",
    "Stock",
    "Features",
    "Image",
    "File",
    "Variant",
    "FAQ",
    "Meta",
    "Description",
    "Syllabus",
    "Will Learn",
    "Short PDF",
    "Review",
    "Landing Page",
  ]);

  const visibleTabs = useMemo(() => {
    if (productType === 6) {
      const hiddenTabs = new Set([
        "Features",
        "Syllabus",
        "Will Learn",
        "Image",
        "File",
        "Variant",
        "Landing Page",
      ]);
      return tabs.filter((tab) => !hiddenTabs.has(tab));
    }
    return tabs.filter((tab) => tab !== "Short PDF");
  }, [productType]);

  useEffect(() => {
    if (!visibleTabs.includes(selectedTab)) {
      setSelectedTab(visibleTabs[0] ?? "Overview");
    }
  }, [selectedTab, visibleTabs]);

  useEffect(() => {
    const product = productData?.storeProduct;
    if (!product) return;
    if (!lastHydratedIdRef.current) {
      lastHydratedIdRef.current = product.id;
    } else if (lastHydratedIdRef.current === product.id) {
      return;
    } else {
      lastHydratedIdRef.current = product.id;
    }

    const nextSiteId =
      typeof product.siteId === "number" ? product.siteId : null;
    setProductSiteId(nextSiteId);
    setAffiliateCommission(
      product.affiliateCommission != null
        ? String(product.affiliateCommission)
        : "0",
    );
    setAffiliateCommissionPercentage(
      product.affiliateCommissionPercentage != null
        ? String(product.affiliateCommissionPercentage)
        : "0",
    );
    setIsAffiliate(
      Boolean(
        (product.affiliateCommission && product.affiliateCommission > 0) ||
          (product.affiliateCommissionPercentage &&
            product.affiliateCommissionPercentage > 0),
      ),
    );
    setBarcode(product.barcode ?? "");
    setCampaignIds(Array.isArray(product.campaigns) ? product.campaigns : []);
    setCampaignSites(
      Array.isArray(product.campaignSites) ? product.campaignSites : [],
    );
    setCashback(product.cashback != null ? String(product.cashback) : "0");
    setIsCashback(Boolean(product.cashback && product.cashback > 0));
    setCollectionIds(
      Array.isArray(product.collections) ? product.collections : [],
    );
    setDiscount(product.discount != null ? String(product.discount) : "0");
    setDeliveryTime(
      product.deliveryTime != null ? String(product.deliveryTime) : "0",
    );
    setEmiDuration(
      product.emiDuration != null ? String(product.emiDuration) : "0",
    );
    setEmiInterest(
      product.emiInterest != null ? String(product.emiInterest) : "0",
    );
    setEmiPrice(product.emiPrice != null ? String(product.emiPrice) : "0");
    setExtraImages(
      Array.isArray(product.extraImages)
        ? product.extraImages.map((a) => ({
            id: a.id,
            image: (a.image ?? "").replaceAll(
              "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/",
              "",
            ),
          }))
        : [],
    );
    setFlashPrice(
      product.flashPrice != null ? String(product.flashPrice) : "0",
    );
    setIsEmi(Boolean(product.isEmi));
    setIsExclusive(Boolean(product.isExclusive));
    setIsFlash(Boolean(product.isFlash));
    setIsNegotiable(Boolean(product.isNegotiable));
    setIsOneTime(Boolean(product.isOneTime));
    setIsPreorder(Boolean(product.isPreorder));
    setIsResell(Boolean(product.isResell));
    setIsTrack(Boolean(product.isTrack));
    setIsVariant(Boolean(product.isVariant));
    setIsWarranty(Boolean(product.isWarranty));
    setKeyword(product.keyword ?? "");
    setMaxResellPrice(
      product.maxResellPrice != null ? String(product.maxResellPrice) : "0",
    );
    setMinResellPrice(
      product.minResellPrice != null ? String(product.minResellPrice) : "0",
    );
    setParentId(product.parentId ?? null);
    setPreorderDelivery(toDateInputValue(product.preorderDelivery));
    setRequirements(
      Array.isArray(product.requirements) ? product.requirements : [],
    );
    setRewardPoints(
      product.rewardPoints != null ? String(product.rewardPoints) : "0",
    );
    setIsRewardPoints(
      Boolean(product.rewardPoints && product.rewardPoints > 0),
    );
    setSalePrice(product.salePrice != null ? String(product.salePrice) : "0");
    setSchema(product.schema ?? {});
    setSource(product.source ?? "");
    setStoppages(Array.isArray(product.stoppages) ? product.stoppages : []);
    setUnitType(product.unitType != null ? product.unitType : 28);
    setValidFor(product.validFor != null ? product.validFor : 1);
    setVideoUrl(product.videoUrl ?? null);
    setWarranty(product.warranty != null ? product.warranty : null);
    setWholesale(Array.isArray(product.wholesale) ? product.wholesale : []);
    setIsWholesale(
      Array.isArray(product.wholesale) ? product.wholesale.length > 0 : false,
    );
    setWholesalePrice(
      product.wholesalePrice != null ? String(product.wholesalePrice) : "0",
    );
    setWholesalePricePercentage(
      product.wholesalePricePercentage != null
        ? String(product.wholesalePricePercentage)
        : "0",
    );
    setIsWholesalePricePercentage(
      Boolean(
        product.wholesalePricePercentage &&
          product.wholesalePricePercentage > 0,
      ),
    );
    setCurrency(product.currency ?? "");
    setShippingType(product.shippingType ?? null);
    setSupplierTitle(product.supplierTitle ?? "");
    setShopIds(Array.isArray(product.shops) ? product.shops : []);
    setShops(Array.isArray(product.shop) ? product.shop : []);
    setAuthor(product.author ?? null);
    setBrand(product.brand ?? null);
    setCampaign(product.campaign ?? null);
    setCategory(product.category ?? null);
    setCollection(product.collection ?? null);
    setSubCategory(product.subCategory ?? null);
    setSubSubCategory(product.subSubCategory ?? null);
    setHtml(product.html ?? {});
    setTitle(product.title ?? "");
    setTranslation(product.translation ?? "");
    setDescription(product.description ?? "");
    setProductType(product.productType ?? 1);
    setIsActive(Boolean(product.isActive));
    setIsPrivate(Boolean(product.isPrivate));
    setIsFeatured(Boolean(product.isFeatured));
    setIsNew(Boolean(product.isNew));
    setIsCod(Boolean(product.isCod));
    if (Array.isArray(product.campaignSites) && product.campaignSites.length) {
      setCampaignSites(product.campaignSites);
      setIsCampaignProduct(true);
    } else {
      setCampaignSites([]);
      setIsCampaignProduct(false);
    }
    setIsContinueSelling(
      product.isContinueSelling === null ||
        product.isContinueSelling === undefined
        ? true
        : Boolean(product.isContinueSelling),
    );
    setIsUnlisted(Boolean(product.isUnlisted));
    setIsLanding(Boolean(product.isLanding));
    setIsDeliveryCharge(Boolean(product.deliveryCharge));
    setDeliveryCharge(
      product.deliveryCharge != null ? String(product.deliveryCharge) : "",
    );
    setSku(product.sku ?? "");
    setCost(product.cost != null ? String(product.cost) : "");
    setPrice(product.price != null ? String(product.price) : "");
    setComparePrice(
      product.comparePrice != null ? String(product.comparePrice) : "",
    );
    if (product.productType === 6) {
      const compare = product.comparePrice ?? 0;
      const nextPrice = product.price ?? 0;
      const nextCost = product.cost ?? 0;
      setBookDiscount(
        compare > 0 && nextPrice
          ? String(Math.round(((compare - nextPrice) / compare) * 100))
          : "0",
      );
      setBookDiscountCost(
        compare > 0 && nextCost
          ? String(Math.round(((compare - nextCost) / compare) * 100))
          : "0",
      );
    } else {
      setBookDiscount("0");
      setBookDiscountCost("0");
    }
    setVat(product.vat != null ? String(product.vat) : "");
    setQuantity(product.quantity != null ? String(product.quantity) : "");
    setPriority(product.priority != null ? String(product.priority) : "");
    setMinOrder(product.minOrder != null ? String(product.minOrder) : "");
    setMaxOrder(product.maxOrder != null ? String(product.maxOrder) : "");
    setWeight(product.weight != null ? String(product.weight) : "");
    setUnit(product.unit != null ? String(product.unit) : "");
    setMetaTitle(product.metaTitle ?? "");
    setMetaDescription(product.metaDescription ?? "");
    setFileType(product.fileType ?? "PDF");
    setFileUrl(product.file ?? "");
    setImages(
      Array.isArray(product.images) && product.images.length
        ? product.images.map((img) => normalizeCdnImage(img.image))
        : [""],
    );
    setFeatures(Array.isArray(product.features) ? product.features : []);
    if (Array.isArray(product.features)) {
      const featureMap = new Map(
        product.features.map((item) => [item.key, item.value]),
      );
      setDefaultBookFeatures((prev) =>
        prev.map((def) =>
          featureMap.has(def.key)
            ? { ...def, value: featureMap.get(def.key) ?? "" }
            : def,
        ),
      );
    }
    setFaq(
      Array.isArray(product.faq)
        ? product.faq.map((item) => ({
            question: item.key ?? item.question ?? "",
            answer: item.value ?? item.answer ?? "",
          }))
        : [],
    );
    setVariants(
      Array.isArray(product.variants)
        ? product.variants.map((variant) => ({
            id: variant.id,
            title: variant.title ?? "",
            variantValues: Array.isArray(variant.variant)
              ? variant.variant.map((entry) => ({
                  key: entry.key,
                  value: entry.value,
                }))
              : [],
            imageIndex: variant.imageIndex ?? 0,
            quantity: variant.quantity != null ? String(variant.quantity) : "0",
            price: variant.price != null ? String(variant.price) : "0",
            cost: variant.cost != null ? String(variant.cost) : "0",
            wholesalePrice:
              variant.wholesalePrice != null
                ? String(variant.wholesalePrice)
                : "0",
            comparePrice:
              variant.comparePrice != null ? String(variant.comparePrice) : "0",
            variantType: Array.isArray(variant.variant)
              ? variant.variant.map((entry) => entry.key).join(", ")
              : "",
          }))
        : [],
    );
    setCategoryIds(Array.isArray(product.categories) ? product.categories : []);
    setSubCategoryIds(
      Array.isArray(product.subCategories) ? product.subCategories : [],
    );
    setSubSubCategoryIds(
      Array.isArray(product.subSubCategories) ? product.subSubCategories : [],
    );
    setBrandIds(Array.isArray(product.brands) ? product.brands : []);
    setAuthorIds(Array.isArray(product.authors) ? product.authors : []);
    setTagIds(Array.isArray(product.tags) ? product.tags : []);
    setSupplierId(product.supplierId ?? null);
    setNotes(
      Array.isArray(product.note)
        ? product.note.map((item) => ({
            genre: item.genre ?? "",
            title: item.title ?? "",
            subTitle: item.subTitle ?? "",
            url: item.url ?? "",
            image: item.image ?? "",
            file: item.file ?? "",
            isFree: Boolean(item.isFree),
          }))
        : [],
    );

    const mainImage =
      product.thumbnail ||
      product.image ||
      (Array.isArray(product.images) && product.images.length
        ? product.images[0]?.image
        : "");
    setFiles(mainImage ? [{ source: mainImage }] : []);
  }, [productData]);

  const cdnPrefix = "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/";
  const normalizeCdnImage = (value: string) => {
    const trimmed = value?.trim();
    if (!trimmed) return "";
    let normalized = trimmed;
    while (
      normalized.startsWith(cdnPrefix) &&
      normalized.slice(cdnPrefix.length).startsWith("http")
    ) {
      normalized = normalized.slice(cdnPrefix.length);
    }
    const doublePrefix = `${cdnPrefix}${cdnPrefix}`;
    while (normalized.includes(doublePrefix)) {
      normalized = normalized.split(doublePrefix).join(cdnPrefix);
    }
    const cleanForExt = normalized.split("?")[0]?.split("#")[0] ?? "";
    const hasImageExt = /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|avif)$/i.test(
      cleanForExt,
    );
    if (!hasImageExt && normalized.includes(cdnPrefix)) {
      normalized = normalized.split(cdnPrefix).join("");
    }
    return normalized;
  };
  const resolveExtraImageSrc = (image: string) => {
    const normalized = normalizeCdnImage(image);
    return normalized.includes("https")
      ? normalized
      : `${cdnPrefix}${normalized}`;
  };
  const resolveGalleryImageSrc = (image: string) => {
    const normalized = normalizeCdnImage(image);
    if (!normalized) return "";
    if (/^https?:\/\//i.test(normalized)) return normalized;
    return `${cdnPrefix}${normalized}`;
  };
  const extraImageTempIdThreshold = 1_000_000_000_000;
  const normalizeExtraImages = (items: ProductImage[]) =>
    items
      .filter((item) => item?.image?.trim())
      .map((item) => {
        const raw = item.image.trim();
        const normalizedRaw = normalizeCdnImage(raw);
        const stripped = normalizedRaw.replace(cdnPrefix, "");
        const image = normalizedRaw.includes("https")
          ? normalizedRaw
          : `${cdnPrefix}${stripped}`;
        const normalized: { id?: number; image: string } = { image };
        if (
          Number.isFinite(item.id) &&
          item.id > 0 &&
          item.id < extraImageTempIdThreshold
        ) {
          normalized.id = item.id;
        } else {
          normalized.id = 1;
        }
        return normalized;
      });

  const uploadExtraImage = async (file: File) => {
    if (!user?.id) return;
    const maxSizeInBytes = 3 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      addNotification(
        {
          title: "Product info",
          subTitle: "File size exceeds the maximum (3 MB) allowed limit.",
        },
        "error",
      );
      return;
    }

    try {
      const response = await createFile({
        variables: {
          userId: user.id,
          mimeType: file.type,
          file,
          size: file.size,
          title: title?.trim() ? title.trim() : file.name,
          url: "",
        },
      });
      const url = response.data?.selfFileFileCreate?.url ?? "";
      if (!url) return;
      const normalized = url.replace(cdnPrefix, "");
      const nextId = Date.now() + Math.floor(Math.random() * 100000);
      setExtraImages((prev) => [...prev, { id: nextId, image: normalized }]);
    } catch (error) {
      addNotification(
        {
          title: "Product info",
          subTitle: "Failed to upload image. Please try again.",
        },
        "error",
      );
    }
  };
  const uploadGalleryImage = async (file: File, index: number) => {
    if (!user?.id) return;
    const maxSizeInBytes = 3 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      addNotification(
        {
          title: "Product info",
          subTitle: "File size exceeds the maximum (3 MB) allowed limit.",
        },
        "error",
      );
      return;
    }

    try {
      const response = await createFile({
        variables: {
          userId: user.id,
          mimeType: file.type,
          file,
          size: file.size,
          title: title?.trim() ? title.trim() : file.name,
          url: "",
        },
      });
      const url = response.data?.selfFileFileCreate?.url ?? "";
      if (!url) return;
      const normalized = url.replace(cdnPrefix, "");
      setImages((prev) => {
        const next = [...prev];
        while (next.length <= index) next.push("");
        next[index] = normalized;
        return next;
      });
    } catch (error) {
      addNotification(
        {
          title: "Product info",
          subTitle: "Failed to upload image. Please try again.",
        },
        "error",
      );
    }
  };
  const handleExtraPdfUpload = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      addNotification(
        {
          title: "Product info",
          subTitle: "Please select a PDF file.",
        },
        "warning",
      );
      return;
    }

    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };
    try {
      let pdfImages;
      try {
        pdfImages = await PdfToImg(file, {
          scale: 1.5,
          returnType: "blob",
          imgType: "webp",
          pages: "all",
        });
      } catch (innerError) {
        const buffer = await file.arrayBuffer();
        pdfImages = await PdfToImg(buffer, {
          scale: 1.5,
          returnType: "blob",
          imgType: "webp",
          pages: "all",
        });
      }
      const images = Array.isArray(pdfImages) ? pdfImages : [pdfImages];

      // Loop sequentially and wait for each image to be uploaded
      for (const a of images) {
        if (!a) continue;
        if (a.type !== "image/webp") {
          const compressedFile = await imageCompression(a, options);
          await uploadExtraImage(compressedFile);
        } else {
          await uploadExtraImage(a);
        }
      }
    } catch (error) {
      addNotification(
        {
          title: "Product info",
          subTitle: "Failed to read PDF file. Please try again.",
        },
        "error",
      );
    }
  };

  const handleExtraImagesDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setExtraImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(result.source.index, 1);
      next.splice(result.destination.index, 0, moved);
      return next;
    });
  };

  useEffect(() => {
    if (productType !== 6) return;
    const compare = toFloat(comparePrice);
    if (!compare) return;
    const nextPrice = compare - (compare * bookDiscountValue) / 100;
    const nextCost = compare - (compare * bookDiscountCostValue) / 100;
    setPrice(String(nextPrice));
    setCost(String(nextCost));
  }, [bookDiscountCostValue, bookDiscountValue, comparePrice, productType]);

  useEffect(() => {
    if (!isWholesale) {
      setWholesale([]);
    }
  }, [isWholesale]);

  useEffect(() => {
    if (!isCashback) setCashback("0");
  }, [isCashback]);

  useEffect(() => {
    if (!isRewardPoints) setRewardPoints("0");
  }, [isRewardPoints]);

  useEffect(() => {
    if (!isAffiliate) {
      setAffiliateCommission("0");
      setAffiliateCommissionPercentage("0");
    }
  }, [isAffiliate]);

  const addWholesale = () => {
    const minOrderValue = toInt(newWholesale.minOrder);
    const maxOrderValue = toInt(newWholesale.maxOrder);
    const priceValue = toFloat(newWholesale.price);
    if (!minOrderValue || !maxOrderValue || !priceValue) return;
    setWholesale((prev) => [
      ...prev,
      { minOrder: minOrderValue, maxOrder: maxOrderValue, price: priceValue },
    ]);
    setNewWholesale({ minOrder: "", maxOrder: "", price: "" });
  };

  const BarcodeCanvas = ({
    value,
    title,
    priceLabel,
  }: {
    value: string;
    title: string;
    priceLabel: string;
  }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
      if (!canvasRef.current || !value) return;
      try {
        const barcodeCanvas = document.createElement("canvas");
        JsBarcode(barcodeCanvas, value, {
          displayValue: false,
          fontSize: 12,
          height: 50,
          margin: 4,
        });

        const padding = 6;
        const fontSize = 12;
        const topTextHeight = fontSize + 4;
        const bottomTextHeight = fontSize + 4;
        const width = barcodeCanvas.width + padding * 2;
        const height =
          barcodeCanvas.height + topTextHeight + bottomTextHeight + padding * 2;

        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(barcodeCanvas, padding, padding + topTextHeight);

        ctx.fillStyle = "#111827";
        ctx.font = `${fontSize}px system-ui`;

        if (title) {
          ctx.textAlign = "left";
          ctx.textBaseline = "top";
          ctx.fillText(title, padding, padding);
        }

        ctx.textBaseline = "bottom";
        ctx.textAlign = "left";
        ctx.fillText(priceLabel, padding, height - padding);

        ctx.textAlign = "right";
        ctx.fillText(value, width - padding, height - padding);
      } catch {
        // ignore render errors
      }
    }, [value, title, priceLabel]);

    return <canvas ref={canvasRef} className="w-full h-auto" />;
  };

  const validateForm = () => {
    if (!title.trim()) return false;
    return true;
  };

  const getFeaturesForSave = () => {
    const pendingKey = newFeatureKey.trim();
    const pendingValue = newFeatureValue.trim();
    const nextFeatures = pendingKey
      ? [...features, { key: pendingKey, value: pendingValue }]
      : features;
    const merged =
      productType !== 6
        ? nextFeatures
        : (() => {
            const bookKeys = new Set(
              defaultBookFeatures.map((entry) => entry.key),
            );
            const nonBook = nextFeatures.filter(
              (item) => !bookKeys.has(item.key),
            );
            return [...nonBook, ...defaultBookFeatures];
          })();
    return { nextFeatures, merged, hasPending: Boolean(pendingKey) };
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      addNotification(
        {
          title: "Product info",
          subTitle: "Please fill in all required fields before updating.",
        },
        "error",
      );
      return;
    }
    const parentSites = Array.isArray(site?.parent) ? site.parent : [];
    if (
      productSiteId != null &&
      parentSites.find((item) => item.id === productSiteId)
    ) {
      addNotification(
        {
          title: "Not allowed",
          subTitle: "You cannot update data from a parent site.",
        },
        "error",
      );
      return;
    }
    if (!resolvedProductId || !user?.id || !siteId) return;

    const { nextFeatures, merged, hasPending } = getFeaturesForSave();
    if (hasPending) {
      setFeatures(nextFeatures);
      setNewFeatureKey("");
      setNewFeatureValue("");
    }

    const mainImageFile = files.find((file) => file instanceof File) as
      | File
      | undefined;
    const galleryImages = images
      .map((image, index) => ({
        id: index + 1,
        image,
      }))
      .filter((item) => item.image);

    const updateProductVariables = {
      userId: user.id,
      siteId,
      id: resolvedProductId,
      affiliateCommission: toFloat(affiliateCommission),
      affiliateCommissionPercentage: toFloat(affiliateCommissionPercentage),
      authors: uniqueNumbers(authorIds),
      author,
      barcode,
      brands: uniqueNumbers(brandIds),
      brand,
      campaigns: uniqueNumbers(campaignIds),
      campaignSites: uniqueNumbers(campaignSites),
      campaign,
      cashback: toFloat(cashback),
      collections: uniqueNumbers(collectionIds),
      collection,
      categories: uniqueNumbers(categoryIds),
      category,
      comparePrice: toFloat(comparePrice),
      cost: toFloat(cost),
      currency: currency || null,
      deliveryCharge: toFloat(deliveryCharge),
      deliveryTime: toInt(deliveryTime),
      description,
      discount: toFloat(discount),
      emiDuration: toInt(emiDuration),
      emiInterest: toFloat(emiInterest),
      emiPrice: toFloat(emiPrice),
      extraImages: decamelizeKeys(normalizeExtraImages(extraImages)),
      faq: faq.map((item) => ({
        key: item.question ?? "",
        value: item.answer ?? "",
      })),
      features: decamelizeKeys(merged),
      file: fileUrl || "",
      fileType,
      flashPrice: toFloat(flashPrice),
      html,
      image: mainImageFile ?? null,
      images: galleryImages.length ? galleryImages : null,
      isActive,
      isExclusive: isDeliveryCharge ? true : isExclusive,
      isCod,
      isContinueSelling,
      isEmi,
      isFeatured,
      isFlash,
      isLanding,
      isNegotiable,
      isNew,
      isOneTime,
      isPreorder,
      isPrivate,
      isResell,
      isTrack,
      isUnlisted,
      isVariant,
      isWarranty,
      keyword,
      maxOrder: toInt(maxOrder),
      maxResellPrice: toFloat(maxResellPrice),
      minResellPrice: toFloat(minResellPrice),
      metaDescription,
      metaTitle,
      minOrder: toInt(minOrder),
      note: decamelizeKeys(notes),
      parentId,
      preorderDelivery: preorderDelivery
        ? new Date(preorderDelivery).toISOString()
        : null,
      price: toFloat(price),
      priority: toInt(priority),
      quantity: toInt(quantity),
      productType,
      requirements: decamelizeKeys(requirements),
      rewardPoints: toFloat(rewardPoints),
      salePrice: toFloat(salePrice || price),
      schema,
      sku,
      source: supplierId != null ? supplierTitle : source,
      stoppages,
      subCategories: uniqueNumbers(subCategoryIds),
      subCategory,
      subSubCategories: uniqueNumbers(subSubCategoryIds),
      subSubCategory,
      shopProducts: [],
      childProducts: [],
      shops: uniqueNumbers(shopIds),
      supplierId: supplierId != null ? Number(supplierId) : null,
      supplierTitle,
      title,
      translation,
      tags: uniqueNumbers(tagIds),
      slug: title || null,
      unit: toFloat(unit) || 1,
      unitType: toInt(unitType),
      variants: decamelizeKeys(
        variants.map((variant) => ({
          ...variant,
          price: toFloat(variant.price) - toFloat(price),
          cost: toFloat(variant.cost) - toFloat(cost),
          comparePrice: toFloat(variant.comparePrice) - toFloat(comparePrice),
          emiPrice: toFloat(emiPrice),
          wholesalePrice:
            toFloat(variant.wholesalePrice) - toFloat(wholesalePrice),
        })),
      ),
      validFor,
      vat: toFloat(vat),
      videoUrl,
      warranty,
      weight: toFloat(weight),
      wholesale: decamelizeKeys(wholesale),
      wholesalePrice: toFloat(wholesalePrice),
      wholesalePricePercentage: toFloat(wholesalePricePercentage),
      shippingType,
    };

    try {
      await updateProduct({ variables: updateProductVariables });
      addNotification(
        {
          title: "Product updated",
          subTitle: "Your changes have been saved.",
        },
        "success",
      );
    } catch (error: unknown) {
      addNotification(
        {
          title: "Update failed",
          subTitle:
            error instanceof Error
              ? error.message
              : "We couldn't update the product. Please try again.",
        },
        "error",
      );
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      addNotification(
        {
          title: "Product info",
          subTitle: "Please fill in all required fields before saving.",
        },
        "error",
      );
      return;
    }
    if (!user?.id || !siteId) return;

    const { nextFeatures, merged, hasPending } = getFeaturesForSave();
    if (hasPending) {
      setFeatures(nextFeatures);
      setNewFeatureKey("");
      setNewFeatureValue("");
    }

    const mainImageFile = files.find((file) => file instanceof File) as
      | File
      | undefined;
    const galleryImages = images
      .map((image, index) => ({
        id: index + 1,
        image,
      }))
      .filter((item) => item.image);

    const createProductVariables = {
      userId: user.id,
      siteId,
      title,
      slug: title || null,
      sku,
      price: toFloat(price),
      comparePrice: toFloat(comparePrice),
      discount: toFloat(discount),
      cost: toFloat(cost),
      quantity: toFloat(quantity),
      productType,
      currency: currency || null,
      description,
      html,
      image: mainImageFile ?? null,
      images: galleryImages.length ? galleryImages : null,
      extraImages: decamelizeKeys(normalizeExtraImages(extraImages)),
      variants: decamelizeKeys(
        variants.map((variant) => ({
          ...variant,
          price: toFloat(variant.price) - toFloat(price),
          cost: toFloat(variant.cost) - toFloat(cost),
          comparePrice: toFloat(variant.comparePrice) - toFloat(comparePrice),
          emiPrice: toFloat(emiPrice),
          wholesalePrice:
            toFloat(variant.wholesalePrice) - toFloat(wholesalePrice),
        })),
      ),
      wholesale: decamelizeKeys(wholesale),
      wholesalePrice: toFloat(wholesalePrice),
      wholesalePricePercentage: toFloat(wholesalePricePercentage),
      minResellPrice: toFloat(minResellPrice),
      maxResellPrice: toFloat(maxResellPrice),
      isActive,
      isFeatured,
      isFlash,
      isNew,
      isCod,
      isPreorder,
      isContinueSelling,
      isPrivate,
      isLanding,
      isUnlisted,
      isResell,
      isVariant,
      weight: toFloat(weight),
      unit: toFloat(unit) || 1,
      unitType: toInt(unitType),
      categories: uniqueNumbers(categoryIds),
      subCategories: uniqueNumbers(subCategoryIds),
      subSubCategories: uniqueNumbers(subSubCategoryIds),
      brands: uniqueNumbers(brandIds),
      authors: uniqueNumbers(authorIds),
      tags: uniqueNumbers(tagIds),
      supplierId: supplierId != null ? Number(supplierId) : null,
      features: decamelizeKeys(merged),
      preorderDelivery: preorderDelivery
        ? new Date(preorderDelivery).toISOString()
        : null,
    };

    try {
      await createProduct({ variables: createProductVariables });
      addNotification(
        {
          title: "Product created",
          subTitle: "Your product has been saved.",
        },
        "success",
      );
      navigate("/product/");
    } catch (error: unknown) {
      addNotification(
        {
          title: "Save failed",
          subTitle:
            error instanceof Error
              ? error.message
              : "We couldn't save the product. Please try again.",
        },
        "error",
      );
    }
  };

  const normalizeKeywords = (value: string) =>
    value
      .split(" ")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

  const addToKeyword = () => {
    const value = tempKeywordInput.trim();
    if (!value) return;
    setKeyword((prev) => {
      const nextTokens = normalizeKeywords(`${prev} ${value}`);
      return Array.from(new Set(nextTokens)).join(" ");
    });
    setTempKeywordInput("");
  };

  const removeKeywordToken = (token: string) => {
    setKeyword((prev) =>
      normalizeKeywords(prev)
        .filter((item) => item !== token)
        .join(" "),
    );
  };

  const handleVideoSelect = (url: string) => {
    setVideoUrl(url);
    setShowFile(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Product</h2>
            <p className="text-sm text-slate-500">
              Efficiently Create and Manage Product Listings for Seamless
              Inventory Control
            </p>
          </div>
          <div className="text-xs text-slate-400">
            {user?.id ? `User #${user.id}` : ""}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-3">
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            {visibleTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTab(tab)}
                className={`border-b-2 pb-2 transition ${
                  selectedTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-600 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === "Overview" ? (
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 lg:grid-cols-3">
              <div className="sm:col-span-1 lg:col-span-1">
                <FilterSelect
                  label="Product Type"
                  items={productTypes.map((item) => ({
                    id: item.id,
                    title: item.name,
                  }))}
                  value={productType}
                  radiusClassName="rounded-md"
                  buttonClassName="py-3 border-gray-300"
                  onChange={(next) => {
                    if (typeof next === "number") setProductType(next);
                  }}
                />
              </div>
              <div className="sm:col-span-3 lg:col-span-1 mx-3">
                <div className="relative rounded-md border border-gray-300 px-3 py-3">
                  <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    type="text"
                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:outline-none sm:text-sm"
                    placeholder="Enter title"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="relative rounded-md border border-gray-300 px-3 py-3">
                  <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                    Translation
                  </label>
                  <input
                    value={translation}
                    onChange={(event) => setTranslation(event.target.value)}
                    type="text"
                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:outline-none sm:text-sm"
                    placeholder="Enter translation"
                  />
                </div>
              </div>

              {productType === 6 ? (
                <div className="sm:col-span-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
                  {defaultBookFeatures.map((feature) => (
                    <div
                      key={`feature_${feature.id}`}
                      className="lg:col-span-1"
                    >
                      {feature.key === "দেশ" ? (
                        <FilterSelect
                          label="দেশ"
                          items={countryOptions}
                          value={
                            countryOptions.find(
                              (option) => option.title === feature.value,
                            )?.id ?? null
                          }
                          onChange={(next) => {
                            const selected =
                              countryOptions.find(
                                (option) => option.id === next,
                              )?.title ?? "";
                            setDefaultBookFeatures((prev) =>
                              prev.map((item) =>
                                item.id === feature.id
                                  ? { ...item, value: selected }
                                  : item,
                              ),
                            );
                          }}
                          radiusClassName="rounded-md"
                        />
                      ) : feature.key === "ভাষা" ? (
                        <FilterSelect
                          label="ভাষা"
                          items={languageOptions}
                          value={
                            languageOptions.find(
                              (option) => option.title === feature.value,
                            )?.id ?? null
                          }
                          onChange={(next) => {
                            const selected =
                              languageOptions.find(
                                (option) => option.id === next,
                              )?.title ?? "";
                            setDefaultBookFeatures((prev) =>
                              prev.map((item) =>
                                item.id === feature.id
                                  ? { ...item, value: selected }
                                  : item,
                              ),
                            );
                          }}
                          radiusClassName="rounded-md"
                        />
                      ) : feature.key === "প্রিন্ট" ? (
                        <FilterSelect
                          label="প্রিন্ট"
                          items={bindingOptions}
                          value={
                            bindingOptions.find(
                              (option) => option.title === feature.value,
                            )?.id ?? null
                          }
                          onChange={(next) => {
                            const selected =
                              bindingOptions.find(
                                (option) => option.id === next,
                              )?.title ?? "";
                            setDefaultBookFeatures((prev) =>
                              prev.map((item) =>
                                item.id === feature.id
                                  ? { ...item, value: selected }
                                  : item,
                              ),
                            );
                          }}
                          radiusClassName="rounded-md"
                        />
                      ) : feature.key === "কভার" ? (
                        <FilterSelect
                          label="কভার"
                          items={coverOptions}
                          value={
                            coverOptions.find(
                              (option) => option.title === feature.value,
                            )?.id ?? null
                          }
                          onChange={(next) => {
                            const selected =
                              coverOptions.find((option) => option.id === next)
                                ?.title ?? "";
                            setDefaultBookFeatures((prev) =>
                              prev.map((item) =>
                                item.id === feature.id
                                  ? { ...item, value: selected }
                                  : item,
                              ),
                            );
                          }}
                          radiusClassName="rounded-md"
                        />
                      ) : (
                        <div className="relative rounded-md border border-gray-300 px-3 py-3">
                          <label
                            htmlFor={`title_${feature.id}`}
                            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >
                            {feature.key}
                          </label>
                          <input
                            value={feature.value}
                            onChange={(event) => {
                              const value = event.target.value;
                              setDefaultBookFeatures((prev) =>
                                prev.map((item) =>
                                  item.id === feature.id
                                    ? { ...item, value }
                                    : item,
                                ),
                              );
                            }}
                            type="text"
                            name={`title_${feature.id}`}
                            id={`title_${feature.id}`}
                            autoComplete="off"
                            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                            placeholder={`${feature.key} লিখুন`}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="sm:col-span-6 mb-8">
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter description"
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>

              <div className="sm:col-span-6">
                <div className="relative rounded-md border border-gray-300 px-3 py-3">
                  <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                    {productType === 6 ? "Book Cover" : "Main Image"}
                  </label>
                  <FilePondUploader
                    className="bg-white pt-4 px-2"
                    files={files}
                    allowMultiple={false}
                    allowReplace
                    accepted="image/*"
                    code={sku}
                    isQr={isQr}
                    isBarcode={isBarcode}
                    disabled={
                      productSiteId != null && siteId != null
                        ? productSiteId !== siteId
                        : false
                    }
                    onAdded={(file) => setFiles([file])}
                    onRemove={() => setFiles([])}
                  />
                </div>
              </div>

              {![6].includes(productType) ? (
                <div className="sm:col-span-6">
                  {videoUrl ? (
                    <div
                      onClick={() => setShowFile(true)}
                      className="cursor-pointer rounded-md w-full border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 flex items-center"
                    >
                      <VideoCameraIcon className="h-6 w-6 mr-2" />
                      <span>
                        {videoUrl.length > 2
                          ? videoUrl.split("/")[videoUrl.split("/").length - 1]
                          : "Select Video"}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowFile(true)}
                      className="rounded-md w-full border border-gray-300 bg-white py-2.5 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 flex items-center"
                    >
                      <VideoCameraIcon className="h-6 w-6 mr-2" />
                      {videoUrl ? videoUrl.slice(-12) : "Select Video"}
                    </button>
                  )}
                </div>
              ) : null}

              <div className="sm:col-span-6 relative">
                <label
                  htmlFor="tempKeywordInput"
                  className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >
                  Keyword
                </label>
                <div className="flex flex-wrap gap-3 border p-4 rounded">
                  {Array.from(
                    new Set(
                      keyword
                        .split(" ")
                        .map((item) => item.trim())
                        .filter((item) => item.length > 1),
                    ),
                  ).map((item) => (
                    <div
                      key={item}
                      className="border px-3 py-2 rounded-md whitespace-nowrap relative"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeKeywordToken(item)}
                        className="absolute rounded-full bg-red-400 -top-2 -right-2"
                      >
                        <XMarkIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}

                  <div className="relative rounded-md border border-gray-300 px-3 py-3">
                    <label
                      htmlFor="tempKeywordInput"
                      className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                    >
                      New
                    </label>
                    <input
                      value={tempKeywordInput}
                      onChange={(event) =>
                        setTempKeywordInput(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addToKeyword();
                        }
                      }}
                      type="text"
                      name="tempKeywordInput"
                      id="tempKeywordInput"
                      autoComplete="off"
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                      placeholder="Enter Keyword"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      {tempKeywordInput.length < 3 ? (
                        <ExclamationCircleIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <CheckCircleIcon
                          className="h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="pt-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Status
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    The details used to determine your product behaviour around
                    the web.
                  </p>
                </div>

                <div className="mt-2">
                  <fieldset>
                    <div className="mt-4 space-y-4">
                      {productSiteId == null || productSiteId === siteId ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isActive"
                              name="isActive"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isActive}
                              onChange={(event) =>
                                setIsActive(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isActive"
                              className="font-medium text-gray-700"
                            >
                              Active
                            </label>
                            <p className="text-gray-500">
                              Customer can view and order
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {productSiteId == null || productSiteId === siteId ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isPrivate"
                              name="isPrivate"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isPrivate}
                              onChange={(event) =>
                                setIsPrivate(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isPrivate"
                              className="font-medium text-gray-700"
                            >
                              Private
                            </label>
                            <p className="text-gray-500">
                              If private, third party can not list this to their
                              site.
                            </p>
                          </div>
                        </div>
                      ) : null}

                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="isFeatured"
                            name="isFeatured"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={isFeatured}
                            onChange={(event) =>
                              setIsFeatured(event.target.checked)
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="isFeatured"
                            className="font-medium text-gray-700"
                          >
                            Featured
                          </label>
                          <p className="text-gray-500">
                            Will be shown at "Featured" section.
                          </p>
                        </div>
                      </div>

                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="isCampaignProduct"
                            name="isCampaignProduct"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={isCampaignProduct}
                            onChange={(event) =>
                              setIsCampaignProduct(event.target.checked)
                            }
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="isCampaignProduct"
                            className="font-medium text-gray-700"
                          >
                            Campaign Product
                          </label>
                          <p className="text-gray-500">
                            Mark this if the product belongs to your own
                            campaign.
                          </p>
                        </div>
                      </div>

                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="isNew"
                            name="isNew"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={isNew}
                            onChange={(event) => setIsNew(event.target.checked)}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="isNew"
                            className="font-medium text-gray-700"
                          >
                            New Arrival
                          </label>
                          <p className="text-gray-500">
                            Will be shown at "New arrival" section
                          </p>
                        </div>
                      </div>

                      {productSiteId == null ||
                      (productSiteId === siteId &&
                        ![6].includes(productType)) ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isOneTime"
                              name="isOneTime"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isOneTime}
                              onChange={(event) =>
                                setIsOneTime(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isOneTime"
                              className="font-medium text-gray-700"
                            >
                              One Time Purchase
                            </label>
                            <p className="text-gray-500">
                              A customer can only purchase one time only. Useful
                              for promotion.
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {productSiteId == null || productSiteId === siteId ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isContinueSelling"
                              name="isContinueSelling"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isContinueSelling}
                              onChange={(event) =>
                                setIsContinueSelling(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isContinueSelling"
                              className="font-medium text-gray-700"
                            >
                              Continue Selling
                            </label>
                            <p className="text-gray-500">
                              Customer can order after stock out.
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {productSiteId == null || productSiteId === siteId ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isUnlisted"
                              name="isUnlisted"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isUnlisted}
                              onChange={(event) =>
                                setIsUnlisted(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isUnlisted"
                              className="font-medium text-gray-700"
                            >
                              Unlisted
                            </label>
                            <p className="text-gray-500">
                              Will not show in home screen.
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {productSiteId == null || productSiteId === siteId ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isCod"
                              name="isCod"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isCod}
                              onChange={(event) =>
                                setIsCod(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isCod"
                              className="font-medium text-gray-700"
                            >
                              COD Available
                            </label>
                            <p className="text-gray-500">
                              Customer can pay cash on delivery.
                            </p>
                          </div>
                        </div>
                      ) : null}

                      <div className="relative flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="isDeliveryCharge"
                            name="isDeliveryCharge"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={isDeliveryCharge}
                            onChange={(event) => {
                              const next = event.target.checked;
                              setIsDeliveryCharge(next);
                              if (!next) setDeliveryCharge("0");
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isDeliveryCharge"
                              className="font-medium text-gray-700"
                            >
                              Delivery Charge
                            </label>
                            <p className="text-gray-500">
                              Will be shown at "Delivery Charge" section
                            </p>
                          </div>
                          {isDeliveryCharge ? (
                            <div className="ml-2 pt-2">
                              <input
                                value={deliveryCharge}
                                onChange={(event) =>
                                  setDeliveryCharge(event.target.value)
                                }
                                id="deliveryCharge"
                                name="deliveryCharge"
                                type="number"
                                className="rounded border border-gray-300 px-2 py-1"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {productSiteId == null ||
                      (productSiteId === siteId &&
                        ![6].includes(productType)) ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isTrack"
                              name="isTrack"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isTrack}
                              onChange={(event) =>
                                setIsTrack(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isTrack"
                              className="font-medium text-gray-700"
                            >
                              Track with Parent product
                            </label>
                            <p className="text-gray-500">
                              To order this product customer have to purchase
                              it's parent product.
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {productSiteId == null ||
                      (productSiteId === siteId &&
                        ![6].includes(productType)) ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isQr"
                              name="isQr"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isQr}
                              onChange={(event) =>
                                setIsQr(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isQr"
                              className="font-medium text-gray-700"
                            >
                              Add QR code to image
                            </label>
                            <p className="text-gray-500">
                              To find product easily by image.
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {productSiteId == null ||
                      (productSiteId === siteId &&
                        ![6].includes(productType)) ? (
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isBarcode"
                              name="isBarcode"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isBarcode}
                              onChange={(event) =>
                                setIsBarcode(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isBarcode"
                              className="font-medium text-gray-700"
                            >
                              Add Barcode code to image
                            </label>
                            <p className="text-gray-500">
                              To find product easily by image.
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          ) : null}

          {selectedTab === "Price" ? (
            <div className="grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-1 lg:col-span-2 lg:col-start-1">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {isOwner && productType !== 6 ? (
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <label
                          htmlFor="cost"
                          className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >
                          Cost / Purchase Price
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">৳</span>
                          </div>
                          <input
                            value={cost}
                            onChange={(event) => setCost(event.target.value)}
                            type="number"
                            name="cost"
                            id="cost"
                            className="block w-full rounded-md border border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                            placeholder="0.00"
                            disabled={
                              productSiteId != null && siteId != null
                                ? productSiteId !== siteId
                                : false
                            }
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">
                              {site?.currency ?? "BDT"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {productType !== 6 ? (
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <label
                          htmlFor="price"
                          className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >
                          Sale / Retail Price
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">৳</span>
                          </div>
                          <input
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                            type="number"
                            name="price"
                            id="price"
                            className="block w-full rounded-md py-3 pl-7 pr-1 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 outline-none focus:ring-0 focus:outline-none border border-gray-300"
                            placeholder="0.00"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">
                              {site?.currency ?? "BDT"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="sm:col-span-3">
                    <div className="relative">
                      <label
                        htmlFor="comparePrice"
                        className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                      >
                        {productType === 6
                          ? "Printed Price (MRP)"
                          : "List / Regular Price"}
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">৳</span>
                        </div>
                        <input
                          value={comparePrice}
                          onChange={(event) =>
                            setComparePrice(event.target.value)
                          }
                          type="number"
                          name="comparePrice"
                          id="comparePrice"
                          placeholder="0.00"
                          className="block w-full rounded-md py-3 pl-7 pr-12 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 outline-none focus:ring-0 focus:outline-none border border-gray-300"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">
                            {site?.currency ?? "BDT"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {productType === 6 ? (
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <label
                          htmlFor="bookDiscountCost"
                          className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >
                          Discount{" "}
                          <span>
                            {Array.isArray(site?.parent) && site.parent.length
                              ? `from ${site.parent[0]?.title ?? ""}`
                              : "for us (cost)"}
                          </span>
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">%</span>
                          </div>
                          <input
                            value={bookDiscountCost}
                            onChange={(event) =>
                              setBookDiscountCost(event.target.value)
                            }
                            type="number"
                            name="bookDiscountCost"
                            id="bookDiscountCost"
                            className="block w-full rounded-md border border-gray-300 py-3 pl-7 pr-12 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                            placeholder="0.00"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">
                              of {comparePrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {productType === 6 ? (
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <label
                          htmlFor="bookDiscount"
                          className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >
                          Discount for customer (sale)
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">%</span>
                          </div>
                          <input
                            value={bookDiscount}
                            onChange={(event) =>
                              setBookDiscount(event.target.value)
                            }
                            type="number"
                            name="bookDiscount"
                            id="bookDiscount"
                            placeholder="0.00"
                            className="block w-full rounded-md py-3 pl-7 pr-12 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 outline-none border border-gray-300 focus:ring-0"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">
                              of {comparePrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {productType === 6 ? (
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <label
                          htmlFor="wholesalePricePercentage"
                          className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >
                          Discount for reseller
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            value={wholesalePricePercentage}
                            onChange={(event) =>
                              setWholesalePricePercentage(event.target.value)
                            }
                            type="number"
                            name="wholesalePricePercentage"
                            id="wholesalePricePercentage"
                            className="block w-full rounded-md border border-gray-300 py-3 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="0.00"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">
                              % of{" "}
                              {formatMoney(comparePriceValue, site?.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {productType !== 6 ? (
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <label
                          htmlFor="vat"
                          className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >
                          VAT
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">%</span>
                          </div>
                          <input
                            value={vat}
                            onChange={(event) => setVat(event.target.value)}
                            type="number"
                            name="vat"
                            id="vat"
                            className="block w-full rounded-md border border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                            placeholder="0.00"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">
                              {site?.currency ?? "BDT"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {canEditSite ? (
                  <div className="pt-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Additional Pricing
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      The details used to determine your product pricing
                      behaviour around the web.
                    </p>
                  </div>
                ) : null}

                {canEditSite ? (
                  <div className="mt-2">
                    <fieldset>
                      <div className="mt-4 space-y-4">
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isFlash"
                              name="isFlash"
                              type="checkbox"
                              className="h-4 w-4 rounded border border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isFlash}
                              onChange={(event) =>
                                setIsFlash(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isFlash"
                              className="font-medium text-gray-700"
                            >
                              Flash price
                            </label>
                            <p className="text-gray-500">
                              Do you offer flash price for this product?
                            </p>
                            {isFlash ? (
                              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                  <div className="relative">
                                    <label
                                      htmlFor="flashPrice"
                                      className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                      Flash price
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                      <input
                                        value={flashPrice}
                                        onChange={(event) =>
                                          setFlashPrice(event.target.value)
                                        }
                                        type="number"
                                        name="flashPrice"
                                        id="flashPrice"
                                        className="block w-full rounded-md  border border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                        placeholder="0.00"
                                      />
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isPreorder"
                              name="isPreorder"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isPreorder}
                              onChange={(event) =>
                                setIsPreorder(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isPreorder"
                              className="font-medium text-gray-700"
                            >
                              Pre Order
                            </label>
                            <p className="text-gray-500">
                              If pre order, need to set pre order delivery date.
                            </p>
                            {isPreorder ? (
                              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                  <DatePicker
                                    title="Preorder delivery"
                                    value={preorderDelivery || null}
                                    minDate={new Date()}
                                    inline
                                    onChange={(next) => {
                                      if (
                                        typeof next === "string" ||
                                        next == null
                                      ) {
                                        setPreorderDelivery(next ?? "");
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {![6].includes(productType) ? (
                          <div className="relative flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="isEmi"
                                name="isEmi"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={isEmi}
                                onChange={(event) =>
                                  setIsEmi(event.target.checked)
                                }
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="isEmi"
                                className="font-medium text-gray-700"
                              >
                                EMI
                              </label>
                              <p className="text-gray-500">
                                Do you offer EMI for this product?
                              </p>
                              {isEmi ? (
                                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                  <div className="sm:col-span-3">
                                    <div className="relative">
                                      <label
                                        htmlFor="emiPrice"
                                        className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                      >
                                        EMI Price
                                      </label>
                                      <div className="relative rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                          <span className="text-gray-500 sm:text-sm">
                                            {site?.currency ?? "BDT"}
                                          </span>
                                        </div>
                                        <input
                                          value={emiPrice}
                                          onChange={(event) =>
                                            setEmiPrice(event.target.value)
                                          }
                                          type="number"
                                          name="emiPrice"
                                          id="emiPrice"
                                          className="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                          placeholder="0.00"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                          <span className="text-gray-500 sm:text-sm">
                                            {site?.currency ?? "BDT"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="sm:col-span-3">
                                    <div className="relative">
                                      <label
                                        htmlFor="emiInterest"
                                        className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                      >
                                        EMI Interest
                                      </label>
                                      <div className="relative rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                          <span className="text-gray-500 sm:text-sm">
                                            {site?.currency ?? "BDT"}
                                          </span>
                                        </div>
                                        <input
                                          value={emiInterest}
                                          onChange={(event) =>
                                            setEmiInterest(event.target.value)
                                          }
                                          type="number"
                                          name="emiInterest"
                                          id="emiInterest"
                                          className="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                          placeholder="0.00"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                          <span className="text-gray-500 sm:text-sm">
                                            {site?.currency ?? "BDT"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="sm:col-span-3">
                                    <div className="relative">
                                      <label
                                        htmlFor="emiDuration"
                                        className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                      >
                                        EMI Duration (month)
                                      </label>
                                      <div className="relative rounded-md shadow-sm">
                                        <input
                                          value={emiDuration}
                                          onChange={(event) =>
                                            setEmiDuration(event.target.value)
                                          }
                                          type="number"
                                          name="emiDuration"
                                          id="emiDuration"
                                          className="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                          placeholder="0.00"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}

                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isResell"
                              name="isResell"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isResell}
                              onChange={(event) =>
                                setIsResell(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isResell"
                              className="font-medium text-gray-700"
                            >
                              Resellable
                            </label>
                            <p className="text-gray-500">
                              Anyone can resell and order for others on your
                              platform.
                            </p>
                            {isResell ? (
                              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                  <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                      <input
                                        id="isWholesalePricePercentage"
                                        name="isWholesalePricePercentage"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={isWholesalePricePercentage}
                                        onChange={(event) =>
                                          setIsWholesalePricePercentage(
                                            event.target.checked,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <label
                                        htmlFor="isWholesalePricePercentage"
                                        className="font-medium text-gray-700"
                                      >
                                        Auto Resell Price
                                      </label>
                                      <p className="text-gray-500">
                                        Auto resell price based on MRP.
                                      </p>
                                      {isWholesalePricePercentage ? (
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                          <div className="sm:col-span-3">
                                            <div className="relative">
                                              <label
                                                htmlFor="wholesalePricePercentage"
                                                className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                              >
                                                Discount for reseller
                                              </label>
                                              <div className="relative rounded-md shadow-sm">
                                                <input
                                                  value={
                                                    wholesalePricePercentage
                                                  }
                                                  onChange={(event) =>
                                                    setWholesalePricePercentage(
                                                      event.target.value,
                                                    )
                                                  }
                                                  type="number"
                                                  name="wholesalePricePercentage"
                                                  id="wholesalePricePercentage"
                                                  className="block w-full rounded-md border-gray-300 py-3 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                  placeholder="0.00"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                  <span className="text-gray-500 sm:text-sm">
                                                    % of{" "}
                                                    {formatMoney(
                                                      comparePriceValue,
                                                      site?.currency,
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                <div className="sm:col-span-3">
                                  <div className="relative">
                                    <label
                                      htmlFor="wholesalePrice"
                                      className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                      Resell Price
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                      <input
                                        value={wholesalePrice}
                                        onChange={(event) =>
                                          setWholesalePrice(event.target.value)
                                        }
                                        type="number"
                                        name="wholesalePrice"
                                        id="wholesalePrice"
                                        className="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                        placeholder="0.00"
                                      />
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <div className="relative">
                                    <label
                                      htmlFor="minResellPrice"
                                      className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                      Min Resell Price
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                      <input
                                        value={minResellPrice}
                                        onChange={(event) =>
                                          setMinResellPrice(event.target.value)
                                        }
                                        type="number"
                                        name="minResellPrice"
                                        id="minResellPrice"
                                        className="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                        placeholder="0.00"
                                      />
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <div className="relative">
                                    <label
                                      htmlFor="maxResellPrice"
                                      className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                      Max Resell Price
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                      <input
                                        value={maxResellPrice}
                                        onChange={(event) =>
                                          setMaxResellPrice(event.target.value)
                                        }
                                        type="number"
                                        name="maxResellPrice"
                                        id="maxResellPrice"
                                        className="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                        placeholder="0.00"
                                      />
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isWholesale"
                              name="isWholesale"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isWholesale}
                              onChange={(event) =>
                                setIsWholesale(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isWholesale"
                              className="font-medium text-gray-700"
                            >
                              Wholesale
                            </label>
                            <p className="text-gray-500">
                              Do you offer wholesale rate for business?
                            </p>
                            {isWholesale ? (
                              <>
                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                  <div className="sm:col-span-6">
                                    {wholesale.map((item, index) => (
                                      <div
                                        key={`wholesale_${index}`}
                                        className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
                                      >
                                        <div className="sm:col-span-2">
                                          <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                            <label
                                              htmlFor={`minOrder_${index}`}
                                              className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                            >
                                              Min Order
                                            </label>
                                            <input
                                              value={item.minOrder}
                                              onChange={(event) => {
                                                const value = toInt(
                                                  event.target.value,
                                                );
                                                setWholesale((prev) =>
                                                  prev.map((entry, i) =>
                                                    i === index
                                                      ? {
                                                          ...entry,
                                                          minOrder: value,
                                                        }
                                                      : entry,
                                                  ),
                                                );
                                              }}
                                              type="number"
                                              name={`minOrder_${index}`}
                                              id={`minOrder_${index}`}
                                              autoComplete="off"
                                              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                                              placeholder="Enter min order"
                                            />
                                          </div>
                                        </div>
                                        <div className="sm:col-span-2">
                                          <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                            <label
                                              htmlFor={`maxOrder_${index}`}
                                              className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                            >
                                              Max Order
                                            </label>
                                            <input
                                              value={item.maxOrder}
                                              onChange={(event) => {
                                                const value = toInt(
                                                  event.target.value,
                                                );
                                                setWholesale((prev) =>
                                                  prev.map((entry, i) =>
                                                    i === index
                                                      ? {
                                                          ...entry,
                                                          maxOrder: value,
                                                        }
                                                      : entry,
                                                  ),
                                                );
                                              }}
                                              type="number"
                                              name={`maxOrder_${index}`}
                                              id={`maxOrder_${index}`}
                                              autoComplete="off"
                                              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                                              placeholder="Enter max order"
                                            />
                                          </div>
                                        </div>
                                        <div className="sm:col-span-2 flex items-center">
                                          <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                            <label
                                              htmlFor={`price_${index}`}
                                              className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                            >
                                              Price
                                            </label>
                                            <input
                                              value={item.price}
                                              onChange={(event) => {
                                                const value = toFloat(
                                                  event.target.value,
                                                );
                                                setWholesale((prev) =>
                                                  prev.map((entry, i) =>
                                                    i === index
                                                      ? {
                                                          ...entry,
                                                          price: value,
                                                        }
                                                      : entry,
                                                  ),
                                                );
                                              }}
                                              type="number"
                                              name={`price_${index}`}
                                              id={`price_${index}`}
                                              autoComplete="off"
                                              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                                              placeholder="Enter price"
                                            />
                                          </div>
                                          <BackspaceIcon
                                            onClick={() =>
                                              setWholesale((prev) =>
                                                prev.filter(
                                                  (_, i) => i !== index,
                                                ),
                                              )
                                            }
                                            className="mx-4 h-8 w-8 text-red-500 cursor-pointer"
                                            aria-hidden="true"
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                      <label
                                        htmlFor="newWholesaleMin"
                                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                      >
                                        Min Order
                                      </label>
                                      <input
                                        value={newWholesale.minOrder}
                                        onChange={(event) =>
                                          setNewWholesale((prev) => ({
                                            ...prev,
                                            minOrder: event.target.value,
                                          }))
                                        }
                                        type="number"
                                        name="newWholesaleMin"
                                        id="newWholesaleMin"
                                        autoComplete="off"
                                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                                        placeholder="Enter min order"
                                      />
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                      <label
                                        htmlFor="newWholesaleMax"
                                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                      >
                                        Max Order
                                      </label>
                                      <input
                                        value={newWholesale.maxOrder}
                                        onChange={(event) =>
                                          setNewWholesale((prev) => ({
                                            ...prev,
                                            maxOrder: event.target.value,
                                          }))
                                        }
                                        type="number"
                                        name="newWholesaleMax"
                                        id="newWholesaleMax"
                                        autoComplete="off"
                                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                                        placeholder="Enter max order"
                                      />
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                      <label
                                        htmlFor="newWholesalePrice"
                                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                      >
                                        Price
                                      </label>
                                      <input
                                        value={newWholesale.price}
                                        onChange={(event) =>
                                          setNewWholesale((prev) => ({
                                            ...prev,
                                            price: event.target.value,
                                          }))
                                        }
                                        type="number"
                                        name="newWholesalePrice"
                                        id="newWholesalePrice"
                                        autoComplete="off"
                                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                                        placeholder="Enter price"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white shadow sm:rounded-lg mt-4">
                                  <div className="px-4 py-5">
                                    <div className="sm:flex sm:items-start sm:justify-between">
                                      <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                                          Add Wholesale price
                                        </h3>
                                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                                          <p>
                                            Enter feature details (e.g., max
                                            order):
                                          </p>
                                        </div>
                                      </div>
                                      <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
                                        <button
                                          type="button"
                                          onClick={addWholesale}
                                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:text-sm"
                                        >
                                          Add
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isAffiliate"
                              name="isAffiliate"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isAffiliate}
                              onChange={(event) =>
                                setIsAffiliate(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isAffiliate"
                              className="font-medium text-gray-700"
                            >
                              Affiliate
                            </label>
                            <p className="text-gray-500">
                              Do you offer affiliate commission for this
                              product?
                            </p>
                            {isAffiliate ? (
                              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                  <div className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                      <input
                                        id="isAffiliateCommissionPercentage"
                                        name="isAffiliateCommissionPercentage"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={
                                          affiliateCommissionPercentage !== "0"
                                        }
                                        onChange={(event) =>
                                          setAffiliateCommissionPercentage(
                                            event.target.checked ? "1" : "0",
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="ml-3 text-sm">
                                      <label
                                        htmlFor="isAffiliateCommissionPercentage"
                                        className="font-medium text-gray-700"
                                      >
                                        Auto affiliate commission
                                      </label>
                                      <p className="text-gray-500">
                                        Auto commission based on profit margin.
                                      </p>
                                      {affiliateCommissionPercentage !== "0" ? (
                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                          <div className="sm:col-span-3">
                                            <div className="relative">
                                              <label
                                                htmlFor="affiliateCommissionPercentage"
                                                className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                              >
                                                Commission for affiliate
                                              </label>
                                              <div className="relative rounded-md shadow-sm">
                                                <input
                                                  value={
                                                    affiliateCommissionPercentage
                                                  }
                                                  onChange={(event) =>
                                                    setAffiliateCommissionPercentage(
                                                      event.target.value,
                                                    )
                                                  }
                                                  type="number"
                                                  name="affiliateCommissionPercentage"
                                                  id="affiliateCommissionPercentage"
                                                  className="block w-full rounded-md border-gray-300 py-3 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                  placeholder="0.00"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                  <span className="text-gray-500 sm:text-sm">
                                                    % on{" "}
                                                    {formatMoney(
                                                      priceValue - costValue,
                                                      site?.currency,
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                <div className="sm:col-span-3">
                                  <div className="relative">
                                    <label
                                      htmlFor="affiliateCommission"
                                      className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                      Affiliate Commission
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                      <input
                                        value={affiliateCommission}
                                        onChange={(event) =>
                                          setAffiliateCommission(
                                            event.target.value,
                                          )
                                        }
                                        type="number"
                                        name="affiliateCommission"
                                        id="affiliateCommission"
                                        className="block w-full rounded-md border-gray-300 py-3 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                        placeholder="0.00"
                                      />
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          %
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isCashback"
                              name="isCashback"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isCashback}
                              onChange={(event) =>
                                setIsCashback(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isCashback"
                              className="font-medium text-gray-700"
                            >
                              Cashback
                            </label>
                            <p className="text-gray-500">
                              Do you offer cashback for this product?
                            </p>
                            {isCashback ? (
                              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                  <div className="relative">
                                    <label
                                      htmlFor="cashback"
                                      className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                      Cashback
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                      <input
                                        value={cashback}
                                        onChange={(event) =>
                                          setCashback(event.target.value)
                                        }
                                        type="number"
                                        name="cashback"
                                        id="cashback"
                                        className="block w-full rounded-md border-gray-300 py-3 pl-4 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                        placeholder="0.00"
                                      />
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          %
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="isRewardPoints"
                              name="isRewardPoints"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              checked={isRewardPoints}
                              onChange={(event) =>
                                setIsRewardPoints(event.target.checked)
                              }
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="isRewardPoints"
                              className="font-medium text-gray-700"
                            >
                              Reward Points
                            </label>
                            <p className="text-gray-500">
                              Do you offer reward points for this product?
                            </p>
                            {isRewardPoints ? (
                              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                  <div className="relative">
                                    <label
                                      htmlFor="rewardPoints"
                                      className="absolute -top-2 left-2 z-10 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                    >
                                      Reward Points
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                      <input
                                        value={rewardPoints}
                                        onChange={(event) =>
                                          setRewardPoints(event.target.value)
                                        }
                                        type="number"
                                        name="rewardPoints"
                                        id="rewardPoints"
                                        className="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50"
                                        placeholder="0.00"
                                      />
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500 sm:text-sm">
                                          {site?.currency ?? "BDT"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {![6].includes(productType) ? (
                          <div className="relative flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="isWarranty"
                                name="isWarranty"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={isWarranty}
                                onChange={(event) =>
                                  setIsWarranty(event.target.checked)
                                }
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="isWarranty"
                                className="font-medium text-gray-700"
                              >
                                Warranty
                              </label>
                              <p className="text-gray-500">
                                Do this product have warranty?
                              </p>
                              {isWarranty ? (
                                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                  <div className="sm:col-span-3">
                                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                                      <label
                                        htmlFor="warranty"
                                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                      >
                                        Warranty in days
                                      </label>
                                      <input
                                        value={warranty ?? ""}
                                        onChange={(event) =>
                                          setWarranty(
                                            event.target.value
                                              ? Number(event.target.value)
                                              : null,
                                          )
                                        }
                                        type="number"
                                        name="warranty"
                                        id="warranty"
                                        autoComplete="off"
                                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm"
                                        placeholder="Enter the warranty"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </fieldset>
                  </div>
                ) : null}
              </div>

              <div>
                <div className="bg-green-50 mb-4 rounded-md px-4 py-4 sm:px-4">
                  <aside className="xl:block">
                    <h2 className="sr-only">Details</h2>
                    <div className="space-y-3">
                      {isOwner && productType === 6 ? (
                        <div className="flex items-center space-x-2">
                          <BanknotesIcon
                            className={`h-5 w-5 ${
                              comparePriceValue > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-800">
                            Printed price{" "}
                            <time dateTime="2020-12-02">
                              {formatMoney(comparePriceValue, site?.currency)}
                            </time>
                          </span>
                        </div>
                      ) : null}

                      {isOwner && productType === 6 ? (
                        <div className="flex items-center space-x-2">
                          <BanknotesIcon
                            className={`h-5 w-5 ${
                              comparePriceValue -
                                (comparePriceValue * bookDiscountValue) / 100 >
                              0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-800">
                            Customer price{" "}
                            <time dateTime="2020-12-02">
                              {formatMoney(
                                comparePriceValue -
                                  (comparePriceValue * bookDiscountValue) / 100,
                                site?.currency,
                              )}
                            </time>
                            &nbsp;({bookDiscountValue}%)
                          </span>
                        </div>
                      ) : null}

                      {isOwner && productType === 6 ? (
                        <div className="flex items-center space-x-2">
                          <BanknotesIcon
                            className={`h-5 w-5 ${
                              comparePriceValue -
                                (comparePriceValue * bookDiscountCostValue) /
                                  100 >
                              0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-800">
                            {site?.title ?? "Site"} price{" "}
                            <time dateTime="2020-12-02">
                              {formatMoney(
                                comparePriceValue -
                                  (comparePriceValue * bookDiscountCostValue) /
                                    100,
                                site?.currency,
                              )}
                            </time>
                            &nbsp;({bookDiscountCostValue}%)
                          </span>
                        </div>
                      ) : null}

                      {isOwner && productType !== 6 ? (
                        <div className="flex items-center space-x-2">
                          <ReceiptRefundIcon
                            className={`h-5 w-5 ${
                              margin > 0 ? "text-green-400" : "text-red-400"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-800">
                            Margin{" "}
                            <time dateTime="2020-12-02">
                              {margin.toFixed(2)}%
                            </time>
                          </span>
                        </div>
                      ) : null}
                      {productType !== 6 ? (
                        <div className="flex items-center space-x-2">
                          <ReceiptPercentIcon
                            className={`h-5 w-5 ${
                              discountPercent > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-800">
                            Discount{" "}
                            <time dateTime="2020-12-02">
                              {discountPercent.toFixed(2)}%
                            </time>
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-6 space-y-8 border-t border-gray-200 pt-4">
                      {isResell ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Resell
                          </h2>
                          <ul role="list" className="mt-3 space-y-3">
                            <li className="flex justify-start">
                              <div className="flex items-center space-x-3">
                                <BanknotesIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <div className="text-sm font-medium text-gray-900">
                                  Price{" "}
                                  <time dateTime="2020-12-02">
                                    {formatMoney(
                                      toFloat(wholesalePrice),
                                      site?.currency,
                                    )}
                                  </time>
                                </div>
                              </div>
                            </li>
                            <li className="flex justify-start">
                              <div className="flex items-center space-x-3">
                                <BanknotesIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <div className="text-sm font-medium text-gray-900">
                                  Min Resell{" "}
                                  <time dateTime="2020-12-02">
                                    {formatMoney(
                                      toFloat(minResellPrice),
                                      site?.currency,
                                    )}
                                  </time>
                                </div>
                              </div>
                            </li>
                            <li className="flex justify-start">
                              <div className="flex items-center space-x-3">
                                <BanknotesIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <div className="text-sm font-medium text-gray-900">
                                  Max Resell{" "}
                                  <time dateTime="2020-12-02">
                                    {formatMoney(
                                      toFloat(maxResellPrice),
                                      site?.currency,
                                    )}
                                  </time>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ) : null}
                      {isEmi ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            EMI -{" "}
                            {formatMoney(toFloat(emiPrice), site?.currency)}
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            <li className="inline">
                              <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                <div className="absolute flex flex-shrink-0 items-center justify-center">
                                  <span
                                    className="h-1.5 w-1.5 rounded-full bg-rose-500"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="ml-3.5 text-sm font-medium text-gray-900">
                                  {toFloat(emiInterest).toFixed(1)}% interest
                                </div>
                              </div>{" "}
                            </li>
                            <li className="inline">
                              <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                <div className="absolute flex flex-shrink-0 items-center justify-center">
                                  <span
                                    className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div className="ml-3.5 text-sm font-medium text-gray-900">
                                  {toInt(emiDuration)} months
                                </div>
                              </div>{" "}
                            </li>
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          ) : null}

          {selectedTab === "Stock" ? (
            <div className="grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-1 lg:col-span-2 lg:col-start-1">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                      <label
                        htmlFor="quantity"
                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                      >
                        Quantity
                      </label>
                      <input
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        type="number"
                        name="quantity"
                        id="quantity"
                        autoComplete="off"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter a quantity"
                        disabled={variants.length > 0 || !canEditSite}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {toFloat(quantity) === 0 ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                      <label
                        htmlFor="priority"
                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                      >
                        Priority
                      </label>
                      <input
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                        type="number"
                        name="priority"
                        id="priority"
                        autoComplete="off"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter the priority"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {toFloat(priority) === 0 ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {![6].includes(productType) ? (
                    <div className="sm:col-span-3">
                      <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                        <label
                          htmlFor="minOrder"
                          className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >
                          Min Order
                        </label>
                        <input
                          value={minOrder}
                          onChange={(event) => setMinOrder(event.target.value)}
                          type="number"
                          name="minOrder"
                          id="minOrder"
                          autoComplete="off"
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter a number"
                          disabled={!canEditSite}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {toFloat(minOrder) === 0 ? (
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <CheckCircleIcon
                              className="h-5 w-5 text-green-500"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {![6].includes(productType) ? (
                    <div className="sm:col-span-3">
                      <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                        <label
                          htmlFor="maxOrder"
                          className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                        >
                          Max Order
                        </label>
                        <input
                          value={maxOrder}
                          onChange={(event) => setMaxOrder(event.target.value)}
                          type="number"
                          name="maxOrder"
                          id="maxOrder"
                          autoComplete="off"
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                          placeholder="Enter the max order"
                          disabled={!canEditSite}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {toFloat(maxOrder) === 0 ? (
                            <ExclamationCircleIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <CheckCircleIcon
                              className="h-5 w-5 text-green-500"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="sm:col-span-3">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                      <label
                        htmlFor="sku"
                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                      >
                        SKU
                      </label>
                      <input
                        value={sku}
                        onChange={(event) => setSku(event.target.value)}
                        type="text"
                        name="sku"
                        id="sku"
                        autoComplete="off"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter your sku"
                        disabled
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {sku.length < 3 ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                      <label
                        htmlFor="barcode"
                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                      >
                        Barcode
                      </label>
                      <input
                        value={barcode}
                        onChange={(event) => setBarcode(event.target.value)}
                        type="text"
                        name="barcode"
                        id="barcode"
                        autoComplete="off"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter a barcode"
                        disabled
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {barcode.length < 3 ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {![].includes(productType) ? (
                  <div className="pt-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Unit & weight
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      The details used to identify your product type around the
                      web.
                    </p>
                  </div>
                ) : null}

                {![6].includes(productType) ? (
                  <div className="pt-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                          <label
                            htmlFor="weight"
                            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >
                            Weight(kg)
                          </label>
                          <input
                            value={weight}
                            onChange={(event) => setWeight(event.target.value)}
                            type="number"
                            name="weight"
                            id="weight"
                            autoComplete="off"
                            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                            placeholder="Enter weight"
                            disabled={!canEditSite}
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            {toFloat(weight) === 0 ? (
                              <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <CheckCircleIcon
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                          <label
                            htmlFor="unit"
                            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                          >
                            Unit
                          </label>
                          <input
                            value={unit}
                            onChange={(event) => setUnit(event.target.value)}
                            type="number"
                            name="unit"
                            id="unit"
                            autoComplete="off"
                            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none sm:text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                            placeholder="Enter unit"
                            disabled={!canEditSite}
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            {toFloat(unit) === 0 ? (
                              <ExclamationCircleIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <CheckCircleIcon
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <FilterSelect
                          label="Unit Type"
                          items={filteredUnitTypes.map((item) => ({
                            id: item.id,
                            title: item.name,
                          }))}
                          value={toInt(unitType)}
                          onChange={(next) =>
                            setUnitType(Number(Array.isArray(next) ? next[0] : next))
                          }
                          disabled={!canEditSite}
                          radiusClassName="rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <div className="bg-green-50 mb-4 rounded-md px-4 py-4 sm:px-4">
                  <aside className="xl:block">
                    <h2 className="sr-only">Details</h2>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <BanknotesIcon
                          className={`h-5 w-5 ${
                            toFloat(quantity) > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          Quantity:{" "}
                          <time dateTime="2020-12-02">{quantity}</time>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ReceiptRefundIcon
                          className={`h-5 w-5 ${
                            sku.length > 0 ? "text-green-400" : "text-red-400"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          SKU: <time dateTime="2020-12-02">{sku}</time>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ReceiptPercentIcon
                          className={`h-5 w-5 ${
                            barcode.length > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          Barcode: <time dateTime="2020-12-02">{barcode}</time>
                        </span>
                      </div>
                      <div className="rounded bg-white p-2 w-[70%]">
                        {barcode ? (
                          <BarcodeCanvas
                            value={barcode}
                            title={title}
                            priceLabel={formatMoney(priceValue, site?.currency)}
                          />
                        ) : (
                          <div className="text-xs text-slate-500">
                            Barcode preview unavailable.
                          </div>
                        )}
                      </div>
                      <div className="flex mt-4 w-full">
                        <input
                          value={barcodeQnt}
                          onChange={(event) =>
                            setBarcodeQnt(event.target.value)
                          }
                          type="number"
                          placeholder="Type Quantity"
                          className="w-[70%] rounded-s-md border-2 border-indigo-600 focus:border-indigo-600 focus:ring-0 focus:outline-none pl-3"
                        />
                        <button
                          type="button"
                          disabled={toInt(barcodeQnt) < 1}
                          onClick={() => setShowBarcodePreview(true)}
                          className="w-[30%] rounded-e-md border-2 border-indigo-600 bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Preview
                        </button>
                      </div>

                      <Popup
                        open={showBarcodePreview}
                        onClose={() => setShowBarcodePreview(false)}
                        title="Barcode Preview"
                        panelClassName="sm:max-w-[210mm] sm:w-[210mm]"
                      >
                        <div className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                          <div className="flex">
                            <input
                              value={columnQnt}
                              onChange={(event) =>
                                setColumnQnt(event.target.value)
                              }
                              type="number"
                              placeholder="Number of columns"
                              className="rounded-s-md border-2 border-indigo-600 focus:border-indigo-600 focus:ring-0 focus:outline-none w-[60%] pl-3"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setAppliedColumnQnt(toInt(columnQnt) || 4)
                              }
                              className="rounded-e-md border-2 border-indigo-600 bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 w-[40%]"
                            >
                              Columns
                            </button>
                          </div>
                          <div className="flex justify-center gap-5">
                            <button
                              type="button"
                              onClick={() => window.print()}
                              className="rounded-md border border-transparent bg-indigo-600 py-2 px-5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2"
                            >
                              Print
                            </button>
                            <button
                              type="button"
                              className="rounded-md border border-red-500 text-white bg-red-500 px-4 py-2 text-sm font-medium hover:bg-red-600"
                              onClick={() => setShowBarcodePreview(false)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                        <div
                          id="barcodeDownload"
                          className="grid gap-[10px] border border-dashed border-gray-200"
                          style={{
                            gridTemplateColumns: `repeat(${appliedColumnQnt}, minmax(0, 1fr))`,
                          }}
                        >
                          {Array.from({
                            length: Math.max(0, toInt(barcodeQnt)),
                          }).map((_, index) => (
                            <div
                              key={`barcode-${index}`}
                              className="flex items-center justify-center bg-white space-x-2 border border-dashed border-gray-200 py-4"
                            >
                              {barcode ? (
                                <BarcodeCanvas
                                  value={barcode}
                                  title={title}
                                  priceLabel={formatMoney(
                                    priceValue,
                                    site?.currency,
                                  )}
                                />
                              ) : null}
                            </div>
                          ))}
                        </div>
                        <style>{`
                          @page {
                            size: A4;
                            margin: 0;
                          }
                          @media print {
                            html, body {
                              margin: 0;
                              padding: 0;
                            }
                            body * {
                              visibility: hidden;
                            }
                            #barcodeDownload,
                            #barcodeDownload * {
                              visibility: visible;
                            }
                            #barcodeDownload {
                              position: absolute;
                              left: 0;
                              top: 0;
                              width: 210mm;
                              padding: 0 30px;
                              margin: 0;
                              border: none;
                            }
                          }
                        `}</style>
                      </Popup>
                    </div>
                    {![6].includes(productType) ? (
                      <div className="mt-6 space-y-8 border-t border-gray-200 pt-4">
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Unit & weight
                          </h2>
                          <ul role="list" className="mt-3 space-y-3">
                            <li className="flex justify-start">
                              <div className="flex items-center space-x-3">
                                <BanknotesIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <div className="text-sm font-medium text-gray-900">
                                  Weight - {weight || 0} kg
                                </div>
                              </div>
                            </li>
                            <li className="flex justify-start">
                              <div className="flex items-center space-x-3">
                                <BanknotesIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <div className="text-sm font-medium text-gray-900">
                                  Unit - {unit || 0}
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </aside>
                </div>
              </div>
            </div>
          ) : null}

          {selectedTab === "Filter" ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-5 min-h-[400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 self-start content-start auto-rows-min">
                  <FilterSelect
                    label="Category"
                    items={categories}
                    value={categoryIds}
                    multiple
                    onChange={(next) => {
                      const ids = Array.isArray(next) ? next : [];
                      setCategoryIds(ids);
                      setSubCategoryIds([]);
                      setSubSubCategoryIds([]);
                    }}
                    loading={loadingCategories}
                    onRefresh={() => refetchCategories()}
                    onSearch={setCategorySearch}
                  />
                  <FilterSelect
                    label="Sub Category"
                    items={filteredSubCategories}
                    value={subCategoryIds}
                    multiple
                    disabled={categoryIds.length === 0}
                    onChange={(next) => {
                      const ids = Array.isArray(next) ? next : [];
                      setSubCategoryIds(ids);
                      setSubSubCategoryIds([]);
                    }}
                    loading={loadingSubCategories}
                    onRefresh={() => refetchSubCategories()}
                    onSearch={setSubCategorySearch}
                  />
                  <FilterSelect
                    label="Sub Sub Category"
                    items={filteredSubSubCategories}
                    value={subSubCategoryIds}
                    multiple
                    disabled={subCategoryIds.length === 0}
                    onChange={(next) => {
                      const ids = Array.isArray(next) ? next : [];
                      setSubSubCategoryIds(ids);
                    }}
                    loading={loadingSubSubCategories}
                    onRefresh={() => refetchSubSubCategories()}
                    onSearch={setSubSubCategorySearch}
                  />
                  <FilterSelect
                    label="Brand"
                    items={brands}
                    value={brandIds}
                    multiple
                    onChange={(next) =>
                      setBrandIds(Array.isArray(next) ? next : [])
                    }
                    loading={loadingBrands}
                    onRefresh={() => refetchBrands()}
                    onSearch={setBrandSearch}
                  />
                  <FilterSelect
                    label="Author"
                    items={authors}
                    value={authorIds}
                    multiple
                    onChange={(next) =>
                      setAuthorIds(Array.isArray(next) ? next : [])
                    }
                    loading={loadingAuthors}
                    onRefresh={() => refetchAuthors()}
                    onSearch={setAuthorSearch}
                  />
                  <FilterSelect
                    label="Tag"
                    items={tags}
                    value={tagIds}
                    multiple
                    onChange={(next) =>
                      setTagIds(Array.isArray(next) ? next : [])
                    }
                    loading={loadingTags}
                    onRefresh={() => refetchTags()}
                    onSearch={setTagSearch}
                  />
                  <FilterSelect
                    label="Supplier"
                    items={suppliers}
                    value={supplierId}
                    onChange={(next) => {
                      const nextId = typeof next === "number" ? next : null;
                      setSupplierId(nextId);
                      setSupplierTitle(
                        nextId != null
                          ? suppliers.find((item) => item.id === nextId)
                              ?.title ?? ""
                          : "",
                      );
                    }}
                    loading={loadingSuppliers}
                    onRefresh={() => refetchSuppliers()}
                    onSearch={setSupplierSearch}
                  />
                </div>

                <div className="bg-green-50 mb-4 rounded-md px-4 py-4 sm:px-4">
                  <aside className="xl:block">
                    <h2 className="sr-only">Details</h2>
                    <div className="mt-0 space-y-2">
                      {selectedCategories.length > 0 ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Categories
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            {selectedCategories.map((item) => (
                              <li key={item.id} className="inline">
                                <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                  <div className="absolute flex flex-shrink-0 items-center justify-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                                    {item.title}
                                  </div>
                                </div>{" "}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {selectedSubCategories.length > 0 ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Sub categories
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            {selectedSubCategories.map((item) => (
                              <li key={item.id} className="inline">
                                <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                  <div className="absolute flex flex-shrink-0 items-center justify-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                                    {item.title}
                                  </div>
                                </div>{" "}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {selectedSubSubCategories.length > 0 ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Sub Sub categories
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            {selectedSubSubCategories.map((item) => (
                              <li key={item.id} className="inline">
                                <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                  <div className="absolute flex flex-shrink-0 items-center justify-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                                    {item.title}
                                  </div>
                                </div>{" "}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {selectedBrands.length > 0 ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Brands
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            {selectedBrands.map((item) => (
                              <li key={item.id} className="inline">
                                <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                  <div className="absolute flex flex-shrink-0 items-center justify-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                                    {item.title}
                                  </div>
                                </div>{" "}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {campaign?.title ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Campaigns
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            <li className="inline">
                              <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                <div className="absolute flex flex-shrink-0 items-center justify-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                </div>
                                <div className="ml-3.5 text-sm font-medium text-gray-900">
                                  {campaign.title}
                                </div>
                              </div>{" "}
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {collection?.title ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Collections
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            <li className="inline">
                              <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                <div className="absolute flex flex-shrink-0 items-center justify-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                </div>
                                <div className="ml-3.5 text-sm font-medium text-gray-900">
                                  {collection.title}
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {supplierId ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Supplier
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            <li className="inline">
                              <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                <div className="absolute flex flex-shrink-0 items-center justify-center">
                                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                </div>
                                <div className="ml-3.5 text-sm font-medium text-gray-900 flex items-center gap-2">
                                  <p>{supplierTitle}</p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ) : null}

                      {selectedAuthors.length > 0 ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Authors
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            {selectedAuthors.map((item) => (
                              <li key={item.id} className="inline">
                                <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                  <div className="absolute flex flex-shrink-0 items-center justify-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900 flex items-center gap-2">
                                    <p>{item.title}</p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {shops.length > 0 ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Shops
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            {shops.map((item) => (
                              <li key={item.id} className="inline">
                                <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                  <div className="absolute flex flex-shrink-0 items-center justify-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                                    {item.title}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {selectedTags.length > 0 ? (
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Tags
                          </h2>
                          <ul role="list" className="mt-2 leading-8">
                            {selectedTags.map((item) => (
                              <li key={item.id} className="inline">
                                <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                                  <div className="absolute flex flex-shrink-0 items-center justify-center">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                                    {item.title}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </aside>
                </div>
              </div>
            </>
          ) : null}

          {selectedTab === "Features" ? (
            <div>
              <div className="">
                <h3 className="text-lg font-medium leading-6 text-gray-900"></h3>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
              <div className="sm:col-span-6">
                {featureRows.map((feature) => (
                  <div
                    key={`${feature.key}-${
                      feature.sourceIndex ?? feature.id ?? "default"
                    }`}
                    className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
                  >
                    <div className="sm:col-span-3">
                      <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                        <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                          Title
                        </label>
                        <input
                          value={feature.key}
                          onChange={(event) => {
                            const value = event.target.value;
                            if (feature.isDefault) return;
                            setFeatures((prev) =>
                              prev.map((item, index) =>
                                index === feature.sourceIndex
                                  ? { ...item, key: value }
                                  : item,
                              ),
                            );
                          }}
                          type="text"
                          name="title"
                          id="title"
                          autoComplete="off"
                          className="block w-full p-0 outline-none text-gray-900 placeholder-gray-500 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={feature.isDefault}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3 flex items-center">
                      <div className="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                        <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                          {feature.placeholder
                            ? `Suggestion: ${feature.placeholder}`
                            : "Value"}
                        </label>
                        <input
                          value={feature.value}
                          onChange={(event) => {
                            const value = event.target.value;
                            if (feature.isDefault) return;
                            setFeatures((prev) =>
                              prev.map((item, index) =>
                                index === feature.sourceIndex
                                  ? { ...item, value }
                                  : item,
                              ),
                            );
                          }}
                          type="text"
                          name="value"
                          id="value"
                          autoComplete="off"
                          className="block w-full p-0 text-gray-900 placeholder-gray-500  sm:text-sm disabled:bg-gray-20 outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
                          disabled={feature.isDefault}
                        />
                      </div>
                      {!feature.isDefault ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (feature.sourceIndex == null) return;
                            setFeatures((prev) =>
                              prev.filter(
                                (_, index) => index !== feature.sourceIndex,
                              ),
                            );
                          }}
                          className="mx-4 text-red-500"
                        >
                          <XMarkIcon className="h-8 w-8" aria-hidden="true" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
              {productSiteId == null || productSiteId === siteId ? (
                <div className="pb-4 pt-6 grid grid-cols-1 items-center gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Title
                      </label>
                      <input
                        value={newFeatureKey}
                        onChange={(event) =>
                          setNewFeatureKey(event.target.value)
                        }
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="off"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none outline-none sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter title"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {newFeatureKey.length === 0 ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Value
                      </label>
                      <input
                        value={newFeatureValue}
                        onChange={(event) =>
                          setNewFeatureValue(event.target.value)
                        }
                        type="text"
                        name="value"
                        id="value"
                        autoComplete="off"
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none outline-none sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                        placeholder="Enter title"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {newFeatureValue.length === 0 ? (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFeatureKey.trim()) return;
                        setFeatures((prev) => [
                          ...prev,
                          {
                            key: newFeatureKey.trim(),
                            value: newFeatureValue.trim(),
                          },
                        ]);
                        setNewFeatureKey("");
                        setNewFeatureValue("");
                      }}
                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:text-sm"
                    >
                      Add Feature
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {selectedTab === "Image" ? (
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {siteId === site?.id ? (
                <div className="sm:col-span-6">
                  {images
                    .map((image, index) => ({ image, index }))
                    .filter((item) => item.image?.trim())
                    .map((item) => (
                      <div
                        key={`image-preview-${item.index}`}
                        className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
                      >
                        <div className="sm:col-span-1/2">
                          <img
                            className="h-12 w-12 rounded-md border"
                            src={resolveGalleryImageSrc(item.image)}
                            alt=""
                          />
                        </div>
                        <div className="sm:col-span-5 flex items-center w-full">
                          <div className="w-full relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                            <label
                              htmlFor={`image-${item.index}`}
                              className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                            >
                              Image URL
                            </label>
                            <input
                              value={item.image}
                              onChange={(event) => {
                                const value = event.target.value;
                                setImages((prev) =>
                                  prev.map((img, idx) =>
                                    idx === item.index ? value : img,
                                  ),
                                );
                              }}
                              type="text"
                              name={`image-${item.index}`}
                              id={`image-${item.index}`}
                              autoComplete="off"
                              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
                              placeholder="Enter value"
                              disabled={siteId !== site?.id}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              {item.image.length < 3 ? (
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <CheckCircleIcon
                                  className="h-5 w-5 text-green-500"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                          </div>

                          <BackspaceIcon
                            onClick={() =>
                              setImages((prev) =>
                                prev.map((img, idx) =>
                                  idx === item.index ? "" : img,
                                ),
                              )
                            }
                            className="mx-4 h-8 w-8 text-red-500 cursor-pointer"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ) : null}

              {Array.from({ length: 7 }).map((_, index) => {
                const currentImage = images[index] ?? "";
                const hasImage = Boolean(currentImage?.trim());
                return (
                  <div key={`image-slot-${index}`} className="sm:col-span-3">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                      <label
                        htmlFor={`image-upload-${index}`}
                        className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                      >
                        Image {index + 1}
                      </label>
                      <FilePondUploader
                        className="bg-white pt-4 px-2"
                        files={
                          hasImage
                            ? [resolveGalleryImageSrc(currentImage)]
                            : []
                        }
                        allowMultiple={false}
                        allowReplace
                        accepted="image/*"
                        code={sku}
                        isQr={isQr}
                        isBarcode={isBarcode}
                        onAdded={(file) => uploadGalleryImage(file, index)}
                        onRemove={() =>
                          setImages((prev) => {
                            const next = [...prev];
                            while (next.length <= index) next.push("");
                            next[index] = "";
                            return next;
                          })
                        }
                        disabled={siteId !== site?.id}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {hasImage ? (
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <ExclamationCircleIcon
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {selectedTab === "File" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  File Type
                </label>
                <select
                  value={fileType}
                  onChange={(event) => setFileType(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>
              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  File URL
                </label>
                <input
                  value={fileUrl}
                  onChange={(event) => setFileUrl(event.target.value)}
                  placeholder="Enter file url"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                />
              </div>
            </div>
          ) : null}

          {selectedTab === "Variant" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <FilterSelect
                    label="Variant Type"
                    items={variantUnitTypes
                      .filter((v) =>
                        productType === 1
                          ? true
                          : v.types.includes(productType),
                      )
                      .map((item) => ({ id: item.id, title: item.name }))}
                    value={
                      variantUnitTypes.find(
                        (item) => item.name === newVariant.variantType,
                      )?.id ?? 1
                    }
                    onChange={(next) => {
                      const id = typeof next === "number" ? next : 1;
                      const selected =
                        variantUnitTypes.find((item) => item.id === id)?.name ??
                        "Size";
                      setNewVariant((prev) => ({
                        ...prev,
                        variantType: selected,
                      }));
                    }}
                  />
                </div>
                <div className="sm:col-span-3">
                  <div className="relative w-full">
                    <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-slate-700 z-10">
                      {productType === 5
                        ? `${newVariant.title || ""} pc. in a ${
                            newVariant.variantType
                          }`
                        : `Variant ${newVariant.variantType}`}
                    </label>
                    <input
                      value={newVariant.title}
                      onChange={(event) =>
                        setNewVariant((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                      placeholder="Enter title"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      type={productType === 5 ? "number" : "text"}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5">
                  <div className="sm:flex sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Add Variant
                      </h3>
                      <br />
                      {parameters.length === 0 ? (
                        <p className="mt-2 max-w-xl text-sm text-gray-500">
                          Enter variant details (e.g., title, price, etc.)
                        </p>
                      ) : (
                        <div className="flex gap-2 whitespace-nowrap text-sm font-medium">
                          {parameters.map((item, index) => (
                            <div
                              key={`${item.name}-${index}`}
                              className="block rounded-md border border-green-200 bg-green-100 px-2 py-1"
                            >
                              <div className="text-sm font-normal">
                                {item.name}
                              </div>
                              <div className="text-xs font-light">
                                {item.values.join(", ")}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
                      <button
                        type="button"
                        disabled={parameters.length === 0}
                        className="mr-3 inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
                        onClick={() => {
                          generateVariants();
                        }}
                      >
                        Generate
                      </button>
                      <button
                        type="button"
                        disabled={newVariant.title.length === 0}
                        onClick={() => {
                          const name = newVariant.variantType.toLowerCase();
                          setParameters((prev) => {
                            const next = [...prev];
                            const existing = next.find((p) => p.name === name);
                            if (existing) {
                              if (!existing.values.includes(newVariant.title)) {
                                existing.values.push(newVariant.title);
                              }
                            } else {
                              next.push({ name, values: [newVariant.title] });
                            }
                            return next;
                          });
                          setNewVariant((prev) => ({ ...prev, title: "" }));
                        }}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="table-source-wrap pb-10">
                      <AppTable className="data-table min-w-full divide-y divide-gray-300">
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="w-full py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                              Title
                            </TableHead>
                            <TableHead className="px-2 py-3 text-left text-sm font-semibold text-gray-900">
                              Image
                            </TableHead>
                            <TableHead className="px-2 py-3 text-left text-sm font-semibold text-gray-900">
                              Stock
                            </TableHead>
                            <TableHead className="px-2 w-full py-3 text-right text-sm font-semibold text-gray-900">
                              Cost
                            </TableHead>
                            <TableHead className="px-2 w-full py-3 text-right text-sm font-semibold text-gray-900">
                              Price
                            </TableHead>
                            <TableHead className="px-2 w-full py-3 text-right text-sm font-semibold text-gray-900">
                              Resell
                            </TableHead>
                            <TableHead className="px-2 w-full py-3 text-right text-sm font-semibold text-gray-900">
                              MRP
                            </TableHead>
                            <TableHead className="px-4 py-3.5 pl-3 text-right text-sm font-semibold text-gray-900">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200 bg-white">
                          {variants.map((variant) => (
                            <TableRow key={variant.id}>
                              <TableCell className="truncate py-2 pl-3 pr-3 text-sm max-w-[170px]">
                                {variant.variantValues &&
                                variant.variantValues.length > 0 ? (
                                  <div className="space-y-1">
                                    {variant.variantValues.map((item) => (
                                      <div
                                        key={`${variant.id}-${item.key}`}
                                        className="block rounded-md border border-green-200 bg-green-100 px-2 py-1"
                                      >
                                        <div className="text-sm font-normal">
                                          {item.value}
                                        </div>
                                        <div className="text-xs font-light">
                                          {item.key}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div>{variant.title}</div>
                                )}
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                <select
                                  value={variant.imageIndex}
                                  onChange={(event) => {
                                    const value = Number(event.target.value);
                                    setVariants((prev) =>
                                      prev.map((item) =>
                                        item.id === variant.id
                                          ? { ...item, imageIndex: value }
                                          : item,
                                      ),
                                    );
                                  }}
                                  className="w-[100px] rounded-md border border-gray-300 bg-white px-2 py-2 text-xs"
                                >
                                  {images.map((img, idx) => (
                                    <option key={`img-${idx}`} value={idx + 1}>
                                      {idx + 1}
                                    </option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-2 py-2">
                                <input
                                  value={variant.quantity}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setVariants((prev) =>
                                      prev.map((item) =>
                                        item.id === variant.id
                                          ? { ...item, quantity: value }
                                          : item,
                                      ),
                                    );
                                  }}
                                  type="number"
                                  className="block w-[100px] rounded-md border border-gray-300 px-2 py-2 text-sm"
                                />
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
                                <input
                                  value={variant.cost}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setVariants((prev) =>
                                      prev.map((item) =>
                                        item.id === variant.id
                                          ? { ...item, cost: value }
                                          : item,
                                      ),
                                    );
                                  }}
                                  type="number"
                                  className="block w-[150px] rounded-md border border-gray-300 px-2 py-2 text-sm text-right"
                                />
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
                                <input
                                  value={variant.price}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setVariants((prev) =>
                                      prev.map((item) =>
                                        item.id === variant.id
                                          ? { ...item, price: value }
                                          : item,
                                      ),
                                    );
                                  }}
                                  type="number"
                                  className="block w-[150px] rounded-md border border-gray-300 px-2 py-2 text-sm text-right"
                                />
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
                                <input
                                  value={variant.wholesalePrice}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setVariants((prev) =>
                                      prev.map((item) =>
                                        item.id === variant.id
                                          ? { ...item, wholesalePrice: value }
                                          : item,
                                      ),
                                    );
                                  }}
                                  type="number"
                                  className="block w-[150px] rounded-md border border-gray-300 px-2 py-2 text-sm text-right"
                                />
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 text-right">
                                <input
                                  value={variant.comparePrice}
                                  onChange={(event) => {
                                    const value = event.target.value;
                                    setVariants((prev) =>
                                      prev.map((item) =>
                                        item.id === variant.id
                                          ? { ...item, comparePrice: value }
                                          : item,
                                      ),
                                    );
                                  }}
                                  type="number"
                                  className="block w-[150px] rounded-md border border-gray-300 px-2 py-2 text-sm text-right"
                                />
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setVariants((prev) =>
                                      prev.filter(
                                        (item) => item.id !== variant.id,
                                      ),
                                    )
                                  }
                                  className="text-xs text-rose-500"
                                >
                                  Remove
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </AppTable>
                      {variants.length === 0 ? (
                        <div className="border-t border-gray-200 bg-white px-4 py-4 text-center text-sm text-gray-700">
                          No record :-(
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {selectedTab === "FAQ" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <input
                  value={newFaqQuestion}
                  onChange={(event) => setNewFaqQuestion(event.target.value)}
                  placeholder="Question"
                  className="sm:col-span-3 rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={newFaqAnswer}
                  onChange={(event) => setNewFaqAnswer(event.target.value)}
                  placeholder="Answer"
                  className="sm:col-span-3 rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newFaqQuestion.trim()) return;
                  setFaq((prev) => [
                    ...prev,
                    { question: newFaqQuestion, answer: newFaqAnswer },
                  ]);
                  setNewFaqQuestion("");
                  setNewFaqAnswer("");
                }}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Add FAQ
              </button>
              <div className="space-y-2">
                {faq.map((item, index) => (
                  <div
                    key={`faq-${index}`}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                  >
                    <div className="font-medium text-slate-700">
                      {item.question}
                    </div>
                    <div className="text-slate-500">{item.answer}</div>
                    <button
                      type="button"
                      onClick={() =>
                        setFaq((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="mt-2 text-xs text-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {selectedTab === "Meta" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Meta Title
                </label>
                <input
                  value={metaTitle}
                  onChange={(event) => setMetaTitle(event.target.value)}
                  placeholder="Meta title"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-6">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(event) => setMetaDescription(event.target.value)}
                  rows={4}
                  placeholder="Meta description"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : null}

          {selectedTab === "Description" ? (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Full Description
              </label>
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Enter description"
                style={{ height: 400 }}
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </div>
          ) : null}

          {selectedTab === "Syllabus" || selectedTab === "Will Learn" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <input
                  value={newNote.genre}
                  onChange={(event) =>
                    setNewNote((prev) => ({
                      ...prev,
                      genre: event.target.value,
                    }))
                  }
                  placeholder="Category"
                  className="sm:col-span-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={newNote.title}
                  onChange={(event) =>
                    setNewNote((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Title"
                  className="sm:col-span-4 rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
                <textarea
                  value={newNote.subTitle}
                  onChange={(event) =>
                    setNewNote((prev) => ({
                      ...prev,
                      subTitle: event.target.value,
                    }))
                  }
                  placeholder="Description"
                  className="sm:col-span-6 rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={newNote.url}
                  onChange={(event) =>
                    setNewNote((prev) => ({ ...prev, url: event.target.value }))
                  }
                  placeholder="Video URL"
                  className="sm:col-span-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={newNote.image}
                  onChange={(event) =>
                    setNewNote((prev) => ({
                      ...prev,
                      image: event.target.value,
                    }))
                  }
                  placeholder="Image URL"
                  className="sm:col-span-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={newNote.file}
                  onChange={(event) =>
                    setNewNote((prev) => ({
                      ...prev,
                      file: event.target.value,
                    }))
                  }
                  placeholder="File URL"
                  className="sm:col-span-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                />
                <label className="sm:col-span-6 flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={newNote.isFree}
                    onChange={(event) =>
                      setNewNote((prev) => ({
                        ...prev,
                        isFree: event.target.checked,
                      }))
                    }
                  />
                  Free
                </label>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!newNote.title.trim()) return;
                  setNotes((prev) => [...prev, newNote]);
                  setNewNote({
                    genre: "",
                    title: "",
                    subTitle: "",
                    url: "",
                    image: "",
                    file: "",
                    isFree: false,
                  });
                }}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Add Note
              </button>
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div
                    key={`note-${index}`}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                  >
                    <div className="font-medium text-slate-700">
                      {note.title}
                    </div>
                    <div className="text-slate-500">{note.subTitle}</div>
                    <button
                      type="button"
                      onClick={() =>
                        setNotes((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="mt-2 text-xs text-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {selectedTab === "Short PDF" ? (
            <div>
              {extraImages.length > 0 ? (
                <div className="mb-2">
                  {extraImages.map((img, index) => (
                    <div
                      key={`extra-${img.id}-${index}`}
                      className="inline-block mr-2"
                    >
                      <img
                        src={resolveExtraImageSrc(img.image)}
                        alt=""
                        className="h-16 w-16"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                "No extra images"
              )}
              <div className="max-h-[800px] bg-gray-200 overflow-auto relative border my-5 w-full rounded">
                <div className="absolute left-0 max-h-[800px] overflow-auto pb-5">
                  <DragDropContext onDragEnd={handleExtraImagesDragEnd}>
                    <Droppable droppableId="extra-images">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {extraImages.map((img, index) => (
                            <Draggable
                              key={`extra-${img.id}-${index}`}
                              draggableId={`extra-${img.id}-${index}`}
                              index={index}
                            >
                              {(dragProvided) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  className="relative flex justify-center max-w-[80px] mx-auto border-b border-4"
                                >
                                  <img
                                    src={resolveExtraImageSrc(img.image)}
                                    alt=""
                                    className="h-full w-full"
                                  />
                                  <div className="absolute left-0 text-xs">
                                    {index + 1}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExtraImages((prev) =>
                                        prev.filter((_, i) => i !== index),
                                      )
                                    }
                                    className="absolute right-0 text-[8px] text-white rounded-full border border-transparent bg-red-600 py-1 px-1"
                                  >
                                    X
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <button
                    type="button"
                    onClick={() => setExtraImages([])}
                    className="m-2 inline-flex justify-center rounded border border-transparent bg-red-600 py-1 px-2 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete All
                  </button>
                </div>
                <div>
                  {extraImages.map((img) => (
                    <div
                      key={`preview-${img.id}`}
                      className="flex justify-center max-w-[500px] mx-auto border-b border-4"
                    >
                      <img
                        src={resolveExtraImageSrc(img.image)}
                        alt=""
                        className="h-full w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                <label
                  htmlFor="shortPdfUpload"
                  className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >
                  Upload PDF
                </label>
                <FilePondUploader
                  className="bg-white pt-4 px-2"
                  accepted="application/pdf"
                  onAdded={handleExtraPdfUpload}
                />
              </div>
              <div className="bg-gray-200 w-full h-10 py-2 my-4 text-center flex justify-center items-center rounded">
                OR
              </div>
              <div className="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
                <label
                  htmlFor="shortImageUpload"
                  className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >
                  Upload Image
                </label>
                <FilePondUploader
                  className="bg-white pt-4 px-2"
                  onAdded={uploadExtraImage}
                />
              </div>
            </div>
          ) : null}

          {selectedTab === "Review" ? (
            <div className="text-sm text-slate-500">
              Review section placeholder.
            </div>
          ) : null}

          {selectedTab === "Landing Page" ? (
            <div className="space-y-3 text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isLanding}
                  onChange={(event) => setIsLanding(event.target.checked)}
                />
                Landing page
              </label>
              {isLanding && site?.domain ? (
                <div className="text-xs text-indigo-600">
                  https://{site.domain}/product-spotlight/slug/id
                </div>
              ) : null}
            </div>
          ) : null}

          {!tabsWithContent.has(selectedTab) ? (
            <div className="text-sm text-slate-500">
              {selectedTab} content will be added in the next phases.
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6">
            {isEditMode ? (
              <>
                <button
                  type="button"
                  className="rounded-lg bg-slate-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isCreateRoute) navigate("/product");
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  {updating ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (isCreateRoute) navigate("/product");
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  {creating ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Popup
        title="File Select"
        open={showFile}
        onClose={() => setShowFile(false)}
      >
        <File view="select" onFile={handleVideoSelect} />
      </Popup>
    </div>
  );
}
