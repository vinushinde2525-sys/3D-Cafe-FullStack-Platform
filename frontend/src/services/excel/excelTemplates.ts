/**
 * excelTemplates.ts — generate downloadable sample import templates
 */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { buildFormattedSheet } from './excelFormatting';

function make(sheetData: (string | number | boolean)[][], sheetName: string, filename: string) {
  const ws = buildFormattedSheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename);
}

export function downloadProductTemplate() {
  make([
    ['name','category','price','discountPrice','description','isVegetarian','isVegan','isGlutenFree','isSpicy','preparationTime','tags'],
    ['Espresso Royale','Coffee',180,'','Rich bold espresso','true','true','true','false',5,'bestseller,hot'],
    ['Wagyu Burger','Burgers',680,620,'Double wagyu patty','false','false','false','false',18,'premium'],
    ['Truffle Margherita','Pizza',820,'','Buffalo mozzarella','true','false','false','false',22,'premium,veg'],
  ], 'Products', 'product_import_template.xlsx');
}

export function downloadInventoryTemplate() {
  make([
    ['itemName','category','currentStock','minStock','maxStock','unit','reorderPoint','supplier','costPerUnit'],
    ['Coffee Beans (Ethiopian)','Raw Material',50,10,200,'kg',15,'Bean Bros Co.',480],
    ['Milk (Full Fat)','Dairy',30,5,100,'liters',10,'Farm Fresh',62],
    ['Sourdough Bread','Bakery',20,3,50,'loaves',5,'Artisan Bakes',85],
  ], 'Inventory', 'inventory_import_template.xlsx');
}

export function downloadCouponTemplate() {
  make([
    ['code','type','value','minOrderValue','maxUses','expiry','description'],
    ['WELCOME20','percentage',20,300,100,'2025-12-31','20% off first order'],
    ['FLAT100','fixed',100,800,50,'2025-06-30','₹100 off'],
    ['FREESHIP','shipping',40,0,200,'2025-12-31','Free delivery'],
  ], 'Coupons', 'coupon_import_template.xlsx');
}

export function downloadCustomerTemplate() {
  make([
    ['name','email','phone','role'],
    ['John Doe','john@example.com','+91 9876543210','customer'],
    ['Jane Smith','jane@example.com','+91 9988776655','customer'],
  ], 'Customers', 'customer_import_template.xlsx');
}

export function downloadEmployeeTemplate() {
  make([
    ['name','email','phone','role','department','salary','hourlyRate','shift','joinDate'],
    ['Rahul Verma','rahul@cafe3d.com','+91 9123456780','barista','Front of House',28000,180,'morning','2026-01-15'],
    ['Anita Joshi','anita@cafe3d.com','+91 9123456781','chef','Kitchen',38000,220,'evening','2025-11-01'],
  ], 'Employees', 'employee_import_template.xlsx');
}

export function downloadSupplierTemplate() {
  make([
    ['name','contactName','email','phone','address','city','gstin','paymentTerms','leadTimeDays'],
    ['Farm Fresh Dairy','Priya Menon','contact@farmfresh.in','+91 9876543210','MIDC Road','Mumbai','27AAPFB1234C1ZV','Net 30',3],
    ['Bean Bros Co.','Sanjay Rao','sanjay@beanbros.in','+91 9988776655','Coffee Estate Rd','Coorg','29AAPFB5678D1ZW','Net 15',5],
  ], 'Suppliers', 'supplier_import_template.xlsx');
}

export const TEMPLATE_CONFIGS = [
  { label: 'Products',   download: downloadProductTemplate,   description: 'Import menu items / food products', cols: 11 },
  { label: 'Inventory',  download: downloadInventoryTemplate, description: 'Import stock levels and suppliers',  cols: 9  },
  { label: 'Coupons',    download: downloadCouponTemplate,    description: 'Import discount codes',             cols: 7  },
  { label: 'Customers',  download: downloadCustomerTemplate,  description: 'Import customer accounts',          cols: 4  },
  { label: 'Employees',  download: downloadEmployeeTemplate,  description: 'Import staff records',              cols: 9  },
  { label: 'Suppliers',  download: downloadSupplierTemplate,  description: 'Import supplier directory',         cols: 9  },
] as const;
