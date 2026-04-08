component Checkout1() {
val siteId:number = 15225;
val productId:number = 516848;
val title:any = "T shirt";
val description:any = "";
val image:any = "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/store/3177e106-f1a7-4391-9542-14a66f85db06.jpeg";
val quantity:number = 1;
val price:number = 500;
val logisticsCharge:number = 150;
val name:any = "";
val phone:number = 0;
val address:any = "";
val variant:any = "";
val isLoading:Boolean = false;
val logistics:Array = [{
"charge": 50,
"id": 1,
"title": "Inside Kolkata"
},{
"charge": 150,
"id": 2,
"title": "Outside Kolkata"
}];
val variants:Array = [{
"id": 1,
"price": 699,
"title": "রিং যুক্ত"
},{
"id": 2,
"price": 699,
"title": "কাঠ যুক্ত "
},{
"id": 3,
"price": 550,
"title": "রশি যুক্ত"
}];
val gatewayId:any = 1;
val total:any = 1000;
} => (
<section className={"py-8 bg-white"} id={"order"} role={"section"}>
  <div className={"container max-w-6xl mx-auto px-4 flex flex-col items-center  pb-14 bg-white text-gray-700"}>
   <h2 className={"text-4xl    leading-tight text-center mb-6"}>
    <text value={"অর্ডার করুন"} />
   </h2>
   <div className={"grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"}>
    <div className={"md:col-span-2"}>
     <div className={"space-y-5"}>
      <input
       className={"appearance-none border border-gray-200 rounded w-full py-4 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-yellow-300"}
       onChange={(e) => {
        name = e["target"]["value"]; 
       }}
       placeholder={"আপনার নাম লিখুন *"}
       type={"text"}
       value={name}
      />
      <input
       className={"appearance-none border border-gray-200 rounded w-full py-4 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-yellow-300"}
       onChange={(e) => {
        if ($validatePhone(e["target"]["value"]) != 0) {
         phone = $validatePhone(e["target"]["value"]); 
        }
       }}
       placeholder={"আপনার মোবাইল নাম্বার লিখুন *"}
       type={"number"}
       value={phone}
      />
      <textarea
       className={"appearance-none border border-gray-200 rounded w-full py-3 px-4 text-black leading-tight focus:outline-none focus:bg-white focus:border-yellow-300"}
       onChange={(e) => {
        address = e["target"]["value"]; 
       }}
       placeholder={"আপনার সম্পূর্ণ ঠিকানা লিখুন *"}
       type={"text"}
       value={address}
      />
     </div>
     <div className={"rounded-xl mt-4  md:max-w-xs flex justify-between gap-4"}>
      <div
       className={"flex items-center ps-4 border border-gray-200 rounded-md dark:border-gray-700 w-full"}
       @each={item in logistics}
      >
       <input
        checked={logisticsCharge == item["charge"]}
        className={"w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"}
        id={item["title"]}
        onChange={(e) => {
         logisticsCharge = $parseInt(e["target"]["value"]); 
        }}
        type={"radio"}
        value={item["charge"]}
       />
       <label
        className={"w-full py-4 ms-2 text-sm font-medium  "}
        for={item["title"]}
       >
        <text value={item["title"]} />
       </label>
      </div>
     </div>
    </div>
    <div>
     <div className={"rounded-lg p-6 border border-slate-500"}>
      <h1 className={"text-2xl mb-6"}>
       <text value={"Shopping Cart"} />
      </h1>
      <div className={"flex justify-between mb-4"}>
       <div className={"flex items-center"}>
        <button className={"text-red-500 hover:text-red-700"}>
         <i className={"fas fa-trash"} />
        </button>
        <div className={"mx-4"}>
         <input
          className={"w-16 text-center border-2 text-black rounded-md h-10"}
          onChange={() => {
           quantity += 1; 
          }}
          type={"number"}
          value:={quantity}
         />
        </div>
        <span className={"font-bold"}>
         <text value={price + " BDT"} />
        </span>
       </div>
      </div>
      <hr className={"my-4"} />
      <div
       className={"rounded-xl mt-4  md:max-w-xs flex justify-between gap-4"}
       @if={variants["length"] > 0}
      >
       <div
        className={"flex items-center ps-2 border border-gray-200 rounded-md dark:border-gray-700 w-full"}
        @each={item in variants}
       >
        <input
         checked={variant == item["title"]}
         className={"w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"}
         id={item["title"]}
         onChange={(e) => {
          price = $parseInt(e["target"]["value"]); 
          variant = item["title"]; 
         }}
         type={"radio"}
         value={item["price"]}
        />
        <label
         className={"w-full py-2 ms-2 text-xs font-medium  "}
         for={item["title"]}
        >
         <text value={item["title"]} />
        </label>
       </div>
      </div>
      <hr
       className={"my-4"}
       @if={variants["length"] > 0}
      />
      <div className={"flex justify-between items-center"}>
       <span className={"font-bold"}>
        <text value={"Subtotal:"} />
       </span>
       <span className={"font-bold"}>
        <text value={price * quantity + " BDT"} />
       </span>
      </div>
      <div className={"flex justify-between items-center mt-4"}>
       <span>
        <text value={"Delivery Charge:"} />
       </span>
       <span>
        <text value={logisticsCharge + " BDT"} />
       </span>
      </div>
      <hr className={"my-4"} />
      <div className={"flex justify-between items-center"}>
       <span className={"font-bold"}>
        <text value={"Total:"} />
       </span>
       <span className={"font-bold"}>
        <text value={price * quantity + logisticsCharge + " BDT"} />
       </span>
      </div>
      <div className={"flex justify-center mt-6"}>
       <button
        className={"bg-lime-500 hover:bg-lime-500 text-white font-bold  px-4 rounded w-full pt-3 pb-3"}
        disabled={address["length"] == 0 || name["length"] == 0 || phone["length"] == 0 || isLoading == true}
        onClick={() => {
         isLoading = true; 
         $createStoreOrder(siteId, {
          "address": address,
          "logisticsCharge": logisticsCharge,
          "name": name,
          "phone": phone
         }, [{
          "id": productId,
          "price": price,
          "quantity": quantity,
          "resellPrice": 0,
          "variant": variant,
          "vat": 0
         }]); 
        }}
        @if={$currentSearch == "?status=success"}
       >
        <text value={$currentHost} />
       </button>
       <button
        className={"bg-lime-500 hover:bg-lime-500 text-white font-bold  px-4 rounded w-full pt-3 pb-3"}
        disabled={address["length"] == 0 || name["length"] == 0 || phone["length"] == 0 || isLoading == true}
        onClick={() => {
         isLoading = true; 
         $createStoreOrderPayment(siteId, gatewayId, $currentHost, {
          "address": address,
          "logisticsCharge": logisticsCharge,
          "name": name,
          "phone": phone
         }, [{
          "id": productId,
          "price": price,
          "quantity": quantity,
          "resellPrice": 0,
          "variant": variant,
          "vat": 0
         }], total); 
        }}
       >
        <text value={"অর্ডার কনফার্ম করুন1"} />
       </button>
      </div>
     </div>
    </div>
   </div>
  </div>
 </section>
)
