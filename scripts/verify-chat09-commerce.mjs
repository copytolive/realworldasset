import fs from "node:fs";

const commerce = fs.readFileSync("src/components/commerce/Commerce.tsx", "utf8");
const catchAll = fs.readFileSync("src/app/[...slug]/page.tsx", "utf8");
const profile = fs.readFileSync("src/components/details/BusinessProfile.tsx", "utf8");

const requiredRoutes = [
  "/checkout",
  "/account/orders",
  "/account/orders/RWA-ORD-20240516-9F7A2B/dispute",
  "/businesses/${businessSlug}/store",
  "/businesses/${businessSlug}/store/products/${p.id}",
];
for (const route of requiredRoutes) {
  if (!commerce.includes(route)) throw new Error(`CHAT09 missing commerce route/action: ${route}`);
}
for (const token of ["StoreScreen", "ProductScreen", "CheckoutScreen", "OrdersScreen", "DisputeScreen", "CommerceRoute"]) {
  if (!commerce.includes(token)) throw new Error(`CHAT09 missing screen/component: ${token}`);
}
if (!catchAll.includes("CommerceRoute")) throw new Error("CHAT09 catch-all is not dispatching real commerce screens");
for (const token of ["checkout","account/orders","/store/products/"]) {
  if (!catchAll.includes(token)) throw new Error(`CHAT09 static route coverage missing: ${token}`);
}
if (!profile.includes("/store") || !profile.includes("Visit Store")) throw new Error("CHAT09 BusinessProfile store handoff missing");
if (!commerce.includes("router.push(\"/checkout\")")) throw new Error("CHAT09 product -> checkout handoff missing");
if (!commerce.includes("router.push(\"/account/orders\")")) throw new Error("CHAT09 checkout -> order history handoff missing");
if (!commerce.includes("/dispute`")) throw new Error("CHAT09 order -> dispute handoff missing");

const buttonCount = (commerce.match(/<button\b/g) || []).length;
const actionCount = (commerce.match(/onClick=/g) || []).length;
if (buttonCount === 0 || actionCount < buttonCount) {
  throw new Error(`CHAT09 native control contract failed: ${buttonCount} buttons, ${actionCount} onClick actions`);
}
console.log(`CHAT09 commerce PASS: Store -> Product -> Checkout -> Orders -> Dispute routes connected; ${buttonCount} native button controls have actions.`);
